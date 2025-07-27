import { BaseService } from "./base-service"
import { executeQuery } from "../database/connection"
import { EmailService } from "./email-service"
import type { Notification, CreateNotificationData } from "../types"

export class NotificationService extends BaseService<Notification> {
  private emailService: EmailService

  constructor() {
    super("notifications")
    this.emailService = new EmailService()
  }

  // Create notification and optionally send email
  async createNotification(data: CreateNotificationData): Promise<Notification> {
    try {
      const notification = await this.create(data)

      // Send email if user has email notifications enabled
      if (data.sendEmail !== false) {
        await this.sendEmailNotification(notification)
      }

      return notification
    } catch (error) {
      console.error("Error creating notification:", error)
      throw error
    }
  }

  // Get unread notifications for user
  async getUnreadNotifications(userId: number): Promise<Notification[]> {
    try {
      const query = `
        SELECT * FROM notifications 
        WHERE user_id = ? AND is_read = FALSE 
        AND (expires_at IS NULL OR expires_at > NOW())
        ORDER BY priority DESC, created_at DESC
      `
      return await executeQuery<Notification>(query, [userId])
    } catch (error) {
      console.error("Error getting unread notifications:", error)
      throw error
    }
  }

  // Get notification count for user
  async getNotificationCount(userId: number): Promise<number> {
    try {
      const query = `
        SELECT COUNT(*) as count 
        FROM notifications 
        WHERE user_id = ? AND is_read = FALSE 
        AND (expires_at IS NULL OR expires_at > NOW())
      `
      const results = await executeQuery<{ count: number }>(query, [userId])
      return results[0]?.count || 0
    } catch (error) {
      console.error("Error getting notification count:", error)
      return 0
    }
  }

  // Mark notification as read
  async markAsRead(notificationId: number, userId: number): Promise<void> {
    try {
      const query = `
        UPDATE notifications 
        SET is_read = TRUE, updated_at = CURRENT_TIMESTAMP 
        WHERE id = ? AND user_id = ?
      `
      await executeQuery(query, [notificationId, userId])
    } catch (error) {
      console.error("Error marking notification as read:", error)
      throw error
    }
  }

  // Mark all notifications as read for user
  async markAllAsRead(userId: number): Promise<void> {
    try {
      const query = `
        UPDATE notifications 
        SET is_read = TRUE, updated_at = CURRENT_TIMESTAMP 
        WHERE user_id = ? AND is_read = FALSE
      `
      await executeQuery(query, [userId])
    } catch (error) {
      console.error("Error marking all notifications as read:", error)
      throw error
    }
  }

  // Send email notification
  private async sendEmailNotification(notification: Notification): Promise<void> {
    try {
      // Get user email and preferences
      const userQuery = `
        SELECT email, name, email_notifications, language_preference 
        FROM users 
        WHERE id = ? AND is_active = TRUE
      `
      const users = await executeQuery<{
        email: string
        name: string
        email_notifications: boolean
        language_preference: string
      }>(userQuery, [(notification as any).user_id])

      const user = users[0]
      if (!user || !user.email_notifications) {
        return
      }

      // Send email based on notification type
      await this.emailService.sendNotificationEmail({
        to: user.email,
        name: user.name,
        type: (notification as any).type,
        title: (notification as any).title,
        message: (notification as any).message,
        actionUrl: (notification as any).action_url,
        language: user.language_preference,
      })

      // Update notification to mark email as sent
      await this.update((notification as any).id, {
        email_sent: true,
        email_sent_at: new Date().toISOString(),
      } as any)
    } catch (error) {
      console.error("Error sending email notification:", error)
    }
  }

  // Create maintenance reminder notifications
  async createMaintenanceReminders(): Promise<void> {
    try {
      // Get maintenance records due soon
      const query = `
        SELECT mr.*, v.license_plate, v.make, v.model,
               DATEDIFF(mr.due_date, CURDATE()) as days_until_due
        FROM maintenance_records mr
        JOIN vehicles v ON mr.vehicle_id = v.id
        WHERE mr.status = 'scheduled' 
        AND mr.due_date BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 30 DAY)
        AND mr.is_active = TRUE
      `

      const maintenanceRecords = await executeQuery<any>(query)

      // Get reminder settings
      const settingsQuery = `
        SELECT setting_value 
        FROM system_settings 
        WHERE setting_key = 'maintenance_reminder_days'
      `
      const settingsResult = await executeQuery<{ setting_value: string }>(settingsQuery)
      const reminderDays = settingsResult[0] ? JSON.parse(settingsResult[0].setting_value) : [30, 15, 7, 3]

      // Create notifications for each maintenance record
      for (const record of maintenanceRecords) {
        if (reminderDays.includes(record.days_until_due)) {
          // Get users who should receive this notification
          const usersQuery = `
            SELECT id FROM users 
            WHERE maintenance_alerts = TRUE AND is_active = TRUE
          `
          const users = await executeQuery<{ id: number }>(usersQuery)

          // Create notification for each user
          for (const user of users) {
            await this.createNotification({
              user_id: user.id,
              type: "maintenance_reminder",
              title: `Maintenance Due: ${record.license_plate}`,
              message: `${record.service_type} maintenance is due in ${record.days_until_due} days for vehicle ${record.license_plate} (${record.make} ${record.model})`,
              priority: record.days_until_due <= 3 ? "high" : "medium",
              action_url: `/maintenance/${record.id}`,
              related_entity_type: "maintenance_record",
              related_entity_id: record.id,
              expires_at: record.due_date,
            })
          }
        }
      }
    } catch (error) {
      console.error("Error creating maintenance reminders:", error)
    }
  }

  // Create license expiry notifications
  async createLicenseExpiryReminders(): Promise<void> {
    try {
      // Get drivers with licenses expiring soon
      const query = `
        SELECT d.*, DATEDIFF(d.license_expiry, CURDATE()) as days_until_expiry
        FROM drivers d
        WHERE d.license_expiry BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 90 DAY)
        AND d.is_active = TRUE
      `

      const drivers = await executeQuery<any>(query)

      // Get reminder settings
      const settingsQuery = `
        SELECT setting_value 
        FROM system_settings 
        WHERE setting_key = 'license_expiry_reminder_days'
      `
      const settingsResult = await executeQuery<{ setting_value: string }>(settingsQuery)
      const reminderDays = settingsResult[0] ? JSON.parse(settingsResult[0].setting_value) : [90, 30, 15, 7]

      // Create notifications
      for (const driver of drivers) {
        if (reminderDays.includes(driver.days_until_expiry)) {
          const usersQuery = `
            SELECT id FROM users 
            WHERE maintenance_alerts = TRUE AND is_active = TRUE
          `
          const users = await executeQuery<{ id: number }>(usersQuery)

          for (const user of users) {
            await this.createNotification({
              user_id: user.id,
              type: "license_expiry",
              title: `License Expiry: ${driver.name}`,
              message: `Driver ${driver.name}'s license expires in ${driver.days_until_expiry} days`,
              priority: driver.days_until_expiry <= 7 ? "critical" : "high",
              action_url: `/drivers/${driver.id}`,
              related_entity_type: "driver",
              related_entity_id: driver.id,
              expires_at: driver.license_expiry,
            })
          }
        }
      }
    } catch (error) {
      console.error("Error creating license expiry reminders:", error)
    }
  }

  // Create incident alert
  async createIncidentAlert(incidentId: number): Promise<void> {
    try {
      // Get incident details
      const query = `
        SELECT i.*, v.license_plate, d.name as driver_name
        FROM incidents i
        JOIN vehicles v ON i.vehicle_id = v.id
        JOIN drivers d ON i.driver_id = d.id
        WHERE i.id = ?
      `
      const incidents = await executeQuery<any>(query, [incidentId])
      const incident = incidents[0]

      if (!incident) return

      // Get users who should receive incident alerts
      const usersQuery = `
        SELECT id FROM users 
        WHERE incident_alerts = TRUE AND is_active = TRUE
      `
      const users = await executeQuery<{ id: number }>(usersQuery)

      // Create notification for each user
      for (const user of users) {
        await this.createNotification({
          user_id: user.id,
          type: "incident_alert",
          title: `New Incident: ${incident.incident_id}`,
          message: `${incident.type} incident reported for vehicle ${incident.license_plate} driven by ${incident.driver_name}`,
          priority: incident.severity === "critical" ? "critical" : "high",
          action_url: `/incidents/${incident.id}`,
          related_entity_type: "incident",
          related_entity_id: incident.id,
        })
      }
    } catch (error) {
      console.error("Error creating incident alert:", error)
    }
  }

  // Clean up expired notifications
  async cleanupExpiredNotifications(): Promise<void> {
    try {
      const query = `
        DELETE FROM notifications 
        WHERE expires_at IS NOT NULL AND expires_at < NOW()
      `
      await executeQuery(query)
    } catch (error) {
      console.error("Error cleaning up expired notifications:", error)
    }
  }

  // Schedule all notification checks (to be called by cron job)
  async runScheduledNotifications(): Promise<void> {
    try {
      console.log("🔔 Running scheduled notifications...")

      await Promise.all([
        this.createMaintenanceReminders(),
        this.createLicenseExpiryReminders(),
        this.cleanupExpiredNotifications(),
      ])

      console.log("✅ Scheduled notifications completed")
    } catch (error) {
      console.error("Error running scheduled notifications:", error)
    }
  }
}
