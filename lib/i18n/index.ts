export type Language = "en" | "es" | "fr" | "de"

export interface TranslationKeys {
  dashboard: string
  vehicles: string
  drivers: string
  maintenance: string
  fuel: string
  incidents: string
  reports: string
  settings: string
  welcome: string
  logout: string
  // Add more keys as needed
}

const translations: Record<Language, TranslationKeys> = {
  en: {
    dashboard: "Dashboard",
    vehicles: "Vehicles",
    drivers: "Drivers",
    maintenance: "Maintenance",
    fuel: "Fuel",
    incidents: "Incidents",
    reports: "Reports",
    settings: "Settings",
    welcome: "Welcome",
    logout: "Logout",
  },
  es: {
    dashboard: "Panel de Control",
    vehicles: "Vehículos",
    drivers: "Conductores",
    maintenance: "Mantenimiento",
    fuel: "Combustible",
    incidents: "Incidentes",
    reports: "Reportes",
    settings: "Configuración",
    welcome: "Bienvenido",
    logout: "Cerrar Sesión",
  },
  fr: {
    dashboard: "Tableau de Bord",
    vehicles: "Véhicules",
    drivers: "Conducteurs",
    maintenance: "Maintenance",
    fuel: "Carburant",
    incidents: "Incidents",
    reports: "Rapports",
    settings: "Paramètres",
    welcome: "Bienvenue",
    logout: "Déconnexion",
  },
  de: {
    dashboard: "Dashboard",
    vehicles: "Fahrzeuge",
    drivers: "Fahrer",
    maintenance: "Wartung",
    fuel: "Kraftstoff",
    incidents: "Vorfälle",
    reports: "Berichte",
    settings: "Einstellungen",
    welcome: "Willkommen",
    logout: "Abmelden",
  },
}

export function getTranslation(language: Language, key: keyof TranslationKeys): string {
  return translations[language][key] || translations.en[key]
}

export function getAvailableLanguages(): { code: Language; name: string }[] {
  return [
    { code: "en", name: "English" },
    { code: "es", name: "Español" },
    { code: "fr", name: "Français" },
    { code: "de", name: "Deutsch" },
  ]
}
