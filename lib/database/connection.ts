"use client"

import mysql from "mysql2/promise"

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  port: Number.parseInt(process.env.DB_PORT || "3306"),
  user: process.env.DB_USER || "fleetly_user",
  password: process.env.DB_PASSWORD || "fleetly_password",
  database: process.env.DB_NAME || "fleetly_db",
  charset: "utf8mb4",
  timezone: "+00:00",
  acquireTimeout: 60000,
  timeout: 60000,
  reconnect: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl:
    process.env.DB_SSL === "true"
      ? {
          rejectUnauthorized: false,
        }
      : false,
}

// Connection pool for better performance
let pool: mysql.Pool | null = null

export function getPool(): mysql.Pool {
  if (!pool) {
    pool = mysql.createPool(dbConfig)
  }
  return pool
}

export async function executeQuery<T = any>(query: string, params: any[] = []): Promise<T[]> {
  try {
    const connection = getPool()
    const [rows] = await connection.execute(query, params)
    return rows as T[]
  } catch (error) {
    console.error("Database query error:", error)
    throw new Error("Database operation failed")
  }
}

export async function executeTransaction<T>(queries: Array<{ query: string; params: any[] }>): Promise<T[]> {
  const connection = await getPool().getConnection()

  try {
    await connection.beginTransaction()

    const results: T[] = []
    for (const { query, params } of queries) {
      const [rows] = await connection.execute(query, params)
      results.push(rows as T)
    }

    await connection.commit()
    return results
  } catch (error) {
    await connection.rollback()
    console.error("Transaction error:", error)
    throw new Error("Transaction failed")
  } finally {
    connection.release()
  }
}

// Test database connection
export async function testConnection(): Promise<boolean> {
  try {
    const connection = getPool()
    await connection.execute("SELECT 1")
    console.log("✅ Database connection successful")
    return true
  } catch (error) {
    console.error("❌ Database connection failed:", error)
    return false
  }
}

// Initialize database connection
export async function initializeDatabase(): Promise<void> {
  try {
    await testConnection()
    console.log("🚀 Database initialized successfully")
  } catch (error) {
    console.error("💥 Database initialization failed:", error)
    throw error
  }
}
