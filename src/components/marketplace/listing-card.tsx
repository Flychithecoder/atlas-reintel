"use client"

import Link from "next/link"
import { Heart, MapPin, Bed, Bath, Maximize, Shield, BadgeCheck, Star } from "lucide-react"
import type { Listing } from "@/types/marketplace"
import { useMarketplaceStore } from "@/store/marketplace"
import { formatPrice, getListingTypeLabel, getListingTypeColor, formatSqmt } from "@/lib/marketplace-utils"
import { cn } from "@/lib/utils"

interface ListingCardProps {
  listing: Listing
  compact?: boolean
}

export function ListingCard({ listing, compact }: ListingCardProps) {
  const { locale, currency, toggleSavedListing, savedListings } = useMarketplaceStore()
  const isSaved = savedListings.includes(listing.id)

  const title = locale === 'es' ? listing.title_es : listing.title_en
  const displayPrice = currency === 'USD' ? listing.priceUSD : listing.priceDOP
  const isRental = ['alquiler', 'vacacional', 'habitacion', 'oficina', 'coliving'].includes(listing.listingType)

  return (
    <Link
      href={`/propiedad/${listing.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-lg hover:border-gray-300"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
        {listing.media[0] ? (
          <img
            src={listing.media[0].url}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-gray-400">
            <Maximize className="h-8 w-8" />
          </div>
        )}

        {/* Badges overlay */}
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          <span className={cn("rounded-full px-2.5 py-1 text-xs font-semibold", getListingTypeColor(listing.listingType))}>
            {getListingTypeLabel(listing.listingType, locale)}
          </span>
          {listing.confoturEligible && (
            <span className="rounded-full bg-yellow-100 px-2.5 py-1 text-xs font-semibold text-yellow-700">
              CONFOTUR
            </span>
          )}
          {listing.featured && (
            <span className="rounded-full bg-blue-600 px-2.5 py-1 text-xs font-semibold text-white">
              <Star className="mr-1 inline h-3 w-3" />
              {locale === 'es' ? 'Destacado' : 'Featured'}
            </span>
          )}
        </div>

        {/* Save button */}
        <button
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            toggleSavedListing(listing.id)
          }}
          className={cn(
            "absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm transition-all hover:bg-white",
            isSaved && "text-red-500"
          )}
        >
          <Heart className={cn("h-5 w-5", isSaved && "fill-current")} />
        </button>

        {/* Title verified badge */}
        {listing.titleVerified && (
          <div className="absolute bottom-3 left-3 flex items-center gap-1 rounded-full bg-emerald-600/90 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
            <Shield className="h-3 w-3" />
            {locale === 'es' ? 'Título Verificado' : 'Title Verified'}
          </div>
        )}

        {/* Photo count */}
        {listing.media.length > 1 && (
          <div className="absolute bottom-3 right-3 rounded-full bg-black/60 px-2 py-0.5 text-xs font-medium text-white backdrop-blur-sm">
            1/{listing.media.length}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        {/* Price */}
        <div className="flex items-baseline justify-between">
          <p className="text-xl font-bold text-gray-900">
            {formatPrice(displayPrice, currency)}
            {isRental && (
              <span className="text-sm font-normal text-gray-500">
                /{locale === 'es' ? 'mes' : 'mo'}
              </span>
            )}
          </p>
        </div>

        {/* Title */}
        <h3 className="mt-1 text-sm font-medium text-gray-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
          {title}
        </h3>

        {/* Location */}
        <p className="mt-1 flex items-center gap-1 text-xs text-gray-500">
          <MapPin className="h-3 w-3 shrink-0" />
          <span className="truncate">{listing.sector ? `${listing.sector}, ` : ''}{listing.municipality}, {listing.province}</span>
        </p>

        {/* Stats */}
        {!compact && (
          <div className="mt-3 flex items-center gap-4 border-t border-gray-100 pt-3 text-xs text-gray-500">
            {listing.bedrooms != null && (
              <span className="flex items-center gap-1">
                <Bed className="h-3.5 w-3.5" />
                {listing.bedrooms} {locale === 'es' ? 'hab' : 'bd'}
              </span>
            )}
            {listing.bathrooms != null && (
              <span className="flex items-center gap-1">
                <Bath className="h-3.5 w-3.5" />
                {listing.bathrooms} {locale === 'es' ? 'baños' : 'ba'}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Maximize className="h-3.5 w-3.5" />
              {formatSqmt(listing.sqmt, locale)}
            </span>
          </div>
        )}
      </div>
    </Link>
  )
}
