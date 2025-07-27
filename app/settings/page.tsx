"use client"

import { Badge } from "@/components/ui/badge"

import { useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/lib/auth"
import { useToast } from "@/hooks/use-toast"
import { Building, User, Bell, Shield, Database, Globe, Key, Users, FileText } from "lucide-react"

export default function SettingsPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  // Company settings
  const [companyName, setCompanyName] = useState("Acme Fleet Management")
  const [companyEmail, setCompanyEmail] = useState("admin@acmefleet.com")
  const [companyPhone, setCompanyPhone] = useState("+1-555-0100")
  const [companyAddress, setCompanyAddress] = useState("123 Business Park Dr, Suite 100")

  // User preferences
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [pushNotifications, setPushNotifications] = useState(true)
  const [maintenanceAlerts, setMaintenanceAlerts] = useState(true)
  const [fuelAlerts, setFuelAlerts] = useState(false)
  const [incidentAlerts, setIncidentAlerts] = useState(true)

  // System settings
  const [units, setUnits] = useState("metric")
  const [timezone, setTimezone] = useState("America/New_York")
  const [dateFormat, setDateFormat] = useState("MM/DD/YYYY")
  const [currency, setCurrency] = useState("USD")

  const handleSaveSettings = async (section: string) => {
    setLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    toast({
      title: "Settings saved",
      description: `${section} settings have been updated successfully.`,
    })
    setLoading(false)
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage your fleet management system configuration
          </p>
        </div>

        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 lg:w-auto lg:grid-cols-6">
            <TabsTrigger value="general" className="flex items-center space-x-2">
              <Building className="h-4 w-4" />
              <span className="hidden sm:inline">General</span>
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Profile</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center space-x-2">
              <Bell className="h-4 w-4" />
              <span className="hidden sm:inline">Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center space-x-2">
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">Security</span>
            </TabsTrigger>
            <TabsTrigger value="integrations" className="flex items-center space-x-2">
              <Database className="h-4 w-4" />
              <span className="hidden sm:inline">Integrations</span>
            </TabsTrigger>
            <TabsTrigger value="system" className="flex items-center space-x-2">
              <Globe className="h-4 w-4" />
              <span className="hidden sm:inline">System</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-6">
            <Card className="rounded-xl">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building className="h-5 w-5 mr-2" />
                  Company Information
                </CardTitle>
                <CardDescription>Update your company details and contact information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="company-name">Company Name</Label>
                    <Input
                      id="company-name"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="rounded-lg"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company-email">Company Email</Label>
                    <Input
                      id="company-email"
                      type="email"
                      value={companyEmail}
                      onChange={(e) => setCompanyEmail(e.target.value)}
                      className="rounded-lg"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company-phone">Phone Number</Label>
                    <Input
                      id="company-phone"
                      value={companyPhone}
                      onChange={(e) => setCompanyPhone(e.target.value)}
                      className="rounded-lg"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select value={timezone} onValueChange={setTimezone}>
                      <SelectTrigger className="rounded-lg">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="America/New_York">Eastern Time</SelectItem>
                        <SelectItem value="America/Chicago">Central Time</SelectItem>
                        <SelectItem value="America/Denver">Mountain Time</SelectItem>
                        <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company-address">Address</Label>
                  <Input
                    id="company-address"
                    value={companyAddress}
                    onChange={(e) => setCompanyAddress(e.target.value)}
                    className="rounded-lg"
                  />
                </div>
                <Button onClick={() => handleSaveSettings("Company")} disabled={loading} className="rounded-lg">
                  {loading ? "Saving..." : "Save Changes"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile" className="space-y-6">
            <Card className="rounded-xl">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Profile Settings
                </CardTitle>
                <CardDescription>Manage your personal account information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="full-name">Full Name</Label>
                    <Input id="full-name" value={user?.name || ""} className="rounded-lg" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" value={user?.email || ""} className="rounded-lg" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Input id="role" value={user?.role || ""} disabled className="rounded-lg bg-gray-50" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" placeholder="+1-555-0123" className="rounded-lg" />
                  </div>
                </div>
                <Button onClick={() => handleSaveSettings("Profile")} disabled={loading} className="rounded-lg">
                  {loading ? "Saving..." : "Update Profile"}
                </Button>
              </CardContent>
            </Card>

            <Card className="rounded-xl">
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
                <CardDescription>Update your password to keep your account secure</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input id="current-password" type="password" className="rounded-lg" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input id="new-password" type="password" className="rounded-lg" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm Password</Label>
                    <Input id="confirm-password" type="password" className="rounded-lg" />
                  </div>
                </div>
                <Button onClick={() => handleSaveSettings("Password")} disabled={loading} className="rounded-lg">
                  {loading ? "Updating..." : "Change Password"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <Card className="rounded-xl">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="h-5 w-5 mr-2" />
                  Notification Preferences
                </CardTitle>
                <CardDescription>Configure how you want to receive notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Email Notifications</Label>
                      <p className="text-sm text-gray-500">Receive notifications via email</p>
                    </div>
                    <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Push Notifications</Label>
                      <p className="text-sm text-gray-500">Receive push notifications in browser</p>
                    </div>
                    <Switch checked={pushNotifications} onCheckedChange={setPushNotifications} />
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h4 className="text-sm font-medium mb-4">Alert Types</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Maintenance Alerts</Label>
                        <p className="text-sm text-gray-500">Upcoming and overdue maintenance</p>
                      </div>
                      <Switch checked={maintenanceAlerts} onCheckedChange={setMaintenanceAlerts} />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Fuel Alerts</Label>
                        <p className="text-sm text-gray-500">Fuel consumption anomalies</p>
                      </div>
                      <Switch checked={fuelAlerts} onCheckedChange={setFuelAlerts} />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Incident Alerts</Label>
                        <p className="text-sm text-gray-500">New incident reports</p>
                      </div>
                      <Switch checked={incidentAlerts} onCheckedChange={setIncidentAlerts} />
                    </div>
                  </div>
                </div>

                <Button onClick={() => handleSaveSettings("Notifications")} disabled={loading} className="rounded-lg">
                  {loading ? "Saving..." : "Save Preferences"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Card className="rounded-xl">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2" />
                  Security Settings
                </CardTitle>
                <CardDescription>Manage security and access control settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Two-Factor Authentication</Label>
                      <p className="text-sm text-gray-500">Add an extra layer of security</p>
                    </div>
                    <Button variant="outline" className="rounded-lg bg-transparent">
                      Enable 2FA
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Session Timeout</Label>
                      <p className="text-sm text-gray-500">Automatically log out after inactivity</p>
                    </div>
                    <Select defaultValue="30">
                      <SelectTrigger className="w-32 rounded-lg">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 minutes</SelectItem>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="60">1 hour</SelectItem>
                        <SelectItem value="120">2 hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h4 className="text-sm font-medium mb-4">API Access</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>API Keys</Label>
                        <p className="text-sm text-gray-500">Manage API access tokens</p>
                      </div>
                      <Button variant="outline" className="rounded-lg bg-transparent">
                        <Key className="h-4 w-4 mr-2" />
                        Manage Keys
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h4 className="text-sm font-medium mb-4">User Management</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Role Permissions</Label>
                        <p className="text-sm text-gray-500">Configure user roles and permissions</p>
                      </div>
                      <Button variant="outline" className="rounded-lg bg-transparent">
                        <Users className="h-4 w-4 mr-2" />
                        Manage Roles
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="integrations" className="space-y-6">
            <Card className="rounded-xl">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Database className="h-5 w-5 mr-2" />
                  Third-Party Integrations
                </CardTitle>
                <CardDescription>Connect external services and APIs</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium">Google Maps API</h4>
                      <Badge className="bg-green-100 text-green-800">Connected</Badge>
                    </div>
                    <p className="text-sm text-gray-500 mb-3">Location tracking and route optimization</p>
                    <Button variant="outline" size="sm" className="rounded-lg bg-transparent">
                      Configure
                    </Button>
                  </div>

                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium">Telematics Provider</h4>
                      <Badge variant="secondary">Not Connected</Badge>
                    </div>
                    <p className="text-sm text-gray-500 mb-3">Real-time vehicle data and diagnostics</p>
                    <Button variant="outline" size="sm" className="rounded-lg bg-transparent">
                      Connect
                    </Button>
                  </div>

                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium">Fuel Card Integration</h4>
                      <Badge variant="secondary">Not Connected</Badge>
                    </div>
                    <p className="text-sm text-gray-500 mb-3">Automatic fuel transaction import</p>
                    <Button variant="outline" size="sm" className="rounded-lg bg-transparent">
                      Connect
                    </Button>
                  </div>

                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium">ERP System</h4>
                      <Badge variant="secondary">Not Connected</Badge>
                    </div>
                    <p className="text-sm text-gray-500 mb-3">Sync with enterprise resource planning</p>
                    <Button variant="outline" size="sm" className="rounded-lg bg-transparent">
                      Connect
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="system" className="space-y-6">
            <Card className="rounded-xl">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Globe className="h-5 w-5 mr-2" />
                  System Preferences
                </CardTitle>
                <CardDescription>Configure system-wide settings and preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="units">Measurement Units</Label>
                    <Select value={units} onValueChange={setUnits}>
                      <SelectTrigger className="rounded-lg">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="metric">Metric (km, L, kg)</SelectItem>
                        <SelectItem value="imperial">Imperial (mi, gal, lb)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="date-format">Date Format</Label>
                    <Select value={dateFormat} onValueChange={setDateFormat}>
                      <SelectTrigger className="rounded-lg">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                        <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                        <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="currency">Currency</Label>
                    <Select value={currency} onValueChange={setCurrency}>
                      <SelectTrigger className="rounded-lg">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD ($)</SelectItem>
                        <SelectItem value="EUR">EUR (€)</SelectItem>
                        <SelectItem value="GBP">GBP (£)</SelectItem>
                        <SelectItem value="CAD">CAD (C$)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="language">Language</Label>
                    <Select defaultValue="en">
                      <SelectTrigger className="rounded-lg">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Spanish</SelectItem>
                        <SelectItem value="fr">French</SelectItem>
                        <SelectItem value="de">German</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h4 className="text-sm font-medium mb-4">Data Management</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Data Export</Label>
                        <p className="text-sm text-gray-500">Export all fleet data</p>
                      </div>
                      <Button variant="outline" className="rounded-lg bg-transparent">
                        <FileText className="h-4 w-4 mr-2" />
                        Export Data
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Data Import</Label>
                        <p className="text-sm text-gray-500">Import data from external sources</p>
                      </div>
                      <Button variant="outline" className="rounded-lg bg-transparent">
                        <Database className="h-4 w-4 mr-2" />
                        Import Data
                      </Button>
                    </div>
                  </div>
                </div>

                <Button onClick={() => handleSaveSettings("System")} disabled={loading} className="rounded-lg">
                  {loading ? "Saving..." : "Save System Settings"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
