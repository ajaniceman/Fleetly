import nodemailer from "nodemailer"

export class ServerEmailService {
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

  async sendMaintenanceReminder(vehicleId: string, dueDate: string): Promise<void> {
    const mailOptions = {
      from: `"${process.env.FROM_NAME || "Fleetly System"}" <${process.env.GMAIL_USER}>`,
      to: process.env.GMAIL_USER, // In production, get manager email from database
      subject: "Vehicle Maintenance Reminder",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Maintenance Reminder</h2>
          <p>This is a reminder that vehicle <strong>${vehicleId}</strong> is due for maintenance.</p>
          <p><strong>Due Date:</strong> ${dueDate}</p>
          <p>Please schedule the maintenance as soon as possible to ensure vehicle safety and compliance.</p>
          <hr style="margin: 20px 0;">
          <p style="color: #666; font-size: 12px;">
            This is an automated message from the Fleetly Fleet Management System.
          </p>
        </div>
      `,
    }

    await this.transporter.sendMail(mailOptions)
  }

  async sendLicenseExpiryAlert(driverId: string, expiryDate: string): Promise<void> {
    const mailOptions = {
      from: `"${process.env.FROM_NAME || "Fleetly System"}" <${process.env.GMAIL_USER}>`,
      to: process.env.GMAIL_USER, // In production, get HR email from database
      subject: "Driver License Expiry Alert",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">License Expiry Alert</h2>
          <p>This is an alert that the driver license for <strong>${driverId}</strong> is expiring soon.</p>
          <p><strong>Expiry Date:</strong> ${expiryDate}</p>
          <p>Please ensure the driver renews their license before the expiry date to maintain compliance.</p>
          <hr style="margin: 20px 0;">
          <p style="color: #666; font-size: 12px;">
            This is an automated message from the Fleetly Fleet Management System.
          </p>
        </div>
      `,
    }

    await this.transporter.sendMail(mailOptions)
  }

  async sendWelcomeEmail(userEmail: string, userName: string): Promise<void> {
    const mailOptions = {
      from: `"${process.env.FROM_NAME || "Fleetly System"}" <${process.env.GMAIL_USER}>`,
      to: userEmail,
      subject: "Welcome to Fleetly Fleet Management System",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Welcome to Fleetly!</h2>
          <p>Hello <strong>${userName}</strong>,</p>
          <p>Welcome to the Fleetly Fleet Management System. Your account has been successfully created.</p>
          <p>You can now access the system to manage vehicles, drivers, maintenance, and more.</p>
          <p><a href="${process.env.APP_URL || "http://localhost:3000"}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Access Fleetly</a></p>
          <hr style="margin: 20px 0;">
          <p style="color: #666; font-size: 12px;">
            If you have any questions, please contact our support team.
          </p>
        </div>
      `,
    }

    await this.transporter.sendMail(mailOptions)
  }

  async sendTestEmail(to: string): Promise<void> {
    const mailOptions = {
      from: `"${process.env.FROM_NAME || "Fleetly System"}" <${process.env.GMAIL_USER}>`,
      to: to,
      subject: "Fleetly Email Test",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Email Test Successful!</h2>
          <p>This is a test email from the Fleetly Fleet Management System.</p>
          <p>If you received this email, the email configuration is working correctly.</p>
          <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
          <hr style="margin: 20px 0;">
          <p style="color: #666; font-size: 12px;">
            This is a test message from the Fleetly Fleet Management System.
          </p>
        </div>
      `,
    }

    await this.transporter.sendMail(mailOptions)
  }

  async sendVerificationEmail(userEmail: string, verificationToken: string): Promise<void> {
    const verificationUrl = `${process.env.APP_URL || "http://localhost:3000"}/verify-email?token=${verificationToken}`

    const mailOptions = {
      from: `"${process.env.FROM_NAME || "Fleetly System"}" <${process.env.GMAIL_USER}>`,
      to: userEmail,
      subject: "Verify Your Email Address",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Verify Your Email Address</h2>
          <p>Please click the link below to verify your email address:</p>
          <p><a href="${verificationUrl}" style="background-color: #28a745; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Verify Email</a></p>
          <p>If the button doesn't work, copy and paste this link into your browser:</p>
          <p style="word-break: break-all;">${verificationUrl}</p>
          <p>This verification link will expire in 24 hours.</p>
          <hr style="margin: 20px 0;">
          <p style="color: #666; font-size: 12px;">
            If you didn't create an account with Fleetly, please ignore this email.
          </p>
        </div>
      `,
    }

    await this.transporter.sendMail(mailOptions)
  }
}

export const serverEmailService = new ServerEmailService()
