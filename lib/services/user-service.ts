import { BaseService } from "./base-service"
import { executeQuery } from "../database/connection"
import type { User } from "../types"
import bcrypt from "bcryptjs"

export class UserService extends BaseService<User> {
  constructor() {
    super("users")
  }

  // Authenticate user
  async authenticate(email: string, password: string): Promise<User | null> {
    try {
      const query = `SELECT * FROM users WHERE email = ? AND is_active = TRUE`
      const users = await executeQuery<User & { password_hash: string }>(query, [email])

      if (users.length === 0) {
        return null
      }

      const user = users[0]
      const isValidPassword = await bcrypt.compare(password, user.password_hash)

      if (!isValidPassword) {
        return null
      }

      // Remove password hash from returned user object
      const { password_hash, ...userWithoutPassword } = user
      return userWithoutPassword as User
    } catch (error) {
      console.error("Error authenticating user:", error)
      throw error
    }
  }

  // Create user with hashed password
  async createUser(userData: {
    name: string
    email: string
    password: string
    role?: "admin" | "manager" | "driver"
  }): Promise<User> {
    try {
      const hashedPassword = await bcrypt.hash(userData.password, 10)

      const { password, ...userDataWithoutPassword } = userData
      const userToCreate = {
        ...userDataWithoutPassword,
        password_hash: hashedPassword,
      }

      return await this.create(userToCreate as any)
    } catch (error) {
      console.error("Error creating user:", error)
      throw error
    }
  }

  // Update user password
  async updatePassword(userId: number, newPassword: string): Promise<boolean> {
    try {
      const hashedPassword = await bcrypt.hash(newPassword, 10)
      const query = `UPDATE users SET password_hash = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`
      await executeQuery(query, [hashedPassword, userId])
      return true
    } catch (error) {
      console.error("Error updating user password:", error)
      throw error
    }
  }

  // Get users by role
  async getUsersByRole(role: "admin" | "manager" | "driver"): Promise<User[]> {
    try {
      const query = `SELECT id, name, email, role, is_active, created_at, updated_at FROM users WHERE role = ? AND is_active = TRUE ORDER BY name`
      return await executeQuery<User>(query, [role])
    } catch (error) {
      console.error("Error getting users by role:", error)
      throw error
    }
  }

  // Update user preferences
  async updatePreferences(
    userId: number,
    preferences: {
      language_preference?: string
      currency_preference?: string
      email_notifications?: boolean
      maintenance_alerts?: boolean
      incident_alerts?: boolean
    },
  ): Promise<User | null> {
    try {
      return await this.update(userId, preferences as any)
    } catch (error) {
      console.error("Error updating user preferences:", error)
      throw error
    }
  }
}

export const userService = new UserService()
