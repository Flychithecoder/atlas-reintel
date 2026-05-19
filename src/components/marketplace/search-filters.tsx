"use client"

import { X } from "lucide-react"
import { useMarketplaceStore } from "@/store/marketplace"
import { getListingTypeLabel, getPropertyTypeLabel, formatPrice } from "@/lib/marketplace-utils"
import type { ListingType, PropertyType, Province } from "@/types/marketplace"
import { cn } from "@/lib/utils"

const LISTING_TYPES: ListingType[] = ['venta', 'alquiler', 'vacacional', 'habitacion', 'oficina', 'terreno', 'negocio', 'coliving']
const PROPERTY_TYPES: PropertyType[] = ['casa', 'apartamento', 'penthouse', 'villa', 'terreno', 'local_comercial', 'oficina', 'nave_industrial', 'finca', 'solar', 'edificio', 'hotel']
const TOP_PROVINCES: Province[] = ['Distrito Nacional', 'Santo Domingo', 'La Altagracia', 'Puerto Plata', 'Samaná', 'La Romana', 'Santiago', 'La Vega']

const PRICE_RANGES_SALE = [
  { min: 0, max: 100000 },
  { min: 100000, max: 250000 },
  { min: 250000, max: 500000 },
  { min: 500000, max: 1000000 },
  { min: 1000000, max: undefined },
]

const PRICE_RANGES_RENT = [
  { min: 0, max: 500 },
  { min: 500, max: 1000 },
  { min: 1000, max: 2000 },
  { min: 2000, max: 5000 },
  { min: 5000, max: undefined },
]

interface SearchFiltersProps {
  className?: string
}

export function SearchFilters({ className }: SearchFiltersProps) {
  const { locale, currency, searchFilters, setSearchFilters, resetSearchFilters, mobileFiltersOpen, setMobileFiltersOpen } = useMarketplaceStore()

  const isRentalMode = searchFilters.listingType?.some(t => ['alquiler', 'vacacional', 'habitacion', 'oficina', 'coliving'].includes(t))
  const priceRanges = isRentalMode ? PRICE_RANGES_RENT : PRICE_RANGES_SALE

  function toggleArrayFilter<T>(key: 'listingType' | 'propertyType' | 'province', value: T) {
    const current = (searchFilters[key] as T[] | undefined) || []
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value]
    setSearchFilters({ [key]: updated.length > 0 ? updated : undefined })
  }

  const activeCount = [
    searchFilters.listingType?.length,
    searchFilters.propertyType?.length,
    searchFilters.province?.length,
    searchFilters.priceMin != null || searchFilters.priceMax != null ? 1 : 0,
    searchFilters.bedroomsMin ? 1 : 0,
    searchFilters.confoturOnly ? 1 : 0,
    searchFilters.titleVerifiedOnly ? 1 : 0,
  ].reduce((sum: number, v) => sum + (v || 0), 0)

  const content = (
    <div className={cn("space-y-6", className)}>
      {/* Header (mobile only) */}
      <div className="flex items-center justify-between lg:hidden">
        <h3 className="text-lg font-bold text-gray-900">
          {locale === 'es' ? 'Filtros' : 'Filters'}
        </h3>
        <button
          onClick={() => setMobileFiltersOpen(false)}
          className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Listing Type */}
      <div>
        <h4 className="mb-3 text-sm font-semibold text-gray-900">
          {locale === 'es' ? 'Tipo de Listado' : 'Listing Type'}
        </h4>
        <div className="flex flex-wrap gap-2">
          {LISTING_TYPES.map((type) => (
            <button
              key={type}
              onClick={() => toggleArrayFilter('listingType', type)}
              className={cn(
                "rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
                searchFilters.listingType?.includes(type)
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              )}
            >
              {getListingTypeLabel(type, locale)}
            </button>
          ))}
        </div>
      </div>

      {/* Property Type */}
      <div>
        <h4 className="mb-3 text-sm font-semibold text-gray-900">
          {locale === 'es' ? 'Tipo de Propiedad' : 'Property Type'}
        </h4>
        <div className="flex flex-wrap gap-2">
          {PROPERTY_TYPES.map((type) => (
            <button
              key={type}
              onClick={() => toggleArrayFilter('propertyType', type)}
              className={cn(
                "rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
                searchFilters.propertyType?.includes(type)
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              )}
            >
              {getPropertyTypeLabel(type, locale)}
            </button>
          ))}
        </div>
      </div>

      {/* Province */}
      <div>
        <h4 className="mb-3 text-sm font-semibold text-gray-900">
          {locale === 'es' ? 'Provincia' : 'Province'}
        </h4>
        <div className="flex flex-wrap gap-2">
          {TOP_PROVINCES.map((province) => (
            <button
              key={province}
              onClick={() => toggleArrayFilter('province', province)}
              className={cn(
                "rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
                searchFilters.province?.includes(province)
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              )}
            >
              {province}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h4 className="mb-3 text-sm font-semibold text-gray-900">
          {locale === 'es' ? 'Rango de Precio' : 'Price Range'} ({currency})
        </h4>
        <div className="flex flex-wrap gap-2">
          {priceRanges.map((range, i) => {
            const isActive = searchFilters.priceMin === range.min && searchFilters.priceMax === range.max
            const label = range.max
              ? `${formatPrice(range.min, currency)} - ${formatPrice(range.max, currency)}`
              : `${formatPrice(range.min, currency)}+`
            return (
              <button
                key={i}
                onClick={() => setSearchFilters(isActive
                  ? { priceMin: undefined, priceMax: undefined }
                  : { priceMin: range.min, priceMax: range.max }
                )}
                className={cn(
                  "rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
                  isActive ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                )}
              >
                {label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Bedrooms */}
      <div>
        <h4 className="mb-3 text-sm font-semibold text-gray-900">
          {locale === 'es' ? 'Habitaciones' : 'Bedrooms'}
        </h4>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((num) => (
            <button
              key={num}
              onClick={() => setSearchFilters({
                bedroomsMin: searchFilters.bedroomsMin === num ? undefined : num
              })}
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-lg text-sm font-medium transition-colors",
                searchFilters.bedroomsMin === num
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              )}
            >
              {num}+
            </button>
          ))}
        </div>
      </div>

      {/* Special filters */}
      <div className="space-y-3">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={searchFilters.confoturOnly || false}
            onChange={(e) => setSearchFilters({ confoturOnly: e.target.checked || undefined })}
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-sm text-gray-700">
            {locale === 'es' ? 'Solo CONFOTUR (exención fiscal)' : 'CONFOTUR only (tax exempt)'}
          </span>
        </label>
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={searchFilters.titleVerifiedOnly || false}
            onChange={(e) => setSearchFilters({ titleVerifiedOnly: e.target.checked || undefined })}
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-sm text-gray-700">
            {locale === 'es' ? 'Solo título verificado' : 'Title verified only'}
          </span>
        </label>
      </div>

      {/* Actions */}
      <div className="flex gap-3 border-t border-gray-100 pt-4">
        <button
          onClick={() => { resetSearchFilters(); setMobileFiltersOpen(false) }}
          className="flex-1 rounded-xl border border-gray-300 bg-white py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
        >
          {locale === 'es' ? 'Limpiar filtros' : 'Clear filters'}
          {activeCount > 0 && ` (${activeCount})`}
        </button>
        <button
          onClick={() => setMobileFiltersOpen(false)}
          className="flex-1 rounded-xl bg-blue-600 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 lg:hidden"
        >
          {locale === 'es' ? 'Aplicar' : 'Apply'}
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden lg:block">{content}</div>

      {/* Mobile drawer */}
      {mobileFiltersOpen && (
        <>
          <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setMobileFiltersOpen(false)} />
          <div className="fixed inset-y-0 right-0 z-50 w-full max-w-sm overflow-y-auto bg-white p-6 shadow-xl lg:hidden">
            {content}
          </div>
        </>
      )}
    </>
  )
}
