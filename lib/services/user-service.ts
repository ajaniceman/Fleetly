import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { BaseService } from "./base-service"
import { executeQuery } from "../database/connection"
import type { User, CreateUserData, LoginCredentials } from "../types"

export class UserService extends BaseService<User> {
  constructor() {
    super("users")
  }

  // Register new user
  async register(userData: CreateUserData): Promise<{ user: User; token: string }> {
    try {
      // Validate required fields
      this.validateRequired(userData, ["email", "password", "name"])

      // Check if user already exists
      const existingUser = await this.findByEmail(userData.email)
      if (existingUser) {
        throw new Error("User with this email already exists")
      }

      // Hash password
      const saltRounds = 12
      const passwordHash = await bcrypt.hash(userData.password, saltRounds)

      // Create user data
      const userToCreate = {
        email: userData.email.toLowerCase().trim(),
        password_hash: passwordHash,
        name: this.sanitizeInput(userData.name),
        phone: userData.phone ? this.sanitizeInput(userData.phone) : null,
        role_id: userData.role_id || 4, // Default to 'Driver' role
        language_preference: userData.language_preference || "en",
        theme_preference: userData.theme_preference || "light",
        currency_preference: userData.currency_preference || "USD",
      }

      // Create user
      const user = await this.create(userToCreate)

      // Generate JWT token
      const token = this.generateToken(user)

      // Remove password hash from response
      const { password_hash, ...userWithoutPassword } = user as any

      return {
        user: userWithoutPassword,
        token,
      }
    } catch (error) {
      console.error("Error registering user:", error)
      throw error
    }
  }

  // Login user
  async login(credentials: LoginCredentials): Promise<{ user: User; token: string }> {
    try {
      const { email, password } = credentials

      // Check for temporary admin login
      if (email === process.env.TEMP_ADMIN_EMAIL && password === process.env.TEMP_ADMIN_PASSWORD) {
        const adminUser = await this.findByEmail("admin@fleetly.com")
        if (adminUser) {
          const token = this.generateToken(adminUser)
          const { password_hash, ...userWithoutPassword } = adminUser as any
          return { user: userWithoutPassword, token }
        }
      }

      // Find user by email
      const user = await this.findByEmail(email)
      if (!user) {
        throw new Error("Invalid email or password")
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, (user as any).password_hash)
      if (!isValidPassword) {
        throw new Error("Invalid email or password")
      }

      // Update last login
      await this.updateLastLogin(user.id)

      // Generate JWT token
      const token = this.generateToken(user)

      // Remove password hash from response
      const { password_hash, ...userWithoutPassword } = user as any

      return {
        user: userWithoutPassword,
        token,
      }
    } catch (error) {
      console.error("Error logging in user:", error)
      throw error
    }
  }

  // Find user by email
  async findByEmail(email: string): Promise<User | null> {
    try {
      const query = `
        SELECT u.*, r.name as role_name, r.permissions 
        FROM users u 
        LEFT JOIN roles r ON u.role_id = r.id 
        WHERE u.email = ? AND u.is_active = TRUE
      `
      const results = await executeQuery<User>(query, [email.toLowerCase()])
      return results[0] || null
    } catch (error) {
      console.error("Error finding user by email:", error)
      throw new Error("Failed to find user")
    }
  }

  // Update user password
  async updatePassword(userId: number, currentPassword: string, newPassword: string): Promise<void> {
    try {
      const user = await this.findById(userId)
      if (!user) {
        throw new Error("User not found")
      }

      // Verify current password
      const isValidPassword = await bcrypt.compare(currentPassword, (user as any).password_hash)
      if (!isValidPassword) {
        throw new Error("Current password is incorrect")
      }

      // Hash new password
      const saltRounds = 12
      const newPasswordHash = await bcrypt.hash(newPassword, saltRounds)

      // Update password
      await this.update(userId, { password_hash: newPasswordHash } as any)
    } catch (error) {
      console.error("Error updating password:", error)
      throw error
    }
  }

  // Update user preferences
  async updatePreferences(
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
      return await this.update(userId, preferences as any)
    } catch (error) {
      console.error("Error updating user preferences:", error)
      throw error
    }
  }

  // Update last login timestamp
  private async updateLastLogin(userId: number): Promise<void> {
    try {
      const query = "UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?"
      await executeQuery(query, [userId])
    } catch (error) {
      console.error("Error updating last login:", error)
    }
  }

  // Generate JWT token
  private generateToken(user: User): string {
    const payload = {
      id: user.id,
      email: (user as any).email,
      role_id: (user as any).role_id,
      role_name: (user as any).role_name,
    }

    return jwt.sign(payload, process.env.JWT_SECRET!, {
      expiresIn: process.env.JWT_EXPIRES_IN || "24h",
    })
  }

  // Verify JWT token
  static verifyToken(token: string): any {
    try {
      return jwt.verify(token, process.env.JWT_SECRET!)
    } catch (error) {
      throw new Error("Invalid token")
    }
  }

  // Get user permissions
  async getUserPermissions(userId: number): Promise<string[]> {
    try {
      const query = `
        SELECT r.permissions 
        FROM users u 
        JOIN roles r ON u.role_id = r.id 
        WHERE u.id = ? AND u.is_active = TRUE
      `
      const results = await executeQuery<{ permissions: string }>(query, [userId])

      if (results[0]?.permissions) {
        return JSON.parse(results[0].permissions)
      }

      return []
    } catch (error) {
      console.error("Error getting user permissions:", error)
      return []
    }
  }

  // Check if user has permission
  async hasPermission(userId: number, permission: string): Promise<boolean> {
    try {
      const permissions = await this.getUserPermissions(userId)

      // Super admin has all permissions
      if (permissions.includes("*")) {
        return true
      }

      // Check exact permission or wildcard
      return permissions.some((p) => p === permission || (p.endsWith(".*") && permission.startsWith(p.slice(0, -1))))
    } catch (error) {
      console.error("Error checking permission:", error)
      return false
    }
  }
}
