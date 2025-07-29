import { type NextRequest, NextResponse } from "next/server"
import { serverEmailService } from "@/lib/server/email-service"

export async function POST(request: NextRequest) {
  try {
    const { to, userName, tempPassword } = await request.json()

    const success = await serverEmailService.sendWelcomeEmail(to, userName, tempPassword)

    return NextResponse.json({ success })
  } catch (error) {
    console.error("Welcome email API error:", error)
    return NextResponse.json({ success: false, error: "Failed to send email" }, { status: 500 })
  }
}
