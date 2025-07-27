import nodemailer from "nodemailer"

interface EmailOptions {
  to: string
  subject: string
  html: string
  text?: string
}

class EmailService {
  private transporter: nodemailer.Transporter

  constructor() {
    this.transporter = nodemailer.createTransporter({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    })
  }

  async sendEmail({ to, subject, html, text }: EmailOptions): Promise<boolean> {
    try {
      const mailOptions = {
        from: `${process.env.FROM_NAME || "Fleetly System"} <${process.env.GMAIL_USER}>`,
        to,
        subject,
        html,
        text: text || html.replace(/<[^>]*>/g, ""), // Strip HTML for text version
      }

      await this.transporter.sendMail(mailOptions)
      console.log(`Email sent successfully to ${to}`)
      return true
    } catch (error) {
      console.error("Email sending failed:", error)
      return false
    }
  }

  async sendMaintenanceReminder(email: string, vehicleInfo: any, maintenanceType: string, dueDate: string) {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Maintenance Reminder</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #2563eb; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #f9fafb; }
            .footer { padding: 20px; text-align: center; color: #666; }
            .button { background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔧 Maintenance Reminder</h1>
            </div>
            <div class="content">
              <h2>Vehicle Maintenance Due</h2>
              <p><strong>Vehicle:</strong> ${vehicleInfo.make} ${vehicleInfo.model} (${vehicleInfo.licensePlate})</p>
              <p><strong>Maintenance Type:</strong> ${maintenanceType}</p>
              <p><strong>Due Date:</strong> ${dueDate}</p>
              <p>Please schedule this maintenance as soon as possible to ensure vehicle safety and compliance.</p>
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/maintenance" class="button">View Maintenance Schedule</a>
            </div>
            <div class="footer">
              <p>Fleetly Fleet Management System</p>
            </div>
          </div>
        </body>
      </html>
    `

    return this.sendEmail({
      to: email,
      subject: `Maintenance Reminder: ${vehicleInfo.make} ${vehicleInfo.model}`,
      html,
    })
  }

  async sendLicenseExpiryAlert(email: string, driverInfo: any, expiryDate: string) {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>License Expiry Alert</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #dc2626; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #f9fafb; }
            .footer { padding: 20px; text-align: center; color: #666; }
            .button { background: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>⚠️ License Expiry Alert</h1>
            </div>
            <div class="content">
              <h2>Driver License Expiring Soon</h2>
              <p><strong>Driver:</strong> ${driverInfo.firstName} ${driverInfo.lastName}</p>
              <p><strong>License Number:</strong> ${driverInfo.licenseNumber}</p>
              <p><strong>Expiry Date:</strong> ${expiryDate}</p>
              <p>Please renew your license before the expiry date to maintain driving privileges.</p>
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/drivers" class="button">Update License Info</a>
            </div>
            <div class="footer">
              <p>Fleetly Fleet Management System</p>
            </div>
          </div>
        </body>
      </html>
    `

    return this.sendEmail({
      to: email,
      subject: `License Expiry Alert: ${driverInfo.firstName} ${driverInfo.lastName}`,
      html,
    })
  }

  async sendWelcomeEmail(email: string, userName: string, tempPassword: string) {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Welcome to Fleetly</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #059669; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #f9fafb; }
            .footer { padding: 20px; text-align: center; color: #666; }
            .button { background: #059669; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; }
            .credentials { background: #e5e7eb; padding: 15px; border-radius: 6px; margin: 15px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🚗 Welcome to Fleetly</h1>
            </div>
            <div class="content">
              <h2>Welcome, ${userName}!</h2>
              <p>Your Fleetly account has been created successfully. You can now access the fleet management system.</p>
              <div class="credentials">
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Temporary Password:</strong> ${tempPassword}</p>
              </div>
              <p><strong>Important:</strong> Please change your password after your first login for security.</p>
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/login" class="button">Login to Fleetly</a>
            </div>
            <div class="footer">
              <p>Fleetly Fleet Management System</p>
            </div>
          </div>
        </body>
      </html>
    `

    return this.sendEmail({
      to: email,
      subject: "Welcome to Fleetly - Your Account is Ready",
      html,
    })
  }
}

export const emailService = new EmailService()
