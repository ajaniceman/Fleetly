"use client"

import { useEffect, useState } from "react"
import { currencyService } from "@/lib/services/currency-service"

interface CurrencyDisplayProps {
  amount: number
  fromCurrency?: string
  toCurrency: string
  className?: string
}

export function CurrencyDisplay({ amount, fromCurrency = "USD", toCurrency, className }: CurrencyDisplayProps) {
  const [convertedAmount, setConvertedAmount] = useState<number>(amount)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const convertAmount = async () => {
      if (fromCurrency === toCurrency) {
        setConvertedAmount(amount)
        return
      }

      setLoading(true)
      try {
        const converted = await currencyService.convertCurrency(amount, fromCurrency, toCurrency)
        setConvertedAmount(converted)
      } catch (error) {
        console.error("Currency conversion failed:", error)
        setConvertedAmount(amount)
      } finally {
        setLoading(false)
      }
    }

    convertAmount()
  }, [amount, fromCurrency, toCurrency])

  if (loading) {
    return <span className={className}>Converting...</span>
  }

  return <span className={className}>{currencyService.formatCurrency(convertedAmount, toCurrency)}</span>
}
