"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import type { User } from "./types"

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for existing auth token on mount
    const token = localStorage.getItem("auth_token")
    if (token) {
      // In a real app, you would validate the token with your API
      // For demo purposes, we'll create a mock user
      setUser({
        id: 1,
        name: "Admin User",
        email: "admin@fleetly.com",
        role: "admin",
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      })
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // For demo purposes, accept any email/password
      if (email && password) {
        const mockUser: User = {
          id: 1,
          name: "Admin User",
          email: email,
          role: "admin",
          is_active: true,
          created_at: new Date(),
          updated_at: new Date(),
        }

        setUser(mockUser)
        localStorage.setItem("auth_token", "demo_token")
        return true
      }

      return false
    } catch (error) {
      console.error("Login error:", error)
      return false
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("auth_token")
  }

  return <AuthContext.Provider value={{ user, login, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
