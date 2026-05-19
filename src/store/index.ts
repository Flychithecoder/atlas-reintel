import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Lead, SearchFilters, User } from '@/types'

export interface AgentMarketPreferences {
  licensedStates: string[]
  metroAreas: string[]
  filterActive: boolean
}

interface AppState {
  currentUser: User | null
  setCurrentUser: (user: User | null) => void
  sidebarOpen: boolean
  toggleSidebar: () => void
  selectedLeads: string[]
  selectLead: (id: string) => void
  deselectLead: (id: string) => void
  clearSelection: () => void
  searchFilters: SearchFilters
  setSearchFilters: (filters: Partial<SearchFilters>) => void
  resetFilters: () => void
  activeMarket: 'all' | 'fl' | 'pr' | 'dr'
  setActiveMarket: (market: 'all' | 'fl' | 'pr' | 'dr') => void
  activeLeadType: 'seller' | 'buyer' | 'tenant'
  setActiveLeadType: (type: 'seller' | 'buyer' | 'tenant') => void
  selectedTerritory: string | null
  setSelectedTerritory: (id: string | null) => void
  agentMarket: AgentMarketPreferences
  setAgentMarket: (prefs: Partial<AgentMarketPreferences>) => void
  addLicensedState: (state: string) => void
  removeLicensedState: (state: string) => void
  addMetroArea: (metro: string) => void
  removeMetroArea: (metro: string) => void
  toggleMarketFilter: () => void
}

const defaultFilters: SearchFilters = {
  propertyTypes: [],
  sortBy: 'score',
  sortOrder: 'desc',
}

const defaultAgentMarket: AgentMarketPreferences = {
  licensedStates: [],
  metroAreas: [],
  filterActive: false,
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      currentUser: null,
      setCurrentUser: (user) => set({ currentUser: user }),
      sidebarOpen: true,
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      selectedLeads: [],
      selectLead: (id) => set((state) => ({ selectedLeads: [...state.selectedLeads, id] })),
      deselectLead: (id) => set((state) => ({ selectedLeads: state.selectedLeads.filter(l => l !== id) })),
      clearSelection: () => set({ selectedLeads: [] }),
      searchFilters: defaultFilters,
      setSearchFilters: (filters) => set((state) => ({ searchFilters: { ...state.searchFilters, ...filters } })),
      resetFilters: () => set({ searchFilters: defaultFilters }),
      activeMarket: 'all',
      setActiveMarket: (market) => set({ activeMarket: market }),
      activeLeadType: 'seller',
      setActiveLeadType: (type) => set({ activeLeadType: type }),
      selectedTerritory: null,
      setSelectedTerritory: (id) => set({ selectedTerritory: id }),
      agentMarket: defaultAgentMarket,
      setAgentMarket: (prefs) => set((state) => ({ agentMarket: { ...state.agentMarket, ...prefs } })),
      addLicensedState: (s) => set((state) => ({
        agentMarket: {
          ...state.agentMarket,
          licensedStates: state.agentMarket.licensedStates.includes(s)
            ? state.agentMarket.licensedStates
            : [...state.agentMarket.licensedStates, s],
        },
      })),
      removeLicensedState: (s) => set((state) => ({
        agentMarket: {
          ...state.agentMarket,
          licensedStates: state.agentMarket.licensedStates.filter((x) => x !== s),
        },
      })),
      addMetroArea: (metro) => set((state) => ({
        agentMarket: {
          ...state.agentMarket,
          metroAreas: state.agentMarket.metroAreas.includes(metro)
            ? state.agentMarket.metroAreas
            : [...state.agentMarket.metroAreas, metro],
        },
      })),
      removeMetroArea: (metro) => set((state) => ({
        agentMarket: {
          ...state.agentMarket,
          metroAreas: state.agentMarket.metroAreas.filter((x) => x !== metro),
        },
      })),
      toggleMarketFilter: () => set((state) => ({
        agentMarket: { ...state.agentMarket, filterActive: !state.agentMarket.filterActive },
      })),
    }),
    {
      name: 'atlas-agent-market',
      partialize: (state) => ({ agentMarket: state.agentMarket }),
    }
  )
)
