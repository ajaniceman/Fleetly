import { NextResponse } from "next/server"
import { serverEmailService } from "@/lib/server/email-service"

export async function POST() {
  try {
    const success = await serverEmailService.verifyConnection()
    return NextResponse.json({ success })
  } catch (error) {
    console.error("Email verification API error:", error)
    return NextResponse.json({ success: false, error: "Failed to verify email connection" }, { status: 500 })
  }
}
