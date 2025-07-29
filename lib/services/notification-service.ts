"use client"

import type { Notification } from "@/lib/types"

export class NotificationService {
  private static instance: NotificationService
  private notifications: Notification[] = []
  private listeners: ((notifications: Notification[]) => void)[] = []

  private constructor() {
    // Initialize with mock notifications
    this.notifications = [
      {
        id: "1",
        type: "maintenance",
        title: "Maintenance Due",
        message: "Vehicle ABC-123 is due for maintenance",
        read: false,
        createdAt: new Date().toISOString(),
        userId: "current-user",
      },
      {
        id: "2",
        type: "license_expiry",
        title: "License Expiry",
        message: "Driver license for Sarah Johnson expires in 30 days",
        read: false,
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        userId: "current-user",
      },
    ]
  }

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService()
    }
    return NotificationService.instance
  }

  getNotifications(): Notification[] {
    return this.notifications
  }

  getUnreadCount(): number {
    return this.notifications.filter((n) => !n.read).length
  }

  markAsRead(id: string): void {
    this.notifications = this.notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
    this.notifyListeners()
  }

  markAllAsRead(): void {
    this.notifications = this.notifications.map((n) => ({ ...n, read: true }))
    this.notifyListeners()
  }

  addNotification(notification: Omit<Notification, "id" | "createdAt">): void {
    const newNotification: Notification = {
      ...notification,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
    }
    this.notifications.unshift(newNotification)
    this.notifyListeners()
  }

  subscribe(listener: (notifications: Notification[]) => void): () => void {
    this.listeners.push(listener)
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener)
    }
  }

  private notifyListeners(): void {
    this.listeners.forEach((listener) => listener(this.notifications))
  }

  // Client-side email notification methods that call API routes
  async sendMaintenanceReminder(vehicleId: string, dueDate: string): Promise<void> {
    try {
      const response = await fetch("/api/email/maintenance-reminder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vehicleId, dueDate }),
      })

      if (!response.ok) {
        throw new Error("Failed to send maintenance reminder")
      }
    } catch (error) {
      console.error("Error sending maintenance reminder:", error)
      throw error
    }
  }

  async sendLicenseExpiryAlert(driverId: string, expiryDate: string): Promise<void> {
    try {
      const response = await fetch("/api/email/license-expiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ driverId, expiryDate }),
      })

      if (!response.ok) {
        throw new Error("Failed to send license expiry alert")
      }
    } catch (error) {
      console.error("Error sending license expiry alert:", error)
      throw error
    }
  }

  async sendWelcomeEmail(userEmail: string, userName: string): Promise<void> {
    try {
      const response = await fetch("/api/email/welcome", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userEmail, userName }),
      })

      if (!response.ok) {
        throw new Error("Failed to send welcome email")
      }
    } catch (error) {
      console.error("Error sending welcome email:", error)
      throw error
    }
  }
}

export const notificationService = NotificationService.getInstance()
