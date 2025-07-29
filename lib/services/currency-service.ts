export interface Currency {
  code: string
  name: string
  symbol: string
  rate: number // Exchange rate to USD
}

const currencies: Currency[] = [
  { code: "USD", name: "US Dollar", symbol: "$", rate: 1.0 },
  { code: "EUR", name: "Euro", symbol: "€", rate: 0.85 },
  { code: "GBP", name: "British Pound", symbol: "£", rate: 0.73 },
  { code: "CAD", name: "Canadian Dollar", symbol: "C$", rate: 1.25 },
  { code: "AUD", name: "Australian Dollar", symbol: "A$", rate: 1.35 },
  { code: "JPY", name: "Japanese Yen", symbol: "¥", rate: 110.0 },
  { code: "CHF", name: "Swiss Franc", symbol: "CHF", rate: 0.92 },
  { code: "CNY", name: "Chinese Yuan", symbol: "¥", rate: 6.45 },
]

export class CurrencyService {
  private static instance: CurrencyService
  private currentCurrency: Currency = currencies[0] // Default to USD

  static getInstance(): CurrencyService {
    if (!CurrencyService.instance) {
      CurrencyService.instance = new CurrencyService()
    }
    return CurrencyService.instance
  }

  getAllCurrencies(): Currency[] {
    return currencies
  }

  getCurrentCurrency(): Currency {
    return this.currentCurrency
  }

  setCurrency(currencyCode: string): boolean {
    const currency = currencies.find((c) => c.code === currencyCode)
    if (currency) {
      this.currentCurrency = currency
      return true
    }
    return false
  }

  convertFromUSD(amount: number, toCurrency?: string): number {
    const targetCurrency = toCurrency ? currencies.find((c) => c.code === toCurrency) : this.currentCurrency

    if (!targetCurrency) return amount

    return amount * targetCurrency.rate
  }

  convertToUSD(amount: number, fromCurrency?: string): number {
    const sourceCurrency = fromCurrency ? currencies.find((c) => c.code === fromCurrency) : this.currentCurrency

    if (!sourceCurrency) return amount

    return amount / sourceCurrency.rate
  }

  formatAmount(amount: number, currencyCode?: string): string {
    const currency = currencyCode ? currencies.find((c) => c.code === currencyCode) : this.currentCurrency

    if (!currency) return amount.toString()

    const convertedAmount = this.convertFromUSD(amount, currency.code)

    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.code,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(convertedAmount)
  }

  getExchangeRate(fromCurrency: string, toCurrency: string): number {
    const from = currencies.find((c) => c.code === fromCurrency)
    const to = currencies.find((c) => c.code === toCurrency)

    if (!from || !to) return 1

    // Convert to USD first, then to target currency
    return to.rate / from.rate
  }
}

export const currencyService = CurrencyService.getInstance()
