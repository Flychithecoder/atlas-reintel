"use client"

import { cn } from "@/lib/utils"

interface MarketSwitcherProps {
  value: string
  onChange: (market: string) => void
  className?: string
}

const markets = [
  { key: "all", label: "All Markets", flag: null },
  { key: "florida", label: "Florida", flag: "\u{1F1FA}\u{1F1F8}" },
  { key: "puerto-rico", label: "Puerto Rico", flag: "\u{1F1F5}\u{1F1F7}" },
  { key: "dominican-republic", label: "Dominican Republic", flag: "\u{1F1E9}\u{1F1F4}" },
]

export function MarketSwitcher({
  value,
  onChange,
  className,
}: MarketSwitcherProps) {
  return (
    <div
      className={cn("flex flex-wrap items-center gap-2", className)}
      role="group"
      aria-label="Market selection"
    >
      {markets.map((market) => {
        const isActive = value === market.key
        return (
          <button
            key={market.key}
            type="button"
            onClick={() => onChange(market.key)}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors",
              isActive
                ? "bg-blue-600 text-white shadow-sm"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            )}
            aria-pressed={isActive}
          >
            {market.flag && <span aria-hidden="true">{market.flag}</span>}
            {market.label}
          </button>
        )
      })}
    </div>
  )
}
