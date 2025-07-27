"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Car, Users, Wrench, Fuel, AlertTriangle, TrendingUp, Settings, X, FileText, LogOut } from "lucide-react"
import { useAuth } from "@/lib/auth"

const navigationItems = [
  { name: "Dashboard", icon: TrendingUp, href: "/dashboard" },
  { name: "Vehicles", icon: Car, href: "/vehicles" },
  { name: "Drivers", icon: Users, href: "/drivers" },
  { name: "Maintenance", icon: Wrench, href: "/maintenance" },
  { name: "Fuel", icon: Fuel, href: "/fuel" },
  { name: "Incidents", icon: AlertTriangle, href: "/incidents" },
  { name: "Reports", icon: FileText, href: "/reports" },
  { name: "Settings", icon: Settings, href: "/settings" },
]

interface SidebarProps {
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
}

export function Sidebar({ sidebarOpen, setSidebarOpen }: SidebarProps) {
  const pathname = usePathname()
  const { logout } = useAuth()

  return (
    <>
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
          <div className="fixed inset-y-0 left-0 flex w-64 flex-col bg-white dark:bg-gray-800 shadow-xl">
            <div className="flex h-16 items-center justify-between px-4">
              <div className="flex items-center">
                <Car className="h-8 w-8 text-blue-600" />
                <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">Fleetly</span>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            <nav className="flex-1 space-y-1 px-2 py-4">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-lg ${
                    pathname === item.href
                      ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              ))}
            </nav>
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <Button
                variant="ghost"
                className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={logout}
              >
                <LogOut className="mr-3 h-5 w-5" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
          <div className="flex h-16 items-center px-4">
            <Car className="h-8 w-8 text-blue-600" />
            <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">Fleetly</span>
          </div>
          <nav className="flex-1 space-y-1 px-2 py-4">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`group flex items-center px-2 py-2 text-sm font-medium rounded-lg ${
                  pathname === item.href
                    ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
                }`}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </Link>
            ))}
          </nav>
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <Button
              variant="ghost"
              className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={logout}
            >
              <LogOut className="mr-3 h-5 w-5" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
