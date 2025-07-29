import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { mockMaintenanceRecords } from "@/lib/data"
import { Plus } from "lucide-react"

export default function MaintenancePage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Maintenance</h1>
            <p className="text-muted-foreground">Track vehicle maintenance and repairs</p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Schedule Maintenance
          </Button>
        </div>

        <div className="space-y-4">
          {mockMaintenanceRecords.map((record) => (
            <Card key={record.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">
                      {record.vehiclePlate} - {record.description}
                    </CardTitle>
                    <CardDescription>
                      {record.type} • {record.date} • {record.mileage.toLocaleString()} miles
                    </CardDescription>
                  </div>
                  <Badge
                    variant={
                      record.status === "completed"
                        ? "default"
                        : record.status === "in-progress"
                          ? "secondary"
                          : "outline"
                    }
                  >
                    {record.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Cost:</span>
                    <div className="font-medium">${record.cost.toFixed(2)}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Service Provider:</span>
                    <div className="font-medium">{record.serviceProvider}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Type:</span>
                    <div className="font-medium capitalize">{record.type}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Status:</span>
                    <div className="font-medium capitalize">{record.status.replace("-", " ")}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}
