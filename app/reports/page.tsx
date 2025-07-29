"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart3, Download, FileText, TrendingUp, DollarSign } from "lucide-react"
import { mockVehicles, mockDrivers, mockMaintenanceRecords, mockFuelRecords, mockIncidents } from "@/lib/data"

export default function ReportsPage() {
  const [selectedReport, setSelectedReport] = useState("overview")
  const [dateRange, setDateRange] = useState("30")

  const reportTypes = [
    { value: "overview", label: "Fleet Overview", icon: BarChart3 },
    { value: "maintenance", label: "Maintenance Report", icon: FileText },
    { value: "fuel", label: "Fuel Consumption", icon: TrendingUp },
    { value: "incidents", label: "Incident Report", icon: FileText },
    { value: "driver", label: "Driver Performance", icon: FileText },
  ]

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
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalVehicles}</div>
            <p className="text-xs text-muted-foreground">{stats.activeVehicles} active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Drivers</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalDrivers}</div>
            <p className="text-xs text-muted-foreground">{stats.activeDrivers} active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Operating Cost</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalOperatingCost.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Last {dateRange} days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fuel Efficiency</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
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
                  <Badge variant="default">Active</Badge>
                </div>
                <div className="font-medium">{mockVehicles.filter((v) => v.status === "active").length} vehicles</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Badge variant="destructive">Maintenance</Badge>
                </div>
                <div className="font-medium">
                  {mockVehicles.filter((v) => v.status === "maintenance").length} vehicles
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary">Inactive</Badge>
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
                <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
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
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
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
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
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
            <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
            <p className="text-gray-600">Generate and view fleet analytics and reports</p>
          </div>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>

        {/* Report Controls */}
        <Card>
          <CardHeader>
            <CardTitle>Report Configuration</CardTitle>
            <CardDescription>Select report type and date range</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label className="text-sm font-medium mb-2 block">Report Type</label>
                <Select value={selectedReport} onValueChange={setSelectedReport}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select report type" />
                  </SelectTrigger>
                  <SelectContent>
                    {reportTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        <div className="flex items-center space-x-2">
                          <type.icon className="h-4 w-4" />
                          <span>{type.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1">
                <label className="text-sm font-medium mb-2 block">Date Range</label>
                <Select value={dateRange} onValueChange={setDateRange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select date range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7">Last 7 days</SelectItem>
                    <SelectItem value="30">Last 30 days</SelectItem>
                    <SelectItem value="90">Last 90 days</SelectItem>
                    <SelectItem value="365">Last year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Report Content */}
        {renderCurrentReport()}
      </div>
    </DashboardLayout>
  )
}
