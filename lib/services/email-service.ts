"use client"

import { executeQuery } from "../database/connection"

// Email service configuration
const EMAIL_API_URL = process.env.EMAIL_API_URL || "https://api.sendgrid.com/v3/mail/send"
const EMAIL_API_KEY = process.env.EMAIL_API_KEY || ""
const FROM_EMAIL = process.env.FROM_EMAIL || "noreply@fleetly.com"
const FROM_NAME = process.env.FROM_NAME || "Fleetly System"

interface EmailData {
  to: string
  subject: string
  html: string
  text: string
}

interface EmailTemplate {
  id: number
  name: string
  subject: string
  html_content: string
  text_content: string
  variables: string[]
  type: string
  language: string
}

interface SendEmailOptions {
  to: string
  name: string
  type: string
  title: string
  message: string
  actionUrl?: string
  language?: string
  variables?: Record<string, any>
}

export class EmailService {
  private fromEmail: string
  private fromName: string
  private apiUrl: string
  private apiKey: string

  constructor() {
    this.fromEmail = process.env.FROM_EMAIL || "noreply@fleetly.com"
    this.fromName = process.env.FROM_NAME || "Fleetly System"
    this.apiUrl = process.env.EMAIL_API_URL || ""
    this.apiKey = process.env.EMAIL_API_KEY || ""
  }

  // Send notification email
  async sendNotificationEmail(options: SendEmailOptions): Promise<void> {
    try {
      const template = await this.getEmailTemplate(options.type, options.language || "en")

      if (!template) {
        console.warn(`No email template found for type: ${options.type}`)
        return
      }

      // Prepare variables for template
      const variables = {
        name: options.name,
        title: options.title,
        message: options.message,
        action_url: options.actionUrl,
        app_url: process.env.APP_URL || "http://localhost:3000",
        company_name: "Fleetly Fleet Management",
        current_year: new Date().getFullYear(),
        ...options.variables,
      }

      // Replace variables in template
      const subject = this.replaceVariables(template.subject, variables)
      const htmlContent = this.replaceVariables(template.html_content, variables)
      const textContent = this.replaceVariables(template.text_content, variables)

      // Send email
      await this.sendEmail({
        to: options.to,
        subject,
        html: htmlContent,
        text: textContent,
      })
    } catch (error) {
      console.error("Error sending notification email:", error)
      throw error
    }
  }

  // Send welcome email
  async sendWelcomeEmail(to: string, name: string, language = "en"): Promise<void> {
    try {
      await this.sendNotificationEmail({
        to,
        name,
        type: "welcome",
        title: "Welcome to Fleetly",
        message: "Your account has been created successfully. You can now start managing your fleet.",
        actionUrl: `${process.env.APP_URL}/dashboard`,
        language,
      })
    } catch (error) {
      console.error("Error sending welcome email:", error)
    }
  }

  // Send password reset email
  async sendPasswordResetEmail(to: string, name: string, resetToken: string, language = "en"): Promise<void> {
    try {
      const resetUrl = `${process.env.APP_URL}/reset-password?token=${resetToken}`

      await this.sendNotificationEmail({
        to,
        name,
        type: "password_reset",
        title: "Password Reset Request",
        message: "You have requested to reset your password. Click the link below to proceed.",
        actionUrl: resetUrl,
        language,
        variables: {
          reset_url: resetUrl,
          reset_token: resetToken,
        },
      })
    } catch (error) {
      console.error("Error sending password reset email:", error)
    }
  }

  // Get email template from database
  private async getEmailTemplate(type: string, language: string): Promise<EmailTemplate | null> {
    try {
      const query = `
        SELECT * FROM email_templates 
        WHERE type = ? AND language = ? AND is_active = TRUE
        ORDER BY created_at DESC 
        LIMIT 1
      `
      const results = await executeQuery<EmailTemplate>(query, [type, language])

      if (results[0]) {
        return {
          ...results[0],
          variables: JSON.parse(results[0].variables as any),
        }
      }

      // Fallback to English if language not found
      if (language !== "en") {
        return await this.getEmailTemplate(type, "en")
      }

      return null
    } catch (error) {
      console.error("Error getting email template:", error)
      return null
    }
  }

  // Replace variables in template content
  private replaceVariables(content: string, variables: Record<string, any>): string {
    let result = content

    Object.entries(variables).forEach(([key, value]) => {
      const regex = new RegExp(`{{${key}}}`, "g")
      result = result.replace(regex, String(value || ""))
    })

    return result
  }

  // Send email via external service
  private async sendEmail(options: {
    to: string
    subject: string
    html: string
    text: string
  }): Promise<void> {
    try {
      if (!this.apiUrl || !this.apiKey) {
        console.warn("Email API not configured, skipping email send")
        return
      }

      const response = await fetch(this.apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          from: {
            email: this.fromEmail,
            name: this.fromName,
          },
          to: [{ email: options.to }],
          subject: options.subject,
          html: options.html,
          text: options.text,
        }),
      })

      if (!response.ok) {
        throw new Error(`Email API error: ${response.status} ${response.statusText}`)
      }

      console.log(`✅ Email sent successfully to ${options.to}`)
    } catch (error) {
      console.error("Error sending email:", error)
      throw error
    }
  }

  // Test email configuration
  async testEmailConfiguration(): Promise<boolean> {
    try {
      if (!this.apiUrl || !this.apiKey) {
        console.warn("Email API not configured")
        return false
      }

      // Send test email
      await this.sendEmail({
        to: "test@example.com",
        subject: "Fleetly Email Test",
        html: "<p>This is a test email from Fleetly.</p>",
        text: "This is a test email from Fleetly.",
      })

      return true
    } catch (error) {
      console.error("Email configuration test failed:", error)
      return false
    }
  }
}

export const emailService = new EmailService()
