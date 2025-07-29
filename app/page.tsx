"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Car, Users, Wrench, BarChart3, Shield, Globe } from "lucide-react"

export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem("auth_token")

    if (token) {
      // User is authenticated, redirect to dashboard
      router.push("/dashboard")
    } else {
      // User is not authenticated, redirect to login
      router.push("/login")
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
    </div>
  )
}
