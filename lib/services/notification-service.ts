import { BaseService } from "./base-service"
import type { Notification, CreateNotificationData } from "../types"

export class NotificationService extends BaseService<Notification> {
  constructor() {
    super("notifications")
  }

  // Create notification (client-side version - calls API)
  async createNotification(data: CreateNotificationData): Promise<boolean> {
    try {
      const response = await fetch("/api/notifications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()
      return result.success || false
    } catch (error) {
      console.error("Error creating notification:", error)
      return false
    }
  }

  // Get unread notifications for user (client-side version)
  async getUnreadNotifications(userId: number): Promise<Notification[]> {
    try {
      const response = await fetch(`/api/notifications/unread?userId=${userId}`)
      const result = await response.json()
      return result.notifications || []
    } catch (error) {
      console.error("Error getting unread notifications:", error)
      return []
    }
  }

  // Get notification count for user (client-side version)
  async getNotificationCount(userId: number): Promise<number> {
    try {
      const response = await fetch(`/api/notifications/count?userId=${userId}`)
      const result = await response.json()
      return result.count || 0
    } catch (error) {
      console.error("Error getting notification count:", error)
      return 0
    }
  }

  // Mark notification as read (client-side version)
  async markAsRead(notificationId: number, userId: number): Promise<void> {
    try {
      await fetch(`/api/notifications/${notificationId}/read`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      })
    } catch (error) {
      console.error("Error marking notification as read:", error)
    }
  }

  // Mark all notifications as read for user (client-side version)
  async markAllAsRead(userId: number): Promise<void> {
    try {
      await fetch("/api/notifications/mark-all-read", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      })
    } catch (error) {
      console.error("Error marking all notifications as read:", error)
    }
  }

  // Mock real-time listener for client-side
  onSnapshot(callback: (notifications: Notification[]) => void, userId: number) {
    // Simulate real-time updates with polling
    const interval = setInterval(async () => {
      const notifications = await this.getUnreadNotifications(userId)
      callback(notifications)
    }, 5000) // Poll every 5 seconds

    // Return cleanup function
    return () => clearInterval(interval)
  }
}

export const notificationService = new NotificationService()
