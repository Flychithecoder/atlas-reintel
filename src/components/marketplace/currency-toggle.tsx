"use client"

import { useMarketplaceStore } from "@/store/marketplace"
import { cn } from "@/lib/utils"

export function CurrencyToggle() {
  const { currency, setCurrency } = useMarketplaceStore()

  return (
    <div className="inline-flex items-center rounded-lg border border-gray-200 bg-gray-50 p-0.5">
      <button
        onClick={() => setCurrency('USD')}
        className={cn(
          "rounded-md px-3 py-1.5 text-xs font-semibold transition-all",
          currency === 'USD'
            ? "bg-white text-gray-900 shadow-sm"
            : "text-gray-500 hover:text-gray-700"
        )}
      >
        USD $
      </button>
      <button
        onClick={() => setCurrency('DOP')}
        className={cn(
          "rounded-md px-3 py-1.5 text-xs font-semibold transition-all",
          currency === 'DOP'
            ? "bg-white text-gray-900 shadow-sm"
            : "text-gray-500 hover:text-gray-700"
        )}
      >
        DOP RD$
      </button>
    </div>
  )
}
