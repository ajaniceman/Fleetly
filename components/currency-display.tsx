"use client"

import { currencyService } from "@/lib/services/currency-service"

interface CurrencyDisplayProps {
  amount: number
  currencyCode?: string
  className?: string
}

export function CurrencyDisplay({ amount, currencyCode, className }: CurrencyDisplayProps) {
  const formattedAmount = currencyService.formatAmount(amount, currencyCode)

  return <span className={className}>{formattedAmount}</span>
}
