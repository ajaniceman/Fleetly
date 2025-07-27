"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { mockVehicles, mockDrivers, type Vehicle } from "@/lib/data"
import { Plus, Search, Filter, Eye, Edit, Trash2 } from "lucide-react"

export default function VehiclesPage() {
  const [vehicles] = useState<Vehicle[]>(mockVehicles)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const filteredVehicles = vehicles.filter((vehicle) => {
    const matchesSearch =
      vehicle.licensePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.vin.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || vehicle.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const getDriverName = (driverId?: string) => {
    if (!driverId) return "Unassigned"
    const driver = mockDrivers.find((d) => d.id === driverId)
    return driver?.name || "Unknown"
  }

  const getStatusBadge = (status: Vehicle["status"]) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>
      case "maintenance":
        return <Badge className="bg-yellow-100 text-yellow-800">Maintenance</Badge>
      case "out-of-service":
        return <Badge className="bg-red-100 text-red-800">Out of Service</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Vehicles</h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Manage your fleet vehicles and their information
            </p>
          </div>
          <Button className="rounded-lg">
            <Plus className="h-4 w-4 mr-2" />
            Add Vehicle
          </Button>
        </div>

        {/* Filters and search */}
        <Card className="rounded-xl">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by license plate, make, model, or VIN..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 rounded-lg"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-48 rounded-lg">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="out-of-service">Out of Service</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Vehicles table */}
        <Card className="rounded-xl">
          <CardHeader>
            <CardTitle>Fleet Vehicles ({filteredVehicles.length})</CardTitle>
            <CardDescription>Complete list of all vehicles in your fleet</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>License Plate</TableHead>
                    <TableHead>Vehicle</TableHead>
                    <TableHead>Year</TableHead>
                    <TableHead>VIN</TableHead>
                    <TableHead>Current Driver</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Next Service</TableHead>
                    <TableHead>Mileage</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredVehicles.map((vehicle) => (
                    <TableRow key={vehicle.id}>
                      <TableCell className="font-medium">{vehicle.licensePlate}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {vehicle.make} {vehicle.model}
                          </div>
                          <div className="text-sm text-gray-500">{vehicle.fuelType}</div>
                        </div>
                      </TableCell>
                      <TableCell>{vehicle.year}</TableCell>
                      <TableCell className="font-mono text-sm">{vehicle.vin}</TableCell>
                      <TableCell>{getDriverName(vehicle.currentDriver)}</TableCell>
                      <TableCell>{getStatusBadge(vehicle.status)}</TableCell>
                      <TableCell>{new Date(vehicle.nextServiceDue).toLocaleDateString()}</TableCell>
                      <TableCell>{vehicle.mileage.toLocaleString()} km</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-600 hover:text-red-700">
                            <Trash2 className="h-4 w-4" />
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

        {/* Vehicle statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="rounded-xl">
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {vehicles.filter((v) => v.status === "active").length}
                </div>
                <div className="text-sm text-gray-500">Active Vehicles</div>
              </div>
            </CardContent>
          </Card>
          <Card className="rounded-xl">
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {vehicles.filter((v) => v.status === "maintenance").length}
                </div>
                <div className="text-sm text-gray-500">In Maintenance</div>
              </div>
            </CardContent>
          </Card>
          <Card className="rounded-xl">
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {vehicles.filter((v) => v.status === "out-of-service").length}
                </div>
                <div className="text-sm text-gray-500">Out of Service</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
