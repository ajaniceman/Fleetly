import { type NextRequest, NextResponse } from "next/server"
import { serverEmailService } from "@/lib/server/email-service"

export async function POST(request: NextRequest) {
  try {
    const { to, vehiclePlate, maintenanceType, dueDate, daysUntilDue } = await request.json()

    const success = await serverEmailService.sendMaintenanceReminder(to, {
      vehiclePlate,
      maintenanceType,
      dueDate,
      daysUntilDue,
    })

    return NextResponse.json({ success })
  } catch (error) {
    console.error("Maintenance reminder email API error:", error)
    return NextResponse.json({ success: false, error: "Failed to send email" }, { status: 500 })
  }
}
