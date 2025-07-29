import { executeQuery, executeQuerySingle } from "../database/connection"

export abstract class BaseService<T> {
  protected tableName: string

  constructor(tableName: string) {
    this.tableName = tableName
  }

  // Get all records
  async getAll(): Promise<T[]> {
    try {
      const query = `SELECT * FROM ${this.tableName} WHERE is_active = TRUE ORDER BY created_at DESC`
      return await executeQuery<T>(query)
    } catch (error) {
      console.error(`Error getting all ${this.tableName}:`, error)
      throw error
    }
  }

  // Get record by ID
  async getById(id: number): Promise<T | null> {
    try {
      const query = `SELECT * FROM ${this.tableName} WHERE id = ? AND is_active = TRUE`
      return await executeQuerySingle<T>(query, [id])
    } catch (error) {
      console.error(`Error getting ${this.tableName} by ID:`, error)
      throw error
    }
  }

  // Create new record
  async create(data: Partial<T>): Promise<T> {
    try {
      const fields = Object.keys(data).join(", ")
      const placeholders = Object.keys(data)
        .map(() => "?")
        .join(", ")
      const values = Object.values(data)

      const query = `INSERT INTO ${this.tableName} (${fields}) VALUES (${placeholders})`
      const result = await executeQuery(query, values)

      // Get the inserted record
      const insertId = (result as any).insertId
      const newRecord = await this.getById(insertId)

      if (!newRecord) {
        throw new Error("Failed to retrieve created record")
      }

      return newRecord
    } catch (error) {
      console.error(`Error creating ${this.tableName}:`, error)
      throw error
    }
  }

  // Update record
  async update(id: number, data: Partial<T>): Promise<T | null> {
    try {
      const fields = Object.keys(data)
        .map((key) => `${key} = ?`)
        .join(", ")
      const values = [...Object.values(data), id]

      const query = `UPDATE ${this.tableName} SET ${fields}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`
      await executeQuery(query, values)

      return await this.getById(id)
    } catch (error) {
      console.error(`Error updating ${this.tableName}:`, error)
      throw error
    }
  }

  // Soft delete record
  async delete(id: number): Promise<boolean> {
    try {
      const query = `UPDATE ${this.tableName} SET is_active = FALSE, updated_at = CURRENT_TIMESTAMP WHERE id = ?`
      await executeQuery(query, [id])
      return true
    } catch (error) {
      console.error(`Error deleting ${this.tableName}:`, error)
      throw error
    }
  }

  // Hard delete record (use with caution)
  async hardDelete(id: number): Promise<boolean> {
    try {
      const query = `DELETE FROM ${this.tableName} WHERE id = ?`
      await executeQuery(query, [id])
      return true
    } catch (error) {
      console.error(`Error hard deleting ${this.tableName}:`, error)
      throw error
    }
  }

  // Get records with pagination
  async getPaginated(
    page = 1,
    limit = 10,
  ): Promise<{
    data: T[]
    total: number
    page: number
    limit: number
    totalPages: number
  }> {
    try {
      const offset = (page - 1) * limit

      // Get total count
      const countQuery = `SELECT COUNT(*) as total FROM ${this.tableName} WHERE is_active = TRUE`
      const countResult = await executeQuerySingle<{ total: number }>(countQuery)
      const total = countResult?.total || 0

      // Get paginated data
      const dataQuery = `SELECT * FROM ${this.tableName} WHERE is_active = TRUE ORDER BY created_at DESC LIMIT ? OFFSET ?`
      const data = await executeQuery<T>(dataQuery, [limit, offset])

      return {
        data,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      }
    } catch (error) {
      console.error(`Error getting paginated ${this.tableName}:`, error)
      throw error
    }
  }

  // Search records
  async search(searchTerm: string, fields: string[]): Promise<T[]> {
    try {
      const searchConditions = fields.map((field) => `${field} LIKE ?`).join(" OR ")
      const searchValues = fields.map(() => `%${searchTerm}%`)

      const query = `SELECT * FROM ${this.tableName} WHERE is_active = TRUE AND (${searchConditions}) ORDER BY created_at DESC`
      return await executeQuery<T>(query, searchValues)
    } catch (error) {
      console.error(`Error searching ${this.tableName}:`, error)
      throw error
    }
  }
}
