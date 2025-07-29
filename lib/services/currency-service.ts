interface ExchangeRates {
  [key: string]: number
}

interface CurrencyInfo {
  code: string
  name: string
  symbol: string
}

export class CurrencyService {
  private static instance: CurrencyService
  private rates: ExchangeRates = {}
  private lastUpdate: Date | null = null
  private readonly UPDATE_INTERVAL = 60 * 60 * 1000 // 1 hour

  private currencies: CurrencyInfo[] = [
    { code: "USD", name: "US Dollar", symbol: "$" },
    { code: "EUR", name: "Euro", symbol: "€" },
    { code: "GBP", name: "British Pound", symbol: "£" },
    { code: "JPY", name: "Japanese Yen", symbol: "¥" },
    { code: "CAD", name: "Canadian Dollar", symbol: "C$" },
    { code: "AUD", name: "Australian Dollar", symbol: "A$" },
    { code: "CHF", name: "Swiss Franc", symbol: "CHF" },
    { code: "CNY", name: "Chinese Yuan", symbol: "¥" },
  ]

  private constructor() {}

  static getInstance(): CurrencyService {
    if (!CurrencyService.instance) {
      CurrencyService.instance = new CurrencyService()
    }
    return CurrencyService.instance
  }

  async getExchangeRates(): Promise<ExchangeRates> {
    if (this.shouldUpdateRates()) {
      await this.fetchExchangeRates()
    }
    return this.rates
  }

  private shouldUpdateRates(): boolean {
    if (!this.lastUpdate) return true
    const now = new Date()
    return now.getTime() - this.lastUpdate.getTime() > this.UPDATE_INTERVAL
  }

  private async fetchExchangeRates(): Promise<void> {
    try {
      // In a real application, you would fetch from a currency API
      // For now, we'll use mock data
      this.rates = {
        USD: 1.0,
        EUR: 0.85,
        GBP: 0.73,
        JPY: 110.0,
        CAD: 1.25,
        AUD: 1.35,
        CHF: 0.92,
        CNY: 6.45,
      }
      this.lastUpdate = new Date()
    } catch (error) {
      console.error("Failed to fetch exchange rates:", error)
      // Use fallback rates if API fails
      if (Object.keys(this.rates).length === 0) {
        this.rates = { USD: 1.0 }
      }
    }
  }

  async convertCurrency(amount: number, fromCurrency: string, toCurrency: string): Promise<number> {
    if (fromCurrency === toCurrency) return amount

    const rates = await this.getExchangeRates()
    const fromRate = rates[fromCurrency] || 1
    const toRate = rates[toCurrency] || 1

    // Convert to USD first, then to target currency
    const usdAmount = amount / fromRate
    return usdAmount * toRate
  }

  formatCurrency(amount: number, currencyCode: string): string {
    const currency = this.currencies.find((c) => c.code === currencyCode)
    const symbol = currency?.symbol || currencyCode

    return `${symbol}${amount.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`
  }

  getAvailableCurrencies(): CurrencyInfo[] {
    return this.currencies
  }

  getCurrencyInfo(code: string): CurrencyInfo | undefined {
    return this.currencies.find((c) => c.code === code)
  }
}

export const currencyService = CurrencyService.getInstance()
