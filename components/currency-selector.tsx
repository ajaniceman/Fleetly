"use client"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { DollarSign } from "lucide-react"
import { currencyService } from "@/lib/services/currency-service"

interface CurrencySelectorProps {
  currentCurrency: string
  onCurrencyChange: (currency: string) => void
}

export function CurrencySelector({ currentCurrency, onCurrencyChange }: CurrencySelectorProps) {
  const currencies = currencyService.getAvailableCurrencies()
  const currentCurrencyInfo = currencyService.getCurrencyInfo(currentCurrency)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm">
          <DollarSign className="h-4 w-4 mr-2" />
          {currentCurrencyInfo?.code || currentCurrency}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {currencies.map((currency) => (
          <DropdownMenuItem
            key={currency.code}
            onClick={() => onCurrencyChange(currency.code)}
            className={currentCurrency === currency.code ? "bg-accent" : ""}
          >
            <span className="mr-2">{currency.symbol}</span>
            {currency.code} - {currency.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
