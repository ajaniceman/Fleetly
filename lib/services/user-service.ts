import { BaseService } from "./base-service"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import type { User } from "@/lib/types"

export class UserService extends BaseService {
  constructor() {
    super("users")
  }

  async authenticate(email: string, password: string): Promise<{ user: User; token: string } | null> {
    const query = "SELECT * FROM users WHERE email = ? AND is_active = TRUE"
    const results = (await this.executeQuery(query, [email])) as User[]

    if (results.length === 0) {
      return null
    }

    const user = results[0]
    const isValidPassword = await bcrypt.compare(password, user.password_hash)

    if (!isValidPassword) {
      return null
    }

    // Update last login
    await this.update(user.id, { last_login: new Date() })

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || "fallback-secret",
      { expiresIn: process.env.JWT_EXPIRES_IN || "24h" },
    )

    // Remove password hash from response
    const { password_hash, ...userWithoutPassword } = user

    return {
      user: userWithoutPassword as User,
      token,
    }
  }

  async createUser(userData: {
    email: string
    password: string
    name: string
    role?: "admin" | "manager" | "driver"
  }): Promise<string> {
    const hashedPassword = await bcrypt.hash(userData.password, 10)

    return await this.create({
      email: userData.email,
      password_hash: hashedPassword,
      name: userData.name,
      role: userData.role || "driver",
    })
  }

  async updatePassword(userId: string, newPassword: string): Promise<void> {
    const hashedPassword = await bcrypt.hash(newPassword, 10)
    await this.update(userId, { password_hash: hashedPassword })
  }

  async findByEmail(email: string): Promise<User | null> {
    const query = "SELECT * FROM users WHERE email = ?"
    const results = (await this.executeQuery(query, [email])) as User[]
    return results.length > 0 ? results[0] : null
  }

  private async executeQuery(query: string, params: any[] = []) {
    const { executeQuery } = await import("@/lib/database/connection")
    return executeQuery(query, params)
  }
}

export const userService = new UserService()
