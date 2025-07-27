const nodemailer = require("nodemailer")
require("dotenv").config({ path: ".env.local" })

async function testEmailConfiguration() {
  console.log("🧪 Testing Gmail SMTP configuration...\n")

  // Check environment variables
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    console.error("❌ Missing Gmail credentials in environment variables")
    console.log("Please set GMAIL_USER and GMAIL_APP_PASSWORD in your .env.local file")
    return
  }

  // Create transporter
  const transporter = nodemailer.createTransporter({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    },
  })

  try {
    // Verify connection
    console.log("🔍 Verifying SMTP connection...")
    await transporter.verify()
    console.log("✅ SMTP connection verified successfully!\n")

    // Send test email
    console.log("📧 Sending test email...")
    const info = await transporter.sendMail({
      from: `"Fleetly System" <${process.env.GMAIL_USER}>`,
      to: process.env.GMAIL_USER, // Send to yourself
      subject: "Fleetly Email Configuration Test",
      text: "This is a test email from your Fleetly application. If you receive this, your email configuration is working correctly!",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #3b82f6, #1d4ed8); color: white; padding: 20px; text-align: center;">
            <h1>🚗 Fleetly Email Test</h1>
          </div>
          <div style="padding: 20px;">
            <p>Congratulations! Your Gmail SMTP configuration is working correctly.</p>
            <p>This test email was sent from your Fleetly application using:</p>
            <ul>
              <li><strong>Gmail Account:</strong> ${process.env.GMAIL_USER}</li>
              <li><strong>SMTP Server:</strong> smtp.gmail.com</li>
              <li><strong>Port:</strong> 587</li>
            </ul>
            <p>You can now receive notifications for:</p>
            <ul>
              <li>Maintenance reminders</li>
              <li>License expiry alerts</li>
              <li>Incident notifications</li>
              <li>Welcome emails</li>
              <li>Password reset requests</li>
            </ul>
          </div>
          <div style="background: #f9fafb; padding: 15px; text-align: center; color: #6b7280; font-size: 14px;">
            <p>This is an automated test message from Fleetly Fleet Management System</p>
          </div>
        </div>
      `,
    })

    console.log("✅ Test email sent successfully!")
    console.log(`📬 Message ID: ${info.messageId}`)
    console.log(`📧 Check your inbox at: ${process.env.GMAIL_USER}\n`)

    console.log("🎉 Gmail configuration test completed successfully!")
    console.log("Your Fleetly application is ready to send email notifications.")
  } catch (error) {
    console.error("❌ Email configuration test failed:")
    console.error(error.message)

    if (error.code === "EAUTH") {
      console.log("\n💡 Authentication failed. Please check:")
      console.log("1. Your Gmail address is correct")
      console.log("2. You have enabled 2-Factor Authentication")
      console.log("3. You have generated an App Password (not your regular password)")
      console.log("4. The App Password is correctly set in GMAIL_APP_PASSWORD")
    } else if (error.code === "ECONNECTION") {
      console.log("\n💡 Connection failed. Please check:")
      console.log("1. Your internet connection")
      console.log("2. Firewall settings")
      console.log("3. Gmail SMTP is not blocked")
    }
  }
}

testEmailConfiguration()
