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

    if (!token && currentPath !== "/login" && currentPath !== "/") {
      router.push("/login")
    }
  }, [router])

  return <>{children}</>
}
