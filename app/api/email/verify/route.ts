import { type NextRequest, NextResponse } from "next/server"
import { serverEmailService } from "@/lib/server/email-service"

export async function POST(request: NextRequest) {
  try {
    const { userEmail, verificationToken } = await request.json()

    if (!userEmail || !verificationToken) {
      return NextResponse.json({ error: "User email and verification token are required" }, { status: 400 })
    }

    await serverEmailService.sendVerificationEmail(userEmail, verificationToken)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error sending verification email:", error)
    return NextResponse.json({ error: "Failed to send verification email" }, { status: 500 })
  }
}
