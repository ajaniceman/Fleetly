"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { User, Settings, LogOut, Moon, Sun, Truck } from "lucide-react"
import { useTranslation } from "react-i18next"
import { useTheme } from "next-themes"
import { LanguageSelector } from "@/components/language-selector"
import { CurrencySelector } from "@/components/currency-selector"
import { NotificationBell } from "@/components/notification-bell"
import { AuthService } from "@/lib/auth"
import type { User as UserType } from "@/lib/types"

export function Header() {
  const { t } = useTranslation()
  const { theme, setTheme } = useTheme()
  const router = useRouter()
  const [user, setUser] = useState<UserType | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    // Load user data from localStorage
    const { user: storedUser } = AuthService.getStoredAuthData()
    setUser(storedUser)
  }, [])

  const handleLogout = () => {
    AuthService.logout()
    router.push("/login")
  }

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  const getUserInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  if (!mounted) {
    return null // Avoid hydration mismatch
  }

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center space-x-2">
            <Truck className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">Fleetly</span>
          </Link>

          {/* Right side controls */}
          <div className="flex items-center space-x-4">
            {/* Language Selector */}
            <LanguageSelector />

            {/* Currency Selector */}
            <CurrencySelector />

            {/* Theme Toggle */}
            <Button variant="ghost" size="sm" onClick={toggleTheme} className="h-8 w-8 p-0">
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              <span className="sr-only">{t("common.toggle_theme")}</span>
            </Button>

            {/* Notifications */}
            {user && <NotificationBell />}

            {/* User Menu */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={(user as any).avatar_url || "/placeholder.svg"} alt={(user as any).name} />
                      <AvatarFallback>{getUserInitials((user as any).name)}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{(user as any).name}</p>
                      <p className="text-xs leading-none text-muted-foreground">{(user as any).email}</p>
                      {(user as any).role_name && (
                        <Badge variant="secondary" className="w-fit text-xs">
                          {(user as any).role_name}
                        </Badge>
                      )}
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      <span>{t("common.profile")}</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings" className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>{t("common.settings")}</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>{t("common.logout")}</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    {t("common.login")}
                  </Button>
                </Link>
                <Link href="/login">
                  <Button size="sm">{t("common.get_started")}</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
