"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Truck,
  Users,
  Wrench,
  Fuel,
  Shield,
  BarChart3,
  Globe,
  DollarSign,
  Star,
  ChevronRight,
  CheckCircle,
  ArrowRight,
  Phone,
  Mail,
  MapPin,
} from "lucide-react"
import { useTranslation } from "react-i18next"
import { LanguageSelector } from "@/components/language-selector"
import { CurrencySelector } from "@/components/currency-selector"

const testimonials = [
  {
    name: "Sarah Johnson",
    company: "City Transport Co.",
    content:
      "Fleetly has revolutionized how we manage our 200+ vehicle fleet. The maintenance scheduling alone has saved us thousands.",
    rating: 5,
    image: "/placeholder.svg?height=60&width=60",
  },
  {
    name: "Michael Chen",
    company: "Logistics Pro",
    content:
      "The real-time tracking and fuel management features have improved our efficiency by 30%. Highly recommended!",
    rating: 5,
    image: "/placeholder.svg?height=60&width=60",
  },
  {
    name: "Emma Rodriguez",
    company: "Delivery Express",
    content: "Multi-language support and currency conversion make it perfect for our international operations.",
    rating: 5,
    image: "/placeholder.svg?height=60&width=60",
  },
]

const features = [
  {
    icon: Truck,
    titleKey: "home.features.vehicles.title",
    descriptionKey: "home.features.vehicles.description",
  },
  {
    icon: Users,
    titleKey: "home.features.drivers.title",
    descriptionKey: "home.features.drivers.description",
  },
  {
    icon: Wrench,
    titleKey: "home.features.maintenance.title",
    descriptionKey: "home.features.maintenance.description",
  },
  {
    icon: Fuel,
    titleKey: "home.features.fuel.title",
    descriptionKey: "home.features.fuel.description",
  },
  {
    icon: Shield,
    titleKey: "home.features.incidents.title",
    descriptionKey: "home.features.incidents.description",
  },
  {
    icon: BarChart3,
    titleKey: "home.features.reports.title",
    descriptionKey: "home.features.reports.description",
  },
]

const benefits = [
  "home.benefits.reduce_costs",
  "home.benefits.improve_efficiency",
  "home.benefits.ensure_compliance",
  "home.benefits.real_time_tracking",
  "home.benefits.automated_alerts",
  "home.benefits.comprehensive_reports",
]

export default function HomePage() {
  const { t } = useTranslation()
  const [currentTestimonial, setCurrentTestimonial] = useState(0)

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Truck className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">Fleetly</span>
            </div>

            <div className="flex items-center space-x-4">
              <LanguageSelector />
              <CurrencySelector />
              <Link href="/login">
                <Button variant="outline">{t("common.login")}</Button>
              </Link>
              <Link href="/login">
                <Button>{t("common.get_started")}</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <Badge variant="secondary" className="mb-4">
            {t("home.hero.badge")}
          </Badge>

          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">{t("home.hero.title")}</h1>

          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">{t("home.hero.subtitle")}</p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/login">
              <Button size="lg" className="text-lg px-8 py-3">
                {t("common.get_started")}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="text-lg px-8 py-3 bg-transparent">
              {t("home.hero.learn_more")}
            </Button>
          </div>

          {/* Hero Image */}
          <div className="relative max-w-4xl mx-auto">
            <img
              src="/placeholder.svg?height=600&width=800"
              alt="Fleetly Dashboard"
              className="rounded-2xl shadow-2xl border"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">{t("home.features.title")}</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">{t("home.features.subtitle")}</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <CardTitle className="text-xl">{t(feature.titleKey)}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">{t(feature.descriptionKey)}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">{t("home.benefits.title")}</h2>
              <p className="text-xl text-gray-600 mb-8">{t("home.benefits.subtitle")}</p>

              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0" />
                    <span className="text-lg text-gray-700">{t(benefit)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <img src="/placeholder.svg?height=500&width=600" alt="Benefits" className="rounded-2xl shadow-xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Multi-language & Currency Features */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">{t("home.global.title")}</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">{t("home.global.subtitle")}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <Card className="p-8">
              <div className="flex items-center mb-6">
                <Globe className="h-8 w-8 text-blue-600 mr-3" />
                <h3 className="text-2xl font-bold">{t("home.global.languages.title")}</h3>
              </div>
              <p className="text-gray-600 mb-6">{t("home.global.languages.description")}</p>
              <div className="flex flex-wrap gap-2">
                {["English", "Español", "Français", "Deutsch", "Bosanski"].map((lang) => (
                  <Badge key={lang} variant="secondary">
                    {lang}
                  </Badge>
                ))}
              </div>
            </Card>

            <Card className="p-8">
              <div className="flex items-center mb-6">
                <DollarSign className="h-8 w-8 text-green-600 mr-3" />
                <h3 className="text-2xl font-bold">{t("home.global.currency.title")}</h3>
              </div>
              <p className="text-gray-600 mb-6">{t("home.global.currency.description")}</p>
              <div className="flex flex-wrap gap-2">
                {["USD", "EUR", "GBP", "CAD", "BAM"].map((currency) => (
                  <Badge key={currency} variant="secondary">
                    {currency}
                  </Badge>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">{t("home.testimonials.title")}</h2>
            <p className="text-xl text-gray-600">{t("home.testimonials.subtitle")}</p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card className="p-8">
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                    <Star key={i} className="h-6 w-6 text-yellow-400 fill-current" />
                  ))}
                </div>

                <blockquote className="text-xl text-gray-700 mb-6 italic">
                  "{testimonials[currentTestimonial].content}"
                </blockquote>

                <div className="flex items-center justify-center space-x-4">
                  <img
                    src={testimonials[currentTestimonial].image || "/placeholder.svg"}
                    alt={testimonials[currentTestimonial].name}
                    className="w-12 h-12 rounded-full"
                  />
                  <div className="text-left">
                    <div className="font-semibold text-gray-900">{testimonials[currentTestimonial].name}</div>
                    <div className="text-gray-600">{testimonials[currentTestimonial].company}</div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Testimonial indicators */}
            <div className="flex justify-center mt-6 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentTestimonial ? "bg-blue-600" : "bg-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-blue-600">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">{t("home.cta.title")}</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">{t("home.cta.subtitle")}</p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/login">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-3">
                {t("common.get_started")}
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 py-3 text-white border-white hover:bg-white hover:text-blue-600 bg-transparent"
            >
              {t("home.cta.contact_sales")}
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Truck className="h-8 w-8 text-blue-400" />
                <span className="text-2xl font-bold">Fleetly</span>
              </div>
              <p className="text-gray-400 mb-4">{t("home.footer.description")}</p>
              <div className="flex space-x-4">
                <LanguageSelector />
                <CurrencySelector />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">{t("home.footer.product")}</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/features" className="hover:text-white transition-colors">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="hover:text-white transition-colors">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="/integrations" className="hover:text-white transition-colors">
                    Integrations
                  </Link>
                </li>
                <li>
                  <Link href="/api" className="hover:text-white transition-colors">
                    API
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">{t("home.footer.company")}</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/about" className="hover:text-white transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/careers" className="hover:text-white transition-colors">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="hover:text-white transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/press" className="hover:text-white transition-colors">
                    Press
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">{t("home.footer.contact")}</h3>
              <div className="space-y-3 text-gray-400">
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4" />
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4" />
                  <span>contact@fleetly.com</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4" />
                  <span>San Francisco, CA</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>
              &copy; {new Date().getFullYear()} Fleetly. {t("home.footer.rights_reserved")}
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
