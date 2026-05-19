"use client"

import { Suspense, useMemo } from "react"
import { useSearchParams } from "next/navigation"
import { Grid3X3, Map, Columns2, SlidersHorizontal } from "lucide-react"
import { SearchBar } from "@/components/marketplace/search-bar"
import { SearchFilters } from "@/components/marketplace/search-filters"
import { ListingGrid } from "@/components/marketplace/listing-grid"
import { CurrencyToggle } from "@/components/marketplace/currency-toggle"
import { useMarketplaceStore } from "@/store/marketplace"
import { useMockListings } from "@/hooks/use-mock-listings"
import type { Listing, ListingType, PropertyType, Province, SearchFilters as SearchFiltersType } from "@/types/marketplace"
import { cn } from "@/lib/utils"

function filterListings(listings: Listing[], filters: SearchFiltersType): Listing[] {
  let results = [...listings].filter((l) => l.status === 'active')

  if (filters.query) {
    const q = filters.query.toLowerCase()
    results = results.filter((l) =>
      l.title_es.toLowerCase().includes(q) ||
      l.title_en.toLowerCase().includes(q) ||
      l.municipality.toLowerCase().includes(q) ||
      l.province.toLowerCase().includes(q) ||
      (l.sector && l.sector.toLowerCase().includes(q)) ||
      l.address.toLowerCase().includes(q)
    )
  }

  if (filters.listingType?.length) {
    results = results.filter((l) => filters.listingType!.includes(l.listingType))
  }

  if (filters.propertyType?.length) {
    results = results.filter((l) => filters.propertyType!.includes(l.propertyType))
  }

  if (filters.province?.length) {
    results = results.filter((l) => filters.province!.includes(l.province))
  }

  if (filters.priceMin != null) {
    results = results.filter((l) => {
      const price = filters.currency === 'USD' ? l.priceUSD : l.priceDOP
      return price >= filters.priceMin!
    })
  }

  if (filters.priceMax != null) {
    results = results.filter((l) => {
      const price = filters.currency === 'USD' ? l.priceUSD : l.priceDOP
      return price <= filters.priceMax!
    })
  }

  if (filters.bedroomsMin) {
    results = results.filter((l) => (l.bedrooms || 0) >= filters.bedroomsMin!)
  }

  if (filters.confoturOnly) {
    results = results.filter((l) => l.confoturEligible)
  }

  if (filters.titleVerifiedOnly) {
    results = results.filter((l) => l.titleVerified)
  }

  switch (filters.sortBy) {
    case 'price_asc':
      results.sort((a, b) => a.priceUSD - b.priceUSD)
      break
    case 'price_desc':
      results.sort((a, b) => b.priceUSD - a.priceUSD)
      break
    case 'popular':
      results.sort((a, b) => b.views - a.views)
      break
    case 'newest':
    default:
      results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }

  return results
}

function SearchPageContent() {
  const { locale, searchFilters, setSearchFilters, viewMode, setViewMode, setMobileFiltersOpen } = useMarketplaceStore()
  const allListings = useMockListings()
  const searchParams = useSearchParams()

  const effectiveFilters = useMemo(() => {
    const urlListingType = searchParams.get('listingType') as ListingType | null
    const urlLocation = searchParams.get('location')
    return {
      ...searchFilters,
      ...(urlListingType && !searchFilters.listingType?.length ? { listingType: [urlListingType] } : {}),
      ...(urlLocation && !searchFilters.query ? { query: urlLocation } : {}),
    }
  }, [searchFilters, searchParams])

  const results = useMemo(() => filterListings(allListings, effectiveFilters), [allListings, effectiveFilters])

  const t = locale === 'es' ? {
    title: 'Buscar Propiedades',
    results: 'resultados',
    sortNewest: 'Más recientes',
    sortPriceAsc: 'Precio: menor a mayor',
    sortPriceDesc: 'Precio: mayor a menor',
    sortPopular: 'Más populares',
    filters: 'Filtros',
  } : {
    title: 'Search Properties',
    results: 'results',
    sortNewest: 'Newest',
    sortPriceAsc: 'Price: low to high',
    sortPriceDesc: 'Price: high to low',
    sortPopular: 'Most popular',
    filters: 'Filters',
  }

  return (
    <div className="pb-16 sm:pb-0">
      {/* Search header */}
      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <SearchBar onSearch={() => {}} />
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex gap-8">
          {/* Sidebar filters (desktop) */}
          <aside className="hidden w-72 shrink-0 lg:block">
            <div className="sticky top-24 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <SearchFilters />
            </div>
          </aside>

          {/* Results */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h1 className="text-xl font-bold text-gray-900">{t.title}</h1>
                <p className="mt-0.5 text-sm text-gray-500">
                  {results.length} {t.results}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <CurrencyToggle />

                {/* Sort */}
                <select
                  value={searchFilters.sortBy}
                  onChange={(e) => setSearchFilters({ sortBy: e.target.value as any })}
                  className="hidden rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 sm:block"
                >
                  <option value="newest">{t.sortNewest}</option>
                  <option value="price_asc">{t.sortPriceAsc}</option>
                  <option value="price_desc">{t.sortPriceDesc}</option>
                  <option value="popular">{t.sortPopular}</option>
                </select>

                {/* View toggle */}
                <div className="hidden items-center rounded-lg border border-gray-200 bg-gray-50 p-0.5 sm:flex">
                  {[
                    { mode: 'grid' as const, icon: Grid3X3 },
                    { mode: 'split' as const, icon: Columns2 },
                    { mode: 'map' as const, icon: Map },
                  ].map(({ mode, icon: Icon }) => (
                    <button
                      key={mode}
                      onClick={() => setViewMode(mode)}
                      className={cn(
                        "rounded-md p-2 transition-all",
                        viewMode === mode ? "bg-white text-gray-900 shadow-sm" : "text-gray-400 hover:text-gray-600"
                      )}
                    >
                      <Icon className="h-4 w-4" />
                    </button>
                  ))}
                </div>

                {/* Mobile filter button */}
                <button
                  onClick={() => setMobileFiltersOpen(true)}
                  className="flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 lg:hidden"
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  {t.filters}
                </button>
              </div>
            </div>

            {/* Listing results */}
            <ListingGrid listings={results} />
          </div>
        </div>
      </div>

      {/* Mobile filters */}
      <SearchFilters />
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense>
      <SearchPageContent />
    </Suspense>
  )
}
