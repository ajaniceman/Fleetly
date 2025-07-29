"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { AlertTriangle, Plus, Search, MoreHorizontal, Edit, Trash2, Eye, DollarSign, Clock } from "lucide-react"
import { mockIncidents, mockVehicles, mockDrivers } from "@/lib/data"

export default function IncidentsPage() {
  const [incidents, setIncidents] = useState(mockIncidents)
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const filteredIncidents = incidents.filter(
    (incident) =>
      incident.incident_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      incident.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      incident.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      incident.location.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case "resolved":
        return "default"
      case "investigating":
        return "secondary"
      case "pending":
        return "destructive"
      default:
        return "secondary"
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "destructive"
      case "major":
        return "destructive"
      case "medium":
        return "secondary"
      case "minor":
        return "default"
      default:
        return "secondary"
    }
  }

  const getVehicleInfo = (vehicleId: number) => {
    const vehicle = mockVehicles.find((v) => v.id === vehicleId)
    return vehicle ? `${vehicle.license_plate} (${vehicle.make} ${vehicle.model})` : `Vehicle ${vehicleId}`
  }

  const getDriverInfo = (driverId: number) => {
    const driver = mockDrivers.find((d) => d.id === driverId)
    return driver ? driver.name : `Driver ${driverId}`
  }

  const totalCost = incidents.reduce((sum, incident) => sum + incident.cost, 0)
  const resolvedIncidents = incidents.filter((i) => i.status === "resolved").length
  const pendingIncidents = incidents.filter((i) => i.status === "investigating" || i.status === "pending").length
  const criticalIncidents = incidents.filter((i) => i.severity === "critical").length

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Incidents</h1>
            <p className="text-muted-foreground">Track and manage fleet incidents and accidents</p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Report Incident
          </Button>
        </div>

        {/* Stats Cards */}
        {incidents.length === 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>No Incidents Reported</CardTitle>
              <CardDescription>Great! There are currently no incidents to display.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                When incidents are reported, they will appear here for tracking and management.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Incidents</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{incidents.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Resolved</CardTitle>
                <AlertTriangle className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{resolvedIncidents}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending</CardTitle>
                <Clock className="h-4 w-4 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{pendingIncidents}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Cost</CardTitle>
                <DollarSign className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${totalCost.toFixed(2)}</div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Search and Filters */}
        {incidents.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Incident Reports</CardTitle>
              <CardDescription>All reported incidents and their current status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search incidents..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Incident ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Vehicle</TableHead>
                    <TableHead>Driver</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Cost</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredIncidents.map((incident) => (
                    <TableRow key={incident.id}>
                      <TableCell className="font-medium">{incident.incident_id}</TableCell>
                      <TableCell>{incident.date.toLocaleDateString()}</TableCell>
                      <TableCell>{getVehicleInfo(incident.vehicle_id)}</TableCell>
                      <TableCell>{getDriverInfo(incident.driver_id)}</TableCell>
                      <TableCell className="capitalize">{incident.type}</TableCell>
                      <TableCell>
                        <Badge variant={getSeverityColor(incident.severity)}>{incident.severity}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(incident.status)}>{incident.status}</Badge>
                      </TableCell>
                      <TableCell>${incident.cost.toFixed(2)}</TableCell>
                      <TableCell className="max-w-xs truncate">{incident.location}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Incident
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete Incident
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}
