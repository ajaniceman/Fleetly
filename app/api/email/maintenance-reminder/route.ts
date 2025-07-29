import { type NextRequest, NextResponse } from "next/server"
import { sendMaintenanceReminder } from "@/lib/server/email-service"

export async function POST(request: NextRequest) {
  try {
    const { vehicleId, driverEmail, maintenanceDetails } = await request.json()

    if (!vehicleId || !driverEmail || !maintenanceDetails) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const success = await sendMaintenanceReminder(vehicleId, driverEmail, maintenanceDetails)

    if (success) {
      return NextResponse.json({ message: "Maintenance reminder sent successfully" })
    } else {
      return NextResponse.json({ error: "Failed to send maintenance reminder" }, { status: 500 })
    }
  } catch (error) {
    console.error("Maintenance reminder API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
