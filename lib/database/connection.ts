import mysql from "mysql2/promise"

// Database connection configuration
const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  port: Number.parseInt(process.env.DB_PORT || "3306"),
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "fleetly",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
}

// Create connection pool
let pool: mysql.Pool | null = null

export function getPool(): mysql.Pool {
  if (!pool) {
    pool = mysql.createPool(dbConfig)
  }
  return pool
}

// Execute a query with parameters
export async function executeQuery<T = any>(query: string, params: any[] = []): Promise<T[]> {
  try {
    const pool = getPool()
    const [rows] = await pool.execute(query, params)
    return rows as T[]
  } catch (error) {
    console.error("Database query error:", error)
    console.error("Query:", query)
    console.error("Params:", params)
    throw error
  }
}

// Execute a query and return the first result
export async function executeQuerySingle<T = any>(query: string, params: any[] = []): Promise<T | null> {
  const results = await executeQuery<T>(query, params)
  return results.length > 0 ? results[0] : null
}

// Test database connection
export async function testConnection(): Promise<boolean> {
  try {
    const pool = getPool()
    const connection = await pool.getConnection()
    await connection.ping()
    connection.release()
    console.log("✅ Database connection successful")
    return true
  } catch (error) {
    console.error("❌ Database connection failed:", error)
    return false
  }
}

// Close all connections
export async function closeConnections(): Promise<void> {
  if (pool) {
    await pool.end()
    pool = null
    console.log("Database connections closed")
  }
}
