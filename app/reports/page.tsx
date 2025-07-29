"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import { mockVehicles, mockDrivers, mockMaintenanceRecords, mockFuelRecords, mockIncidents } from "@/lib/data"

const reportTypes = [
  {
    title: "Vehicle Utilization Report",
    description: "Track vehicle usage and efficiency metrics",
    lastGenerated: "2024-01-25",
  },
  {
    title: "Maintenance Cost Analysis",
    description: "Analyze maintenance costs and trends",
    lastGenerated: "2024-01-20",
  },
  {
    title: "Fuel Consumption Report",
    description: "Monitor fuel usage and costs across the fleet",
    lastGenerated: "2024-01-22",
  },
  {
    title: "Driver Performance Report",
    description: "Evaluate driver performance and safety metrics",
    lastGenerated: "2024-01-18",
  },
]

export default function ReportsPage() {
  const [selectedReport, setSelectedReport] = useState("overview")
  const [dateRange, setDateRange] = useState("30")

  const generateOverviewStats = () => {
    const totalVehicles = mockVehicles.length
    const activeVehicles = mockVehicles.filter((v) => v.status === "active").length
    const totalDrivers = mockDrivers.length
    const activeDrivers = mockDrivers.filter((d) => d.status === "active").length
    const totalMaintenanceCost = mockMaintenanceRecords.reduce((sum, r) => sum + r.cost, 0)
    const totalFuelCost = mockFuelRecords.reduce((sum, r) => sum + r.total_cost, 0)
    const totalIncidentCost = mockIncidents.reduce((sum, i) => sum + i.cost, 0)
    const totalOperatingCost = totalMaintenanceCost + totalFuelCost + totalIncidentCost

    return {
      totalVehicles,
      activeVehicles,
      totalDrivers,
      activeDrivers,
      totalMaintenanceCost,
      totalFuelCost,
      totalIncidentCost,
      totalOperatingCost,
    }
  }

  const stats = generateOverviewStats()

  const renderOverviewReport = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Vehicles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalVehicles}</div>
            <p className="text-xs text-muted-foreground">{stats.activeVehicles} active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Drivers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalDrivers}</div>
            <p className="text-xs text-muted-foreground">{stats.activeDrivers} active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Operating Cost</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalOperatingCost.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Last {dateRange} days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fuel Efficiency</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">28.5 MPG</div>
            <p className="text-xs text-muted-foreground">Fleet average</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Cost Breakdown</CardTitle>
            <CardDescription>Operating costs by category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm">Fuel</span>
                </div>
                <div className="text-right">
                  <div className="font-medium">${stats.totalFuelCost.toFixed(2)}</div>
                  <div className="text-xs text-gray-500">
                    {((stats.totalFuelCost / stats.totalOperatingCost) * 100).toFixed(1)}%
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Maintenance</span>
                </div>
                <div className="text-right">
                  <div className="font-medium">${stats.totalMaintenanceCost.toFixed(2)}</div>
                  <div className="text-xs text-gray-500">
                    {((stats.totalMaintenanceCost / stats.totalOperatingCost) * 100).toFixed(1)}%
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-sm">Incidents</span>
                </div>
                <div className="text-right">
                  <div className="font-medium">${stats.totalIncidentCost.toFixed(2)}</div>
                  <div className="text-xs text-gray-500">
                    {((stats.totalIncidentCost / stats.totalOperatingCost) * 100).toFixed(1)}%
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Fleet Status</CardTitle>
            <CardDescription>Current vehicle status distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">
                    Active
                  </span>
                </div>
                <div className="font-medium">{mockVehicles.filter((v) => v.status === "active").length} vehicles</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="bg-red-100 text-red-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300">
                    Maintenance
                  </span>
                </div>
                <div className="font-medium">
                  {mockVehicles.filter((v) => v.status === "maintenance").length} vehicles
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="bg-gray-100 text-gray-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-gray-900 dark:text-gray-300">
                    Inactive
                  </span>
                </div>
                <div className="font-medium">{mockVehicles.filter((v) => v.status === "inactive").length} vehicles</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  const renderMaintenanceReport = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Maintenance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockMaintenanceRecords.length}</div>
            <p className="text-xs text-muted-foreground">Records</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockMaintenanceRecords.filter((r) => r.status === "completed").length}
            </div>
            <p className="text-xs text-muted-foreground">Services</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Cost</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalMaintenanceCost.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Maintenance spend</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Maintenance by Service Type</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Array.from(new Set(mockMaintenanceRecords.map((r) => r.service_type))).map((serviceType) => {
              const records = mockMaintenanceRecords.filter((r) => r.service_type === serviceType)
              const cost = records.reduce((sum, r) => sum + r.cost, 0)
              return (
                <div key={serviceType} className="flex items-center justify-between">
                  <span className="font-medium">{serviceType}</span>
                  <div className="text-right">
                    <div className="font-medium">${cost.toFixed(2)}</div>
                    <div className="text-xs text-gray-500">{records.length} records</div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderCurrentReport = () => {
    switch (selectedReport) {
      case "overview":
        return renderOverviewReport()
      case "maintenance":
        return renderMaintenanceReport()
      case "fuel":
        return (
          <Card>
            <CardContent className="p-6">
              <div className="text-center text-gray-500">
                <span className="h-12 w-12 mx-auto mb-4 opacity-50">Fuel Icon</span>
                <p>Fuel consumption report coming soon...</p>
              </div>
            </CardContent>
          </Card>
        )
      case "incidents":
        return (
          <Card>
            <CardContent className="p-6">
              <div className="text-center text-gray-500">
                <span className="h-12 w-12 mx-auto mb-4 opacity-50">Incident Icon</span>
                <p>Incident report coming soon...</p>
              </div>
            </CardContent>
          </Card>
        )
      case "driver":
        return (
          <Card>
            <CardContent className="p-6">
              <div className="text-center text-gray-500">
                <span className="h-12 w-12 mx-auto mb-4 opacity-50">Driver Icon</span>
                <p>Driver performance report coming soon...</p>
              </div>
            </CardContent>
          </Card>
        )
      default:
        return renderOverviewReport()
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
            <p className="text-muted-foreground">Generate and download fleet management reports</p>
          </div>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>

        {/* Report Controls */}
        <div className="grid gap-4 md:grid-cols-2">
          {reportTypes.map((report, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="text-lg">{report.title}</CardTitle>
                <CardDescription>{report.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div className="text-sm text-muted-foreground">Last generated: {report.lastGenerated}</div>
                  <Button size="sm" onClick={() => setSelectedReport(report.title.toLowerCase().replace(" ", "-"))}>
                    <Download className="mr-2 h-4 w-4" />
                    Generate
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Report Content */}
        {renderCurrentReport()}
      </div>
    </DashboardLayout>
  )
}
