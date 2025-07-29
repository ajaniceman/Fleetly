import jwt from "jsonwebtoken"
import { cookies } from "next/headers"
import type { User } from "./types"

export async function getUser(): Promise<User | null> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("auth-token")?.value

    if (!token) {
      return null
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback-secret") as any

    // In a real app, you'd fetch the user from the database
    return {
      id: decoded.userId,
      email: decoded.email,
      name: decoded.name || "User",
      role: decoded.role,
      createdAt: new Date().toISOString(),
    }
  } catch (error) {
    return null
  }
}

export async function requireAuth(): Promise<User> {
  const user = await getUser()
  if (!user) {
    throw new Error("Authentication required")
  }
  return user
}

export function createAuthToken(user: User): string {
  return jwt.sign(
    { userId: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET || "fallback-secret",
    { expiresIn: process.env.JWT_EXPIRES_IN || "24h" },
  )
}
