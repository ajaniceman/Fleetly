const nodemailer = require("nodemailer")
require("dotenv").config({ path: ".env.local" })

async function testEmailConnection() {
  console.log("🧪 Testing Gmail SMTP connection...\n")

  // Check environment variables
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    console.error("❌ Missing required environment variables:")
    console.error("   - GMAIL_USER")
    console.error("   - GMAIL_APP_PASSWORD")
    console.error("\nPlease check your .env.local file")
    process.exit(1)
  }

  console.log("📧 Gmail User:", process.env.GMAIL_USER)
  console.log("🔑 App Password:", process.env.GMAIL_APP_PASSWORD ? "✓ Set" : "❌ Missing")
  console.log("")

  // Create transporter
  const transporter = nodemailer.createTransporter({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  })

  try {
    // Test connection
    console.log("🔍 Verifying SMTP connection...")
    await transporter.verify()
    console.log("✅ SMTP connection verified successfully!\n")

    // Send test email
    console.log("📤 Sending test email...")
    const testEmail = {
      from: `${process.env.FROM_NAME || "Fleetly System"} <${process.env.GMAIL_USER}>`,
      to: process.env.GMAIL_USER, // Send to yourself
      subject: "🧪 Fleetly Email Test - Success!",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: #059669; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
              .content { background: #f8fafc; padding: 30px; border-radius: 0 0 8px 8px; }
              .success { background: #d1fae5; border-left: 4px solid #059669; padding: 15px; margin: 20px 0; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🎉 Email Test Successful!</h1>
              </div>
              <div class="content">
                <div class="success">
                  <strong>✅ Gmail Integration Working</strong><br>
                  Your Fleetly system can now send emails successfully!
                </div>
                
                <h3>Test Details:</h3>
                <ul>
                  <li><strong>From:</strong> ${process.env.GMAIL_USER}</li>
                  <li><strong>Service:</strong> Gmail SMTP</li>
                  <li><strong>Time:</strong> ${new Date().toLocaleString()}</li>
                  <li><strong>Status:</strong> ✅ Success</li>
                </ul>
                
                <p>Your Fleetly fleet management system is now ready to send:</p>
                <ul>
                  <li>🔧 Maintenance reminders</li>
                  <li>📋 License expiry alerts</li>
                  <li>🎉 Welcome emails</li>
                  <li>🚨 Incident notifications</li>
                </ul>
                
                <p><em>This is an automated test message from your Fleetly system.</em></p>
              </div>
            </div>
          </body>
        </html>
      `,
      text: `
        EMAIL TEST SUCCESSFUL!
        
        Your Fleetly system can now send emails successfully!
        
        Test Details:
        - From: ${process.env.GMAIL_USER}
        - Service: Gmail SMTP
        - Time: ${new Date().toLocaleString()}
        - Status: Success
        
        Your system is ready to send maintenance reminders, license alerts, welcome emails, and incident notifications.
      `,
    }

    const result = await transporter.sendMail(testEmail)
    console.log("✅ Test email sent successfully!")
    console.log("📧 Message ID:", result.messageId)
    console.log("📬 Check your Gmail inbox for the test email\n")

    console.log("🎉 Gmail integration is working perfectly!")
    console.log("🚀 Your Fleetly system is ready for production!")
  } catch (error) {
    console.error("❌ Email test failed:")
    console.error("Error:", error.message)

    if (error.code === "EAUTH") {
      console.error("\n💡 Authentication failed. Please check:")
      console.error("   1. Gmail 2-Factor Authentication is enabled")
      console.error("   2. App Password is correctly generated")
      console.error("   3. GMAIL_APP_PASSWORD in .env.local is correct")
    } else if (error.code === "ENOTFOUND") {
      console.error("\n💡 Network error. Please check your internet connection.")
    }

    process.exit(1)
  }
}

// Run the test
testEmailConnection()
