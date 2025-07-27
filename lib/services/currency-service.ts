import { BaseService } from "./base-service"
import { executeQuery } from "../database/connection"

interface ExchangeRate {
  id: number
  base_currency: string
  target_currency: string
  rate: number
  date: string
  created_at: string
}

interface ExchangeApiResponse {
  success: boolean
  rates: Record<string, number>
  base: string
  date: string
}

export class CurrencyService extends BaseService<ExchangeRate> {
  private static instance: CurrencyService
  private rateCache: Map<string, { rate: number; timestamp: number }> = new Map()
  private readonly CACHE_DURATION = 1000 * 60 * 60 // 1 hour in milliseconds

  constructor() {
    super("currency_rates")
  }

  static getInstance(): CurrencyService {
    if (!CurrencyService.instance) {
      CurrencyService.instance = new CurrencyService()
    }
    return CurrencyService.instance
  }

  // Get supported currencies from system settings
  async getSupportedCurrencies(): Promise<string[]> {
    try {
      const query = `
        SELECT setting_value 
        FROM system_settings 
        WHERE setting_key = 'supported_currencies'
      `
      const results = await executeQuery<{ setting_value: string }>(query)

      if (results[0]?.setting_value) {
        return JSON.parse(results[0].setting_value)
      }

      return ["USD", "EUR", "GBP", "CAD", "BAM"] // Default currencies
    } catch (error) {
      console.error("Error getting supported currencies:", error)
      return ["USD", "EUR", "GBP", "CAD", "BAM"]
    }
  }

  // Get exchange rate between two currencies
  async getExchangeRate(fromCurrency: string, toCurrency: string): Promise<number> {
    try {
      // Same currency
      if (fromCurrency === toCurrency) {
        return 1
      }

      const cacheKey = `${fromCurrency}_${toCurrency}`
      const cached = this.rateCache.get(cacheKey)

      // Return cached rate if still valid
      if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
        return cached.rate
      }

      // Try to get rate from database (today's rate)
      const today = new Date().toISOString().split("T")[0]
      let rate = await this.getRateFromDatabase(fromCurrency, toCurrency, today)

      if (!rate) {
        // Fetch from external API
        rate = await this.fetchRateFromAPI(fromCurrency, toCurrency)

        if (rate) {
          // Store in database
          await this.storeRate(fromCurrency, toCurrency, rate, today)
        }
      }

      if (rate) {
        // Cache the rate
        this.rateCache.set(cacheKey, { rate, timestamp: Date.now() })
        return rate
      }

      throw new Error(`Unable to get exchange rate for ${fromCurrency} to ${toCurrency}`)
    } catch (error) {
      console.error("Error getting exchange rate:", error)

      // Fallback: try to get last known rate from database
      const fallbackRate = await this.getLastKnownRate(fromCurrency, toCurrency)
      if (fallbackRate) {
        return fallbackRate
      }

      // Ultimate fallback
      return 1
    }
  }

  // Convert amount from one currency to another
  async convertCurrency(
    amount: number,
    fromCurrency: string,
    toCurrency: string,
  ): Promise<{ convertedAmount: number; rate: number; fromCurrency: string; toCurrency: string }> {
    try {
      const rate = await this.getExchangeRate(fromCurrency, toCurrency)
      const convertedAmount = Math.round(amount * rate * 100) / 100 // Round to 2 decimal places

      return {
        convertedAmount,
        rate,
        fromCurrency,
        toCurrency,
      }
    } catch (error) {
      console.error("Error converting currency:", error)
      throw error
    }
  }

  // Get rate from database
  private async getRateFromDatabase(fromCurrency: string, toCurrency: string, date: string): Promise<number | null> {
    try {
      const query = `
        SELECT rate 
        FROM currency_rates 
        WHERE base_currency = ? AND target_currency = ? AND date = ?
        ORDER BY created_at DESC 
        LIMIT 1
      `
      const results = await executeQuery<{ rate: number }>(query, [fromCurrency, toCurrency, date])
      return results[0]?.rate || null
    } catch (error) {
      console.error("Error getting rate from database:", error)
      return null
    }
  }

  // Get last known rate from database
  private async getLastKnownRate(fromCurrency: string, toCurrency: string): Promise<number | null> {
    try {
      const query = `
        SELECT rate 
        FROM currency_rates 
        WHERE base_currency = ? AND target_currency = ?
        ORDER BY date DESC, created_at DESC 
        LIMIT 1
      `
      const results = await executeQuery<{ rate: number }>(query, [fromCurrency, toCurrency])
      return results[0]?.rate || null
    } catch (error) {
      console.error("Error getting last known rate:", error)
      return null
    }
  }

  // Fetch rate from external API
  private async fetchRateFromAPI(fromCurrency: string, toCurrency: string): Promise<number | null> {
    try {
      const apiUrl = process.env.EXCHANGE_API_URL || "https://api.exchangerate-api.com/v4/latest"
      const apiKey = process.env.EXCHANGE_API_KEY

      let url = `${apiUrl}/${fromCurrency}`
      if (apiKey) {
        url += `?access_key=${apiKey}`
      }

      const response = await fetch(url)

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`)
      }

      const data: ExchangeApiResponse = await response.json()

      if (data.success === false) {
        throw new Error("API returned error")
      }

      return data.rates[toCurrency] || null
    } catch (error) {
      console.error("Error fetching rate from API:", error)
      return null
    }
  }

  // Store rate in database
  private async storeRate(fromCurrency: string, toCurrency: string, rate: number, date: string): Promise<void> {
    try {
      const query = `
        INSERT INTO currency_rates (base_currency, target_currency, rate, date)
        VALUES (?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE rate = VALUES(rate), created_at = CURRENT_TIMESTAMP
      `
      await executeQuery(query, [fromCurrency, toCurrency, rate, date])
    } catch (error) {
      console.error("Error storing rate in database:", error)
    }
  }

  // Update all exchange rates for supported currencies
  async updateAllRates(baseCurrency = "USD"): Promise<void> {
    try {
      const supportedCurrencies = await this.getSupportedCurrencies()
      const today = new Date().toISOString().split("T")[0]

      // Fetch rates from API
      const apiUrl = process.env.EXCHANGE_API_URL || "https://api.exchangerate-api.com/v4/latest"
      const response = await fetch(`${apiUrl}/${baseCurrency}`)

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`)
      }

      const data: ExchangeApiResponse = await response.json()

      // Store rates for all supported currencies
      const storePromises = supportedCurrencies
        .filter((currency) => currency !== baseCurrency && data.rates[currency])
        .map((currency) => this.storeRate(baseCurrency, currency, data.rates[currency], today))

      await Promise.all(storePromises)

      console.log(`✅ Updated exchange rates for ${storePromises.length} currencies`)
    } catch (error) {
      console.error("Error updating all rates:", error)
      throw error
    }
  }

  // Format currency amount with proper symbol and formatting
  formatCurrency(amount: number, currency: string, locale = "en-US"): string {
    try {
      return new Intl.NumberFormat(locale, {
        style: "currency",
        currency: currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(amount)
    } catch (error) {
      // Fallback formatting
      const symbols: Record<string, string> = {
        USD: "$",
        EUR: "€",
        GBP: "£",
        CAD: "C$",
        BAM: "KM",
      }

      const symbol = symbols[currency] || currency
      return `${symbol}${amount.toFixed(2)}`
    }
  }

  // Get currency symbol
  getCurrencySymbol(currency: string): string {
    const symbols: Record<string, string> = {
      USD: "$",
      EUR: "€",
      GBP: "£",
      CAD: "C$",
      BAM: "KM",
      JPY: "¥",
      CHF: "CHF",
      AUD: "A$",
      NZD: "NZ$",
    }

    return symbols[currency] || currency
  }
}

// Export singleton instance
export const currencyService = CurrencyService.getInstance()
