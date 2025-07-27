"use client"

import nodemailer from "nodemailer"
import { executeQuery } from "../database/connection"

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
  private transporter: any
  private fromEmail: string
  private fromName: string

  constructor() {
    this.fromEmail = process.env.GMAIL_USER || process.env.FROM_EMAIL || "noreply@fleetly.com"
    this.fromName = process.env.FROM_NAME || "Fleetly System"
    this.initializeTransporter()
  }

  private initializeTransporter() {
    // Gmail SMTP configuration
    this.transporter = nodemailer.createTransporter({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.GMAIL_USER, // Your Gmail address
        pass: process.env.GMAIL_APP_PASSWORD, // Your Gmail App Password (not regular password)
      },
      tls: {
        rejectUnauthorized: false,
      },
    })
  }

  // Send notification email
  async sendNotificationEmail(options: SendEmailOptions): Promise<void> {
    try {
      const template = await this.getEmailTemplate(options.type, options.language || "en")

      if (!template) {
        console.warn(`No email template found for type: ${options.type}, using default template`)
        await this.sendDefaultEmail(options)
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

  // Send default email when no template is found
  private async sendDefaultEmail(options: SendEmailOptions): Promise<void> {
    const htmlContent = this.getDefaultHtmlTemplate(options.name, options.title, options.message, options.actionUrl)
    const textContent = this.getDefaultTextTemplate(options.name, options.title, options.message, options.actionUrl)

    await this.sendEmail({
      to: options.to,
      subject: options.title,
      html: htmlContent,
      text: textContent,
    })
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

  // Send maintenance reminder email
  async sendMaintenanceReminder(
    to: string,
    name: string,
    vehiclePlate: string,
    serviceType: string,
    dueDate: string,
    language = "en",
  ): Promise<void> {
    try {
      await this.sendNotificationEmail({
        to,
        name,
        type: "maintenance_reminder",
        title: `Maintenance Reminder: ${vehiclePlate}`,
        message: `Your vehicle ${vehiclePlate} is due for ${serviceType} maintenance on ${dueDate}.`,
        actionUrl: `${process.env.APP_URL}/maintenance`,
        language,
        variables: {
          vehicle_plate: vehiclePlate,
          service_type: serviceType,
          due_date: dueDate,
        },
      })
    } catch (error) {
      console.error("Error sending maintenance reminder:", error)
    }
  }

  // Send license expiry alert
  async sendLicenseExpiryAlert(
    to: string,
    name: string,
    driverName: string,
    expiryDate: string,
    language = "en",
  ): Promise<void> {
    try {
      await this.sendNotificationEmail({
        to,
        name,
        type: "license_expiry",
        title: `License Expiry Alert: ${driverName}`,
        message: `Driver ${driverName}'s license will expire on ${expiryDate}. Please renew immediately.`,
        actionUrl: `${process.env.APP_URL}/drivers`,
        language,
        variables: {
          driver_name: driverName,
          expiry_date: expiryDate,
        },
      })
    } catch (error) {
      console.error("Error sending license expiry alert:", error)
    }
  }

  // Send incident alert
  async sendIncidentAlert(
    to: string,
    name: string,
    incidentId: string,
    vehiclePlate: string,
    incidentType: string,
    language = "en",
  ): Promise<void> {
    try {
      await this.sendNotificationEmail({
        to,
        name,
        type: "incident_alert",
        title: `Incident Alert: ${incidentId}`,
        message: `A new ${incidentType} incident has been reported for vehicle ${vehiclePlate}.`,
        actionUrl: `${process.env.APP_URL}/incidents`,
        language,
        variables: {
          incident_id: incidentId,
          vehicle_plate: vehiclePlate,
          incident_type: incidentType,
        },
      })
    } catch (error) {
      console.error("Error sending incident alert:", error)
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

  // Send email via Gmail SMTP
  private async sendEmail(options: {
    to: string
    subject: string
    html: string
    text: string
  }): Promise<void> {
    try {
      if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
        console.warn("Gmail credentials not configured, skipping email send")
        console.log("📧 Email would be sent:", {
          to: options.to,
          subject: options.subject,
          preview: options.text.substring(0, 100) + "...",
        })
        return
      }

      const mailOptions = {
        from: `"${this.fromName}" <${this.fromEmail}>`,
        to: options.to,
        subject: options.subject,
        text: options.text,
        html: options.html,
      }

      const info = await this.transporter.sendMail(mailOptions)
      console.log(`✅ Email sent successfully to ${options.to}`, info.messageId)
    } catch (error) {
      console.error("Error sending email:", error)
      throw error
    }
  }

  // Test email configuration
  async testEmailConfiguration(): Promise<boolean> {
    try {
      if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
        console.warn("Gmail credentials not configured")
        return false
      }

      // Verify transporter configuration
      await this.transporter.verify()
      console.log("✅ Gmail SMTP configuration is valid")

      return true
    } catch (error) {
      console.error("Gmail configuration test failed:", error)
      return false
    }
  }

  // Default HTML template
  private getDefaultHtmlTemplate(name: string, title: string, message: string, actionUrl?: string): string {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
      line-height: 1.6; 
      color: #333; 
      margin: 0; 
      padding: 0; 
      background-color: #f5f5f5; 
    }
    .container { 
      max-width: 600px; 
      margin: 0 auto; 
      background: white; 
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    .header { 
      background: linear-gradient(135deg, #3b82f6, #1d4ed8); 
      color: white; 
      padding: 30px; 
      text-align: center; 
    }
    .content { 
      padding: 30px; 
    }
    .footer { 
      background: #f9fafb; 
      padding: 20px; 
      text-align: center; 
      color: #6b7280; 
      font-size: 14px; 
    }
    .button { 
      display: inline-block; 
      background: #3b82f6; 
      color: white; 
      padding: 12px 24px; 
      text-decoration: none; 
      border-radius: 6px; 
      margin: 15px 0; 
    }
    .logo { 
      font-size: 24px; 
      font-weight: bold; 
    }
    .message-box {
      background: #f0f9ff;
      border-left: 4px solid #3b82f6;
      padding: 15px;
      margin: 20px 0;
      border-radius: 4px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">🚗 Fleetly</div>
      <h1>${title}</h1>
    </div>
    <div class="content">
      <p>Hello ${name},</p>
      
      <div class="message-box">
        <p>${message}</p>
      </div>
      
      ${
        actionUrl
          ? `
        <div style="text-align: center;">
          <a href="${actionUrl}" class="button">Take Action</a>
        </div>
      `
          : ""
      }
      
      <p>Best regards,<br>The Fleetly Team</p>
    </div>
    <div class="footer">
      <p>This is an automated message from Fleetly Fleet Management System</p>
      <p>© ${new Date().getFullYear()} Fleetly. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
    `
  }

  // Default text template
  private getDefaultTextTemplate(name: string, title: string, message: string, actionUrl?: string): string {
    return `
${title}

Hello ${name},

${message}

${actionUrl ? `Take Action: ${actionUrl}` : ""}

Best regards,
The Fleetly Team

This is an automated message from Fleetly Fleet Management System
© ${new Date().getFullYear()} Fleetly. All rights reserved.
    `.trim()
  }
}

export const emailService = new EmailService()
