"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function Template({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  useEffect(() => {
    // Check authentication on route changes
    const token = localStorage.getItem("auth_token")
    const currentPath = window.location.pathname

    // Redirect to login if not authenticated and not already on login page
    if (!token && currentPath !== "/login" && currentPath !== "/") {
      router.push("/login")
    }
  }, [router])

  return <div className="min-h-screen bg-gray-50">{children}</div>
}
