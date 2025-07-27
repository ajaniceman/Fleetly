"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { mockDrivers, mockVehicles, type Driver } from "@/lib/data"
import { Plus, Search, Filter, Eye, Edit, Trash2, Phone, Mail } from "lucide-react"

export default function DriversPage() {
  const [drivers] = useState<Driver[]>(mockDrivers)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const filteredDrivers = drivers.filter((driver) => {
    const matchesSearch =
      driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.licenseNumber.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || driver.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const getVehiclePlate = (vehicleId?: string) => {
    if (!vehicleId) return "Unassigned"
    const vehicle = mockVehicles.find((v) => v.id === vehicleId)
    return vehicle?.licensePlate || "Unknown"
  }

  const getStatusBadge = (status: Driver["status"]) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>
      case "on-leave":
        return <Badge className="bg-yellow-100 text-yellow-800">On Leave</Badge>
      case "suspended":
        return <Badge className="bg-red-100 text-red-800">Suspended</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const isLicenseExpiringSoon = (expiryDate: string) => {
    const expiry = new Date(expiryDate)
    const today = new Date()
    const diffTime = expiry.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays <= 90 && diffDays > 0
  }

  const isLicenseExpired = (expiryDate: string) => {
    const expiry = new Date(expiryDate)
    const today = new Date()
    return expiry < today
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Drivers</h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Manage your fleet drivers and their information
            </p>
          </div>
          <Button className="rounded-lg">
            <Plus className="h-4 w-4 mr-2" />
            Add Driver
          </Button>
        </div>

        {/* Filters and search */}
        <Card className="rounded-xl">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by name, employee ID, email, or license..."
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
                  <SelectItem value="on-leave">On Leave</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Drivers table */}
        <Card className="rounded-xl">
          <CardHeader>
            <CardTitle>Fleet Drivers ({filteredDrivers.length})</CardTitle>
            <CardDescription>Complete list of all drivers in your fleet</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Driver</TableHead>
                    <TableHead>Employee ID</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>License</TableHead>
                    <TableHead>License Expiry</TableHead>
                    <TableHead>Assigned Vehicle</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDrivers.map((driver) => (
                    <TableRow key={driver.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center">
                            <span className="text-sm font-medium text-white">
                              {driver.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <div className="font-medium">{driver.name}</div>
                            <div className="text-sm text-gray-500">
                              Hired: {new Date(driver.hireDate).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono">{driver.employeeId}</TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center text-sm">
                            <Mail className="h-3 w-3 mr-1 text-gray-400" />
                            {driver.email}
                          </div>
                          <div className="flex items-center text-sm">
                            <Phone className="h-3 w-3 mr-1 text-gray-400" />
                            {driver.phone}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-sm">{driver.licenseNumber}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <span
                            className={`text-sm ${
                              isLicenseExpired(driver.licenseExpiry)
                                ? "text-red-600 font-medium"
                                : isLicenseExpiringSoon(driver.licenseExpiry)
                                  ? "text-yellow-600 font-medium"
                                  : "text-gray-900 dark:text-white"
                            }`}
                          >
                            {new Date(driver.licenseExpiry).toLocaleDateString()}
                          </span>
                          {isLicenseExpired(driver.licenseExpiry) && (
                            <Badge variant="destructive" className="text-xs">
                              Expired
                            </Badge>
                          )}
                          {isLicenseExpiringSoon(driver.licenseExpiry) && !isLicenseExpired(driver.licenseExpiry) && (
                            <Badge className="bg-yellow-100 text-yellow-800 text-xs">Expiring Soon</Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{getVehiclePlate(driver.assignedVehicle)}</TableCell>
                      <TableCell>{getStatusBadge(driver.status)}</TableCell>
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

        {/* Driver statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="rounded-xl">
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {drivers.filter((d) => d.status === "active").length}
                </div>
                <div className="text-sm text-gray-500">Active Drivers</div>
              </div>
            </CardContent>
          </Card>
          <Card className="rounded-xl">
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {drivers.filter((d) => d.status === "on-leave").length}
                </div>
                <div className="text-sm text-gray-500">On Leave</div>
              </div>
            </CardContent>
          </Card>
          <Card className="rounded-xl">
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {drivers.filter((d) => d.status === "suspended").length}
                </div>
                <div className="text-sm text-gray-500">Suspended</div>
              </div>
            </CardContent>
          </Card>
          <Card className="rounded-xl">
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {
                    drivers.filter((d) => isLicenseExpiringSoon(d.licenseExpiry) || isLicenseExpired(d.licenseExpiry))
                      .length
                  }
                </div>
                <div className="text-sm text-gray-500">License Issues</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
