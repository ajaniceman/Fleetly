"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { mockFuelEntries, type FuelEntry } from "@/lib/data"
import { Plus, Search, Filter, Fuel, DollarSign, TrendingUp, BarChart3 } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"

// Sample data for fuel analytics
const fuelConsumptionData = [
  { month: "Jan", consumption: 2450, cost: 3552 },
  { month: "Feb", consumption: 2380, cost: 3445 },
  { month: "Mar", consumption: 2520, cost: 3654 },
  { month: "Apr", consumption: 2340, cost: 3392 },
  { month: "May", consumption: 2480, cost: 3596 },
  { month: "Jun", consumption: 2420, cost: 3508 },
]

const fuelEfficiencyData = [
  { vehicle: "ABC-123", efficiency: 8.2 },
  { vehicle: "XYZ-789", efficiency: 12.5 },
  { vehicle: "DEF-456", efficiency: 9.1 },
]

export default function FuelPage() {
  const [fuelEntries] = useState<FuelEntry[]>(mockFuelEntries)
  const [searchTerm, setSearchTerm] = useState("")
  const [vehicleFilter, setVehicleFilter] = useState<string>("all")

  const filteredEntries = fuelEntries.filter((entry) => {
    const matchesSearch =
      entry.vehicleLicensePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.driverName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.location.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesVehicle = vehicleFilter === "all" || entry.vehicleLicensePlate === vehicleFilter

    return matchesSearch && matchesVehicle
  })

  const totalFuelCost = fuelEntries.reduce((sum, entry) => sum + entry.totalCost, 0)
  const totalFuelQuantity = fuelEntries.reduce((sum, entry) => sum + entry.quantity, 0)
  const averageFuelPrice = totalFuelCost / totalFuelQuantity

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Fuel Management</h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Track fuel consumption and analyze costs across your fleet
            </p>
          </div>
          <Button className="rounded-lg">
            <Plus className="h-4 w-4 mr-2" />
            Add Fuel Entry
          </Button>
        </div>

        {/* Fuel statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="rounded-xl">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Fuel className="h-8 w-8 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Fuel</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalFuelQuantity.toFixed(1)}L</p>
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
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">${totalFuelCost.toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-xl">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <TrendingUp className="h-8 w-8 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Avg Price/L</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">${averageFuelPrice.toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-xl">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <BarChart3 className="h-8 w-8 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Entries</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{fuelEntries.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Fuel analytics charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="rounded-xl">
            <CardHeader>
              <CardTitle>Fuel Consumption Trends</CardTitle>
              <CardDescription>Monthly fuel usage and costs</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={fuelConsumptionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="consumption" stroke="#3b82f6" strokeWidth={2} name="Consumption (L)" />
                  <Line type="monotone" dataKey="cost" stroke="#10b981" strokeWidth={2} name="Cost ($)" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="rounded-xl">
            <CardHeader>
              <CardTitle>Fuel Efficiency by Vehicle</CardTitle>
              <CardDescription>L/100km consumption rates</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={fuelEfficiencyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="vehicle" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="efficiency" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
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
                  placeholder="Search by vehicle, driver, or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 rounded-lg"
                />
              </div>
              <Select value={vehicleFilter} onValueChange={setVehicleFilter}>
                <SelectTrigger className="w-full sm:w-48 rounded-lg">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by vehicle" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Vehicles</SelectItem>
                  {Array.from(new Set(fuelEntries.map((e) => e.vehicleLicensePlate))).map((plate) => (
                    <SelectItem key={plate} value={plate}>
                      {plate}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Fuel entries table */}
        <Card className="rounded-xl">
          <CardHeader>
            <CardTitle>Fuel Entries ({filteredEntries.length})</CardTitle>
            <CardDescription>Complete log of all fuel transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Vehicle</TableHead>
                    <TableHead>Driver</TableHead>
                    <TableHead>Odometer</TableHead>
                    <TableHead>Fuel Type</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Unit Cost</TableHead>
                    <TableHead>Total Cost</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEntries.map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell>{new Date(entry.date).toLocaleDateString()}</TableCell>
                      <TableCell className="font-medium">{entry.vehicleLicensePlate}</TableCell>
                      <TableCell>{entry.driverName}</TableCell>
                      <TableCell>{entry.odometerReading.toLocaleString()} km</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Fuel className="h-4 w-4 mr-2 text-gray-400" />
                          {entry.fuelType}
                        </div>
                      </TableCell>
                      <TableCell>{entry.quantity.toFixed(1)}L</TableCell>
                      <TableCell>${entry.unitCost.toFixed(2)}</TableCell>
                      <TableCell className="font-medium">${entry.totalCost.toFixed(2)}</TableCell>
                      <TableCell className="max-w-xs truncate">{entry.location}</TableCell>
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
