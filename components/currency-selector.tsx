"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { DollarSign, Check } from "lucide-react"
import { useTranslation } from "react-i18next"
import { currencyService } from "@/lib/services/currency-service"

const currencies = [
  { code: "USD", name: "US Dollar", symbol: "$" },
  { code: "EUR", name: "Euro", symbol: "€" },
  { code: "GBP", name: "British Pound", symbol: "£" },
  { code: "CAD", name: "Canadian Dollar", symbol: "C$" },
  { code: "BAM", name: "Bosnia and Herzegovina Convertible Mark", symbol: "KM" },
]

export function CurrencySelector() {
  const { t } = useTranslation()
  const [selectedCurrency, setSelectedCurrency] = useState("USD")
  const [supportedCurrencies, setSupportedCurrencies] = useState<string[]>([])

  useEffect(() => {
    // Load supported currencies
    const loadSupportedCurrencies = async () => {
      try {
        const supported = await currencyService.getSupportedCurrencies()
        setSupportedCurrencies(supported)
      } catch (error) {
        console.error("Error loading supported currencies:", error)
        setSupportedCurrencies(["USD", "EUR", "GBP", "CAD", "BAM"])
      }
    }

    loadSupportedCurrencies()

    // Load saved currency preference
    const savedCurrency = localStorage.getItem("currency_preference")
    if (savedCurrency && currencies.find((c) => c.code === savedCurrency)) {
      setSelectedCurrency(savedCurrency)
    }
  }, [])

  const handleCurrencyChange = async (currencyCode: string) => {
    setSelectedCurrency(currencyCode)
    localStorage.setItem("currency_preference", currencyCode)

    // Trigger currency change event for other components
    window.dispatchEvent(
      new CustomEvent("currencyChanged", {
        detail: { currency: currencyCode },
      }),
    )

    // Update user preference if logged in
    try {
      const authData = JSON.parse(localStorage.getItem("user_data") || "{}")
      if (authData.id) {
        // This would typically be handled by a user service
        console.log("Updating user currency preference:", currencyCode)
      }
    } catch (error) {
      console.error("Error updating user currency preference:", error)
    }
  }

  const selectedCurrencyData = currencies.find((c) => c.code === selectedCurrency)
  const availableCurrencies = currencies.filter((c) => supportedCurrencies.includes(c.code))

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 px-2">
          <DollarSign className="h-4 w-4 mr-1" />
          <span className="font-medium">{selectedCurrencyData?.code || "USD"}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {availableCurrencies.map((currency) => (
          <DropdownMenuItem
            key={currency.code}
            onClick={() => handleCurrencyChange(currency.code)}
            className="flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center">
              <span className="font-medium mr-2">{currency.symbol}</span>
              <div>
                <div className="font-medium">{currency.code}</div>
                <div className="text-sm text-muted-foreground">{currency.name}</div>
              </div>
            </div>
            {selectedCurrency === currency.code && <Check className="h-4 w-4 text-primary" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
