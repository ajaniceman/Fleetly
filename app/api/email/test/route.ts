import { type NextRequest, NextResponse } from "next/server"
import { sendTestEmail } from "@/lib/server/email-service"

export async function POST(request: NextRequest) {
  try {
    const { recipientEmail } = await request.json()

    if (!recipientEmail) {
      return NextResponse.json({ error: "Missing recipient email" }, { status: 400 })
    }

    const success = await sendTestEmail(recipientEmail)

    if (success) {
      return NextResponse.json({ message: "Test email sent successfully" })
    } else {
      return NextResponse.json({ error: "Failed to send test email" }, { status: 500 })
    }
  } catch (error) {
    console.error("Test email API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
