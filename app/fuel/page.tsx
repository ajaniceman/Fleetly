import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { mockFuelRecords } from "@/lib/data"
import { Plus } from "lucide-react"

export default function FuelPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Fuel Management</h1>
            <p className="text-muted-foreground">Track fuel consumption and costs</p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Fuel Record
          </Button>
        </div>

        <div className="space-y-4">
          {mockFuelRecords.map((record) => (
            <Card key={record.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">
                      {record.vehiclePlate} - {record.location}
                    </CardTitle>
                    <CardDescription>
                      {record.date} • {record.driver} • {record.mileage.toLocaleString()} miles
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold">${record.cost.toFixed(2)}</div>
                    <div className="text-sm text-muted-foreground">${record.pricePerUnit.toFixed(2)}/gal</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Amount:</span>
                    <div className="font-medium">{record.amount} gallons</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Total Cost:</span>
                    <div className="font-medium">${record.cost.toFixed(2)}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Price per Gallon:</span>
                    <div className="font-medium">${record.pricePerUnit.toFixed(2)}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Efficiency:</span>
                    <div className="font-medium">{(record.mileage / record.amount).toFixed(1)} MPG</div>
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
