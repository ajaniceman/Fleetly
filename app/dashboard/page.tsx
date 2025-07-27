"use client"

import { useAuth } from "@/lib/auth"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Car, Users, Wrench, Fuel, AlertTriangle, Calendar, Plus } from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts"

// Sample data for charts
const fuelEfficiencyData = [
  { month: "Jan", efficiency: 8.2 },
  { month: "Feb", efficiency: 7.9 },
  { month: "Mar", efficiency: 8.1 },
  { month: "Apr", efficiency: 7.8 },
  { month: "May", efficiency: 8.0 },
  { month: "Jun", efficiency: 7.7 },
]

const maintenanceCostData = [
  { category: "Engine", cost: 15000 },
  { category: "Tires", cost: 8000 },
  { category: "Brakes", cost: 12000 },
  { category: "Oil Change", cost: 3000 },
  { category: "Other", cost: 7000 },
]

const vehicleUtilizationData = [
  { name: "Active", value: 85, color: "#10b981" },
  { name: "Maintenance", value: 10, color: "#f59e0b" },
  { name: "Idle", value: 5, color: "#ef4444" },
]

const recentActivities = [
  { id: 1, type: "maintenance", message: "Vehicle ABC-123 completed scheduled maintenance", time: "2 hours ago" },
  { id: 2, type: "fuel", message: "Driver John Smith added fuel to vehicle XYZ-789", time: "4 hours ago" },
  { id: 3, type: "incident", message: "Minor incident reported for vehicle DEF-456", time: "6 hours ago" },
  { id: 4, type: "driver", message: "New driver Sarah Johnson added to system", time: "1 day ago" },
]

const upcomingMaintenance = [
  { vehicle: "ABC-123", service: "Oil Change", dueDate: "2024-01-15", priority: "high" },
  { vehicle: "XYZ-789", service: "Tire Rotation", dueDate: "2024-01-18", priority: "medium" },
  { vehicle: "DEF-456", service: "Brake Inspection", dueDate: "2024-01-20", priority: "low" },
]

export default function DashboardPage() {
  const { user } = useAuth()

  if (!user) {
    return null
  }

  return (
    <DashboardLayout>
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Welcome back! Here's what's happening with your fleet today.
        </p>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card className="rounded-xl">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Car className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Vehicles</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">124</p>
                <p className="text-sm text-green-600">+2 from last month</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Drivers</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">89</p>
                <p className="text-sm text-green-600">+5 from last month</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Wrench className="h-8 w-8 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">In Maintenance</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">12</p>
                <p className="text-sm text-yellow-600">3 due this week</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Fuel className="h-8 w-8 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Avg Fuel Efficiency</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">7.8L</p>
                <p className="text-sm text-green-600">-0.2L from last month</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts and analytics */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 mb-8">
        <Card className="rounded-xl">
          <CardHeader>
            <CardTitle>Fuel Efficiency Trends</CardTitle>
            <CardDescription>Average fuel consumption over the last 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={fuelEfficiencyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="efficiency" stroke="#3b82f6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="rounded-xl">
          <CardHeader>
            <CardTitle>Maintenance Cost Breakdown</CardTitle>
            <CardDescription>Maintenance expenses by category this quarter</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={maintenanceCostData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="cost" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 mb-8">
        <Card className="rounded-xl">
          <CardHeader>
            <CardTitle>Vehicle Utilization</CardTitle>
            <CardDescription>Current fleet status distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={vehicleUtilizationData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {vehicleUtilizationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {vehicleUtilizationData.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }} />
                    <span className="text-sm text-gray-600 dark:text-gray-400">{item.name}</span>
                  </div>
                  <span className="text-sm font-medium">{item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest updates from your fleet</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    {activity.type === "maintenance" && <Wrench className="h-5 w-5 text-yellow-600" />}
                    {activity.type === "fuel" && <Fuel className="h-5 w-5 text-purple-600" />}
                    {activity.type === "incident" && <AlertTriangle className="h-5 w-5 text-red-600" />}
                    {activity.type === "driver" && <Users className="h-5 w-5 text-green-600" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900 dark:text-white">{activity.message}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts and quick actions */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="rounded-xl">
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2" />
              Upcoming Maintenance
            </CardTitle>
            <CardDescription>Vehicles requiring attention soon</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingMaintenance.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{item.vehicle}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{item.service}</p>
                  </div>
                  <div className="text-right">
                    <Badge
                      variant={
                        item.priority === "high" ? "destructive" : item.priority === "medium" ? "default" : "secondary"
                      }
                    >
                      {item.priority}
                    </Badge>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{item.dueDate}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <Button className="h-20 flex-col space-y-2 rounded-lg">
                <Plus className="h-5 w-5" />
                <span className="text-sm">Add Vehicle</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col space-y-2 rounded-lg bg-transparent">
                <Users className="h-5 w-5" />
                <span className="text-sm">Add Driver</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col space-y-2 rounded-lg bg-transparent">
                <Calendar className="h-5 w-5" />
                <span className="text-sm">Schedule Service</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col space-y-2 rounded-lg bg-transparent">
                <AlertTriangle className="h-5 w-5" />
                <span className="text-sm">Report Incident</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
