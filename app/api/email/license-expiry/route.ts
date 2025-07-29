import { type NextRequest, NextResponse } from "next/server"
import { sendLicenseExpiryNotification } from "@/lib/server/email-service"

export async function POST(request: NextRequest) {
  try {
    const { driverEmail, driverName, expiryDate } = await request.json()

    if (!driverEmail || !driverName || !expiryDate) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const success = await sendLicenseExpiryNotification(driverEmail, driverName, expiryDate)

    if (success) {
      return NextResponse.json({ message: "License expiry notification sent successfully" })
    } else {
      return NextResponse.json({ error: "Failed to send license expiry notification" }, { status: 500 })
    }
  } catch (error) {
    console.error("License expiry API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
