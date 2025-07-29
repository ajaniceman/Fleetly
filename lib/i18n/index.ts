import en from "./locales/en.json"
import es from "./locales/es.json"
import fr from "./locales/fr.json"
import de from "./locales/de.json"

const translations = {
  en,
  es,
  fr,
  de,
}

export type Language = keyof typeof translations
export type TranslationKey = keyof typeof en

export function getTranslation(language: Language, key: TranslationKey): string {
  return translations[language][key] || translations.en[key] || key
}

export function getAvailableLanguages(): { code: Language; name: string }[] {
  return [
    { code: "en", name: "English" },
    { code: "es", name: "Español" },
    { code: "fr", name: "Français" },
    { code: "de", name: "Deutsch" },
  ]
}
