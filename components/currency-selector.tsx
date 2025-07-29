"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { DollarSign } from "lucide-react"
import { currencyService } from "@/lib/services/currency-service"

export function CurrencySelector() {
  const [currentCurrency, setCurrentCurrency] = useState("USD")
  const currencies = currencyService.getSupportedCurrencies()

  const changeCurrency = (currencyCode: string) => {
    setCurrentCurrency(currencyCode)
    // In a real app, you would save this preference to user settings
    localStorage.setItem("preferred_currency", currencyCode)
  }

  const currentCurrencyInfo = currencies.find((c) => c.code === currentCurrency)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 px-2">
          <DollarSign className="h-4 w-4 mr-1" />
          {currentCurrencyInfo?.code}
          <span className="sr-only">Select currency</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {currencies.map((currency) => (
          <DropdownMenuItem
            key={currency.code}
            onClick={() => changeCurrency(currency.code)}
            className={currentCurrency === currency.code ? "bg-accent" : ""}
          >
            <span className="mr-2">{currency.symbol}</span>
            <span className="mr-2">{currency.code}</span>
            <span className="text-sm text-gray-500">{currency.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
