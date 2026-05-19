"use client"

import Link from "next/link"
import { MapPin, Home, TrendingUp, ArrowRight } from "lucide-react"
import type { AreaGuide } from "@/types/marketplace"
import { useMarketplaceStore } from "@/store/marketplace"
import { formatPrice } from "@/lib/marketplace-utils"

interface AreaGuideCardProps {
  guide: AreaGuide
}

export function AreaGuideCard({ guide }: AreaGuideCardProps) {
  const { locale, currency } = useMarketplaceStore()

  const description = locale === 'es' ? guide.description_es : guide.description_en
  const highlights = locale === 'es' ? guide.highlights_es : guide.highlights_en

  return (
    <Link
      href={`/buscar?location=${encodeURIComponent(guide.name)}`}
      className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-lg hover:border-gray-300"
    >
      {/* Hero image */}
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={guide.heroImage}
          alt={guide.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-2xl font-bold text-white">{guide.name}</h3>
          <p className="mt-1 flex items-center gap-1 text-sm text-white/80">
            <MapPin className="h-3.5 w-3.5" />
            {guide.province}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <p className="text-sm text-gray-600 line-clamp-2">{description}</p>

        {/* Stats */}
        <div className="mt-4 flex items-center gap-6 border-t border-gray-100 pt-4">
          <div className="flex items-center gap-1.5">
            <TrendingUp className="h-4 w-4 text-blue-600" />
            <div>
              <p className="text-xs text-gray-500">{locale === 'es' ? 'Precio promedio' : 'Avg. price'}</p>
              <p className="text-sm font-semibold text-gray-900">{formatPrice(guide.avgPriceUSD, 'USD')}</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <Home className="h-4 w-4 text-blue-600" />
            <div>
              <p className="text-xs text-gray-500">{locale === 'es' ? 'Propiedades' : 'Listings'}</p>
              <p className="text-sm font-semibold text-gray-900">{guide.listingCount.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Highlights */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {highlights.map((h) => (
            <span key={h} className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
              {h}
            </span>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-4 flex items-center gap-1 text-sm font-semibold text-blue-600 group-hover:text-blue-700">
          {locale === 'es' ? 'Ver propiedades' : 'View properties'}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  )
}
