"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Car, Users, Wrench, BarChart3, Shield, Globe } from "lucide-react"

export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem("auth_token")
    if (token) {
      router.push("/dashboard")
    }
  }, [router])

  const features = [
    {
      icon: Car,
      title: "Vehicle Management",
      description:
        "Track and manage your entire fleet with detailed vehicle profiles, maintenance schedules, and real-time status updates.",
    },
    {
      icon: Users,
      title: "Driver Management",
      description:
        "Manage driver information, licenses, certifications, and performance metrics in one centralized system.",
    },
    {
      icon: Wrench,
      title: "Maintenance Tracking",
      description:
        "Schedule preventive maintenance, track service history, and receive automated reminders to keep your fleet running smoothly.",
    },
    {
      icon: BarChart3,
      title: "Analytics & Reports",
      description:
        "Generate comprehensive reports on fuel consumption, maintenance costs, driver performance, and fleet efficiency.",
    },
    {
      icon: Shield,
      title: "Incident Management",
      description:
        "Document and track incidents, accidents, and violations with detailed reporting and follow-up capabilities.",
    },
    {
      icon: Globe,
      title: "Multi-language Support",
      description: "Available in multiple languages with currency support for international fleet operations.",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-2">
              <Car className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">Fleetly</span>
            </div>
            <Button onClick={() => router.push("/login")}>Get Started</Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Modern Fleet Management
            <span className="block text-blue-600">Made Simple</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Streamline your fleet operations with our comprehensive management system. Track vehicles, manage drivers,
            schedule maintenance, and generate insights to optimize your fleet performance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={() => router.push("/login")}>
              Start Free Trial
            </Button>
            <Button variant="outline" size="lg">
              Watch Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Manage Your Fleet
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our comprehensive platform provides all the tools you need to efficiently manage your fleet operations
              from a single dashboard.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="h-full">
                <CardHeader>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-white mb-2">10,000+</div>
              <div className="text-blue-100">Vehicles Managed</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">500+</div>
              <div className="text-blue-100">Companies Trust Us</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">99.9%</div>
              <div className="text-blue-100">Uptime Guarantee</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">24/7</div>
              <div className="text-blue-100">Customer Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Ready to Transform Your Fleet Management?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of companies that trust Fleetly to manage their fleet operations efficiently.
          </p>
          <Button size="lg" onClick={() => router.push("/login")}>
            Get Started Today
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Car className="h-6 w-6" />
              <span className="text-xl font-bold">Fleetly</span>
            </div>
            <div className="text-gray-400">© 2024 Fleetly. All rights reserved.</div>
          </div>
        </div>
      </footer>
    </div>
  )
}
