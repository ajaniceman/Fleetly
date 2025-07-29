import { type NextRequest, NextResponse } from "next/server"
import { sendVerificationEmail } from "@/lib/server/email-service"

export async function POST(request: NextRequest) {
  try {
    const { userEmail, verificationToken } = await request.json()

    if (!userEmail || !verificationToken) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const success = await sendVerificationEmail(userEmail, verificationToken)

    if (success) {
      return NextResponse.json({ message: "Verification email sent successfully" })
    } else {
      return NextResponse.json({ error: "Failed to send verification email" }, { status: 500 })
    }
  } catch (error) {
    console.error("Verification email API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
