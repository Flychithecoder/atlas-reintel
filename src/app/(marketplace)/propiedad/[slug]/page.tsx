"use client"

import { use } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  Heart,
  Share2,
  MapPin,
  Bed,
  Bath,
  Maximize,
  Calendar,
  Eye,
  Shield,
  BadgeCheck,
  Phone,
  Mail,
  ChevronLeft,
  ChevronRight,
  Star,
  Flag,
  Printer,
  ExternalLink,
} from "lucide-react"
import { WhatsAppButton } from "@/components/marketplace/whatsapp-button"
import { ListingCard } from "@/components/marketplace/listing-card"
import { CurrencyToggle } from "@/components/marketplace/currency-toggle"
import { useMarketplaceStore } from "@/store/marketplace"
import { useMockListings, useMockListingBySlug } from "@/hooks/use-mock-listings"
import {
  formatPrice,
  getListingTypeLabel,
  getListingTypeColor,
  getPropertyTypeLabel,
  getAmenityLabel,
  formatSqmt,
} from "@/lib/marketplace-utils"
import type { Amenity } from "@/types/marketplace"
import { cn } from "@/lib/utils"
import { useState } from "react"

export default function PropertyDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const { locale, currency, toggleSavedListing, savedListings } = useMarketplaceStore()
  const listing = useMockListingBySlug(slug)
  const allListings = useMockListings()
  const [currentImage, setCurrentImage] = useState(0)

  if (!listing) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
        <h1 className="text-2xl font-bold text-gray-900">
          {locale === 'es' ? 'Propiedad no encontrada' : 'Property not found'}
        </h1>
        <p className="mt-2 text-gray-500">
          {locale === 'es' ? 'La propiedad que buscas no existe o fue removida.' : 'The property you\'re looking for doesn\'t exist or was removed.'}
        </p>
        <Link href="/buscar" className="mt-6 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700">
          {locale === 'es' ? 'Ver propiedades' : 'Browse properties'}
        </Link>
      </div>
    )
  }

  const title = locale === 'es' ? listing.title_es : listing.title_en
  const description = locale === 'es' ? listing.description_es : listing.description_en
  const displayPrice = currency === 'USD' ? listing.priceUSD : listing.priceDOP
  const isSaved = savedListings.includes(listing.id)
  const isRental = ['alquiler', 'vacacional', 'habitacion', 'oficina', 'coliving'].includes(listing.listingType)

  const similarListings = allListings
    .filter((l) => l.id !== listing.id && l.province === listing.province && l.status === 'active')
    .slice(0, 3)

  const t = locale === 'es' ? {
    back: 'Volver',
    share: 'Compartir',
    save: 'Guardar',
    saved: 'Guardado',
    details: 'Detalles',
    description: 'Descripción',
    amenities: 'Amenidades',
    location: 'Ubicación',
    contact: 'Contactar',
    contactOwner: 'Contactar al propietario',
    callNow: 'Llamar ahora',
    sendEmail: 'Enviar correo',
    bedrooms: 'Habitaciones',
    bathrooms: 'Baños',
    area: 'Área',
    lotSize: 'Terreno',
    yearBuilt: 'Año de construcción',
    propertyType: 'Tipo de propiedad',
    listingType: 'Tipo de listado',
    verified: 'Título Verificado',
    unverified: 'Título No Verificado',
    confotur: 'Elegible CONFOTUR — Exención fiscal hasta 15 años',
    views: 'vistas',
    similar: 'Propiedades Similares',
    perMonth: '/mes',
    perNight: '/noche',
    report: 'Reportar',
    print: 'Imprimir',
    province: 'Provincia',
    municipality: 'Municipio',
    sector: 'Sector',
    pricePerSqmt: 'Precio por m²',
  } : {
    back: 'Back',
    share: 'Share',
    save: 'Save',
    saved: 'Saved',
    details: 'Details',
    description: 'Description',
    amenities: 'Amenities',
    location: 'Location',
    contact: 'Contact',
    contactOwner: 'Contact owner',
    callNow: 'Call now',
    sendEmail: 'Send email',
    bedrooms: 'Bedrooms',
    bathrooms: 'Bathrooms',
    area: 'Area',
    lotSize: 'Lot size',
    yearBuilt: 'Year built',
    propertyType: 'Property type',
    listingType: 'Listing type',
    verified: 'Title Verified',
    unverified: 'Title Not Verified',
    confotur: 'CONFOTUR Eligible — Tax exemption up to 15 years',
    views: 'views',
    similar: 'Similar Properties',
    perMonth: '/mo',
    perNight: '/night',
    report: 'Report',
    print: 'Print',
    province: 'Province',
    municipality: 'Municipality',
    sector: 'Sector',
    pricePerSqmt: 'Price per m²',
  }

  const priceSuffix = listing.listingType === 'vacacional' ? t.perNight : isRental ? t.perMonth : ''
  const pricePerSqmt = listing.sqmt > 0 ? Math.round(listing.priceUSD / listing.sqmt) : 0

  return (
    <div className="pb-28 sm:pb-0">
      {/* Top bar */}
      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <Link href="/buscar" className="flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-gray-900">
            <ArrowLeft className="h-4 w-4" />
            {t.back}
          </Link>
          <div className="flex items-center gap-2">
            <CurrencyToggle />
            <button
              onClick={() => toggleSavedListing(listing.id)}
              className={cn(
                "flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium transition-colors",
                isSaved ? "border-red-200 bg-red-50 text-red-600" : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
              )}
            >
              <Heart className={cn("h-4 w-4", isSaved && "fill-current")} />
              {isSaved ? t.saved : t.save}
            </button>
            <button className="hidden items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 sm:flex">
              <Share2 className="h-4 w-4" />
              {t.share}
            </button>
          </div>
        </div>
      </div>

      {/* Image gallery */}
      <div className="relative bg-gray-100">
        <div className="mx-auto max-w-7xl">
          <div className="relative aspect-[16/9] overflow-hidden sm:aspect-[2.5/1]">
            {listing.media[currentImage] ? (
              <img
                src={listing.media[currentImage].url}
                alt={title}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-gray-400">
                <Maximize className="h-12 w-12" />
              </div>
            )}

            {listing.media.length > 1 && (
              <>
                <button
                  onClick={() => setCurrentImage((p) => (p - 1 + listing.media.length) % listing.media.length)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow-md backdrop-blur-sm hover:bg-white"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setCurrentImage((p) => (p + 1) % listing.media.length)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow-md backdrop-blur-sm hover:bg-white"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-3 py-1 text-sm text-white backdrop-blur-sm">
                  {currentImage + 1} / {listing.media.length}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header */}
            <div>
              <div className="flex flex-wrap gap-2">
                <span className={cn("rounded-full px-3 py-1 text-xs font-semibold", getListingTypeColor(listing.listingType))}>
                  {getListingTypeLabel(listing.listingType, locale)}
                </span>
                {listing.confoturEligible && (
                  <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700">CONFOTUR</span>
                )}
                {listing.titleVerified && (
                  <span className="flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                    <Shield className="h-3 w-3" />
                    {t.verified}
                  </span>
                )}
              </div>
              <h1 className="mt-3 text-2xl font-bold text-gray-900 sm:text-3xl">{title}</h1>
              <p className="mt-2 flex items-center gap-1.5 text-base text-gray-500">
                <MapPin className="h-4 w-4 shrink-0" />
                {listing.address}, {listing.municipality}, {listing.province}
              </p>
              <div className="mt-4 flex items-baseline gap-2">
                <p className="text-3xl font-extrabold text-gray-900">
                  {formatPrice(displayPrice, currency)}
                </p>
                {priceSuffix && <span className="text-lg text-gray-500">{priceSuffix}</span>}
              </div>
              <div className="mt-1 flex items-center gap-3 text-sm text-gray-500">
                <span className="flex items-center gap-1"><Eye className="h-3.5 w-3.5" /> {listing.views.toLocaleString()} {t.views}</span>
                <span>ID: {listing.id}</span>
              </div>
            </div>

            {/* Quick stats */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {[
                listing.bedrooms != null && { icon: Bed, label: t.bedrooms, value: listing.bedrooms },
                listing.bathrooms != null && { icon: Bath, label: t.bathrooms, value: listing.bathrooms },
                { icon: Maximize, label: t.area, value: formatSqmt(listing.sqmt, locale) },
                listing.yearBuilt && { icon: Calendar, label: t.yearBuilt, value: listing.yearBuilt },
              ].filter(Boolean).map((stat: any) => (
                <div key={stat.label} className="rounded-xl border border-gray-200 bg-gray-50/50 p-4">
                  <stat.icon className="h-5 w-5 text-blue-600" />
                  <p className="mt-2 text-sm text-gray-500">{stat.label}</p>
                  <p className="text-lg font-bold text-gray-900">{stat.value}</p>
                </div>
              ))}
            </div>

            {/* Alerts */}
            {listing.confoturEligible && (
              <div className="rounded-xl border border-yellow-200 bg-yellow-50 px-5 py-4">
                <p className="flex items-center gap-2 text-sm font-semibold text-yellow-800">
                  <BadgeCheck className="h-5 w-5" />
                  {t.confotur}
                </p>
              </div>
            )}

            {/* Description */}
            <div>
              <h2 className="text-lg font-bold text-gray-900">{t.description}</h2>
              <p className="mt-3 text-base leading-7 text-gray-600 whitespace-pre-line">{description}</p>
            </div>

            {/* Details table */}
            <div>
              <h2 className="text-lg font-bold text-gray-900">{t.details}</h2>
              <dl className="mt-4 grid grid-cols-2 gap-4">
                {[
                  { label: t.propertyType, value: getPropertyTypeLabel(listing.propertyType, locale) },
                  { label: t.listingType, value: getListingTypeLabel(listing.listingType, locale) },
                  { label: t.province, value: listing.province },
                  { label: t.municipality, value: listing.municipality },
                  listing.sector && { label: t.sector, value: listing.sector },
                  { label: t.area, value: formatSqmt(listing.sqmt, locale) },
                  listing.lotSize && { label: t.lotSize, value: formatSqmt(listing.lotSize, locale) },
                  pricePerSqmt > 0 && { label: t.pricePerSqmt, value: formatPrice(pricePerSqmt, 'USD') },
                ].filter(Boolean).map((item: any) => (
                  <div key={item.label} className="border-b border-gray-100 pb-3">
                    <dt className="text-sm text-gray-500">{item.label}</dt>
                    <dd className="mt-1 text-sm font-semibold text-gray-900">{item.value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* Amenities */}
            {listing.amenities.length > 0 && (
              <div>
                <h2 className="text-lg font-bold text-gray-900">{t.amenities}</h2>
                <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {listing.amenities.map((amenity) => (
                    <div key={amenity} className="flex items-center gap-2 text-sm text-gray-700">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100">
                        <BadgeCheck className="h-3.5 w-3.5 text-blue-600" />
                      </div>
                      {getAmenityLabel(amenity as Amenity, locale)}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar — Contact */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-4">
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900">{t.contactOwner}</h3>
                <div className="mt-4 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-lg font-bold text-blue-600">
                    {listing.ownerName.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{listing.ownerName}</p>
                    <p className="text-xs text-gray-500">{locale === 'es' ? 'Propietario' : 'Owner'}</p>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  {listing.ownerWhatsapp && (
                    <WhatsAppButton
                      phone={listing.ownerWhatsapp}
                      listingTitle={title}
                      size="large"
                      className="w-full"
                    />
                  )}
                  {listing.ownerPhone && (
                    <a
                      href={`tel:${listing.ownerPhone}`}
                      className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-6 py-3.5 text-base font-semibold text-gray-700 transition-colors hover:bg-gray-50"
                    >
                      <Phone className="h-5 w-5" />
                      {t.callNow}
                    </a>
                  )}
                </div>
              </div>

              {/* Title verification */}
              <div className={cn(
                "rounded-2xl border p-5",
                listing.titleVerified
                  ? "border-emerald-200 bg-emerald-50"
                  : "border-orange-200 bg-orange-50"
              )}>
                <div className="flex items-center gap-2">
                  <Shield className={cn("h-5 w-5", listing.titleVerified ? "text-emerald-600" : "text-orange-600")} />
                  <p className={cn("font-semibold", listing.titleVerified ? "text-emerald-800" : "text-orange-800")}>
                    {listing.titleVerified ? t.verified : t.unverified}
                  </p>
                </div>
                <p className={cn("mt-2 text-sm", listing.titleVerified ? "text-emerald-700" : "text-orange-700")}>
                  {listing.titleVerified
                    ? (locale === 'es'
                      ? 'Esta propiedad ha sido verificada contra el Registro de Títulos de República Dominicana.'
                      : 'This property has been verified against the Dominican Republic Title Registry.')
                    : (locale === 'es'
                      ? 'Esta propiedad aún no ha sido verificada. Solicita una verificación de título antes de comprar.'
                      : 'This property has not been verified yet. Request a title verification before purchasing.')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Similar listings */}
        {similarListings.length > 0 && (
          <div className="mt-16">
            <h2 className="text-xl font-bold text-gray-900">{t.similar}</h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {similarListings.map((l) => (
                <ListingCard key={l.id} listing={l} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
