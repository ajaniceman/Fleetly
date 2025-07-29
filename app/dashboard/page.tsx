import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Car, Users, Wrench, Fuel } from "lucide-react"

const stats = [
  {
    name: "Total Vehicles",
    value: "24",
    icon: Car,
    change: "+2 from last month",
    changeType: "positive",
  },
  {
    name: "Active Drivers",
    value: "18",
    icon: Users,
    change: "+1 from last month",
    changeType: "positive",
  },
  {
    name: "Maintenance Due",
    value: "3",
    icon: Wrench,
    change: "-2 from last week",
    changeType: "negative",
  },
  {
    name: "Fuel Efficiency",
    value: "12.5 MPG",
    icon: Fuel,
    change: "+0.5 from last month",
    changeType: "positive",
  },
]

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Overview of your fleet management system</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.name}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.name}</CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.change}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">Vehicle ABC-123 completed maintenance</p>
                    <p className="text-sm text-muted-foreground">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">New driver Sarah Johnson added</p>
                    <p className="text-sm text-muted-foreground">1 day ago</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">Fuel record updated for XYZ-789</p>
                    <p className="text-sm text-muted-foreground">2 days ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks and shortcuts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <button className="w-full text-left p-2 hover:bg-gray-100 rounded">Add New Vehicle</button>
                <button className="w-full text-left p-2 hover:bg-gray-100 rounded">Schedule Maintenance</button>
                <button className="w-full text-left p-2 hover:bg-gray-100 rounded">Add Fuel Record</button>
                <button className="w-full text-left p-2 hover:bg-gray-100 rounded">Generate Report</button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
