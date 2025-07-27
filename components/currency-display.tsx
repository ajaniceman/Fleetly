"use client"

import { useState, useEffect } from "react"
import { currencyService } from "@/lib/services/currency-service"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertCircle } from "lucide-react"

interface CurrencyDisplayProps {
  amount: number
  originalCurrency: string
  className?: string
  showOriginal?: boolean
}

export function CurrencyDisplay({
  amount,
  originalCurrency,
  className = "",
  showOriginal = false,
}: CurrencyDisplayProps) {
  const [displayCurrency, setDisplayCurrency] = useState("USD")
  const [convertedAmount, setConvertedAmount] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Get user's preferred currency
    const savedCurrency = localStorage.getItem("currency_preference") || "USD"
    setDisplayCurrency(savedCurrency)

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
      if (originalCurrency === displayCurrency) {
        setConvertedAmount(amount)
        setIsLoading(false)
        return
      }

      setIsLoading(true)
      setError(null)

      try {
        const result = await currencyService.convertCurrency(amount, originalCurrency, displayCurrency)
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
  }, [amount, originalCurrency, displayCurrency])

  if (isLoading) {
    return <Skeleton className={`h-4 w-16 ${className}`} />
  }

  if (error) {
    return (
      <span className={`text-muted-foreground flex items-center ${className}`}>
        <AlertCircle className="h-3 w-3 mr-1" />
        {currencyService.formatCurrency(amount, originalCurrency)}
      </span>
    )
  }

  const formattedAmount = currencyService.formatCurrency(convertedAmount || amount, displayCurrency)

  const formattedOriginal = currencyService.formatCurrency(amount, originalCurrency)

  return (
    <span className={className}>
      {formattedAmount}
      {showOriginal && originalCurrency !== displayCurrency && (
        <span className="text-xs text-muted-foreground ml-1">({formattedOriginal})</span>
      )}
    </span>
  )
}
