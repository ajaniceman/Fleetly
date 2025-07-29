const mysql = require("mysql2/promise")
const fs = require("fs")
const path = require("path")
require("dotenv").config({ path: ".env.local" })

async function runMigrations() {
  console.log("🚀 Starting database migration...")

  const config = {
    host: process.env.DB_HOST || "localhost",
    port: Number.parseInt(process.env.DB_PORT || "3306"),
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "fleetly",
    multipleStatements: true,
  }

  let connection

  try {
    // Connect to MySQL
    connection = await mysql.createConnection(config)
    console.log("✅ Connected to MySQL database")

    // Read and execute schema
    const schemaPath = path.join(__dirname, "..", "database", "schema.sql")

    if (!fs.existsSync(schemaPath)) {
      throw new Error(`Schema file not found: ${schemaPath}`)
    }

    const schema = fs.readFileSync(schemaPath, "utf8")
    console.log("📄 Executing database schema...")

    await connection.execute(schema)
    console.log("✅ Database schema executed successfully")

    // Verify tables were created
    const [tables] = await connection.execute("SHOW TABLES")
    console.log(
      "📊 Created tables:",
      tables.map((row) => Object.values(row)[0]),
    )

    console.log("🎉 Migration completed successfully!")
  } catch (error) {
    console.error("❌ Migration failed:", error.message)

    if (error.code === "ER_ACCESS_DENIED_ERROR") {
      console.log("\n💡 Database connection failed. Please check:")
      console.log("1. Database credentials in .env.local")
      console.log("2. MySQL server is running")
      console.log("3. Database exists and user has proper permissions")
    }

    process.exit(1)
  } finally {
    if (connection) {
      await connection.end()
      console.log("🔌 Database connection closed")
    }
  }
}

runMigrations()
