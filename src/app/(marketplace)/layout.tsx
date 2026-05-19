"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Search,
  Home,
  PlusCircle,
  Heart,
  User,
  Menu,
  X,
  MapPin,
  Shield,
  TrendingUp,
  Building2,
  ChevronDown,
} from "lucide-react"
import { LocaleSwitcher } from "@/components/marketplace/locale-switcher"
import { CurrencyToggle } from "@/components/marketplace/currency-toggle"
import { useMarketplaceStore } from "@/store/marketplace"
import { cn } from "@/lib/utils"

export default function MarketplaceLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { locale } = useMarketplaceStore()
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [browseOpen, setBrowseOpen] = useState(false)

  const t = locale === 'es' ? {
    home: 'Inicio',
    search: 'Buscar',
    publish: 'Publicar',
    favorites: 'Favoritos',
    account: 'Mi Cuenta',
    buy: 'Comprar',
    rent: 'Alquilar',
    vacation: 'Vacacional',
    invest: 'Invertir',
    agents: 'Agentes',
    valuation: 'Valoración',
    browseBy: 'Explorar',
    tagline: 'La plataforma inmobiliaria #1 de República Dominicana',
    publishFree: 'Publica gratis',
    aboutUs: 'Nosotros',
    contact: 'Contacto',
    terms: 'Términos',
    privacy: 'Privacidad',
    titleVerification: 'Verificación de Títulos',
    allRights: 'Todos los derechos reservados.',
  } : {
    home: 'Home',
    search: 'Search',
    publish: 'List Property',
    favorites: 'Favorites',
    account: 'Account',
    buy: 'Buy',
    rent: 'Rent',
    vacation: 'Vacation',
    invest: 'Invest',
    agents: 'Agents',
    valuation: 'Valuation',
    browseBy: 'Browse',
    tagline: 'The #1 real estate platform in the Dominican Republic',
    publishFree: 'List for free',
    aboutUs: 'About Us',
    contact: 'Contact',
    terms: 'Terms',
    privacy: 'Privacy',
    titleVerification: 'Title Verification',
    allRights: 'All rights reserved.',
  }

  const navLinks = [
    { href: '/buscar?listingType=venta', label: t.buy },
    { href: '/buscar?listingType=alquiler', label: t.rent },
    { href: '/buscar?listingType=vacacional', label: t.vacation },
  ]

  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* Top bar */}
      <div className="border-b border-gray-100 bg-gray-50/80">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-1.5 sm:px-6 lg:px-8">
          <p className="hidden text-xs text-gray-500 sm:block">{t.tagline}</p>
          <div className="flex items-center gap-3 ml-auto">
            <CurrencyToggle />
            <LocaleSwitcher />
          </div>
        </div>
      </div>

      {/* Main nav */}
      <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link href="/inicio" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600">
              <MapPin className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-gray-900">ATLAS</span>
              <span className="ml-1 text-xs font-medium text-blue-600">RD</span>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-1 lg:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-lg px-3.5 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900"
              >
                {link.label}
              </Link>
            ))}

            {/* Browse dropdown */}
            <div className="relative">
              <button
                onClick={() => setBrowseOpen(!browseOpen)}
                className="flex items-center gap-1 rounded-lg px-3.5 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900"
              >
                {t.browseBy}
                <ChevronDown className="h-3.5 w-3.5" />
              </button>
              {browseOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setBrowseOpen(false)} />
                  <div className="absolute left-0 z-20 mt-1 w-56 overflow-hidden rounded-xl border border-gray-200 bg-white p-1.5 shadow-lg">
                    {[
                      { href: '/buscar?listingType=terreno', label: locale === 'es' ? 'Terrenos' : 'Land', icon: MapPin },
                      { href: '/buscar?listingType=oficina', label: locale === 'es' ? 'Oficinas' : 'Offices', icon: Building2 },
                      { href: '/buscar?listingType=negocio', label: locale === 'es' ? 'Negocios' : 'Businesses', icon: TrendingUp },
                      { href: '/buscar?listingType=habitacion', label: locale === 'es' ? 'Habitaciones' : 'Rooms', icon: Home },
                      { href: '/buscar?listingType=coliving', label: 'Coliving', icon: User },
                    ].map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setBrowseOpen(false)}
                        className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm text-gray-700 transition-colors hover:bg-gray-50"
                      >
                        <item.icon className="h-4 w-4 text-gray-400" />
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </>
              )}
            </div>
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <Link
              href="/publicar"
              className="hidden items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 sm:inline-flex"
            >
              <PlusCircle className="h-4 w-4" />
              {t.publishFree}
            </Link>
            <Link
              href="/cuenta/favoritos"
              className="hidden rounded-lg p-2.5 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 sm:block"
            >
              <Heart className="h-5 w-5" />
            </Link>
            <Link
              href="/cuenta"
              className="hidden rounded-lg p-2.5 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 sm:block"
            >
              <User className="h-5 w-5" />
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="rounded-lg p-2.5 text-gray-500 transition-colors hover:bg-gray-100 lg:hidden"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="border-t border-gray-100 bg-white px-4 pb-4 pt-2 lg:hidden">
            <nav className="space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/publicar"
                onClick={() => setMobileMenuOpen(false)}
                className="block rounded-lg px-3 py-2.5 text-sm font-medium text-blue-600 hover:bg-blue-50"
              >
                {t.publishFree}
              </Link>
              <Link
                href="/cuenta/favoritos"
                onClick={() => setMobileMenuOpen(false)}
                className="block rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                {t.favorites}
              </Link>
              <Link
                href="/cuenta"
                onClick={() => setMobileMenuOpen(false)}
                className="block rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                {t.account}
              </Link>
            </nav>
          </div>
        )}
      </header>

      {/* Page content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
                  <MapPin className="h-4 w-4 text-white" />
                </div>
                <span className="text-lg font-bold text-white">ATLAS RD</span>
              </div>
              <p className="mt-3 text-sm text-gray-400">{t.tagline}</p>
            </div>

            {/* Quick links */}
            <div>
              <h4 className="text-sm font-semibold text-white">{t.browseBy}</h4>
              <ul className="mt-3 space-y-2">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-gray-400 hover:text-white transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services */}
            <div>
              <h4 className="text-sm font-semibold text-white">{locale === 'es' ? 'Servicios' : 'Services'}</h4>
              <ul className="mt-3 space-y-2">
                <li><Link href="/valoracion" className="text-sm text-gray-400 hover:text-white transition-colors">{t.valuation}</Link></li>
                <li><Link href="/titulo" className="text-sm text-gray-400 hover:text-white transition-colors">{t.titleVerification}</Link></li>
                <li><Link href="/agentes" className="text-sm text-gray-400 hover:text-white transition-colors">{t.agents}</Link></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="text-sm font-semibold text-white">{locale === 'es' ? 'Empresa' : 'Company'}</h4>
              <ul className="mt-3 space-y-2">
                <li><Link href="/nosotros" className="text-sm text-gray-400 hover:text-white transition-colors">{t.aboutUs}</Link></li>
                <li><Link href="/contacto" className="text-sm text-gray-400 hover:text-white transition-colors">{t.contact}</Link></li>
                <li><Link href="/terminos" className="text-sm text-gray-400 hover:text-white transition-colors">{t.terms}</Link></li>
                <li><Link href="/privacidad" className="text-sm text-gray-400 hover:text-white transition-colors">{t.privacy}</Link></li>
              </ul>
            </div>
          </div>

          <div className="mt-10 border-t border-gray-800 pt-6">
            <p className="text-center text-xs text-gray-500">
              &copy; {new Date().getFullYear()} Atlas RD. {t.allRights}
            </p>
          </div>
        </div>
      </footer>

      {/* Mobile bottom nav */}
      <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-gray-200 bg-white/95 backdrop-blur-sm sm:hidden">
        <nav className="mx-auto flex max-w-md items-center justify-around px-2 py-2">
          {[
            { href: '/inicio', icon: Home, label: t.home },
            { href: '/buscar', icon: Search, label: t.search },
            { href: '/publicar', icon: PlusCircle, label: t.publish },
            { href: '/cuenta/favoritos', icon: Heart, label: t.favorites },
            { href: '/cuenta', icon: User, label: t.account },
          ].map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-0.5 rounded-lg px-3 py-1.5 text-[10px] font-medium transition-colors",
                  isActive ? "text-blue-600" : "text-gray-500"
                )}
              >
                <item.icon className={cn("h-5 w-5", item.href === '/publicar' && "text-blue-600")} />
                {item.label}
              </Link>
            )
          })}
        </nav>
      </div>
    </div>
  )
}
