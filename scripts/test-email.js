const nodemailer = require("nodemailer")
require("dotenv").config({ path: ".env.local" })

async function testEmailConnection() {
  console.log("🧪 Testing Gmail SMTP connection...\n")

  // Check environment variables
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    console.error("❌ Missing environment variables:")
    console.error("   GMAIL_USER:", process.env.GMAIL_USER ? "✅ Set" : "❌ Missing")
    console.error("   GMAIL_APP_PASSWORD:", process.env.GMAIL_APP_PASSWORD ? "✅ Set" : "❌ Missing")
    console.error("\nPlease check your .env.local file")
    return
  }

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
    console.log("📧 Sending test email...")
    const testEmail = {
      from: `${process.env.FROM_NAME || "Fleetly System"} <${process.env.GMAIL_USER}>`,
      to: process.env.GMAIL_USER, // Send to yourself
      subject: "🧪 Fleetly Email Test - Success!",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <title>Email Test</title>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: #059669; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
              .content { padding: 20px; background: #f9fafb; border-radius: 0 0 8px 8px; }
              .success { color: #059669; font-weight: bold; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🎉 Email Configuration Test</h1>
              </div>
              <div class="content">
                <p class="success">✅ Congratulations! Your Gmail SMTP configuration is working perfectly.</p>
                <p><strong>Test Details:</strong></p>
                <ul>
                  <li>Gmail User: ${process.env.GMAIL_USER}</li>
                  <li>From Name: ${process.env.FROM_NAME || "Fleetly System"}</li>
                  <li>Test Time: ${new Date().toLocaleString()}</li>
                </ul>
                <p>Your Fleetly system is now ready to send:</p>
                <ul>
                  <li>🔧 Maintenance reminders</li>
                  <li>⚠️ License expiry alerts</li>
                  <li>👋 Welcome emails</li>
                  <li>📊 System notifications</li>
                </ul>
              </div>
            </div>
          </body>
        </html>
      `,
    }

    const info = await transporter.sendMail(testEmail)
    console.log("✅ Test email sent successfully!")
    console.log("📧 Message ID:", info.messageId)
    console.log("📬 Check your Gmail inbox for the test email\n")

    console.log("🎉 Gmail integration is ready for production!")
  } catch (error) {
    console.error("❌ Email test failed:", error.message)

    if (error.code === "EAUTH") {
      console.error("\n💡 Authentication failed. Please check:")
      console.error("   1. Gmail 2-Factor Authentication is enabled")
      console.error("   2. App Password is correctly generated")
      console.error("   3. App Password has no spaces")
      console.error("   4. GMAIL_USER is your full email address")
    }
  }
}

testEmailConnection()
