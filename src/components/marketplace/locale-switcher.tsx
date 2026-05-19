"use client"

import { useMarketplaceStore } from "@/store/marketplace"
import { cn } from "@/lib/utils"
import { Globe } from "lucide-react"

export function LocaleSwitcher() {
  const { locale, setLocale } = useMarketplaceStore()

  return (
    <div className="inline-flex items-center gap-1.5">
      <Globe className="h-4 w-4 text-gray-400" />
      <div className="inline-flex items-center rounded-lg border border-gray-200 bg-gray-50 p-0.5">
        <button
          onClick={() => setLocale('es')}
          className={cn(
            "rounded-md px-2.5 py-1 text-xs font-semibold transition-all",
            locale === 'es'
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          )}
        >
          ES
        </button>
        <button
          onClick={() => setLocale('en')}
          className={cn(
            "rounded-md px-2.5 py-1 text-xs font-semibold transition-all",
            locale === 'en'
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          )}
        >
          EN
        </button>
      </div>
    </div>
  )
}
