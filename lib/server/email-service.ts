// Correctly import createTransport as a named export
import { createTransport } from "nodemailer"

// Server-side email service using nodemailer
const transporter = createTransport({ // Use createTransport directly
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
})

// All your existing send functions follow below, using 'transporter' as before
export async function sendMaintenanceReminder(
  vehicleId: string,
  driverEmail: string,
  maintenanceDetails: any,
): Promise<boolean> {
  try {
    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: driverEmail,
      subject: `Maintenance Reminder - Vehicle ${vehicleId}`,
      html: `
        <h2>Maintenance Reminder</h2>
        <p>Dear Driver,</p>
        <p>This is a reminder that vehicle <strong>${vehicleId}</strong> requires maintenance.</p>
        <h3>Maintenance Details:</h3>
        <ul>
          <li><strong>Type:</strong> ${maintenanceDetails.type}</li>
          <li><strong>Description:</strong> ${maintenanceDetails.description}</li>
          <li><strong>Due Date:</strong> ${maintenanceDetails.dueDate}</li>
          <li><strong>Estimated Cost:</strong> $${maintenanceDetails.estimatedCost}</li>
        </ul>
        <p>Please schedule this maintenance as soon as possible.</p>
        <p>Best regards,<br>Fleet Management Team</p>
      `,
    }

    await transporter.sendMail(mailOptions)
    return true
  } catch (error) {
    console.error("Error sending maintenance reminder:", error)
    return false
  }
}

export async function sendLicenseExpiryNotification(
  driverEmail: string,
  driverName: string,
  expiryDate: string,
): Promise<boolean> {
  try {
    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: driverEmail,
      subject: "License Expiry Notification",
      html: `
        <h2>License Expiry Notification</h2>
        <p>Dear ${driverName},</p>
        <p>This is to inform you that your driver's license is set to expire on <strong>${expiryDate}</strong>.</p>
        <p>Please ensure you renew your license before the expiry date to avoid any disruption to your driving duties.</p>
        <p>If you have already renewed your license, please update your information in the system.</p>
        <p>Best regards,<br>Fleet Management Team</p>
      `,
    }

    await transporter.sendMail(mailOptions)
    return true
  } catch (error) {
    console.error("Error sending license expiry notification:", error)
    return false
  }
}

export async function sendWelcomeEmail(userEmail: string, userName: string): Promise<boolean> {
  try {
    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: userEmail,
      subject: "Welcome to Fleetly",
      html: `
        <h2>Welcome to Fleetly!</h2>
        <p>Dear ${userName},</p>
        <p>Welcome to the Fleetly Fleet Management System. Your account has been successfully created.</p>
        <p>You can now access the system to:</p>
        <ul>
          <li>View vehicle information</li>
          <li>Track maintenance schedules</li>
          <li>Monitor fuel consumption</li>
          <li>Report incidents</li>
          <li>Generate reports</li>
        </ul>
        <p>If you have any questions or need assistance, please don't hesitate to contact our support team.</p>
        <p>Best regards,<br>Fleetly Team</p>
      `,
    }

    await transporter.sendMail(mailOptions)
    return true
  } catch (error) {
    console.error("Error sending welcome email:", error)
    return false
  }
}

export async function sendTestEmail(recipientEmail: string): Promise<boolean> {
  try {
    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: recipientEmail,
      subject: "Test Email from Fleetly",
      html: `
        <h2>Test Email</h2>
        <p>This is a test email from the Fleetly Fleet Management System.</p>
        <p>If you received this email, the email configuration is working correctly.</p>
        <p>Timestamp: ${new Date().toISOString()}</p>
        <p>Best regards,<br>Fleetly System</p>
      `,
    }

    await transporter.sendMail(mailOptions)
    return true
  } catch (error) {
    console.error("Error sending test email:", error)
    return false
  }
}

export async function sendVerificationEmail(userEmail: string, verificationToken: string): Promise<boolean> {
  try {
    const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify?token=${verificationToken}`

    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: userEmail,
      subject: "Verify Your Email - Fleetly",
      html: `
        <h2>Email Verification</h2>
        <p>Please click the link below to verify your email address:</p>
        <p><a href="${verificationUrl}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Verify Email</a></p>
        <p>If the button doesn't work, copy and paste this link into your browser:</p>
        <p>${verificationUrl}</p>
        <p>This link will expire in 24 hours.</p>
        <p>If you didn't request this verification, please ignore this email.</p>
        <p>Best regards,<br>Fleetly Team</p>
      `,
    }

    await transporter.sendMail(mailOptions)
    return true
  } catch (error) {
    console.error("Error sending verification email:", error)
    return false
  }
}