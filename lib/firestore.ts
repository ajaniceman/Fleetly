// Mock Firestore service for development
export class FirestoreService {
  private static instance: FirestoreService
  private data: Map<string, any[]> = new Map()

  private constructor() {
    // Initialize with mock data
    this.data.set("vehicles", [])
    this.data.set("drivers", [])
    this.data.set("maintenance", [])
    this.data.set("fuel", [])
    this.data.set("users", [])
  }

  static getInstance(): FirestoreService {
    if (!FirestoreService.instance) {
      FirestoreService.instance = new FirestoreService()
    }
    return FirestoreService.instance
  }

  async getCollection(collection: string): Promise<any[]> {
    return this.data.get(collection) || []
  }

  async addDocument(collection: string, document: any): Promise<string> {
    const id = Math.random().toString(36).substr(2, 9)
    const newDoc = { ...document, id }

    const existing = this.data.get(collection) || []
    this.data.set(collection, [...existing, newDoc])

    return id
  }

  async updateDocument(collection: string, id: string, updates: any): Promise<void> {
    const existing = this.data.get(collection) || []
    const index = existing.findIndex((doc) => doc.id === id)

    if (index !== -1) {
      existing[index] = { ...existing[index], ...updates }
      this.data.set(collection, existing)
    }
  }

  async deleteDocument(collection: string, id: string): Promise<void> {
    const existing = this.data.get(collection) || []
    const filtered = existing.filter((doc) => doc.id !== id)
    this.data.set(collection, filtered)
  }
}

export const firestore = FirestoreService.getInstance()
