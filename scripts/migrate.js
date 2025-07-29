const mysql = require("mysql2/promise")
const fs = require("fs")
const path = require("path")
require("dotenv").config()

async function runMigrations() {
  let connection

  try {
    console.log("Connecting to database...")

    connection = await mysql.createConnection({
      host: process.env.DB_HOST || "localhost",
      port: Number.parseInt(process.env.DB_PORT || "3306"),
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
      database: process.env.DB_NAME || "fleetly",
    })

    console.log("✅ Connected to database")

    // Read and execute schema
    const schemaPath = path.join(__dirname, "..", "database", "schema.sql")
    const schema = fs.readFileSync(schemaPath, "utf8")

    // Split by semicolon and execute each statement
    const statements = schema.split(";").filter((stmt) => stmt.trim().length > 0)

    console.log(`Executing ${statements.length} SQL statements...`)

    for (const statement of statements) {
      if (statement.trim()) {
        await connection.execute(statement)
      }
    }

    console.log("✅ Database migration completed successfully!")
  } catch (error) {
    console.error("❌ Migration failed:", error.message)
    process.exit(1)
  } finally {
    if (connection) {
      await connection.end()
    }
  }
}

runMigrations()
