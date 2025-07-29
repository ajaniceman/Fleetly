import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Wrench, Calendar, DollarSign, MapPin } from "lucide-react"
import { mockMaintenanceRecords } from "@/lib/data"

export default function MaintenancePage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Maintenance</h1>
            <p className="text-gray-600">Track vehicle maintenance and repairs</p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Schedule Maintenance
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {mockMaintenanceRecords.map((record) => (
            <Card key={record.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <Wrench className="h-5 w-5" />
                    <span>{record.type === "scheduled" ? "Scheduled" : "Repair"}</span>
                  </CardTitle>
                  <Badge variant={record.status === "completed" ? "default" : "secondary"}>{record.status}</Badge>
                </div>
                <CardDescription>Vehicle ID: {record.vehicleId}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <p className="text-sm font-medium">{record.description}</p>
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="h-4 w-4 mr-2" />
                    {record.date}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <DollarSign className="h-4 w-4 mr-2" />${record.cost.toFixed(2)}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mr-2" />
                    {record.serviceProvider}
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">Mileage:</span> {record.mileage?.toLocaleString()} miles
                  </div>
                  {record.nextServiceDate && (
                    <div className="text-sm">
                      <span className="font-medium">Next Service:</span> {record.nextServiceDate}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}
