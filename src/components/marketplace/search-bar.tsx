"use client"

import { useState, useRef, useEffect } from "react"
import { Search, MapPin, SlidersHorizontal, X } from "lucide-react"
import { useMarketplaceStore } from "@/store/marketplace"
import { PROVINCES_WITH_AREAS } from "@/types/marketplace"
import { cn } from "@/lib/utils"

interface SearchBarProps {
  onSearch?: () => void
  size?: "default" | "large"
  showFiltersButton?: boolean
}

export function SearchBar({ onSearch, size = "default", showFiltersButton = true }: SearchBarProps) {
  const { locale, searchFilters, setSearchFilters, mobileFiltersOpen, setMobileFiltersOpen } = useMarketplaceStore()
  const [query, setQuery] = useState(searchFilters.query || "")
  const [showSuggestions, setShowSuggestions] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)

  const allLocations = Object.entries(PROVINCES_WITH_AREAS).flatMap(([province, areas]) => [
    { type: 'province' as const, name: province },
    ...areas.map((area) => ({ type: 'area' as const, name: area, province })),
  ])

  const filteredSuggestions = query.length >= 2
    ? allLocations.filter((loc) =>
        loc.name.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 8)
    : []

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSearchFilters({ query })
    setShowSuggestions(false)
    onSearch?.()
  }

  function handleSuggestionClick(loc: typeof allLocations[number]) {
    setQuery(loc.name)
    setSearchFilters({ query: loc.name })
    setShowSuggestions(false)
    onSearch?.()
  }

  const isLarge = size === "large"

  return (
    <div ref={wrapperRef} className="relative w-full">
      <form onSubmit={handleSubmit} className="relative flex items-center gap-2">
        <div className="relative flex-1">
          <Search className={cn(
            "absolute left-4 top-1/2 -translate-y-1/2 text-gray-400",
            isLarge ? "h-5 w-5" : "h-4 w-4"
          )} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setShowSuggestions(true)
            }}
            onFocus={() => setShowSuggestions(true)}
            placeholder={locale === 'es'
              ? 'Buscar por ubicación, ciudad o provincia...'
              : 'Search by location, city, or province...'}
            className={cn(
              "w-full rounded-xl border border-gray-300 bg-white text-gray-900 placeholder-gray-400 transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20",
              isLarge ? "pl-12 pr-4 py-4 text-lg" : "pl-10 pr-4 py-3 text-sm"
            )}
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery("")
                setSearchFilters({ query: undefined })
                inputRef.current?.focus()
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <button
          type="submit"
          className={cn(
            "shrink-0 rounded-xl bg-blue-600 font-semibold text-white transition-colors hover:bg-blue-700",
            isLarge ? "px-8 py-4 text-base" : "px-5 py-3 text-sm"
          )}
        >
          {locale === 'es' ? 'Buscar' : 'Search'}
        </button>

        {showFiltersButton && (
          <button
            type="button"
            onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
            className={cn(
              "shrink-0 rounded-xl border border-gray-300 bg-white text-gray-700 transition-colors hover:bg-gray-50 lg:hidden",
              isLarge ? "p-4" : "p-3"
            )}
          >
            <SlidersHorizontal className={isLarge ? "h-5 w-5" : "h-4 w-4"} />
          </button>
        )}
      </form>

      {/* Suggestions dropdown */}
      {showSuggestions && filteredSuggestions.length > 0 && (
        <div className="absolute left-0 right-0 z-50 mt-2 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">
          {filteredSuggestions.map((loc, i) => (
            <button
              key={`${loc.type}-${loc.name}-${i}`}
              onClick={() => handleSuggestionClick(loc)}
              className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm transition-colors hover:bg-gray-50"
            >
              <MapPin className="h-4 w-4 shrink-0 text-gray-400" />
              <div>
                <p className="font-medium text-gray-900">{loc.name}</p>
                {loc.type === 'area' && 'province' in loc && (
                  <p className="text-xs text-gray-500">{loc.province}</p>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
