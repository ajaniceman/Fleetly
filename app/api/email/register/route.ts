import { type NextRequest, NextResponse } from "next/server"
import { getPool, executeQuery } from "@/lib/database/connection" // Updated import path and functions
import bcrypt from "bcryptjs"

export async function POST(request: NextRequest) {
  try {
    const { email, firstName, lastName, password, role } = await request.json()

    // 1. Input Validation
    if (!email || !firstName || !lastName || !password || !role) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Basic email format validation (more robust validation can be added)
    if (!/\S+@\S+\.\S+/.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
    }

    // Password strength validation (example: min 6 characters)
    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters long" }, { status: 400 })
    }

    // 2. Hash Password
    const hashedPassword = await bcrypt.hash(password, 10) // 10 is the salt rounds

    // 3. Database Interaction using the provided pool and executeQuery
    try {
      // Check if user with this email already exists
      // executeQuery returns results directly, no need for [existingUsers] destructuring
      const existingUsers = await executeQuery(
        "SELECT id FROM users WHERE email = ?",
        [email]
      )

      if (Array.isArray(existingUsers) && existingUsers.length > 0) {
        return NextResponse.json({ error: "Email already registered" }, { status: 409 }) // Conflict
      }

      // Insert new user into the database
      // executeQuery returns results directly, check affectedRows from the result
      const result = await executeQuery(
        "INSERT INTO users (email, password, firstName, lastName, role) VALUES (?, ?, ?, ?, ?)",
        [email, hashedPassword, firstName, lastName, role]
      )

      // Check if the insert operation was successful
      // The `affectedRows` property is typically on the result object from an INSERT query
      if (result && result.affectedRows === 0) {
        throw new Error("Failed to insert user into database.")
      }

      return NextResponse.json({ message: "Registration successful!" }, { status: 201 }) // Created
    } catch (error: any) {
      console.error("Database operation error during registration:", error)
      // Handle specific database errors if needed, e.g., duplicate entry
      if (error.code === 'ER_DUP_ENTRY') {
        return NextResponse.json({ error: "Email already registered" }, { status: 409 })
      }
      // Re-throw to be caught by the outer try-catch for generic internal server error
      throw error; 
    }
  } catch (error: any) {
    console.error("Registration API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
