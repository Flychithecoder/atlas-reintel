"use client"

import { useState } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Upload,
  MapPin,
  Home,
  DollarSign,
  Image as ImageIcon,
  FileText,
} from "lucide-react"
import { useMarketplaceStore } from "@/store/marketplace"
import { getListingTypeLabel, getPropertyTypeLabel, getAmenityLabel } from "@/lib/marketplace-utils"
import { AMENITIES } from "@/types/marketplace"
import type { ListingType, PropertyType, Amenity } from "@/types/marketplace"
import { cn } from "@/lib/utils"

const STEPS = [
  { key: 'type', icon: Home },
  { key: 'location', icon: MapPin },
  { key: 'details', icon: FileText },
  { key: 'media', icon: ImageIcon },
  { key: 'pricing', icon: DollarSign },
  { key: 'review', icon: Check },
]

const LISTING_TYPES: ListingType[] = ['venta', 'alquiler', 'vacacional', 'habitacion', 'oficina', 'terreno', 'negocio', 'coliving']
const PROPERTY_TYPES: PropertyType[] = ['casa', 'apartamento', 'penthouse', 'villa', 'terreno', 'local_comercial', 'oficina', 'nave_industrial', 'finca', 'solar', 'edificio', 'hotel']

interface FormData {
  listingType: ListingType | ''
  propertyType: PropertyType | ''
  province: string
  municipality: string
  sector: string
  address: string
  title_es: string
  title_en: string
  description_es: string
  bedrooms: string
  bathrooms: string
  sqmt: string
  lotSize: string
  yearBuilt: string
  amenities: string[]
  price: string
  currency: 'DOP' | 'USD'
  confoturEligible: boolean
}

export default function PublishPage() {
  const { locale } = useMarketplaceStore()
  const [step, setStep] = useState(0)
  const [form, setForm] = useState<FormData>({
    listingType: '',
    propertyType: '',
    province: '',
    municipality: '',
    sector: '',
    address: '',
    title_es: '',
    title_en: '',
    description_es: '',
    bedrooms: '',
    bathrooms: '',
    sqmt: '',
    lotSize: '',
    yearBuilt: '',
    amenities: [],
    price: '',
    currency: 'USD',
    confoturEligible: false,
  })

  const update = (partial: Partial<FormData>) => setForm((prev) => ({ ...prev, ...partial }))

  const t = locale === 'es' ? {
    title: 'Publicar Propiedad',
    subtitle: 'Llega a miles de compradores e inquilinos. Publica en 2 minutos.',
    next: 'Siguiente',
    back: 'Atrás',
    publish: 'Publicar Gratis',
    stepType: 'Tipo',
    stepLocation: 'Ubicación',
    stepDetails: 'Detalles',
    stepMedia: 'Fotos',
    stepPricing: 'Precio',
    stepReview: 'Revisar',
    selectListingType: '¿Qué quieres hacer?',
    selectPropertyType: '¿Qué tipo de propiedad es?',
    whereIsProperty: '¿Dónde está la propiedad?',
    province: 'Provincia',
    municipality: 'Municipio',
    sector: 'Sector / Barrio',
    address: 'Dirección',
    titleLabel: 'Título del anuncio (Español)',
    titleEnLabel: 'Título en inglés (opcional)',
    descriptionLabel: 'Descripción (Español)',
    bedrooms: 'Habitaciones',
    bathrooms: 'Baños',
    sqmt: 'Metros cuadrados',
    lotSize: 'Tamaño del terreno (m²)',
    yearBuilt: 'Año de construcción',
    amenitiesLabel: 'Amenidades',
    uploadPhotos: 'Sube fotos de tu propiedad',
    uploadHint: 'Arrastra fotos aquí o haz clic para seleccionar. Hasta 20 fotos. Primera foto será la portada.',
    priceLabel: 'Precio',
    currency: 'Moneda',
    confotur: 'Esta propiedad es elegible CONFOTUR',
    reviewTitle: 'Revisa tu anuncio',
    publishing: 'Tu anuncio será publicado inmediatamente y visible para miles de compradores potenciales.',
    success: '¡Propiedad publicada exitosamente!',
  } : {
    title: 'List Property',
    subtitle: 'Reach thousands of buyers and renters. List in 2 minutes.',
    next: 'Next',
    back: 'Back',
    publish: 'Publish Free',
    stepType: 'Type',
    stepLocation: 'Location',
    stepDetails: 'Details',
    stepMedia: 'Photos',
    stepPricing: 'Price',
    stepReview: 'Review',
    selectListingType: 'What do you want to do?',
    selectPropertyType: 'What type of property is it?',
    whereIsProperty: 'Where is the property?',
    province: 'Province',
    municipality: 'Municipality',
    sector: 'Sector / Neighborhood',
    address: 'Address',
    titleLabel: 'Listing title (Spanish)',
    titleEnLabel: 'Title in English (optional)',
    descriptionLabel: 'Description (Spanish)',
    bedrooms: 'Bedrooms',
    bathrooms: 'Bathrooms',
    sqmt: 'Square meters',
    lotSize: 'Lot size (m²)',
    yearBuilt: 'Year built',
    amenitiesLabel: 'Amenities',
    uploadPhotos: 'Upload photos of your property',
    uploadHint: 'Drag photos here or click to select. Up to 20 photos. First photo will be the cover.',
    priceLabel: 'Price',
    currency: 'Currency',
    confotur: 'This property is CONFOTUR eligible',
    reviewTitle: 'Review your listing',
    publishing: 'Your listing will be published immediately and visible to thousands of potential buyers.',
    success: 'Property published successfully!',
  }

  const stepLabels = [t.stepType, t.stepLocation, t.stepDetails, t.stepMedia, t.stepPricing, t.stepReview]

  return (
    <div className="pb-16 sm:pb-0">
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/inicio" className="mb-4 inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900">
            <ArrowLeft className="h-4 w-4" />
            {t.back}
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">{t.title}</h1>
          <p className="mt-1 text-sm text-gray-500">{t.subtitle}</p>
        </div>

        {/* Progress */}
        <div className="mb-10 flex items-center justify-between">
          {STEPS.map((s, i) => (
            <div key={s.key} className="flex items-center">
              <button
                onClick={() => i < step && setStep(i)}
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold transition-all",
                  i < step ? "bg-blue-600 text-white" :
                  i === step ? "bg-blue-600 text-white ring-4 ring-blue-100" :
                  "bg-gray-100 text-gray-400"
                )}
              >
                {i < step ? <Check className="h-5 w-5" /> : <s.icon className="h-4 w-4" />}
              </button>
              {i < STEPS.length - 1 && (
                <div className={cn("mx-2 hidden h-0.5 w-8 sm:block", i < step ? "bg-blue-600" : "bg-gray-200")} />
              )}
            </div>
          ))}
        </div>

        <p className="mb-6 text-sm font-medium text-blue-600">
          {locale === 'es' ? 'Paso' : 'Step'} {step + 1} / {STEPS.length}: {stepLabels[step]}
        </p>

        {/* Step content */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          {/* Step 0: Type */}
          {step === 0 && (
            <div className="space-y-8">
              <div>
                <h2 className="text-lg font-bold text-gray-900">{t.selectListingType}</h2>
                <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {LISTING_TYPES.map((type) => (
                    <button
                      key={type}
                      onClick={() => update({ listingType: type })}
                      className={cn(
                        "rounded-xl border-2 px-4 py-3 text-sm font-semibold transition-all",
                        form.listingType === type
                          ? "border-blue-600 bg-blue-50 text-blue-700"
                          : "border-gray-200 text-gray-700 hover:border-gray-300"
                      )}
                    >
                      {getListingTypeLabel(type, locale)}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">{t.selectPropertyType}</h2>
                <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {PROPERTY_TYPES.map((type) => (
                    <button
                      key={type}
                      onClick={() => update({ propertyType: type })}
                      className={cn(
                        "rounded-xl border-2 px-4 py-3 text-sm font-semibold transition-all",
                        form.propertyType === type
                          ? "border-blue-600 bg-blue-50 text-blue-700"
                          : "border-gray-200 text-gray-700 hover:border-gray-300"
                      )}
                    >
                      {getPropertyTypeLabel(type, locale)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 1: Location */}
          {step === 1 && (
            <div className="space-y-5">
              <h2 className="text-lg font-bold text-gray-900">{t.whereIsProperty}</h2>
              {[
                { key: 'province', label: t.province },
                { key: 'municipality', label: t.municipality },
                { key: 'sector', label: t.sector },
                { key: 'address', label: t.address },
              ].map((field) => (
                <div key={field.key}>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">{field.label}</label>
                  <input
                    type="text"
                    value={(form as any)[field.key]}
                    onChange={(e) => update({ [field.key]: e.target.value })}
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              ))}
            </div>
          )}

          {/* Step 2: Details */}
          {step === 2 && (
            <div className="space-y-5">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">{t.titleLabel}</label>
                <input
                  type="text"
                  value={form.title_es}
                  onChange={(e) => update({ title_es: e.target.value })}
                  placeholder={locale === 'es' ? 'ej: Apartamento moderno en Piantini' : 'e.g. Modern apartment in Piantini'}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">{t.descriptionLabel}</label>
                <textarea
                  value={form.description_es}
                  onChange={(e) => update({ description_es: e.target.value })}
                  rows={4}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                {[
                  { key: 'bedrooms', label: t.bedrooms, type: 'number' },
                  { key: 'bathrooms', label: t.bathrooms, type: 'number' },
                  { key: 'sqmt', label: t.sqmt, type: 'number' },
                  { key: 'lotSize', label: t.lotSize, type: 'number' },
                  { key: 'yearBuilt', label: t.yearBuilt, type: 'number' },
                ].map((field) => (
                  <div key={field.key}>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">{field.label}</label>
                    <input
                      type={field.type}
                      value={(form as any)[field.key]}
                      onChange={(e) => update({ [field.key]: e.target.value })}
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                ))}
              </div>
              <div>
                <label className="mb-3 block text-sm font-medium text-gray-700">{t.amenitiesLabel}</label>
                <div className="flex flex-wrap gap-2">
                  {AMENITIES.map((amenity) => (
                    <button
                      key={amenity}
                      onClick={() => {
                        const current = form.amenities
                        update({
                          amenities: current.includes(amenity)
                            ? current.filter((a) => a !== amenity)
                            : [...current, amenity]
                        })
                      }}
                      className={cn(
                        "rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
                        form.amenities.includes(amenity)
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      )}
                    >
                      {getAmenityLabel(amenity, locale)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Media */}
          {step === 3 && (
            <div>
              <h2 className="text-lg font-bold text-gray-900">{t.uploadPhotos}</h2>
              <div className="mt-4 flex min-h-[240px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 p-8 text-center transition-colors hover:border-blue-400 hover:bg-blue-50/30">
                <Upload className="h-10 w-10 text-gray-400" />
                <p className="mt-3 text-sm text-gray-600">{t.uploadHint}</p>
              </div>
            </div>
          )}

          {/* Step 4: Pricing */}
          {step === 4 && (
            <div className="space-y-5">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">{t.priceLabel}</label>
                <div className="flex gap-3">
                  <input
                    type="number"
                    value={form.price}
                    onChange={(e) => update({ price: e.target.value })}
                    placeholder="0"
                    className="flex-1 rounded-xl border border-gray-300 px-4 py-3 text-lg font-semibold text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                  <select
                    value={form.currency}
                    onChange={(e) => update({ currency: e.target.value as 'DOP' | 'USD' })}
                    className="rounded-xl border border-gray-300 px-4 py-3 text-sm font-semibold text-gray-700"
                  >
                    <option value="USD">USD $</option>
                    <option value="DOP">DOP RD$</option>
                  </select>
                </div>
              </div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.confoturEligible}
                  onChange={(e) => update({ confoturEligible: e.target.checked })}
                  className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">{t.confotur}</span>
              </label>
            </div>
          )}

          {/* Step 5: Review */}
          {step === 5 && (
            <div>
              <h2 className="text-lg font-bold text-gray-900">{t.reviewTitle}</h2>
              <p className="mt-2 text-sm text-gray-500">{t.publishing}</p>
              <div className="mt-6 space-y-3 rounded-xl border border-gray-200 bg-gray-50 p-5">
                {[
                  { label: t.stepType, value: `${form.listingType ? getListingTypeLabel(form.listingType, locale) : '—'} / ${form.propertyType ? getPropertyTypeLabel(form.propertyType, locale) : '—'}` },
                  { label: t.stepLocation, value: [form.sector, form.municipality, form.province].filter(Boolean).join(', ') || '—' },
                  { label: t.titleLabel, value: form.title_es || '—' },
                  { label: t.priceLabel, value: form.price ? `${form.currency === 'USD' ? '$' : 'RD$'}${Number(form.price).toLocaleString()}` : '—' },
                  { label: t.sqmt, value: form.sqmt ? `${form.sqmt} m²` : '—' },
                ].map((item) => (
                  <div key={item.label} className="flex justify-between text-sm">
                    <span className="text-gray-500">{item.label}</span>
                    <span className="font-medium text-gray-900">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="mt-6 flex justify-between">
          <button
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
            className={cn(
              "flex items-center gap-1.5 rounded-xl px-5 py-3 text-sm font-semibold transition-colors",
              step === 0
                ? "cursor-not-allowed text-gray-300"
                : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
            )}
          >
            <ArrowLeft className="h-4 w-4" />
            {t.back}
          </button>
          {step < STEPS.length - 1 ? (
            <button
              onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))}
              className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
            >
              {t.next}
              <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <Link
              href="/publicar/exito"
              className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
            >
              <Check className="h-4 w-4" />
              {t.publish}
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
