"use client"

import Link from "next/link"
import { ArrowLeft, Heart } from "lucide-react"
import { ListingCard } from "@/components/marketplace/listing-card"
import { useMarketplaceStore } from "@/store/marketplace"
import { useMockListings } from "@/hooks/use-mock-listings"

export default function FavoritesPage() {
  const { locale, savedListings } = useMarketplaceStore()
  const allListings = useMockListings()
  const favorites = allListings.filter((l) => savedListings.includes(l.id))

  const t = locale === 'es' ? {
    title: 'Favoritos',
    empty: 'No tienes propiedades guardadas',
    emptyHint: 'Toca el corazón en cualquier propiedad para guardarla aquí.',
    browse: 'Explorar propiedades',
    back: 'Mi Cuenta',
  } : {
    title: 'Favorites',
    empty: 'No saved properties',
    emptyHint: 'Tap the heart on any property to save it here.',
    browse: 'Browse properties',
    back: 'My Account',
  }

  return (
    <div className="pb-16 sm:pb-0">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Link href="/cuenta" className="mb-4 inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900">
          <ArrowLeft className="h-4 w-4" />
          {t.back}
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">{t.title}</h1>

        {favorites.length === 0 ? (
          <div className="mt-16 flex flex-col items-center text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100">
              <Heart className="h-8 w-8 text-gray-400" />
            </div>
            <h2 className="mt-4 text-lg font-semibold text-gray-900">{t.empty}</h2>
            <p className="mt-1 text-sm text-gray-500">{t.emptyHint}</p>
            <Link href="/buscar" className="mt-6 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700">
              {t.browse}
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {favorites.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
