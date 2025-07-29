import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Fuel, Calendar, DollarSign, MapPin, Gauge } from "lucide-react"
import { mockFuelRecords } from "@/lib/data"

export default function FuelPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Fuel Management</h1>
            <p className="text-gray-600">Track fuel consumption and costs</p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Fuel Record
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {mockFuelRecords.map((record) => (
            <Card key={record.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Fuel className="h-5 w-5" />
                  <span>Fuel Purchase</span>
                </CardTitle>
                <CardDescription>
                  Vehicle ID: {record.vehicleId} • Driver ID: {record.driverId}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="h-4 w-4 mr-2" />
                    {record.date}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mr-2" />
                    {record.location}
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center">
                      <Fuel className="h-4 w-4 mr-2 text-gray-400" />
                      <span className="font-medium">Amount:</span>
                      <span className="ml-1">{record.amount} gal</span>
                    </div>
                    <div className="flex items-center">
                      <DollarSign className="h-4 w-4 mr-2 text-gray-400" />
                      <span className="font-medium">Cost:</span>
                      <span className="ml-1">${record.cost.toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center">
                      <span className="font-medium">Price/Unit:</span>
                      <span className="ml-1">${record.pricePerUnit.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center">
                      <Gauge className="h-4 w-4 mr-2 text-gray-400" />
                      <span className="font-medium">Mileage:</span>
                      <span className="ml-1">{record.mileage?.toLocaleString()}</span>
                    </div>
                  </div>
                  {record.receiptNumber && (
                    <div className="text-sm">
                      <span className="font-medium">Receipt:</span> {record.receiptNumber}
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
