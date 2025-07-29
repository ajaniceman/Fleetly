import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BarChart3, Download, Calendar, TrendingUp, Fuel, Wrench } from "lucide-react"

export default function ReportsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
            <p className="text-gray-600">Generate and view fleet analytics</p>
          </div>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5" />
                <span>Fleet Overview</span>
              </CardTitle>
              <CardDescription>Comprehensive fleet performance metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Total Vehicles:</span>
                  <span className="font-medium">24</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Active Drivers:</span>
                  <span className="font-medium">18</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Monthly Miles:</span>
                  <span className="font-medium">45,230</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Fuel className="h-5 w-5" />
                <span>Fuel Analytics</span>
              </CardTitle>
              <CardDescription>Fuel consumption and cost analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Monthly Fuel Cost:</span>
                  <span className="font-medium">$3,245</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Average MPG:</span>
                  <span className="font-medium">12.5</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Efficiency Trend:</span>
                  <span className="font-medium text-green-600">+2.3%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Wrench className="h-5 w-5" />
                <span>Maintenance Report</span>
              </CardTitle>
              <CardDescription>Maintenance costs and scheduling</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Monthly Cost:</span>
                  <span className="font-medium">$1,850</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Scheduled:</span>
                  <span className="font-medium">3 pending</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Overdue:</span>
                  <span className="font-medium text-red-600">1 vehicle</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5" />
                <span>Cost Analysis</span>
              </CardTitle>
              <CardDescription>Operating costs and trends</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Total Monthly:</span>
                  <span className="font-medium">$8,450</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Cost per Mile:</span>
                  <span className="font-medium">$0.187</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>vs Last Month:</span>
                  <span className="font-medium text-green-600">-5.2%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span>Monthly Summary</span>
              </CardTitle>
              <CardDescription>Current month performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Miles Driven:</span>
                  <span className="font-medium">45,230</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Incidents:</span>
                  <span className="font-medium">2</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Efficiency:</span>
                  <span className="font-medium text-green-600">Excellent</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Download className="h-5 w-5" />
                <span>Custom Report</span>
              </CardTitle>
              <CardDescription>Generate custom analytics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button variant="outline" className="w-full text-sm bg-transparent">
                  Date Range Report
                </Button>
                <Button variant="outline" className="w-full text-sm bg-transparent">
                  Vehicle Specific
                </Button>
                <Button variant="outline" className="w-full text-sm bg-transparent">
                  Driver Performance
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
