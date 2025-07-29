import { type NextRequest, NextResponse } from "next/server"
import { serverEmailService } from "@/lib/server/email-service"

export async function POST(request: NextRequest) {
  try {
    const { to, driverName, licenseType, expiryDate, daysUntilExpiry } = await request.json()

    const success = await serverEmailService.sendLicenseExpiryAlert(to, {
      driverName,
      licenseType,
      expiryDate,
      daysUntilExpiry,
    })

    return NextResponse.json({ success })
  } catch (error) {
    console.error("License expiry email API error:", error)
    return NextResponse.json({ success: false, error: "Failed to send email" }, { status: 500 })
  }
}
