const mysql = require("mysql2/promise")
require("dotenv").config({ path: ".env.local" })

async function runMigration() {
  console.log("🚀 Starting database migration...\n")

  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  })

  try {
    console.log("✅ Connected to MySQL database")

    // Read and execute schema
    const fs = require("fs")
    const path = require("path")
    const schemaPath = path.join(__dirname, "..", "database", "schema.sql")

    if (!fs.existsSync(schemaPath)) {
      console.error("❌ Schema file not found at:", schemaPath)
      return
    }

    const schema = fs.readFileSync(schemaPath, "utf8")
    const statements = schema.split(";").filter((stmt) => stmt.trim().length > 0)

    console.log(`📝 Executing ${statements.length} SQL statements...\n`)

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i].trim()
      if (statement) {
        try {
          await connection.execute(statement)
          console.log(`✅ Statement ${i + 1}/${statements.length} executed successfully`)
        } catch (error) {
          if (error.code === "ER_TABLE_EXISTS_ERROR") {
            console.log(`⚠️  Statement ${i + 1}/${statements.length} - Table already exists, skipping`)
          } else {
            console.error(`❌ Statement ${i + 1}/${statements.length} failed:`, error.message)
          }
        }
      }
    }

    console.log("\n🎉 Database migration completed successfully!")
    console.log("Your Fleetly database is ready to use.")
  } catch (error) {
    console.error("❌ Migration failed:", error.message)
    console.log("\n🔧 Troubleshooting tips:")
    console.log("1. Make sure MySQL is running")
    console.log("2. Check your database credentials in .env.local")
    console.log("3. Ensure the database exists and user has proper permissions")
  } finally {
    await connection.end()
  }
}

runMigration()
