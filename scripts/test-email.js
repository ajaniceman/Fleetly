const nodemailer = require("nodemailer")
require("dotenv").config({ path: ".env.local" })

async function testEmailConfiguration() {
  console.log("🧪 Testing Gmail SMTP Configuration...\n")

  // Check environment variables
  const requiredVars = ["GMAIL_USER", "GMAIL_APP_PASSWORD"]
  const missing = requiredVars.filter((varName) => !process.env[varName])

  if (missing.length > 0) {
    console.error("❌ Missing environment variables:", missing.join(", "))
    console.log("\n📝 Please ensure these are set in your .env.local file:")
    missing.forEach((varName) => {
      console.log(`   ${varName}=your_value_here`)
    })
    process.exit(1)
  }

  console.log("✅ Environment variables found")
  console.log(`📧 Gmail User: ${process.env.GMAIL_USER}`)
  console.log(`🔐 App Password: ${"*".repeat(16)} (${process.env.GMAIL_APP_PASSWORD?.length} characters)`)

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
    console.log("\n🔌 Testing SMTP connection...")
    await transporter.verify()
    console.log("✅ SMTP connection successful!")

    // Send test email
    console.log("\n📤 Sending test email...")
    const testEmail = {
      from: `${process.env.FROM_NAME || "Fleetly System"} <${process.env.GMAIL_USER}>`,
      to: process.env.GMAIL_USER, // Send to yourself
      subject: `✅ Fleetly Email Test - ${new Date().toLocaleString()}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: #10b981; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1>✅ Email Test Successful!</h1>
          </div>
          <div style="background: #f8fafc; padding: 30px; border-radius: 0 0 8px 8px;">
            <div style="background: #d1fae5; border-left: 4px solid #10b981; padding: 15px; margin: 20px 0;">
              <strong>🎉 Congratulations!</strong><br>
              Your Gmail SMTP configuration is working perfectly.
            </div>
            <p><strong>Configuration Details:</strong></p>
            <ul>
              <li>📧 Gmail User: ${process.env.GMAIL_USER}</li>
              <li>⏰ Test Time: ${new Date().toLocaleString()}</li>
              <li>🌐 App URL: ${process.env.NEXT_PUBLIC_APP_URL || "Not set"}</li>
            </ul>
            <p>Your Fleetly system is ready to send:</p>
            <ul>
              <li>🔧 Maintenance reminders</li>
              <li>⚠️ License expiry alerts</li>
              <li>👋 Welcome emails</li>
              <li>📊 System notifications</li>
            </ul>
          </div>
          <div style="text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px;">
            <p>This is a test message from Fleetly Fleet Management System</p>
          </div>
        </div>
      `,
      text: `Email Test Successful!\n\nYour Gmail SMTP configuration is working perfectly.\n\nConfiguration Details:\nGmail User: ${process.env.GMAIL_USER}\nTest Time: ${new Date().toLocaleString()}\nApp URL: ${process.env.NEXT_PUBLIC_APP_URL || "Not set"}\n\nYour Fleetly system is ready to send maintenance reminders, license expiry alerts, welcome emails, and system notifications.`,
    }

    const result = await transporter.sendMail(testEmail)
    console.log("✅ Test email sent successfully!")
    console.log(`📬 Message ID: ${result.messageId}`)
    console.log(`📧 Check your inbox: ${process.env.GMAIL_USER}`)

    console.log("\n🎉 Gmail configuration is working perfectly!")
    console.log("🚀 Your Fleetly system is ready to send automated emails.")
  } catch (error) {
    console.error("\n❌ Email test failed:")

    if (error.code === "EAUTH") {
      console.error("🔐 Authentication failed. Please check:")
      console.error("   1. Gmail App Password is correct (16 characters, no spaces)")
      console.error("   2. 2-Factor Authentication is enabled on Gmail")
      console.error('   3. App Password was generated for "Mail"')
    } else if (error.code === "ENOTFOUND") {
      console.error("🌐 Network connection failed. Please check your internet connection.")
    } else {
      console.error("📧 Error details:", error.message)
    }

    console.log("\n🔧 Troubleshooting steps:")
    console.log("   1. Verify your Gmail credentials in .env.local")
    console.log("   2. Ensure 2FA is enabled on your Gmail account")
    console.log("   3. Generate a new App Password if needed")
    console.log("   4. Remove all spaces from the App Password")

    process.exit(1)
  }
}

testEmailConfiguration()
