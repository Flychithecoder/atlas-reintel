"use client"

import type { Listing } from "@/types/marketplace"
import { ListingCard } from "./listing-card"
import { useMarketplaceStore } from "@/store/marketplace"

interface ListingGridProps {
  listings: Listing[]
  loading?: boolean
}

export function ListingGrid({ listings, loading }: ListingGridProps) {
  const { locale } = useMarketplaceStore()

  if (loading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="animate-pulse rounded-2xl border border-gray-200 bg-white">
            <div className="aspect-[4/3] rounded-t-2xl bg-gray-200" />
            <div className="p-4 space-y-3">
              <div className="h-6 w-24 rounded bg-gray-200" />
              <div className="h-4 w-48 rounded bg-gray-200" />
              <div className="h-3 w-36 rounded bg-gray-200" />
              <div className="flex gap-4 pt-3 border-t border-gray-100">
                <div className="h-3 w-12 rounded bg-gray-200" />
                <div className="h-3 w-12 rounded bg-gray-200" />
                <div className="h-3 w-16 rounded bg-gray-200" />
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (listings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100">
          <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <h3 className="mt-4 text-lg font-semibold text-gray-900">
          {locale === 'es' ? 'No se encontraron propiedades' : 'No properties found'}
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          {locale === 'es' ? 'Intenta ajustar tus filtros de búsqueda' : 'Try adjusting your search filters'}
        </p>
      </div>
    )
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {listings.map((listing) => (
        <ListingCard key={listing.id} listing={listing} />
      ))}
    </div>
  )
}
