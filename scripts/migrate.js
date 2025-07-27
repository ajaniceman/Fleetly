const mysql = require("mysql2/promise")
const fs = require("fs")
const path = require("path")
require("dotenv").config({ path: ".env.local" })

async function runMigrations() {
  console.log("🔄 Running database migrations...\n")

  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || "fleetly_user",
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || "fleetly_db",
    ssl: process.env.DB_SSL === "true",
  })

  try {
    // Read and execute schema
    const schemaPath = path.join(__dirname, "..", "database", "schema.sql")
    const schema = fs.readFileSync(schemaPath, "utf8")

    // Split by semicolon and execute each statement
    const statements = schema.split(";").filter((stmt) => stmt.trim())

    for (const statement of statements) {
      if (statement.trim()) {
        await connection.execute(statement)
      }
    }

    console.log("✅ Database migrations completed successfully!")
  } catch (error) {
    console.error("❌ Migration failed:", error.message)
  } finally {
    await connection.end()
  }
}

runMigrations()
