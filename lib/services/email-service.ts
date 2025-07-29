import nodemailer from "nodemailer"

interface EmailOptions {
  to: string
  subject: string
  html: string
  text?: string
}

interface MaintenanceReminder {
  vehiclePlate: string
  maintenanceType: string
  dueDate: string
  daysUntilDue: number
}

interface LicenseExpiry {
  driverName: string
  licenseType: string
  expiryDate: string
  daysUntilExpiry: number
}

class EmailService {
  private transporter: nodemailer.Transporter

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    })
  }

  private async sendEmail(options: EmailOptions): Promise<boolean> {
    try {
      const mailOptions = {
        from: `${process.env.FROM_NAME || "Fleetly System"} <${process.env.GMAIL_USER}>`,
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text,
      }

      const result = await this.transporter.sendMail(mailOptions)
      console.log("Email sent successfully:", result.messageId)
      return true
    } catch (error) {
      console.error("Failed to send email:", error)
      return false
    }
  }

  private async callEmailAPI(endpoint: string, data: any): Promise<boolean> {
    try {
      const response = await fetch(`/api/email/${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()
      return result.success || false
    } catch (error) {
      console.error(`Email API call failed for ${endpoint}:`, error)
      return false
    }
  }

  async sendMaintenanceReminder(to: string, data: MaintenanceReminder): Promise<boolean> {
    // return this.sendEmail({
    //   to,
    //   subject: `🔧 Maintenance Reminder: ${data.vehiclePlate}`,
    //   html: `
    //     <!DOCTYPE html>
    //     <html>
    //       <head>
    //         <meta charset="utf-8">
    //         <meta name="viewport" content="width=device-width, initial-scale=1.0">
    //         <title>Maintenance Reminder</title>
    //         <style>
    //           body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    //           .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    //           .header { background: #3b82f6; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
    //           .content { background: #f8fafc; padding: 30px; border-radius: 0 0 8px 8px; }
    //           .alert { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; }
    //           .button { display: inline-block; background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
    //           .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
    //         </style>
    //       </head>
    //       <body>
    //         <div class="container">
    //           <div class="header">
    //             <h1>🔧 Maintenance Reminder</h1>
    //           </div>
    //           <div class="content">
    //             <h2>Vehicle: ${data.vehiclePlate}</h2>
    //             <div class="alert">
    //               <strong>⚠️ Maintenance Due Soon!</strong><br>
    //               ${data.maintenanceType} is due in ${data.daysUntilDue} days (${data.dueDate})
    //             </div>
    //             <p>Please schedule the maintenance to ensure vehicle safety and compliance.</p>
    //             <a href="${process.env.NEXT_PUBLIC_APP_URL}/maintenance" class="button">View Maintenance Schedule</a>
    //           </div>
    //           <div class="footer">
    //             <p>This is an automated message from Fleetly Fleet Management System</p>
    //           </div>
    //         </div>
    //       </body>
    //     </html>
    //   `,
    //   text: `Maintenance Reminder: ${data.vehiclePlate}\n\n${data.maintenanceType} is due in ${data.daysUntilDue} days (${data.dueDate})\n\nPlease schedule the maintenance to ensure vehicle safety and compliance.`,
    // })
    return this.callEmailAPI("maintenance-reminder", { to, ...data })
  }

  async sendLicenseExpiryAlert(to: string, data: LicenseExpiry): Promise<boolean> {
    // return this.sendEmail({
    //   to,
    //   subject: `⚠️ License Expiry Alert: ${data.driverName}`,
    //   html: `
    //     <!DOCTYPE html>
    //     <html>
    //       <head>
    //         <meta charset="utf-8">
    //         <meta name="viewport" content="width=device-width, initial-scale=1.0">
    //         <title>License Expiry Alert</title>
    //         <style>
    //           body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    //           .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    //           .header { background: #dc2626; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
    //           .content { background: #f8fafc; padding: 30px; border-radius: 0 0 8px 8px; }
    //           .alert { background: #fee2e2; border-left: 4px solid #dc2626; padding: 15px; margin: 20px 0; }
    //           .button { display: inline-block; background: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
    //           .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
    //         </style>
    //       </head>
    //       <body>
    //         <div class="container">
    //           <div class="header">
    //             <h1>⚠️ License Expiry Alert</h1>
    //           </div>
    //           <div class="content">
    //             <h2>Driver: ${data.driverName}</h2>
    //             <div class="alert">
    //               <strong>🚨 License Expiring Soon!</strong><br>
    //               ${data.licenseType} expires in ${data.daysUntilExpiry} days (${data.expiryDate})
    //             </div>
    //             <p>Please ensure the license is renewed before expiry to maintain compliance.</p>
    //             <a href="${process.env.NEXT_PUBLIC_APP_URL}/drivers" class="button">View Driver Details</a>
    //           </div>
    //           <div class="footer">
    //             <p>This is an automated message from Fleetly Fleet Management System</p>
    //           </div>
    //         </div>
    //       </body>
    //     </html>
    //   `,
    //   text: `License Expiry Alert: ${data.driverName}\n\n${data.licenseType} expires in ${data.daysUntilExpiry} days (${data.expiryDate})\n\nPlease ensure the license is renewed before expiry to maintain compliance.`,
    // })
    return this.callEmailAPI("license-expiry", { to, ...data })
  }

  async sendWelcomeEmail(to: string, userName: string, tempPassword?: string): Promise<boolean> {
    // return this.sendEmail({
    //   to,
    //   subject: `👋 Welcome to Fleetly Fleet Management`,
    //   html: `
    //     <!DOCTYPE html>
    //     <html>
    //       <head>
    //         <meta charset="utf-8">
    //         <meta name="viewport" content="width=device-width, initial-scale=1.0">
    //         <title>Welcome to Fleetly</title>
    //         <style>
    //           body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    //           .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    //           .header { background: #059669; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
    //           .content { background: #f8fafc; padding: 30px; border-radius: 0 0 8px 8px; }
    //           .credentials { background: #e0f2fe; border: 1px solid #0284c7; padding: 15px; margin: 20px 0; border-radius: 6px; }
    //           .button { display: inline-block; background: #059669; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
    //           .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
    //         </style>
    //       </head>
    //       <body>
    //         <div class="container">
    //           <div class="header">
    //             <h1>👋 Welcome to Fleetly</h1>
    //           </div>
    //           <div class="content">
    //             <h2>Hello ${userName}!</h2>
    //             <p>Welcome to Fleetly Fleet Management System. Your account has been created successfully.</p>
    //
    //             ${
    //               tempPassword
    //                 ? `
    //               <div class="credentials">
    //                 <strong>🔐 Your Login Credentials:</strong><br>
    //                 Email: ${to}<br>
    //                 Temporary Password: ${tempPassword}<br>
    //                 <em>Please change your password after first login.</em>
    //               </div>
    //             `
    //                 : ""
    //             }
    //
    //             <p>With Fleetly, you can:</p>
    //             <ul>
    //               <li>🚗 Manage your vehicle fleet</li>
    //               <li>👥 Track driver information</li>
    //               <li>🔧 Schedule maintenance</li>
    //               <li>⛽ Monitor fuel consumption</li>
    //               <li>📊 Generate detailed reports</li>
    //             </ul>
    //
    //             <a href="${process.env.NEXT_PUBLIC_APP_URL}/login" class="button">Login to Fleetly</a>
    //           </div>
    //           <div class="footer">
    //             <p>If you have any questions, please contact our support team.</p>
    //           </div>
    //         </div>
    //       </body>
    //     </html>
    //   `,
    //   text: `Welcome to Fleetly Fleet Management!\n\nHello ${userName}!\n\nYour account has been created successfully.\n\n${tempPassword ? `Login Credentials:\nEmail: ${to}\nTemporary Password: ${tempPassword}\nPlease change your password after first login.\n\n` : ""}Visit ${process.env.NEXT_PUBLIC_APP_URL}/login to get started.`,
    // })
    return this.callEmailAPI("welcome", { to, userName, tempPassword })
  }

  async sendTestEmail(to: string): Promise<boolean> {
    // return this.sendEmail({
    //   to,
    //   subject: `✅ Fleetly Email Test - ${new Date().toLocaleString()}`,
    //   html: `
    //     <!DOCTYPE html>
    //     <html>
    //       <head>
    //         <meta charset="utf-8">
    //         <meta name="viewport" content="width=device-width, initial-scale=1.0">
    //         <title>Email Test</title>
    //         <style>
    //           body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    //           .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    //           .header { background: #10b981; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
    //           .content { background: #f8fafc; padding: 30px; border-radius: 0 0 8px 8px; }
    //           .success { background: #d1fae5; border-left: 4px solid #10b981; padding: 15px; margin: 20px 0; }
    //           .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
    //         </style>
    //       </head>
    //       <body>
    //         <div class="container">
    //           <div class="header">
    //             <h1>✅ Email Configuration Test</h1>
    //           </div>
    //           <div class="content">
    //             <div class="success">
    //               <strong>🎉 Success!</strong><br>
    //               Your Gmail SMTP configuration is working correctly.
    //             </div>
    //             <p><strong>Test Details:</strong></p>
    //             <ul>
    //               <li>📧 From: ${process.env.GMAIL_USER}</li>
    //               <li>📬 To: ${to}</li>
    //               <li>⏰ Time: ${new Date().toLocaleString()}</li>
    //               <li>🌐 App URL: ${process.env.NEXT_PUBLIC_APP_URL}</li>
    //             </ul>
    //             <p>Your Fleetly system is ready to send automated notifications!</p>
    //           </div>
    //           <div class="footer">
    //             <p>This is a test message from Fleetly Fleet Management System</p>
    //           </div>
    //         </div>
    //       </body>
    //     </html>
    //   `,
    //   text: `Email Configuration Test\n\nSuccess! Your Gmail SMTP configuration is working correctly.\n\nTest Details:\nFrom: ${process.env.GMAIL_USER}\nTo: ${to}\nTime: ${new Date().toLocaleString()}\nApp URL: ${process.env.NEXT_PUBLIC_APP_URL}\n\nYour Fleetly system is ready to send automated notifications!`,
    // })
    return this.callEmailAPI("test", { to })
  }

  async verifyConnection(): Promise<boolean> {
    // try {
    //   await this.transporter.verify()
    //   console.log("✅ Gmail SMTP connection verified successfully")
    //   return true
    // } catch (error) {
    //   console.error("❌ Gmail SMTP connection failed:", error)
    //   return false
    // }
    try {
      const response = await fetch("/api/email/verify", { method: "POST" })
      const result = await response.json()
      return result.success || false
    } catch (error) {
      console.error("Email verification failed:", error)
      return false
    }
  }
}

export const emailService = new EmailService()
