const nodemailer = require("nodemailer")
require("dotenv").config({ path: ".env.local" })

async function testEmail() {
  console.log("Testing email configuration...")

  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    console.error("❌ Missing email configuration. Please check your .env.local file.")
    console.log("Required variables:")
    console.log("- GMAIL_USER")
    console.log("- GMAIL_APP_PASSWORD")
    process.exit(1)
  }

  const transporter = nodemailer.createTransporter({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  })

  try {
    // Verify connection
    await transporter.verify()
    console.log("✅ SMTP connection verified successfully")

    // Send test email
    const info = await transporter.sendMail({
      from: `"${process.env.FROM_NAME || "Fleetly System"}" <${process.env.GMAIL_USER}>`,
      to: process.env.GMAIL_USER,
      subject: "Fleetly Email Test - " + new Date().toISOString(),
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
    })

    console.log("✅ Test email sent successfully!")
    console.log("Message ID:", info.messageId)
    console.log("Preview URL:", nodemailer.getTestMessageUrl(info))
  } catch (error) {
    console.error("❌ Email test failed:", error.message)

    if (error.code === "EAUTH") {
      console.log("\n💡 Authentication failed. Please check:")
      console.log("1. Gmail App Password is correct")
      console.log("2. 2-Factor Authentication is enabled on your Gmail account")
      console.log("3. App Password was generated correctly")
    }

    process.exit(1)
  }
}

testEmail()
