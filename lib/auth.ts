import { userService } from "@/lib/services/user-service"
import type { User } from "@/lib/types"

export interface AuthResponse {
  success: boolean
  user?: User
  token?: string
  message?: string
}

export class AuthService {
  private static instance: AuthService
  private currentUser: User | null = null

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService()
    }
    return AuthService.instance
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      const user = await userService.authenticateUser(email, password)

      if (!user) {
        return {
          success: false,
          message: "Invalid email or password",
        }
      }

      // Generate a simple token (in production, use JWT)
      const token = this.generateToken(user.id)
      this.currentUser = user

      return {
        success: true,
        user,
        token,
      }
    } catch (error) {
      console.error("Login error:", error)
      return {
        success: false,
        message: "An error occurred during login",
      }
    }
  }

  async register(userData: {
    email: string
    password: string
    firstName: string
    lastName: string
    role?: "admin" | "manager" | "driver"
  }): Promise<AuthResponse> {
    try {
      // Check if user already exists
      const existingUser = await userService.findByEmail(userData.email)
      if (existingUser) {
        return {
          success: false,
          message: "User with this email already exists",
        }
      }

      const userId = await userService.createUser({
        ...userData,
        role: userData.role || "driver",
        status: "active",
      })

      const user = await userService.findById(userId)
      const token = this.generateToken(userId)

      return {
        success: true,
        user,
        token,
      }
    } catch (error) {
      console.error("Registration error:", error)
      return {
        success: false,
        message: "An error occurred during registration",
      }
    }
  }

  async logout(): Promise<void> {
    this.currentUser = null
    // In a real app, you'd invalidate the token on the server
  }

  async getCurrentUser(): Promise<User | null> {
    return this.currentUser
  }

  async validateToken(token: string): Promise<boolean> {
    try {
      // Simple token validation (in production, use proper JWT validation)
      const parts = token.split(".")
      if (parts.length !== 3) return false

      const payload = JSON.parse(atob(parts[1]))
      const userId = payload.userId
      const expiry = payload.exp

      if (Date.now() > expiry) return false

      const user = await userService.findById(userId)
      if (!user || user.status !== "active") return false

      this.currentUser = user
      return true
    } catch (error) {
      console.error("Token validation error:", error)
      return false
    }
  }

  async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<AuthResponse> {
    try {
      const user = await userService.findById(userId)
      if (!user) {
        return {
          success: false,
          message: "User not found",
        }
      }

      // Verify current password
      const isValid = await userService.authenticateUser(user.email, currentPassword)
      if (!isValid) {
        return {
          success: false,
          message: "Current password is incorrect",
        }
      }

      // Update password
      const updated = await userService.updatePassword(userId, newPassword)
      if (!updated) {
        return {
          success: false,
          message: "Failed to update password",
        }
      }

      return {
        success: true,
        message: "Password updated successfully",
      }
    } catch (error) {
      console.error("Change password error:", error)
      return {
        success: false,
        message: "An error occurred while changing password",
      }
    }
  }

  private generateToken(userId: string): string {
    const header = { alg: "HS256", typ: "JWT" }
    const payload = {
      userId,
      exp: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
    }

    const encodedHeader = btoa(JSON.stringify(header))
    const encodedPayload = btoa(JSON.stringify(payload))
    const signature = btoa(`${encodedHeader}.${encodedPayload}.secret`)

    return `${encodedHeader}.${encodedPayload}.${signature}`
  }
}

export const authService = AuthService.getInstance()
