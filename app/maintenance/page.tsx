"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { mockMaintenanceTasks, type MaintenanceTask } from "@/lib/data"
import { Plus, Search, Filter, Calendar, Wrench, DollarSign, Clock } from "lucide-react"

export default function MaintenancePage() {
  const [tasks] = useState<MaintenanceTask[]>(mockMaintenanceTasks)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.vehicleLicensePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.serviceType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (task.assignedMechanic && task.assignedMechanic.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesStatus = statusFilter === "all" || task.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: MaintenanceTask["status"]) => {
    switch (status) {
      case "scheduled":
        return <Badge className="bg-blue-100 text-blue-800">Scheduled</Badge>
      case "in-progress":
        return <Badge className="bg-yellow-100 text-yellow-800">In Progress</Badge>
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>
      case "overdue":
        return <Badge className="bg-red-100 text-red-800">Overdue</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const isOverdue = (dueDate: string, status: string) => {
    if (status === "completed") return false
    const due = new Date(dueDate)
    const today = new Date()
    return due < today
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Maintenance</h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Schedule and track vehicle maintenance tasks
            </p>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" className="rounded-lg bg-transparent">
              <Calendar className="h-4 w-4 mr-2" />
              Calendar View
            </Button>
            <Button className="rounded-lg">
              <Plus className="h-4 w-4 mr-2" />
              Schedule Maintenance
            </Button>
          </div>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="rounded-xl">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Clock className="h-8 w-8 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Scheduled</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {tasks.filter((t) => t.status === "scheduled").length}
                  </p>
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
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">In Progress</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {tasks.filter((t) => t.status === "in-progress").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-xl">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <DollarSign className="h-8 w-8 text-red-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Overdue</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {tasks.filter((t) => isOverdue(t.dueDate, t.status)).length}
                  </p>
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
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    ${tasks.reduce((sum, t) => sum + (t.actualCost || t.estimatedCost), 0).toLocaleString()}
                  </p>
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
                  placeholder="Search by vehicle, service type, or mechanic..."
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
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Maintenance tasks table */}
        <Card className="rounded-xl">
          <CardHeader>
            <CardTitle>Maintenance Tasks ({filteredTasks.length})</CardTitle>
            <CardDescription>All scheduled and completed maintenance activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Vehicle</TableHead>
                    <TableHead>Service Type</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Scheduled Date</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Mechanic</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Cost</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTasks.map((task) => (
                    <TableRow
                      key={task.id}
                      className={isOverdue(task.dueDate, task.status) ? "bg-red-50 dark:bg-red-900/10" : ""}
                    >
                      <TableCell className="font-medium">{task.vehicleLicensePlate}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Wrench className="h-4 w-4 mr-2 text-gray-400" />
                          {task.serviceType}
                        </div>
                      </TableCell>
                      <TableCell className="max-w-xs truncate">{task.description}</TableCell>
                      <TableCell>{new Date(task.scheduledDate).toLocaleDateString()}</TableCell>
                      <TableCell className={isOverdue(task.dueDate, task.status) ? "text-red-600 font-medium" : ""}>
                        {new Date(task.dueDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{task.assignedMechanic || "Unassigned"}</TableCell>
                      <TableCell>
                        {isOverdue(task.dueDate, task.status) ? getStatusBadge("overdue") : getStatusBadge(task.status)}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="font-medium">
                            ${task.actualCost ? task.actualCost.toLocaleString() : task.estimatedCost.toLocaleString()}
                          </div>
                          <div className="text-gray-500">{task.actualCost ? "Actual" : "Estimated"}</div>
                        </div>
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
