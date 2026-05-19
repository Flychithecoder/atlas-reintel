import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Currency, Locale, SearchFilters, ListingType } from '@/types/marketplace'

interface MarketplaceState {
  locale: Locale
  setLocale: (locale: Locale) => void
  currency: Currency
  setCurrency: (currency: Currency) => void
  savedListings: string[]
  toggleSavedListing: (id: string) => void
  isListingSaved: (id: string) => boolean
  searchFilters: SearchFilters
  setSearchFilters: (filters: Partial<SearchFilters>) => void
  resetSearchFilters: () => void
  viewMode: 'grid' | 'map' | 'split'
  setViewMode: (mode: 'grid' | 'map' | 'split') => void
  mapViewport: { lat: number; lng: number; zoom: number }
  setMapViewport: (viewport: { lat: number; lng: number; zoom: number }) => void
  mobileFiltersOpen: boolean
  setMobileFiltersOpen: (open: boolean) => void
}

const defaultFilters: SearchFilters = {
  currency: 'USD',
  sortBy: 'newest',
  page: 1,
  limit: 24,
}

const DR_CENTER = { lat: 18.7357, lng: -70.1627, zoom: 8 }

export const useMarketplaceStore = create<MarketplaceState>()(
  persist(
    (set, get) => ({
      locale: 'es',
      setLocale: (locale) => set({ locale }),
      currency: 'USD',
      setCurrency: (currency) => set({ currency }),
      savedListings: [],
      toggleSavedListing: (id) =>
        set((state) => ({
          savedListings: state.savedListings.includes(id)
            ? state.savedListings.filter((l) => l !== id)
            : [...state.savedListings, id],
        })),
      isListingSaved: (id) => get().savedListings.includes(id),
      searchFilters: defaultFilters,
      setSearchFilters: (filters) =>
        set((state) => ({
          searchFilters: { ...state.searchFilters, ...filters, page: filters.page ?? 1 },
        })),
      resetSearchFilters: () => set({ searchFilters: defaultFilters }),
      viewMode: 'grid',
      setViewMode: (mode) => set({ viewMode: mode }),
      mapViewport: DR_CENTER,
      setMapViewport: (viewport) => set({ mapViewport: viewport }),
      mobileFiltersOpen: false,
      setMobileFiltersOpen: (open) => set({ mobileFiltersOpen: open }),
    }),
    {
      name: 'atlas-marketplace',
      partialize: (state) => ({
        locale: state.locale,
        currency: state.currency,
        savedListings: state.savedListings,
        viewMode: state.viewMode,
      }),
    }
  )
)
