"use client"

import Link from "next/link"
import {
  ArrowRight,
  Shield,
  Globe,
  Banknote,
  MapPin,
  Building2,
  Home,
  Palmtree,
  Briefcase,
  Users,
  TrendingUp,
  BadgeCheck,
  Star,
} from "lucide-react"
import { SearchBar } from "@/components/marketplace/search-bar"
import { ListingCard } from "@/components/marketplace/listing-card"
import { AreaGuideCard } from "@/components/marketplace/area-guide-card"
import { useMarketplaceStore } from "@/store/marketplace"
import { useMockFeaturedListings, useMockAreaGuides } from "@/hooks/use-mock-listings"
import { useRouter } from "next/navigation"

export default function MarketplaceHomePage() {
  const { locale } = useMarketplaceStore()
  const featured = useMockFeaturedListings()
  const areas = useMockAreaGuides()
  const router = useRouter()

  const t = locale === 'es' ? {
    heroTitle1: 'Encuentra tu propiedad ideal en',
    heroTitle2: 'República Dominicana',
    heroSub: 'Compra, vende, alquila — casas, apartamentos, terrenos, negocios, oficinas y más. Con verificación de títulos y protección para tu inversión.',
    featuredTitle: 'Propiedades Destacadas',
    featuredSub: 'Las mejores oportunidades del mercado, verificadas y seleccionadas para ti.',
    viewAll: 'Ver todas',
    areasTitle: 'Explora por Zona',
    areasSub: 'Descubre las mejores zonas para vivir, invertir o vacacionar en República Dominicana.',
    categoriesTitle: '¿Qué estás buscando?',
    whyTitle: '¿Por qué Atlas RD?',
    whySub: 'La primera plataforma inmobiliaria de República Dominicana con verificación de títulos, precios transparentes y protección al comprador.',
    statsListings: 'Propiedades',
    statsVerified: 'Títulos Verificados',
    statsUsers: 'Usuarios Activos',
    statsProvinces: 'Provincias',
    ctaTitle: 'Publica tu propiedad gratis',
    ctaSub: 'Llega a miles de compradores e inquilinos locales e internacionales. Publica en 2 minutos.',
    ctaButton: 'Publicar Ahora',
  } : {
    heroTitle1: 'Find your ideal property in the',
    heroTitle2: 'Dominican Republic',
    heroSub: 'Buy, sell, rent — houses, apartments, land, businesses, offices and more. With title verification and investment protection.',
    featuredTitle: 'Featured Properties',
    featuredSub: 'Top market opportunities, verified and curated for you.',
    viewAll: 'View all',
    areasTitle: 'Explore by Area',
    areasSub: 'Discover the best areas to live, invest, or vacation in the Dominican Republic.',
    categoriesTitle: 'What are you looking for?',
    whyTitle: 'Why Atlas RD?',
    whySub: 'The first Dominican Republic real estate platform with title verification, transparent pricing, and buyer protection.',
    statsListings: 'Listings',
    statsVerified: 'Verified Titles',
    statsUsers: 'Active Users',
    statsProvinces: 'Provinces',
    ctaTitle: 'List your property for free',
    ctaSub: 'Reach thousands of local and international buyers and renters. List in 2 minutes.',
    ctaButton: 'List Now',
  }

  const categories = [
    { href: '/buscar?listingType=venta', icon: Home, label: locale === 'es' ? 'Casas en Venta' : 'Houses for Sale', color: 'bg-emerald-100 text-emerald-600' },
    { href: '/buscar?listingType=alquiler', icon: Building2, label: locale === 'es' ? 'Apartamentos en Alquiler' : 'Apartments for Rent', color: 'bg-blue-100 text-blue-600' },
    { href: '/buscar?listingType=vacacional', icon: Palmtree, label: locale === 'es' ? 'Alquiler Vacacional' : 'Vacation Rentals', color: 'bg-purple-100 text-purple-600' },
    { href: '/buscar?listingType=terreno', icon: MapPin, label: locale === 'es' ? 'Terrenos' : 'Land', color: 'bg-lime-100 text-lime-600' },
    { href: '/buscar?listingType=oficina', icon: Briefcase, label: locale === 'es' ? 'Oficinas' : 'Offices', color: 'bg-slate-100 text-slate-600' },
    { href: '/buscar?listingType=negocio', icon: TrendingUp, label: locale === 'es' ? 'Negocios' : 'Businesses', color: 'bg-rose-100 text-rose-600' },
  ]

  const whyReasons = [
    {
      icon: Shield,
      title: locale === 'es' ? 'Verificación de Títulos' : 'Title Verification',
      description: locale === 'es'
        ? 'Cada propiedad puede ser verificada contra el Registro de Títulos. Protege tu inversión contra fraude inmobiliario.'
        : 'Every property can be verified against the Title Registry. Protect your investment against real estate fraud.',
    },
    {
      icon: Globe,
      title: locale === 'es' ? 'Bilingüe (ES/EN)' : 'Bilingual (ES/EN)',
      description: locale === 'es'
        ? 'Plataforma completamente bilingüe para conectar compradores locales e internacionales con vendedores dominicanos.'
        : 'Fully bilingual platform connecting local and international buyers with Dominican sellers.',
    },
    {
      icon: Banknote,
      title: locale === 'es' ? 'Precios en DOP y USD' : 'Prices in DOP & USD',
      description: locale === 'es'
        ? 'Ve precios en pesos dominicanos o dólares americanos. Perfecto para diáspora, expats e inversores internacionales.'
        : 'View prices in Dominican pesos or US dollars. Perfect for diaspora, expats, and international investors.',
    },
    {
      icon: BadgeCheck,
      title: 'CONFOTUR',
      description: locale === 'es'
        ? 'Identifica propiedades elegibles para exención fiscal CONFOTUR — hasta 15 años sin impuestos de transferencia ni IPI.'
        : 'Identify CONFOTUR-eligible properties — up to 15 years exempt from transfer tax and IPI.',
    },
  ]

  return (
    <div className="pb-16 sm:pb-0">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800">
        <div className="pointer-events-none absolute inset-0 opacity-10" style={{
          backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }} />
        <div className="relative mx-auto max-w-4xl px-4 pb-16 pt-12 text-center sm:px-6 sm:pb-24 sm:pt-20 lg:px-8">
          <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
            {t.heroTitle1}{' '}
            <span className="bg-gradient-to-r from-yellow-300 to-amber-300 bg-clip-text text-transparent">
              {t.heroTitle2}
            </span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base text-blue-100/80 sm:text-lg">
            {t.heroSub}
          </p>

          {/* Search bar */}
          <div className="mx-auto mt-8 max-w-2xl">
            <SearchBar
              size="large"
              showFiltersButton={false}
              onSearch={() => router.push('/buscar')}
            />
          </div>

          {/* Quick category pills */}
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {categories.slice(0, 4).map((cat) => (
              <Link
                key={cat.href}
                href={cat.href}
                className="rounded-full bg-white/15 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/25"
              >
                {cat.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-b border-gray-100 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            {[
              { value: '3,200+', label: t.statsListings },
              { value: '1,850+', label: t.statsVerified },
              { value: '28,000+', label: t.statsUsers },
              { value: '31', label: t.statsProvinces },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-2xl font-extrabold text-gray-900 sm:text-3xl">{stat.value}</p>
                <p className="mt-1 text-sm text-gray-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
            {t.categoriesTitle}
          </h2>
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {categories.map((cat) => (
              <Link
                key={cat.href}
                href={cat.href}
                className="group flex flex-col items-center gap-3 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-blue-200"
              >
                <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${cat.color} transition-transform group-hover:scale-110`}>
                  <cat.icon className="h-7 w-7" />
                </div>
                <span className="text-center text-sm font-semibold text-gray-900">{cat.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Listings */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
                {t.featuredTitle}
              </h2>
              <p className="mt-2 text-base text-gray-500">{t.featuredSub}</p>
            </div>
            <Link
              href="/buscar"
              className="hidden items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700 sm:flex"
            >
              {t.viewAll}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.slice(0, 6).map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
          <div className="mt-8 text-center sm:hidden">
            <Link
              href="/buscar"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600"
            >
              {t.viewAll} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Area Guides */}
      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
              {t.areasTitle}
            </h2>
            <p className="mt-2 text-base text-gray-500">{t.areasSub}</p>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {areas.map((guide) => (
              <AreaGuideCard key={guide.slug} guide={guide} />
            ))}
          </div>
        </div>
      </section>

      {/* Why Atlas */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
              {t.whyTitle}
            </h2>
            <p className="mx-auto mt-2 max-w-2xl text-base text-gray-500">{t.whySub}</p>
          </div>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {whyReasons.map((reason) => (
              <div key={reason.title} className="text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100">
                  <reason.icon className="h-7 w-7 text-blue-600" />
                </div>
                <h3 className="mt-4 text-base font-bold text-gray-900">{reason.title}</h3>
                <p className="mt-2 text-sm text-gray-500">{reason.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-br from-blue-600 to-indigo-700 py-16">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-2xl font-extrabold text-white sm:text-4xl">{t.ctaTitle}</h2>
          <p className="mt-4 text-lg text-blue-100/80">{t.ctaSub}</p>
          <Link
            href="/publicar"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-8 py-4 text-base font-bold text-blue-700 shadow-lg transition-all hover:bg-blue-50 hover:shadow-xl"
          >
            {t.ctaButton}
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  )
}
