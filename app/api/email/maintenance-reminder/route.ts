import { type NextRequest, NextResponse } from "next/server"
import { serverEmailService } from "@/lib/server/email-service"

export async function POST(request: NextRequest) {
  try {
    const { vehicleId, dueDate } = await request.json()

    if (!vehicleId || !dueDate) {
      return NextResponse.json({ error: "Vehicle ID and due date are required" }, { status: 400 })
    }

    await serverEmailService.sendMaintenanceReminder(vehicleId, dueDate)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error sending maintenance reminder:", error)
    return NextResponse.json({ error: "Failed to send maintenance reminder" }, { status: 500 })
  }
}
