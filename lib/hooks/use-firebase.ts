"use client"

import { useState, useEffect } from "react"
import { initializeApp, type FirebaseApp } from "firebase/app"
import { getFirestore, type Firestore, connectFirestoreEmulator } from "firebase/firestore"
import {
  getAuth,
  type Auth,
  signInWithCustomToken,
  signInAnonymously,
  onAuthStateChanged,
  type User,
} from "firebase/auth"

// Global variables that should be available in Canvas environment
declare global {
  var __firebase_config: any
  var __app_id: string
  var __initial_auth_token: string
}

interface UseFirebaseReturn {
  app: FirebaseApp | null
  db: Firestore | null
  auth: Auth | null
  user: User | null
  loading: boolean
  displayUserId: string
  error: string | null
  isConnected: boolean
  connect: () => void
  disconnect: () => void
}

let firebaseApp: FirebaseApp | null = null
let firestoreDb: Firestore | null = null
let firebaseAuth: Auth | null = null

export function useFirebase(): UseFirebaseReturn {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [displayUserId, setDisplayUserId] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    const initializeFirebase = async () => {
      try {
        // Initialize Firebase if not already done
        if (!firebaseApp) {
          const firebaseConfig = globalThis.__firebase_config || {
            // Fallback config for development
            apiKey: "demo-api-key",
            authDomain: "demo-project.firebaseapp.com",
            projectId: "demo-project",
            storageBucket: "demo-project.appspot.com",
            messagingSenderId: "123456789",
            appId: "demo-app-id",
          }

          firebaseApp = initializeApp(firebaseConfig, globalThis.__app_id || "fleetly-app")
          firebaseAuth = getAuth(firebaseApp)
          firestoreDb = getFirestore(firebaseApp)

          // Connect to emulator in development
          if (process.env.NODE_ENV === "development" && !globalThis.__firebase_config) {
            try {
              connectFirestoreEmulator(firestoreDb, "localhost", 8080)
            } catch (e) {
              // Emulator already connected or not available
            }
          }
        }

        // Set up auth state listener
        const unsubscribe = onAuthStateChanged(firebaseAuth!, async (firebaseUser) => {
          if (firebaseUser) {
            setUser(firebaseUser)
            setDisplayUserId(firebaseUser.uid)
          } else {
            // Try to authenticate
            try {
              let authUser: User

              if (globalThis.__initial_auth_token) {
                // Use custom token if available
                const credential = await signInWithCustomToken(firebaseAuth!, globalThis.__initial_auth_token)
                authUser = credential.user
              } else {
                // Fall back to anonymous auth
                const credential = await signInAnonymously(firebaseAuth!)
                authUser = credential.user
              }

              setUser(authUser)
              setDisplayUserId(authUser.uid)
            } catch (authError) {
              console.error("Authentication failed:", authError)
              setError("Authentication failed")
              // Generate a fallback user ID for offline mode
              const fallbackId = crypto.randomUUID()
              setDisplayUserId(fallbackId)
            }
          }
          setLoading(false)
        })

        setIsConnected(true)
        return unsubscribe
      } catch (initError) {
        console.error("Firebase initialization failed:", initError)
        setError("Firebase initialization failed")
        setLoading(false)
        // Generate a fallback user ID for offline mode
        const fallbackId = crypto.randomUUID()
        setDisplayUserId(fallbackId)
      }
    }

    const unsubscribe = initializeFirebase()

    return () => {
      if (unsubscribe && typeof unsubscribe === "function") {
        unsubscribe()
      }
      setIsConnected(false)
    }
  }, [])

  return {
    app: firebaseApp,
    db: firestoreDb,
    auth: firebaseAuth,
    user,
    loading,
    displayUserId,
    error,
    isConnected,
    connect: () => setIsConnected(true),
    disconnect: () => setIsConnected(false),
  }
}
