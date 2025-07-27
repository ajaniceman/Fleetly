"use client"

import { executeQuery, executeTransaction } from "../database/connection"
import type { PaginationOptions, FilterOptions, SortOptions } from "../types"

export interface BaseEntity {
  id: number
  created_at: Date
  updated_at: Date
  is_active: boolean
}

export interface CreateOptions {
  userId: number
  skipAudit?: boolean
}

export interface UpdateOptions {
  userId: number
  skipAudit?: boolean
}

export interface QueryOptions {
  limit?: number
  offset?: number
  orderBy?: string
  orderDirection?: "ASC" | "DESC"
  filters?: Record<string, any>
  includeInactive?: boolean
}

export abstract class BaseService<T extends BaseEntity> {
  protected tableName: string
  protected primaryKey = "id"

  constructor(tableName: string) {
    this.tableName = tableName
  }

  // Create a new record
  async create(data: Partial<T>, userId?: number): Promise<T> {
    try {
      const fields = Object.keys(data).join(", ")
      const placeholders = Object.keys(data)
        .map(() => "?")
        .join(", ")
      const values = Object.values(data)

      if (userId) {
        values.push(userId)
      }

      const query = `
        INSERT INTO ${this.tableName} (${fields}${userId ? ", created_by" : ""}) 
        VALUES (${placeholders}${userId ? ", ?" : ""})
      `

      const result = await executeQuery(query, values)
      const insertId = (result as any).insertId

      return await this.findById(insertId)
    } catch (error) {
      console.error(`Error creating ${this.tableName}:`, error)
      throw new Error(`Failed to create ${this.tableName}`)
    }
  }

  // Find record by ID
  async findById(id: number): Promise<T | null> {
    try {
      const query = `SELECT * FROM ${this.tableName} WHERE ${this.primaryKey} = ? AND is_active = TRUE`
      const results = await executeQuery<T>(query, [id])
      return results[0] || null
    } catch (error) {
      console.error(`Error finding ${this.tableName} by ID:`, error)
      throw new Error(`Failed to find ${this.tableName}`)
    }
  }

  // Find all records with pagination and filtering
  async findAll(
    options: {
      pagination?: PaginationOptions
      filters?: FilterOptions
      sort?: SortOptions
    } = {},
  ): Promise<{ data: T[]; total: number; page: number; limit: number }> {
    try {
      const { pagination = { page: 1, limit: 10 }, filters = {}, sort = {} } = options

      // Build WHERE clause
      let whereClause = "WHERE is_active = TRUE"
      const queryParams: any[] = []

      if (filters.search && filters.searchFields) {
        const searchConditions = filters.searchFields.map((field) => `${field} LIKE ?`).join(" OR ")
        whereClause += ` AND (${searchConditions})`
        filters.searchFields.forEach(() => queryParams.push(`%${filters.search}%`))
      }

      if (filters.status) {
        whereClause += " AND status = ?"
        queryParams.push(filters.status)
      }

      if (filters.dateFrom) {
        whereClause += " AND created_at >= ?"
        queryParams.push(filters.dateFrom)
      }

      if (filters.dateTo) {
        whereClause += " AND created_at <= ?"
        queryParams.push(filters.dateTo)
      }

      // Build ORDER BY clause
      let orderClause = ""
      if (sort.field && sort.direction) {
        orderClause = `ORDER BY ${sort.field} ${sort.direction.toUpperCase()}`
      } else {
        orderClause = "ORDER BY created_at DESC"
      }

      // Build LIMIT clause
      const offset = (pagination.page - 1) * pagination.limit
      const limitClause = `LIMIT ${pagination.limit} OFFSET ${offset}`

      // Get total count
      const countQuery = `SELECT COUNT(*) as total FROM ${this.tableName} ${whereClause}`
      const countResult = await executeQuery<{ total: number }>(countQuery, queryParams)
      const total = countResult[0]?.total || 0

      // Get data
      const dataQuery = `SELECT * FROM ${this.tableName} ${whereClause} ${orderClause} ${limitClause}`
      const data = await executeQuery<T>(dataQuery, queryParams)

      return {
        data,
        total,
        page: pagination.page,
        limit: pagination.limit,
      }
    } catch (error) {
      console.error(`Error finding all ${this.tableName}:`, error)
      throw new Error(`Failed to fetch ${this.tableName}`)
    }
  }

  // Update record by ID
  async update(id: number, data: Partial<T>, userId?: number): Promise<T> {
    try {
      const fields = Object.keys(data)
        .map((key) => `${key} = ?`)
        .join(", ")
      const values = [...Object.values(data), id]

      if (userId) {
        values.splice(-1, 0, userId) // Insert userId before id
      }

      const query = `
        UPDATE ${this.tableName} 
        SET ${fields}${userId ? ", updated_by = ?" : ""}, updated_at = CURRENT_TIMESTAMP 
        WHERE ${this.primaryKey} = ? AND is_active = TRUE
      `

      await executeQuery(query, values)
      return await this.findById(id)
    } catch (error) {
      console.error(`Error updating ${this.tableName}:`, error)
      throw new Error(`Failed to update ${this.tableName}`)
    }
  }

  // Soft delete record by ID
  async delete(id: number, userId?: number): Promise<boolean> {
    try {
      const values = [id]
      if (userId) {
        values.unshift(userId)
      }

      const query = `
        UPDATE ${this.tableName} 
        SET is_active = FALSE${userId ? ", updated_by = ?" : ""}, updated_at = CURRENT_TIMESTAMP 
        WHERE ${this.primaryKey} = ?
      `

      const result = await executeQuery(query, values)
      return (result as any).affectedRows > 0
    } catch (error) {
      console.error(`Error deleting ${this.tableName}:`, error)
      throw new Error(`Failed to delete ${this.tableName}`)
    }
  }

  // Hard delete record by ID (use with caution)
  async hardDelete(id: number): Promise<boolean> {
    try {
      const query = `DELETE FROM ${this.tableName} WHERE ${this.primaryKey} = ?`
      const result = await executeQuery(query, [id])
      return (result as any).affectedRows > 0
    } catch (error) {
      console.error(`Error hard deleting ${this.tableName}:`, error)
      throw new Error(`Failed to hard delete ${this.tableName}`)
    }
  }

  // Bulk operations
  async bulkCreate(records: Partial<T>[], userId?: number): Promise<T[]> {
    try {
      const queries = records.map((record) => {
        const fields = Object.keys(record).join(", ")
        const placeholders = Object.keys(record)
          .map(() => "?")
          .join(", ")
        const values = Object.values(record)

        if (userId) {
          values.push(userId)
        }

        return {
          query: `INSERT INTO ${this.tableName} (${fields}${userId ? ", created_by" : ""}) VALUES (${placeholders}${userId ? ", ?" : ""})`,
          params: values,
        }
      })

      await executeTransaction(queries)

      // Return the created records (simplified - in production you'd want to return actual IDs)
      return records as T[]
    } catch (error) {
      console.error(`Error bulk creating ${this.tableName}:`, error)
      throw new Error(`Failed to bulk create ${this.tableName}`)
    }
  }

  // Custom query execution
  protected async executeCustomQuery<R = any>(query: string, params: any[] = []): Promise<R[]> {
    return await executeQuery<R>(query, params)
  }

  // Validation helper
  protected validateRequired(data: any, requiredFields: string[]): void {
    const missingFields = requiredFields.filter((field) => !data[field])
    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(", ")}`)
    }
  }

  // Sanitization helper
  protected sanitizeInput(input: string): string {
    return input.trim().replace(/[<>]/g, "")
  }
}
