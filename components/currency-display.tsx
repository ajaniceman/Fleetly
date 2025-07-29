"use client"

import { useState, useEffect } from "react"
import { currencyService } from "@/lib/services/currency-service"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertCircle } from "lucide-react"

interface CurrencyDisplayProps {
  amount: number
  currency?: string
  className?: string
}

export function CurrencyDisplay({ amount, currency = "USD", className = "" }: CurrencyDisplayProps) {
  const [displayCurrency, setDisplayCurrency] = useState(currency)
  const [convertedAmount, setConvertedAmount] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Listen for currency changes
    const handleCurrencyChange = (event: CustomEvent) => {
      setDisplayCurrency(event.detail.currency)
    }

    window.addEventListener("currencyChanged", handleCurrencyChange as EventListener)
    return () => {
      window.removeEventListener("currencyChanged", handleCurrencyChange as EventListener)
    }
  }, [])

  useEffect(() => {
    const convertAmount = async () => {
      if (currency === displayCurrency) {
        setConvertedAmount(amount)
        setIsLoading(false)
        return
      }

      setIsLoading(true)
      setError(null)

      try {
        const result = await currencyService.convertCurrency(amount, currency, displayCurrency)
        setConvertedAmount(result.convertedAmount)
      } catch (error) {
        console.error("Currency conversion error:", error)
        setError("Conversion failed")
        setConvertedAmount(amount) // Fallback to original amount
      } finally {
        setIsLoading(false)
      }
    }

    convertAmount()
  }, [amount, currency, displayCurrency])

  if (isLoading) {
    return <Skeleton className={`h-4 w-16 ${className}`} />
  }

  if (error) {
    return (
      <span className={`text-muted-foreground flex items-center ${className}`}>
        <AlertCircle className="h-3 w-3 mr-1" />
        {currencyService.formatCurrency(amount, currency)}
      </span>
    )
  }

  const formattedAmount = currencyService.formatCurrency(convertedAmount || amount, displayCurrency)

  return <span className={className}>{formattedAmount}</span>
}
