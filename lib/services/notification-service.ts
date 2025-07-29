import { BaseService } from "./base-service"
import type { Notification } from "@/lib/types"
import { executeQuery } from "@/lib/database/connection"

export class NotificationService extends BaseService {
  constructor() {
    super("notifications")
  }

  async createNotification(notificationData: Omit<Notification, "id" | "createdAt">): Promise<string> {
    const id = this.generateId()

    const notification = {
      id,
      user_id: notificationData.userId,
      type: notificationData.type,
      title: notificationData.title,
      message: notificationData.message,
      read_status: notificationData.read,
      created_at: new Date(),
    }

    await this.create(notification)
    return id
  }

  async getNotificationsForUser(userId: string, limit = 50): Promise<Notification[]> {
    const query = `
      SELECT * FROM notifications 
      WHERE user_id = ? 
      ORDER BY created_at DESC 
      LIMIT ?
    `
    const results = await executeQuery(query, [userId, limit])

    return results.map(this.mapToNotification)
  }

  async getUnreadNotificationsForUser(userId: string): Promise<Notification[]> {
    const query = `
      SELECT * FROM notifications 
      WHERE user_id = ? AND read_status = FALSE 
      ORDER BY created_at DESC
    `
    const results = await executeQuery(query, [userId])

    return results.map(this.mapToNotification)
  }

  async markAsRead(notificationId: string): Promise<boolean> {
    return await this.update(notificationId, {
      read_status: true,
    })
  }

  async markAllAsReadForUser(userId: string): Promise<boolean> {
    const query = "UPDATE notifications SET read_status = TRUE WHERE user_id = ?"
    const result = await executeQuery(query, [userId])
    return result.affectedRows > 0
  }

  async getUnreadCount(userId: string): Promise<number> {
    const query = "SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND read_status = FALSE"
    const results = await executeQuery(query, [userId])
    return results[0].count
  }

  async deleteOldNotifications(daysOld = 30): Promise<number> {
    const query = `
      DELETE FROM notifications 
      WHERE created_at < DATE_SUB(NOW(), INTERVAL ? DAY)
    `
    const result = await executeQuery(query, [daysOld])
    return result.affectedRows
  }

  // Specific notification creators
  async createMaintenanceReminder(userId: string, vehicleId: string, description: string): Promise<string> {
    return await this.createNotification({
      userId,
      type: "maintenance",
      title: "Maintenance Reminder",
      message: `Vehicle ${vehicleId}: ${description}`,
      read: false,
    })
  }

  async createLicenseExpiryAlert(userId: string, driverName: string, expiryDate: string): Promise<string> {
    return await this.createNotification({
      userId,
      type: "license_expiry",
      title: "License Expiry Alert",
      message: `${driverName}'s license expires on ${expiryDate}`,
      read: false,
    })
  }

  async createIncidentAlert(userId: string, vehicleId: string, incidentType: string): Promise<string> {
    return await this.createNotification({
      userId,
      type: "incident",
      title: "Incident Reported",
      message: `${incidentType} reported for vehicle ${vehicleId}`,
      read: false,
    })
  }

  private mapToNotification(row: any): Notification {
    return {
      id: row.id,
      userId: row.user_id,
      type: row.type,
      title: row.title,
      message: row.message,
      read: row.read_status,
      createdAt: row.created_at,
    }
  }

  private generateId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9)
  }
}

export const notificationService = new NotificationService()
