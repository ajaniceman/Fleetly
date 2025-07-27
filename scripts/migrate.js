const mysql = require("mysql2/promise")
const fs = require("fs")
const path = require("path")
require("dotenv").config({ path: ".env.local" })

async function runMigration() {
  console.log("🗄️  Starting database migration...\n")

  // Check environment variables
  const requiredVars = ["DB_HOST", "DB_USER", "DB_PASSWORD", "DB_NAME"]
  const missing = requiredVars.filter((varName) => !process.env[varName])

  if (missing.length > 0) {
    console.error("❌ Missing database environment variables:", missing.join(", "))
    process.exit(1)
  }

  const config = {
    host: process.env.DB_HOST,
    port: Number.parseInt(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    multipleStatements: true,
  }

  let connection

  try {
    // Connect to database
    console.log(`🔌 Connecting to MySQL database: ${config.host}:${config.port}`)
    connection = await mysql.createConnection(config)
    console.log("✅ Database connection successful!")

    // Read schema file
    const schemaPath = path.join(__dirname, "..", "database", "schema.sql")
    if (!fs.existsSync(schemaPath)) {
      console.error("❌ Schema file not found:", schemaPath)
      process.exit(1)
    }

    console.log("\n📄 Reading database schema...")
    const schema = fs.readFileSync(schemaPath, "utf8")

    // Execute schema
    console.log("🚀 Executing database migration...")
    await connection.execute(schema)
    console.log("✅ Database schema created successfully!")

    // Verify tables were created
    console.log("\n🔍 Verifying table creation...")
    const [tables] = await connection.execute("SHOW TABLES")

    if (tables.length > 0) {
      console.log("✅ Tables created successfully:")
      tables.forEach((table) => {
        const tableName = Object.values(table)[0]
        console.log(`   📋 ${tableName}`)
      })
    } else {
      console.log("⚠️  No tables found. Please check the schema file.")
    }

    console.log("\n🎉 Database migration completed successfully!")
    console.log("🚀 Your Fleetly database is ready to use.")
  } catch (error) {
    console.error("\n❌ Migration failed:")

    if (error.code === "ER_ACCESS_DENIED_ERROR") {
      console.error("🔐 Access denied. Please check your database credentials.")
    } else if (error.code === "ENOTFOUND") {
      console.error("🌐 Database host not found. Please check DB_HOST.")
    } else if (error.code === "ECONNREFUSED") {
      console.error("🔌 Connection refused. Please ensure MySQL is running.")
    } else {
      console.error("📄 Error details:", error.message)
    }

    console.log("\n🔧 Troubleshooting steps:")
    console.log("   1. Ensure MySQL server is running")
    console.log("   2. Verify database credentials in .env.local")
    console.log("   3. Check if database exists and user has permissions")
    console.log("   4. Verify network connectivity to database host")

    process.exit(1)
  } finally {
    if (connection) {
      await connection.end()
      console.log("\n🔌 Database connection closed.")
    }
  }
}

runMigration()
