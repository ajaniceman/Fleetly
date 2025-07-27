import { UserService } from "./services/user-service"
import type { User, LoginCredentials, CreateUserData } from "./types"

const userService = new UserService()

export interface AuthResult {
  user: User
  token: string
}

export class AuthService {
  // Login user
  static async login(credentials: LoginCredentials): Promise<AuthResult> {
    try {
      return await userService.login(credentials)
    } catch (error) {
      console.error("Login error:", error)
      throw error
    }
  }

  // Register new user
  static async register(userData: CreateUserData): Promise<AuthResult> {
    try {
      return await userService.register(userData)
    } catch (error) {
      console.error("Registration error:", error)
      throw error
    }
  }

  // Verify JWT token
  static verifyToken(token: string): any {
    try {
      return UserService.verifyToken(token)
    } catch (error) {
      console.error("Token verification error:", error)
      throw error
    }
  }

  // Get current user from token
  static async getCurrentUser(token: string): Promise<User | null> {
    try {
      const decoded = this.verifyToken(token)
      return await userService.findById(decoded.id)
    } catch (error) {
      console.error("Get current user error:", error)
      return null
    }
  }

  // Update user password
  static async updatePassword(userId: number, currentPassword: string, newPassword: string): Promise<void> {
    try {
      return await userService.updatePassword(userId, currentPassword, newPassword)
    } catch (error) {
      console.error("Update password error:", error)
      throw error
    }
  }

  // Update user preferences
  static async updatePreferences(
    userId: number,
    preferences: {
      language_preference?: string
      theme_preference?: "light" | "dark"
      currency_preference?: string
      email_notifications?: boolean
      push_notifications?: boolean
    },
  ): Promise<User> {
    try {
      return await userService.updatePreferences(userId, preferences)
    } catch (error) {
      console.error("Update preferences error:", error)
      throw error
    }
  }

  // Check user permissions
  static async hasPermission(userId: number, permission: string): Promise<boolean> {
    try {
      return await userService.hasPermission(userId, permission)
    } catch (error) {
      console.error("Permission check error:", error)
      return false
    }
  }

  // Logout (client-side token removal)
  static logout(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth_token")
      localStorage.removeItem("user_data")
    }
  }

  // Store auth data in localStorage
  static storeAuthData(user: User, token: string): void {
    if (typeof window !== "undefined") {
      localStorage.setItem("auth_token", token)
      localStorage.setItem("user_data", JSON.stringify(user))
    }
  }

  // Get stored auth data
  static getStoredAuthData(): { user: User | null; token: string | null } {
    if (typeof window === "undefined") {
      return { user: null, token: null }
    }

    const token = localStorage.getItem("auth_token")
    const userData = localStorage.getItem("user_data")

    return {
      token,
      user: userData ? JSON.parse(userData) : null,
    }
  }

  // Check if user is authenticated
  static isAuthenticated(): boolean {
    const { token } = this.getStoredAuthData()

    if (!token) return false

    try {
      this.verifyToken(token)
      return true
    } catch {
      return false
    }
  }
}
