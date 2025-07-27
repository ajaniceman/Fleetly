const mysql = require("mysql2/promise")
const fs = require("fs")
const path = require("path")
require("dotenv").config({ path: ".env.local" })

async function runMigrations() {
  console.log("🗄️  Starting database migration...\n")

  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : false,
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

    console.log("✅ Database schema created successfully!")
    console.log("🚀 Database is ready for use!")
  } catch (error) {
    console.error("❌ Migration failed:", error.message)
    process.exit(1)
  } finally {
    await connection.end()
  }
}

runMigrations()
