import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Car, Users, Wrench, Fuel, AlertTriangle, TrendingUp } from "lucide-react"

const stats = [
  {
    title: "Total Vehicles",
    value: "24",
    description: "2 inactive",
    icon: Car,
    trend: "+2 this month",
  },
  {
    title: "Active Drivers",
    value: "18",
    description: "All certified",
    icon: Users,
    trend: "+1 this month",
  },
  {
    title: "Maintenance Due",
    value: "3",
    description: "This week",
    icon: Wrench,
    trend: "-1 from last week",
  },
  {
    title: "Fuel Efficiency",
    value: "12.5 MPG",
    description: "Fleet average",
    icon: Fuel,
    trend: "+0.3 from last month",
  },
  {
    title: "Open Incidents",
    value: "1",
    description: "Pending resolution",
    icon: AlertTriangle,
    trend: "-2 from last week",
  },
  {
    title: "Monthly Savings",
    value: "$2,340",
    description: "vs last month",
    icon: TrendingUp,
    trend: "+15% improvement",
  },
]

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's what's happening with your fleet.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
                <p className="text-xs text-green-600 mt-1">{stat.trend}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest fleet updates and notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Vehicle ABC-123 completed maintenance</p>
                    <p className="text-xs text-gray-500">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">New driver Sarah Johnson added</p>
                    <p className="text-xs text-gray-500">1 day ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Fuel efficiency report generated</p>
                    <p className="text-xs text-gray-500">2 days ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Upcoming Tasks</CardTitle>
              <CardDescription>Important items requiring attention</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Vehicle XYZ-789 maintenance</p>
                    <p className="text-xs text-gray-500">Due in 3 days</p>
                  </div>
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Driver license renewal</p>
                    <p className="text-xs text-gray-500">Due in 1 week</p>
                  </div>
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Insurance policy review</p>
                    <p className="text-xs text-gray-500">Due in 2 weeks</p>
                  </div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
