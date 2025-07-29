import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Car, MapPin, Calendar } from "lucide-react"
import { mockVehicles } from "@/lib/data"

export default function VehiclesPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Vehicles</h1>
            <p className="text-gray-600">Manage your fleet vehicles</p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Vehicle
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockVehicles.map((vehicle) => (
            <Card key={vehicle.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <Car className="h-5 w-5" />
                    <span>
                      {vehicle.make} {vehicle.model}
                    </span>
                  </CardTitle>
                  <Badge variant={vehicle.status === "active" ? "default" : "secondary"}>{vehicle.status}</Badge>
                </div>
                <CardDescription>
                  {vehicle.year} • {vehicle.licensePlate}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mr-2" />
                    {vehicle.location}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="h-4 w-4 mr-2" />
                    Next maintenance: {vehicle.nextMaintenance}
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">Mileage:</span> {vehicle.mileage.toLocaleString()} miles
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">Fuel Type:</span> {vehicle.fuelType}
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
