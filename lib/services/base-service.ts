import { executeQuery } from "@/lib/database/connection"

export abstract class BaseService {
  protected tableName: string

  constructor(tableName: string) {
    this.tableName = tableName
  }

  async findAll(): Promise<any[]> {
    const query = `SELECT * FROM ${this.tableName} ORDER BY created_at DESC`
    return await executeQuery(query)
  }

  async findById(id: string): Promise<any | null> {
    const query = `SELECT * FROM ${this.tableName} WHERE id = ?`
    const results = await executeQuery(query, [id])
    return results.length > 0 ? results[0] : null
  }

  async create(data: any): Promise<string> {
    const fields = Object.keys(data).join(", ")
    const placeholders = Object.keys(data)
      .map(() => "?")
      .join(", ")
    const values = Object.values(data)

    const query = `INSERT INTO ${this.tableName} (${fields}) VALUES (${placeholders})`
    await executeQuery(query, values)

    return data.id
  }

  async update(id: string, data: any): Promise<boolean> {
    const fields = Object.keys(data)
      .map((key) => `${key} = ?`)
      .join(", ")
    const values = [...Object.values(data), id]

    const query = `UPDATE ${this.tableName} SET ${fields} WHERE id = ?`
    const result = await executeQuery(query, values)

    return result.affectedRows > 0
  }

  async delete(id: string): Promise<boolean> {
    const query = `DELETE FROM ${this.tableName} WHERE id = ?`
    const result = await executeQuery(query, [id])

    return result.affectedRows > 0
  }

  async findByField(field: string, value: any): Promise<any[]> {
    const query = `SELECT * FROM ${this.tableName} WHERE ${field} = ?`
    return await executeQuery(query, [value])
  }

  async count(): Promise<number> {
    const query = `SELECT COUNT(*) as count FROM ${this.tableName}`
    const results = await executeQuery(query)
    return results[0].count
  }
}
