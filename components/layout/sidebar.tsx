"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Car, Users, Wrench, Fuel, AlertTriangle, BarChart3, Settings, Menu, X, Home } from "lucide-react"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Vehicles", href: "/vehicles", icon: Car },
  { name: "Drivers", href: "/drivers", icon: Users },
  { name: "Maintenance", href: "/maintenance", icon: Wrench },
  { name: "Fuel", href: "/fuel", icon: Fuel },
  { name: "Incidents", href: "/incidents", icon: AlertTriangle },
  { name: "Reports", href: "/reports", icon: BarChart3 },
  { name: "Settings", href: "/settings", icon: Settings },
]

interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <div className={cn("flex flex-col h-full bg-gray-900 text-white", className)}>
      <div className="flex items-center justify-between p-4">
        <div className={cn("flex items-center space-x-2", isCollapsed && "justify-center")}>
          <Car className="h-8 w-8 text-blue-400" />
          {!isCollapsed && <span className="text-xl font-bold">Fleetly</span>}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-gray-400 hover:text-white"
        >
          {isCollapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
        </Button>
      </div>

      <ScrollArea className="flex-1 px-3">
        <nav className="space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link key={item.name} href={item.href}>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start text-left",
                    isActive
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "text-gray-300 hover:text-white hover:bg-gray-800",
                    isCollapsed && "justify-center px-2",
                  )}
                >
                  <item.icon className={cn("h-4 w-4", !isCollapsed && "mr-2")} />
                  {!isCollapsed && item.name}
                </Button>
              </Link>
            )
          })}
        </nav>
      </ScrollArea>

      <div className="p-4 border-t border-gray-800">
        <div className={cn("text-xs text-gray-400", isCollapsed && "text-center")}>
          {!isCollapsed && "© 2024 Fleetly"}
        </div>
      </div>
    </div>
  )
}
