"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Fuel, Plus, Search, MoreHorizontal, Edit, Trash2, Eye, DollarSign, TrendingUp } from "lucide-react"
import { mockFuelRecords, mockVehicles, mockDrivers } from "@/lib/data"

export default function FuelPage() {
  const [fuelRecords, setFuelRecords] = useState(mockFuelRecords)
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const filteredRecords = fuelRecords.filter(
    (record) =>
      record.fuel_station.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.receipt_number.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getVehicleInfo = (vehicleId: number) => {
    const vehicle = mockVehicles.find((v) => v.id === vehicleId)
    return vehicle ? `${vehicle.license_plate} (${vehicle.make} ${vehicle.model})` : `Vehicle ${vehicleId}`
  }

  const getDriverInfo = (driverId: number) => {
    const driver = mockDrivers.find((d) => d.id === driverId)
    return driver ? driver.name : `Driver ${driverId}`
  }

  const totalCost = fuelRecords.reduce((sum, record) => sum + record.total_cost, 0)
  const totalFuel = fuelRecords.reduce((sum, record) => sum + record.fuel_amount, 0)
  const averageCostPerUnit = totalFuel > 0 ? totalCost / totalFuel : 0
  const totalRecords = fuelRecords.length

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
            <h1 className="text-3xl font-bold text-gray-900">Fuel Management</h1>
            <p className="text-gray-600">Track fuel consumption and costs across your fleet</p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Fuel Record
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Records</CardTitle>
              <Fuel className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalRecords}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Fuel</CardTitle>
              <Fuel className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalFuel.toFixed(1)} gal</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Cost</CardTitle>
              <DollarSign className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalCost.toFixed(2)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Cost/Gallon</CardTitle>
              <TrendingUp className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${averageCostPerUnit.toFixed(2)}</div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Fuel Records</CardTitle>
            <CardDescription>Track all fuel purchases and consumption for your fleet</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search fuel records..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Vehicle</TableHead>
                  <TableHead>Driver</TableHead>
                  <TableHead>Fuel Amount</TableHead>
                  <TableHead>Cost/Unit</TableHead>
                  <TableHead>Total Cost</TableHead>
                  <TableHead>Station</TableHead>
                  <TableHead>Odometer</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecords.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className="font-medium">{record.date.toLocaleDateString()}</TableCell>
                    <TableCell>{getVehicleInfo(record.vehicle_id)}</TableCell>
                    <TableCell>{getDriverInfo(record.driver_id)}</TableCell>
                    <TableCell>{record.fuel_amount.toFixed(1)} gal</TableCell>
                    <TableCell>${record.cost_per_unit.toFixed(2)}</TableCell>
                    <TableCell>${record.total_cost.toFixed(2)}</TableCell>
                    <TableCell>{record.fuel_station}</TableCell>
                    <TableCell>{record.odometer_reading.toLocaleString()} mi</TableCell>
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
                            Edit Record
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Record
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
      </div>
    </DashboardLayout>
  )
}
