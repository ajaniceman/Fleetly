const nodemailer = require("nodemailer")
require("dotenv").config({ path: ".env.local" })

async function testEmailConfiguration() {
  console.log("🧪 Testing Gmail SMTP configuration...\n")

  // Check environment variables
  if (!process.env.GMAIL_USER) {
    console.error("❌ GMAIL_USER environment variable is not set")
    return
  }

  if (!process.env.GMAIL_APP_PASSWORD) {
    console.error("❌ GMAIL_APP_PASSWORD environment variable is not set")
    return
  }

  console.log(`📧 Gmail User: ${process.env.GMAIL_USER}`)
  console.log(`🔑 App Password: ${process.env.GMAIL_APP_PASSWORD.substring(0, 4)}****`)
  console.log(`📛 From Name: ${process.env.FROM_NAME || "Fleetly System"}`)
  console.log(`🌐 App URL: ${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}\n`)

  // Create transporter
  const transporter = nodemailer.createTransporter({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  })

  try {
    // Verify connection
    console.log("🔍 Verifying SMTP connection...")
    await transporter.verify()
    console.log("✅ SMTP connection verified successfully!\n")

    // Send test email
    console.log("📤 Sending test email...")
    const testEmail = {
      from: `${process.env.FROM_NAME || "Fleetly System"} <${process.env.GMAIL_USER}>`,
      to: process.env.GMAIL_USER, // Send to yourself for testing
      subject: `✅ Fleetly Email Test - ${new Date().toLocaleString()}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: #10b981; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1>🚗 Fleetly Email Test</h1>
          </div>
          <div style="background: #f8fafc; padding: 30px; border-radius: 0 0 8px 8px;">
            <div style="background: #d1fae5; border-left: 4px solid #10b981; padding: 15px; margin: 20px 0; border-radius: 4px;">
              <strong>🎉 Success!</strong><br>
              Your Gmail SMTP configuration is working correctly.
            </div>
            <p><strong>Configuration Details:</strong></p>
            <ul>
              <li>📧 Gmail User: ${process.env.GMAIL_USER}</li>
              <li>⏰ Test Time: ${new Date().toLocaleString()}</li>
              <li>🌐 App URL: ${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}</li>
            </ul>
            <p>Your Fleetly system is ready to send automated notifications!</p>
          </div>
          <div style="text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px;">
            <p>This is a test message from Fleetly Fleet Management System</p>
          </div>
        </div>
      `,
      text: `Fleetly Email Test\n\nSuccess! Your Gmail SMTP configuration is working correctly.\n\nConfiguration Details:\nGmail User: ${process.env.GMAIL_USER}\nTest Time: ${new Date().toLocaleString()}\nApp URL: ${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}\n\nYour Fleetly system is ready to send automated notifications!`,
    }

    const result = await transporter.sendMail(testEmail)
    console.log(`✅ Test email sent successfully!`)
    console.log(`📬 Message ID: ${result.messageId}`)
    console.log(`📧 Check your inbox at: ${process.env.GMAIL_USER}\n`)

    console.log("🎉 Gmail configuration test completed successfully!")
    console.log("Your Fleetly system is ready to send email notifications.")
  } catch (error) {
    console.error("❌ Email test failed:", error.message)
    console.log("\n🔧 Troubleshooting tips:")
    console.log("1. Make sure 2-Factor Authentication is enabled on your Gmail account")
    console.log("2. Generate a new App Password from Google Account Settings")
    console.log("3. Remove all spaces from the App Password in your .env.local file")
    console.log("4. Check that GMAIL_USER and GMAIL_APP_PASSWORD are correctly set")
  }
}

testEmailConfiguration()
