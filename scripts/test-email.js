const nodemailer = require("nodemailer")
require("dotenv").config()

async function testEmail() {
  try {
    console.log("Testing email configuration...")

    const transporter = nodemailer.createTransporter({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    })

    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: process.env.GMAIL_USER, // Send to self for testing
      subject: "Fleetly Email Test",
      html: `
        <h2>Email Configuration Test</h2>
        <p>This is a test email from the Fleetly Fleet Management System.</p>
        <p>If you received this email, the configuration is working correctly!</p>
        <p>Timestamp: ${new Date().toISOString()}</p>
      `,
    }

    const info = await transporter.sendMail(mailOptions)
    console.log("✅ Email sent successfully!")
    console.log("Message ID:", info.messageId)
  } catch (error) {
    console.error("❌ Email test failed:", error.message)
    process.exit(1)
  }
}

testEmail()
