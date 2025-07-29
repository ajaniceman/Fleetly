import { BaseService } from "./base-service"
import type { User } from "@/lib/types"
import { executeQuery } from "@/lib/database/connection"
import bcrypt from "bcryptjs"

export class UserService extends BaseService {
  constructor() {
    super("users")
  }

  async createUser(userData: Omit<User, "id" | "createdAt" | "updatedAt"> & { password: string }): Promise<string> {
    const hashedPassword = await bcrypt.hash(userData.password, 10)
    const id = this.generateId()

    const user = {
      id,
      email: userData.email,
      password_hash: hashedPassword,
      first_name: userData.firstName,
      last_name: userData.lastName,
      role: userData.role,
      status: userData.status,
      created_at: new Date(),
      updated_at: new Date(),
    }

    await this.create(user)
    return id
  }

  async authenticateUser(email: string, password: string): Promise<User | null> {
    const query = 'SELECT * FROM users WHERE email = ? AND status = "active"'
    const results = await executeQuery(query, [email])

    if (results.length === 0) {
      return null
    }

    const user = results[0]
    const isValidPassword = await bcrypt.compare(password, user.password_hash)

    if (!isValidPassword) {
      return null
    }

    // Return user without password hash
    const { password_hash, ...userWithoutPassword } = user
    return {
      ...userWithoutPassword,
      firstName: user.first_name,
      lastName: user.last_name,
      createdAt: user.created_at,
      updatedAt: user.updated_at,
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    const results = await this.findByField("email", email)
    if (results.length === 0) return null

    const user = results[0]
    return {
      ...user,
      firstName: user.first_name,
      lastName: user.last_name,
      createdAt: user.created_at,
      updatedAt: user.updated_at,
    }
  }

  async updatePassword(id: string, newPassword: string): Promise<boolean> {
    const hashedPassword = await bcrypt.hash(newPassword, 10)
    return await this.update(id, {
      password_hash: hashedPassword,
      updated_at: new Date(),
    })
  }

  async getActiveDrivers(): Promise<User[]> {
    const query = 'SELECT * FROM users WHERE role = "driver" AND status = "active"'
    const results = await executeQuery(query)

    return results.map((user: any) => ({
      ...user,
      firstName: user.first_name,
      lastName: user.last_name,
      createdAt: user.created_at,
      updatedAt: user.updated_at,
    }))
  }

  private generateId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9)
  }
}

export const userService = new UserService()
