// Mock Firestore service for development
export class FirestoreService {
  private mockData: Record<string, any[]> = {
    vehicles: [],
    drivers: [],
    maintenance: [],
    fuel: [],
    incidents: [],
    notifications: [],
  }

  async collection(name: string) {
    return {
      get: async () => ({
        docs:
          this.mockData[name]?.map((item, index) => ({
            id: index.toString(),
            data: () => item,
          })) || [],
      }),
      add: async (data: any) => {
        if (!this.mockData[name]) {
          this.mockData[name] = []
        }
        this.mockData[name].push(data)
        return { id: this.mockData[name].length.toString() }
      },
      doc: (id: string) => ({
        get: async () => ({
          exists: true,
          data: () => this.mockData[name]?.[Number.parseInt(id)] || null,
        }),
        set: async (data: any) => {
          if (!this.mockData[name]) {
            this.mockData[name] = []
          }
          this.mockData[name][Number.parseInt(id)] = data
        },
        update: async (data: any) => {
          if (this.mockData[name]?.[Number.parseInt(id)]) {
            this.mockData[name][Number.parseInt(id)] = {
              ...this.mockData[name][Number.parseInt(id)],
              ...data,
            }
          }
        },
        delete: async () => {
          if (this.mockData[name]) {
            this.mockData[name].splice(Number.parseInt(id), 1)
          }
        },
      }),
    }
  }

  async enableNetwork() {
    console.log("Firestore network enabled")
  }

  async disableNetwork() {
    console.log("Firestore network disabled")
  }
}

export const db = new FirestoreService()
