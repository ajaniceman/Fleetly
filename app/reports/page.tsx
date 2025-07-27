"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { FileText, Download, Calendar, TrendingUp, DollarSign, Car } from "lucide-react"

// Sample data for reports
const fleetUtilizationData = [
  { month: "Jan", utilization: 85, maintenance: 10, idle: 5 },
  { month: "Feb", utilization: 88, maintenance: 8, idle: 4 },
  { month: "Mar", utilization: 82, maintenance: 12, idle: 6 },
  { month: "Apr", utilization: 90, maintenance: 7, idle: 3 },
  { month: "May", utilization: 87, maintenance: 9, idle: 4 },
  { month: "Jun", utilization: 89, maintenance: 8, idle: 3 },
]

const maintenanceCostTrends = [
  { month: "Jan", preventive: 15000, corrective: 8000, emergency: 3000 },
  { month: "Feb", preventive: 18000, corrective: 6000, emergency: 2000 },
  { month: "Mar", preventive: 16000, corrective: 9000, emergency: 4000 },
  { month: "Apr", preventive: 20000, corrective: 5000, emergency: 1500 },
  { month: "May", preventive: 17000, corrective: 7000, emergency: 2500 },
  { month: "Jun", preventive: 19000, corrective: 6500, emergency: 2000 },
]

const driverPerformanceData = [
  { name: "Excellent", value: 45, color: "#10b981" },
  { name: "Good", value: 35, color: "#3b82f6" },
  { name: "Average", value: 15, color: "#f59e0b" },
  { name: "Needs Improvement", value: 5, color: "#ef4444" },
]

const fuelEfficiencyTrends = [
  { month: "Jan", efficiency: 8.2, cost: 12500 },
  { month: "Feb", efficiency: 7.9, cost: 11800 },
  { month: "Mar", efficiency: 8.1, cost: 12200 },
  { month: "Apr", efficiency: 7.8, cost: 11600 },
  { month: "May", efficiency: 8.0, cost: 12000 },
  { month: "Jun", efficiency: 7.7, cost: 11400 },
]

const reportTemplates = [
  {
    id: 1,
    name: "Fleet Utilization Report",
    description: "Vehicle uptime, idle time, and mileage analysis",
    icon: Car,
    color: "text-blue-600",
    bgColor: "bg-blue-100",
  },
  {
    id: 2,
    name: "Maintenance Cost Report",
    description: "Breakdown of maintenance costs by vehicle and type",
    icon: DollarSign,
    color: "text-green-600",
    bgColor: "bg-green-100",
  },
  {
    id: 3,
    name: "Driver Performance Report",
    description: "Incidents, mileage, and fuel efficiency per driver",
    icon: TrendingUp,
    color: "text-purple-600",
    bgColor: "bg-purple-100",
  },
  {
    id: 4,
    name: "Fuel Cost Analysis",
    description: "Fuel consumption trends and cost optimization",
    icon: FileText,
    color: "text-orange-600",
    bgColor: "bg-orange-100",
  },
  {
    id: 5,
    name: "Compliance Report",
    description: "License expiry, inspection due dates, and certifications",
    icon: Calendar,
    color: "text-red-600",
    bgColor: "bg-red-100",
  },
  {
    id: 6,
    name: "Custom Report Builder",
    description: "Create custom reports with drag-and-drop interface",
    icon: FileText,
    color: "text-gray-600",
    bgColor: "bg-gray-100",
  },
]

export default function ReportsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Reports & Analytics</h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Generate insights and analyze your fleet performance
            </p>
          </div>
          <Button className="rounded-lg">
            <FileText className="h-4 w-4 mr-2" />
            Custom Report Builder
          </Button>
        </div>

        {/* Key metrics overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="rounded-xl">
            <CardHeader>
              <CardTitle>Fleet Utilization Trends</CardTitle>
              <CardDescription>Monthly vehicle utilization rates</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={fleetUtilizationData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="utilization" stackId="a" fill="#10b981" name="Active" />
                  <Bar dataKey="maintenance" stackId="a" fill="#f59e0b" name="Maintenance" />
                  <Bar dataKey="idle" stackId="a" fill="#ef4444" name="Idle" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="rounded-xl">
            <CardHeader>
              <CardTitle>Maintenance Cost Analysis</CardTitle>
              <CardDescription>Breakdown of maintenance expenses</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={maintenanceCostTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="preventive" stroke="#3b82f6" strokeWidth={2} name="Preventive" />
                  <Line type="monotone" dataKey="corrective" stroke="#f59e0b" strokeWidth={2} name="Corrective" />
                  <Line type="monotone" dataKey="emergency" stroke="#ef4444" strokeWidth={2} name="Emergency" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="rounded-xl">
            <CardHeader>
              <CardTitle>Driver Performance Distribution</CardTitle>
              <CardDescription>Overall driver performance ratings</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={driverPerformanceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {driverPerformanceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 grid grid-cols-2 gap-2">
                {driverPerformanceData.map((item, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }} />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {item.name}: {item.value}%
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-xl">
            <CardHeader>
              <CardTitle>Fuel Efficiency & Cost Trends</CardTitle>
              <CardDescription>Monthly fuel consumption and costs</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={fuelEfficiencyTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="efficiency"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                    name="Efficiency (L/100km)"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="cost"
                    stroke="#10b981"
                    strokeWidth={2}
                    name="Cost ($)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Report templates */}
        <Card className="rounded-xl">
          <CardHeader>
            <CardTitle>Report Templates</CardTitle>
            <CardDescription>Pre-built reports and analytics dashboards</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reportTemplates.map((template) => (
                <Card
                  key={template.id}
                  className="rounded-lg border-2 border-gray-200 hover:border-blue-300 transition-colors cursor-pointer"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className={`flex-shrink-0 p-3 rounded-lg ${template.bgColor}`}>
                        <template.icon className={`h-6 w-6 ${template.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">{template.name}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{template.description}</p>
                        <div className="flex space-x-2">
                          <Button size="sm" className="rounded-lg">
                            Generate
                          </Button>
                          <Button variant="outline" size="sm" className="rounded-lg bg-transparent">
                            <Download className="h-4 w-4 mr-1" />
                            Export
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent reports */}
        <Card className="rounded-xl">
          <CardHeader>
            <CardTitle>Recent Reports</CardTitle>
            <CardDescription>Recently generated reports and exports</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: "Fleet Utilization Report - June 2024", date: "2024-06-30", type: "PDF", size: "2.4 MB" },
                { name: "Maintenance Cost Analysis - Q2 2024", date: "2024-06-28", type: "Excel", size: "1.8 MB" },
                { name: "Driver Performance Summary", date: "2024-06-25", type: "PDF", size: "1.2 MB" },
                { name: "Fuel Efficiency Report - May 2024", date: "2024-05-31", type: "CSV", size: "0.8 MB" },
              ].map((report, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <FileText className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{report.name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Generated on {new Date(report.date).toLocaleDateString()} • {report.type} • {report.size}
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
