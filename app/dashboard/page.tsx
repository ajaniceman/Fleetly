"use client"

import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Car, Users, Wrench, TrendingUp, TrendingDown, Fuel } from "lucide-react"
import { dashboardStats, mockVehicles, mockMaintenanceRecords } from "@/lib/data"

export default function DashboardPage() {
  const [stats, setStats] = useState(dashboardStats)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    )
  }

  const statCards = [
    {
      title: "Total Vehicles",
      value: stats.totalVehicles,
      description: `${stats.activeVehicles} active`,
      icon: Car,
      trend: "+2.5%",
      trendUp: true,
    },
    {
      title: "Total Drivers",
      value: stats.totalDrivers,
      description: `${stats.activeDrivers} active`,
      icon: Users,
      trend: "+1.2%",
      trendUp: true,
    },
    {
      title: "Pending Maintenance",
      value: stats.pendingMaintenance,
      description: "Items scheduled",
      icon: Wrench,
      trend: "-5.1%",
      trendUp: false,
    },
    {
      title: "Monthly Fuel Cost",
      value: `$${stats.monthlyFuelCost.toFixed(2)}`,
      description: "This month",
      icon: Fuel,
      trend: "+3.8%",
      trendUp: false,
    },
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's what's happening with your fleet.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
                <div className="flex items-center mt-2">
                  {stat.trendUp ? (
                    <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
                  )}
                  <span className={`text-xs ${stat.trendUp ? "text-green-500" : "text-red-500"}`}>{stat.trend}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Vehicles */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Vehicles</CardTitle>
              <CardDescription>Latest vehicle additions and updates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockVehicles.slice(0, 3).map((vehicle) => (
                  <div key={vehicle.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Car className="h-8 w-8 text-blue-500" />
                      <div>
                        <p className="font-medium">{vehicle.license_plate}</p>
                        <p className="text-sm text-gray-500">
                          {vehicle.make} {vehicle.model} ({vehicle.year})
                        </p>
                      </div>
                    </div>
                    <Badge variant={vehicle.status === "active" ? "default" : "secondary"}>{vehicle.status}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Maintenance */}
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Maintenance</CardTitle>
              <CardDescription>Scheduled maintenance items</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockMaintenanceRecords
                  .filter((record) => record.status === "scheduled")
                  .slice(0, 3)
                  .map((record) => (
                    <div key={record.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Wrench className="h-8 w-8 text-orange-500" />
                        <div>
                          <p className="font-medium">{record.service_type}</p>
                          <p className="text-sm text-gray-500">Vehicle ID: {record.vehicle_id}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{record.scheduled_date.toLocaleDateString()}</p>
                        <p className="text-sm text-gray-500">${record.cost.toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Fleet Health Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Fleet Health Overview</CardTitle>
            <CardDescription>Current status of your fleet</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Active Vehicles</span>
                  <span className="text-sm text-gray-500">
                    {stats.activeVehicles}/{stats.totalVehicles}
                  </span>
                </div>
                <Progress value={(stats.activeVehicles / stats.totalVehicles) * 100} />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Driver Utilization</span>
                  <span className="text-sm text-gray-500">
                    {stats.activeDrivers}/{stats.totalDrivers}
                  </span>
                </div>
                <Progress value={(stats.activeDrivers / stats.totalDrivers) * 100} />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Maintenance Compliance</span>
                  <span className="text-sm text-gray-500">85%</span>
                </div>
                <Progress value={85} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
