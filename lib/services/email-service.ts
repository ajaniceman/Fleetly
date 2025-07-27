import nodemailer from "nodemailer"

interface EmailOptions {
  to: string
  subject: string
  html: string
  text?: string
}

interface EmailTemplate {
  subject: string
  html: string
  text: string
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

  async sendEmail(options: EmailOptions): Promise<boolean> {
    try {
      const mailOptions = {
        from: `${process.env.FROM_NAME || "Fleetly System"} <${process.env.GMAIL_USER}>`,
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text || this.stripHtml(options.html),
      }

      await this.transporter.sendMail(mailOptions)
      console.log(`Email sent successfully to ${options.to}`)
      return true
    } catch (error) {
      console.error("Failed to send email:", error)
      return false
    }
  }

  async sendMaintenanceReminder(
    email: string,
    vehicleInfo: { licensePlate: string; make: string; model: string },
    maintenanceType: string,
    dueDate: string,
  ): Promise<boolean> {
    const template = this.getMaintenanceReminderTemplate(vehicleInfo, maintenanceType, dueDate)

    return this.sendEmail({
      to: email,
      subject: template.subject,
      html: template.html,
      text: template.text,
    })
  }

  async sendLicenseExpiryAlert(
    email: string,
    driverName: string,
    licenseType: string,
    expiryDate: string,
  ): Promise<boolean> {
    const template = this.getLicenseExpiryTemplate(driverName, licenseType, expiryDate)

    return this.sendEmail({
      to: email,
      subject: template.subject,
      html: template.html,
      text: template.text,
    })
  }

  async sendWelcomeEmail(email: string, name: string, tempPassword?: string): Promise<boolean> {
    const template = this.getWelcomeTemplate(name, tempPassword)

    return this.sendEmail({
      to: email,
      subject: template.subject,
      html: template.html,
      text: template.text,
    })
  }

  async sendIncidentAlert(
    email: string,
    incidentDetails: {
      vehicleLicense: string
      driverName: string
      incidentType: string
      location: string
      timestamp: string
    },
  ): Promise<boolean> {
    const template = this.getIncidentAlertTemplate(incidentDetails)

    return this.sendEmail({
      to: email,
      subject: template.subject,
      html: template.html,
      text: template.text,
    })
  }

  async testConnection(): Promise<boolean> {
    try {
      await this.transporter.verify()
      console.log("Email service connection verified successfully")
      return true
    } catch (error) {
      console.error("Email service connection failed:", error)
      return false
    }
  }

  private getMaintenanceReminderTemplate(
    vehicleInfo: { licensePlate: string; make: string; model: string },
    maintenanceType: string,
    dueDate: string,
  ): EmailTemplate {
    const subject = `🔧 Maintenance Reminder: ${vehicleInfo.licensePlate}`

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Maintenance Reminder</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #2563eb; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f8fafc; padding: 30px; border-radius: 0 0 8px 8px; }
            .alert { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; }
            .vehicle-info { background: white; padding: 20px; border-radius: 6px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
            .btn { display: inline-block; background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔧 Maintenance Reminder</h1>
            </div>
            <div class="content">
              <div class="alert">
                <strong>⚠️ Maintenance Due Soon</strong><br>
                Your vehicle requires scheduled maintenance attention.
              </div>
              
              <div class="vehicle-info">
                <h3>Vehicle Information</h3>
                <p><strong>License Plate:</strong> ${vehicleInfo.licensePlate}</p>
                <p><strong>Vehicle:</strong> ${vehicleInfo.make} ${vehicleInfo.model}</p>
                <p><strong>Maintenance Type:</strong> ${maintenanceType}</p>
                <p><strong>Due Date:</strong> ${dueDate}</p>
              </div>
              
              <p>Please schedule this maintenance as soon as possible to ensure vehicle safety and compliance.</p>
              
              <a href="${process.env.APP_URL}/maintenance" class="btn">View Maintenance Schedule</a>
              
              <div class="footer">
                <p>This is an automated message from Fleetly Fleet Management System</p>
                <p>© ${new Date().getFullYear()} Fleetly. All rights reserved.</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `

    const text = `
      MAINTENANCE REMINDER
      
      Vehicle: ${vehicleInfo.make} ${vehicleInfo.model}
      License Plate: ${vehicleInfo.licensePlate}
      Maintenance Type: ${maintenanceType}
      Due Date: ${dueDate}
      
      Please schedule this maintenance as soon as possible.
      
      View details: ${process.env.APP_URL}/maintenance
    `

    return { subject, html, text }
  }

  private getLicenseExpiryTemplate(driverName: string, licenseType: string, expiryDate: string): EmailTemplate {
    const subject = `📋 License Expiry Alert: ${driverName}`

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>License Expiry Alert</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #dc2626; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f8fafc; padding: 30px; border-radius: 0 0 8px 8px; }
            .alert { background: #fee2e2; border-left: 4px solid #dc2626; padding: 15px; margin: 20px 0; }
            .driver-info { background: white; padding: 20px; border-radius: 6px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
            .btn { display: inline-block; background: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📋 License Expiry Alert</h1>
            </div>
            <div class="content">
              <div class="alert">
                <strong>🚨 Urgent: License Expiring Soon</strong><br>
                Immediate action required to maintain compliance.
              </div>
              
              <div class="driver-info">
                <h3>Driver Information</h3>
                <p><strong>Driver:</strong> ${driverName}</p>
                <p><strong>License Type:</strong> ${licenseType}</p>
                <p><strong>Expiry Date:</strong> ${expiryDate}</p>
              </div>
              
              <p>Please ensure the license is renewed before the expiry date to avoid compliance issues and potential service disruptions.</p>
              
              <a href="${process.env.APP_URL}/drivers" class="btn">Manage Driver Licenses</a>
              
              <div class="footer">
                <p>This is an automated message from Fleetly Fleet Management System</p>
                <p>© ${new Date().getFullYear()} Fleetly. All rights reserved.</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `

    const text = `
      LICENSE EXPIRY ALERT
      
      Driver: ${driverName}
      License Type: ${licenseType}
      Expiry Date: ${expiryDate}
      
      Please renew this license before expiry to maintain compliance.
      
      Manage licenses: ${process.env.APP_URL}/drivers
    `

    return { subject, html, text }
  }

  private getWelcomeTemplate(name: string, tempPassword?: string): EmailTemplate {
    const subject = `🎉 Welcome to Fleetly Fleet Management`

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to Fleetly</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #059669; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f8fafc; padding: 30px; border-radius: 0 0 8px 8px; }
            .welcome-info { background: white; padding: 20px; border-radius: 6px; margin: 20px 0; }
            .credentials { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
            .btn { display: inline-block; background: #059669; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Welcome to Fleetly</h1>
            </div>
            <div class="content">
              <h2>Hello ${name}!</h2>
              
              <p>Welcome to Fleetly Fleet Management System. You now have access to our comprehensive fleet management platform.</p>
              
              <div class="welcome-info">
                <h3>What you can do with Fleetly:</h3>
                <ul>
                  <li>🚗 Manage vehicle fleet and tracking</li>
                  <li>👥 Driver management and licensing</li>
                  <li>🔧 Maintenance scheduling and tracking</li>
                  <li>⛽ Fuel consumption monitoring</li>
                  <li>📊 Comprehensive reporting and analytics</li>
                  <li>🚨 Incident reporting and management</li>
                </ul>
              </div>
              
              ${
                tempPassword
                  ? `
                <div class="credentials">
                  <strong>🔐 Your Login Credentials:</strong><br>
                  <strong>Email:</strong> Your email address<br>
                  <strong>Temporary Password:</strong> ${tempPassword}<br>
                  <em>Please change your password after first login for security.</em>
                </div>
              `
                  : ""
              }
              
              <a href="${process.env.APP_URL}/login" class="btn">Access Fleetly Dashboard</a>
              
              <p>If you have any questions or need assistance, please don't hesitate to contact our support team.</p>
              
              <div class="footer">
                <p>This is an automated message from Fleetly Fleet Management System</p>
                <p>© ${new Date().getFullYear()} Fleetly. All rights reserved.</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `

    const text = `
      WELCOME TO FLEETLY
      
      Hello ${name}!
      
      Welcome to Fleetly Fleet Management System. You now have access to our comprehensive fleet management platform.
      
      Features available:
      - Vehicle fleet management and tracking
      - Driver management and licensing
      - Maintenance scheduling and tracking
      - Fuel consumption monitoring
      - Comprehensive reporting and analytics
      - Incident reporting and management
      
      ${
        tempPassword
          ? `
      Your Login Credentials:
      Email: Your email address
      Temporary Password: ${tempPassword}
      Please change your password after first login.
      `
          : ""
      }
      
      Access dashboard: ${process.env.APP_URL}/login
    `

    return { subject, html, text }
  }

  private getIncidentAlertTemplate(incidentDetails: {
    vehicleLicense: string
    driverName: string
    incidentType: string
    location: string
    timestamp: string
  }): EmailTemplate {
    const subject = `🚨 Incident Alert: ${incidentDetails.vehicleLicense}`

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Incident Alert</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #dc2626; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f8fafc; padding: 30px; border-radius: 0 0 8px 8px; }
            .alert { background: #fee2e2; border-left: 4px solid #dc2626; padding: 15px; margin: 20px 0; }
            .incident-info { background: white; padding: 20px; border-radius: 6px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
            .btn { display: inline-block; background: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🚨 Incident Alert</h1>
            </div>
            <div class="content">
              <div class="alert">
                <strong>⚠️ New Incident Reported</strong><br>
                Immediate attention may be required.
              </div>
              
              <div class="incident-info">
                <h3>Incident Details</h3>
                <p><strong>Vehicle:</strong> ${incidentDetails.vehicleLicense}</p>
                <p><strong>Driver:</strong> ${incidentDetails.driverName}</p>
                <p><strong>Incident Type:</strong> ${incidentDetails.incidentType}</p>
                <p><strong>Location:</strong> ${incidentDetails.location}</p>
                <p><strong>Time:</strong> ${incidentDetails.timestamp}</p>
              </div>
              
              <p>Please review this incident and take appropriate action as needed.</p>
              
              <a href="${process.env.APP_URL}/incidents" class="btn">View Incident Details</a>
              
              <div class="footer">
                <p>This is an automated message from Fleetly Fleet Management System</p>
                <p>© ${new Date().getFullYear()} Fleetly. All rights reserved.</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `

    const text = `
      INCIDENT ALERT
      
      Vehicle: ${incidentDetails.vehicleLicense}
      Driver: ${incidentDetails.driverName}
      Incident Type: ${incidentDetails.incidentType}
      Location: ${incidentDetails.location}
      Time: ${incidentDetails.timestamp}
      
      Please review this incident and take appropriate action.
      
      View details: ${process.env.APP_URL}/incidents
    `

    return { subject, html, text }
  }

  private stripHtml(html: string): string {
    return html
      .replace(/<[^>]*>/g, "")
      .replace(/\s+/g, " ")
      .trim()
  }
}

export const emailService = new EmailService()
export default EmailService
