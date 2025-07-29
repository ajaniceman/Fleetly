import { type NextRequest, NextResponse } from "next/server"
import { sendWelcomeEmail } from "@/lib/server/email-service"

export async function POST(request: NextRequest) {
  try {
    const { userEmail, userName } = await request.json()

    if (!userEmail || !userName) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const success = await sendWelcomeEmail(userEmail, userName)

    if (success) {
      return NextResponse.json({ message: "Welcome email sent successfully" })
    } else {
      return NextResponse.json({ error: "Failed to send welcome email" }, { status: 500 })
    }
  } catch (error) {
    console.error("Welcome email API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
