// Mock Firestore service for development
export class FirestoreService {
  private mockData: any = {}

  async get(collection: string, id?: string) {
    if (id) {
      return this.mockData[collection]?.[id] || null
    }
    return Object.values(this.mockData[collection] || {})
  }

  async add(collection: string, data: any) {
    if (!this.mockData[collection]) {
      this.mockData[collection] = {}
    }
    const id = Date.now().toString()
    this.mockData[collection][id] = { ...data, id }
    return id
  }

  async update(collection: string, id: string, data: any) {
    if (this.mockData[collection]?.[id]) {
      this.mockData[collection][id] = { ...this.mockData[collection][id], ...data }
      return true
    }
    return false
  }

  async delete(collection: string, id: string) {
    if (this.mockData[collection]?.[id]) {
      delete this.mockData[collection][id]
      return true
    }
    return false
  }

  async query(collection: string, filters: any[] = []) {
    const items = Object.values(this.mockData[collection] || {})
    // Simple mock filtering - in real implementation, apply filters
    return items
  }
}

export const firestore = new FirestoreService()
