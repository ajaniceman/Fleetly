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
    multipleStatements: true,
  })

  try {
    // Read and execute schema
    const schemaPath = path.join(__dirname, "..", "database", "schema.sql")
    const schema = fs.readFileSync(schemaPath, "utf8")

    console.log("📋 Executing database schema...")
    await connection.execute(schema)
    console.log("✅ Database schema created successfully!")

    // Insert default admin user
    console.log("👤 Creating default admin user...")
    const bcrypt = require("bcryptjs")
    const hashedPassword = await bcrypt.hash("admin123", 10)

    await connection.execute(
      `
      INSERT IGNORE INTO users (email, password, firstName, lastName, role, isActive) 
      VALUES (?, ?, ?, ?, ?, ?)
    `,
      ["admin@fleetly.com", hashedPassword, "Admin", "User", "admin", true],
    )

    console.log("✅ Default admin user created!")
    console.log("   Email: admin@fleetly.com")
    console.log("   Password: admin123")
    console.log("   ⚠️  Please change this password after first login!\n")

    console.log("🎉 Database migration completed successfully!")
  } catch (error) {
    console.error("❌ Migration failed:", error.message)
    process.exit(1)
  } finally {
    await connection.end()
  }
}

runMigrations()
