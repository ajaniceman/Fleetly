"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { mockIncidents, type Incident } from "@/lib/data"
import { Plus, Search, Filter, AlertTriangle, Car, DollarSign, FileText } from "lucide-react"

export default function IncidentsPage() {
  const [incidents] = useState<Incident[]>(mockIncidents)
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const filteredIncidents = incidents.filter((incident) => {
    const matchesSearch =
      incident.incidentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      incident.vehicleLicensePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
      incident.driverName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      incident.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      incident.location.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesType = typeFilter === "all" || incident.type === typeFilter
    const matchesStatus = statusFilter === "all" || incident.status === statusFilter

    return matchesSearch && matchesType && matchesStatus
  })

  const getTypeBadge = (type: Incident["type"]) => {
    switch (type) {
      case "accident":
        return <Badge className="bg-red-100 text-red-800">Accident</Badge>
      case "breakdown":
        return <Badge className="bg-yellow-100 text-yellow-800">Breakdown</Badge>
      case "violation":
        return <Badge className="bg-orange-100 text-orange-800">Violation</Badge>
      case "other":
        return <Badge className="bg-gray-100 text-gray-800">Other</Badge>
      default:
        return <Badge variant="secondary">{type}</Badge>
    }
  }

  const getSeverityBadge = (severity: Incident["severity"]) => {
    switch (severity) {
      case "critical":
        return <Badge variant="destructive">Critical</Badge>
      case "high":
        return <Badge className="bg-red-100 text-red-800">High</Badge>
      case "medium":
        return <Badge className="bg-yellow-100 text-yellow-800">Medium</Badge>
      case "low":
        return <Badge className="bg-green-100 text-green-800">Low</Badge>
      default:
        return <Badge variant="secondary">{severity}</Badge>
    }
  }

  const getStatusBadge = (status: Incident["status"]) => {
    switch (status) {
      case "reported":
        return <Badge className="bg-blue-100 text-blue-800">Reported</Badge>
      case "investigating":
        return <Badge className="bg-yellow-100 text-yellow-800">Investigating</Badge>
      case "resolved":
        return <Badge className="bg-green-100 text-green-800">Resolved</Badge>
      case "closed":
        return <Badge className="bg-gray-100 text-gray-800">Closed</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const totalIncidents = incidents.length
  const openIncidents = incidents.filter((i) => i.status !== "closed" && i.status !== "resolved").length
  const totalCost = incidents.reduce((sum, i) => sum + (i.actualCost || i.estimatedCost || 0), 0)
  const criticalIncidents = incidents.filter((i) => i.severity === "critical" || i.severity === "high").length

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Incidents</h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Track and manage fleet incidents and safety reports
            </p>
          </div>
          <Button className="rounded-lg">
            <Plus className="h-4 w-4 mr-2" />
            Report Incident
          </Button>
        </div>

        {/* Incident statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="rounded-xl">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <FileText className="h-8 w-8 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Incidents</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalIncidents}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-xl">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <AlertTriangle className="h-8 w-8 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Open Cases</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{openIncidents}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-xl">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Car className="h-8 w-8 text-red-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Critical/High</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{criticalIncidents}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-xl">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <DollarSign className="h-8 w-8 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Cost</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">${totalCost.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and search */}
        <Card className="rounded-xl">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by incident ID, vehicle, driver, or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 rounded-lg"
                />
              </div>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full sm:w-48 rounded-lg">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="accident">Accident</SelectItem>
                  <SelectItem value="breakdown">Breakdown</SelectItem>
                  <SelectItem value="violation">Violation</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-48 rounded-lg">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="reported">Reported</SelectItem>
                  <SelectItem value="investigating">Investigating</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Incidents table */}
        <Card className="rounded-xl">
          <CardHeader>
            <CardTitle>Incident Reports ({filteredIncidents.length})</CardTitle>
            <CardDescription>All reported incidents and their current status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
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
                    <TableHead>Description</TableHead>
                    <TableHead>Cost</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredIncidents.map((incident) => (
                    <TableRow key={incident.id}>
                      <TableCell className="font-mono font-medium">{incident.incidentId}</TableCell>
                      <TableCell>{new Date(incident.date).toLocaleDateString()}</TableCell>
                      <TableCell className="font-medium">{incident.vehicleLicensePlate}</TableCell>
                      <TableCell>{incident.driverName}</TableCell>
                      <TableCell>{getTypeBadge(incident.type)}</TableCell>
                      <TableCell>{getSeverityBadge(incident.severity)}</TableCell>
                      <TableCell>{getStatusBadge(incident.status)}</TableCell>
                      <TableCell className="max-w-xs truncate">{incident.description}</TableCell>
                      <TableCell>
                        {incident.actualCost || incident.estimatedCost ? (
                          <div className="text-sm">
                            <div className="font-medium">
                              ${(incident.actualCost || incident.estimatedCost)?.toLocaleString()}
                            </div>
                            <div className="text-gray-500">{incident.actualCost ? "Actual" : "Estimated"}</div>
                          </div>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button variant="ghost" size="sm" className="h-8 px-2 text-xs">
                            View
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 px-2 text-xs">
                            Edit
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
