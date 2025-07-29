import { type NextRequest, NextResponse } from "next/server"
import { serverEmailService } from "@/lib/server/email-service"

export async function POST(request: NextRequest) {
  try {
    const { driverId, expiryDate } = await request.json()

    if (!driverId || !expiryDate) {
      return NextResponse.json({ error: "Driver ID and expiry date are required" }, { status: 400 })
    }

    await serverEmailService.sendLicenseExpiryAlert(driverId, expiryDate)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error sending license expiry alert:", error)
    return NextResponse.json({ error: "Failed to send license expiry alert" }, { status: 500 })
  }
}
