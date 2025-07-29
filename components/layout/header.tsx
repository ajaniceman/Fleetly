"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { NotificationBell } from "@/components/notification-bell"
import { LanguageSelector } from "@/components/language-selector"
import { CurrencySelector } from "@/components/currency-selector"
import { ModeToggle } from "@/components/mode-toggle"
import { User, LogOut } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { Language } from "@/lib/i18n"

export function Header() {
  const [currentLanguage, setCurrentLanguage] = useState<Language>("en")
  const [currentCurrency, setCurrentCurrency] = useState("USD")

  const handleSignOut = () => {
    // Handle sign out logic
    window.location.href = "/login"
  }

  return (
    <header className="flex h-16 items-center justify-between border-b bg-background px-6">
      <div className="flex items-center space-x-4">
        <h2 className="text-lg font-semibold">Fleet Management</h2>
      </div>

      <div className="flex items-center space-x-4">
        <NotificationBell />
        <LanguageSelector currentLanguage={currentLanguage} onLanguageChange={setCurrentLanguage} />
        <CurrencySelector currentCurrency={currentCurrency} onCurrencyChange={setCurrentCurrency} />
        <ModeToggle />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <User className="h-4 w-4 mr-2" />
              Admin User
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
