"use client"

import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  onSnapshot,
  Timestamp,
  type DocumentData,
  type QuerySnapshot,
} from "firebase/firestore"
import { useFirebase } from "./hooks/use-firebase"

export class FirestoreService<T extends { id: string }> {
  private collectionName: string
  private isPublic: boolean

  constructor(collectionName: string, isPublic = true) {
    this.collectionName = collectionName
    this.isPublic = isPublic
  }

  private getCollectionPath(userId?: string): string {
    const appId = globalThis.__app_id || "fleetly-app"

    if (this.isPublic) {
      return `artifacts/${appId}/public/data/${this.collectionName}`
    } else {
      if (!userId) throw new Error("User ID required for private collections")
      return `artifacts/${appId}/users/${userId}/${this.collectionName}`
    }
  }

  async create(data: Omit<T, "id">, userId?: string): Promise<string> {
    const { db } = this.getFirebaseInstances()
    const collectionPath = this.getCollectionPath(userId)

    const docData = {
      ...data,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    }

    const docRef = await addDoc(collection(db, collectionPath), docData)
    return docRef.id
  }

  async getById(id: string, userId?: string): Promise<T | null> {
    const { db } = this.getFirebaseInstances()
    const collectionPath = this.getCollectionPath(userId)

    const docRef = doc(db, collectionPath, id)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as T
    }
    return null
  }

  async getAll(userId?: string): Promise<T[]> {
    const { db } = this.getFirebaseInstances()
    const collectionPath = this.getCollectionPath(userId)

    const querySnapshot = await getDocs(collection(db, collectionPath))
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as T)
  }

  async update(id: string, data: Partial<Omit<T, "id">>, userId?: string): Promise<void> {
    const { db } = this.getFirebaseInstances()
    const collectionPath = this.getCollectionPath(userId)

    const docRef = doc(db, collectionPath, id)
    await updateDoc(docRef, {
      ...data,
      updatedAt: Timestamp.now(),
    })
  }

  async delete(id: string, userId?: string): Promise<void> {
    const { db } = this.getFirebaseInstances()
    const collectionPath = this.getCollectionPath(userId)

    const docRef = doc(db, collectionPath, id)
    await deleteDoc(docRef)
  }

  async softDelete(id: string, userId?: string): Promise<void> {
    await this.update(
      id,
      {
        status: "deleted",
        deletedAt: Timestamp.now(),
      } as any,
      userId,
    )
  }

  async query(filters: Array<{ field: string; operator: any; value: any }>, userId?: string): Promise<T[]> {
    const { db } = this.getFirebaseInstances()
    const collectionPath = this.getCollectionPath(userId)

    let q = collection(db, collectionPath)

    // Apply filters
    filters.forEach((filter) => {
      q = query(q as any, where(filter.field, filter.operator, filter.value)) as any
    })

    const querySnapshot = await getDocs(q as any)
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as T)
  }

  onSnapshot(
    callback: (data: T[]) => void,
    userId?: string,
    filters?: Array<{ field: string; operator: any; value: any }>,
  ): () => void {
    const { db } = this.getFirebaseInstances()
    const collectionPath = this.getCollectionPath(userId)

    let q = collection(db, collectionPath)

    // Apply filters if provided
    if (filters) {
      filters.forEach((filter) => {
        q = query(q as any, where(filter.field, filter.operator, filter.value)) as any
      })
    }

    return onSnapshot(q as any, (snapshot: QuerySnapshot<DocumentData>) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as T)
      callback(data)
    })
  }

  private getFirebaseInstances() {
    // This is a simplified version - in a real app you'd use a hook or context
    const firebase = (globalThis as any).__firebase_instances
    if (!firebase?.db) {
      throw new Error("Firebase not initialized")
    }
    return firebase
  }
}

// Hook to use Firestore services with proper Firebase context
export function useFirestoreService<T extends { id: string }>(collectionName: string, isPublic = true) {
  const { db, user, loading } = useFirebase()

  if (!db && !loading) {
    throw new Error("Firestore not available")
  }

  const service = new FirestoreService<T>(collectionName, isPublic)

  // Override the getFirebaseInstances method to use the hook's instances
  ;(service as any).getFirebaseInstances = () => ({ db, user })

  return {
    service,
    userId: user?.uid,
    loading,
  }
}
