"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth"
import { notificationService } from "@/lib/services/notification-service"
import type { Notification } from "@/lib/types"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Bell, Check, CheckCheck } from "lucide-react"
import { useTranslation } from "react-i18next"

export function NotificationBell() {
  const { user } = useAuth()
  const { t } = useTranslation()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!user) return

    // Set up real-time listener for notifications
    const unsubscribe = notificationService.onSnapshot((notificationData) => {
      setNotifications(notificationData.sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis()))
      setUnreadCount(notificationData.filter((n) => !n.read).length)
    }, user.id)

    return unsubscribe
  }, [user])

  const markAsRead = async (notificationId: string) => {
    if (!user) return

    try {
      await notificationService.markAsRead(notificationId, user.id)
    } catch (error) {
      console.error("Error marking notification as read:", error)
    }
  }

  const markAllAsRead = async () => {
    if (!user) return

    setLoading(true)
    try {
      await notificationService.markAllAsRead(user.id)
    } catch (error) {
      console.error("Error marking all notifications as read:", error)
    } finally {
      setLoading(false)
    }
  }

  const getPriorityColor = (priority: Notification["priority"]) => {
    switch (priority) {
      case "critical":
        return "text-red-600"
      case "high":
        return "text-orange-600"
      case "medium":
        return "text-yellow-600"
      case "low":
        return "text-blue-600"
      default:
        return "text-gray-600"
    }
  }

  const getTypeIcon = (type: Notification["type"]) => {
    switch (type) {
      case "maintenance":
        return "🔧"
      case "license_expiry":
        return "📄"
      case "document_expiry":
        return "📋"
      case "incident":
        return "🚨"
      case "system":
        return "⚙️"
      default:
        return "📢"
    }
  }

  const formatTimeAgo = (timestamp: any) => {
    const now = new Date()
    const notificationTime = timestamp.toDate()
    const diffInMinutes = Math.floor((now.getTime() - notificationTime.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return "Just now"
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return `${Math.floor(diffInMinutes / 1440)}d ago`
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount > 99 ? "99+" : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 max-h-96 overflow-y-auto">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>{t("notifications.title")}</span>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllAsRead} disabled={loading} className="h-6 px-2 text-xs">
              <CheckCheck className="h-3 w-3 mr-1" />
              {t("notifications.markAllRead")}
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {notifications.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">{t("notifications.noNotifications")}</p>
          </div>
        ) : (
          notifications.slice(0, 10).map((notification) => (
            <DropdownMenuItem
              key={notification.id}
              className={`flex flex-col items-start p-3 cursor-pointer ${
                !notification.read ? "bg-blue-50 dark:bg-blue-900/20" : ""
              }`}
              onClick={() => {
                if (!notification.read) {
                  markAsRead(notification.id)
                }
                if (notification.actionUrl) {
                  window.location.href = notification.actionUrl
                }
              }}
            >
              <div className="flex items-start justify-between w-full">
                <div className="flex items-start space-x-2 flex-1">
                  <span className="text-lg">{getTypeIcon(notification.type)}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <p className={`text-sm font-medium truncate ${getPriorityColor(notification.priority)}`}>
                        {notification.title}
                      </p>
                      {!notification.read && <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0" />}
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">{notification.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{formatTimeAgo(notification.createdAt)}</p>
                  </div>
                </div>
                {!notification.read && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 ml-2"
                    onClick={(e) => {
                      e.stopPropagation()
                      markAsRead(notification.id)
                    }}
                  >
                    <Check className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </DropdownMenuItem>
          ))
        )}

        {notifications.length > 10 && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-center text-sm text-gray-500">View all notifications</DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
