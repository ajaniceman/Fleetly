"use client"

import type React from "react"

import { AuthProvider } from "@/lib/auth"
import "@/lib/i18n"

export default function Template({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>
}
