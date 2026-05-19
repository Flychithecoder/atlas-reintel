"use client"

import { useState } from "react"
import { useAppStore } from "@/store"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  MapPin,
  Shield,
  X,
  Plus,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  Check,
} from "lucide-react"
import { cn } from "@/lib/utils"

const US_STATES = [
  "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
  "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
  "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
  "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
  "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY",
  "DC", "PR", "VI", "GU",
] as const

const STATE_NAMES: Record<string, string> = {
  AL: "Alabama", AK: "Alaska", AZ: "Arizona", AR: "Arkansas", CA: "California",
  CO: "Colorado", CT: "Connecticut", DE: "Delaware", FL: "Florida", GA: "Georgia",
  HI: "Hawaii", ID: "Idaho", IL: "Illinois", IN: "Indiana", IA: "Iowa",
  KS: "Kansas", KY: "Kentucky", LA: "Louisiana", ME: "Maine", MD: "Maryland",
  MA: "Massachusetts", MI: "Michigan", MN: "Minnesota", MS: "Mississippi", MO: "Missouri",
  MT: "Montana", NE: "Nebraska", NV: "Nevada", NH: "New Hampshire", NJ: "New Jersey",
  NM: "New Mexico", NY: "New York", NC: "North Carolina", ND: "North Dakota", OH: "Ohio",
  OK: "Oklahoma", OR: "Oregon", PA: "Pennsylvania", RI: "Rhode Island", SC: "South Carolina",
  SD: "South Dakota", TN: "Tennessee", TX: "Texas", UT: "Utah", VT: "Vermont",
  VA: "Virginia", WA: "Washington", WV: "West Virginia", WI: "Wisconsin", WY: "Wyoming",
  DC: "Washington D.C.", PR: "Puerto Rico", VI: "U.S. Virgin Islands", GU: "Guam",
}

const POPULAR_METROS: Record<string, string[]> = {
  FL: ["Miami-Dade", "Broward", "Palm Beach", "Orlando", "Tampa Bay", "Jacksonville", "Fort Lauderdale", "Naples", "Sarasota", "Gainesville"],
  TX: ["Houston", "Dallas-Fort Worth", "Austin", "San Antonio", "El Paso"],
  CA: ["Los Angeles", "San Francisco Bay Area", "San Diego", "Sacramento", "Inland Empire"],
  NY: ["New York City", "Long Island", "Westchester", "Buffalo", "Albany"],
  GA: ["Atlanta", "Savannah", "Augusta"],
  IL: ["Chicago", "Naperville", "Rockford"],
  AZ: ["Phoenix", "Tucson", "Scottsdale"],
  PR: ["San Juan", "Ponce", "Bayamón", "Carolina", "Caguas", "Mayagüez", "Dorado", "Rincón"],
  NC: ["Charlotte", "Raleigh-Durham", "Greensboro"],
  PA: ["Philadelphia", "Pittsburgh", "Allentown"],
  CO: ["Denver", "Colorado Springs", "Boulder"],
  NV: ["Las Vegas", "Reno"],
  WA: ["Seattle", "Tacoma", "Spokane"],
  TN: ["Nashville", "Memphis", "Knoxville"],
  OH: ["Columbus", "Cleveland", "Cincinnati"],
}

export function AgentMarketFilter({ className }: { className?: string }) {
  const {
    agentMarket,
    addLicensedState,
    removeLicensedState,
    addMetroArea,
    removeMetroArea,
    toggleMarketFilter,
  } = useAppStore()

  const [expanded, setExpanded] = useState(false)
  const [stateSearch, setStateSearch] = useState("")
  const [metroInput, setMetroInput] = useState("")
  const [showStatePicker, setShowStatePicker] = useState(false)

  const { licensedStates, metroAreas, filterActive } = agentMarket

  const filteredStates = stateSearch
    ? US_STATES.filter(
        (s) =>
          s.toLowerCase().includes(stateSearch.toLowerCase()) ||
          (STATE_NAMES[s] || "").toLowerCase().includes(stateSearch.toLowerCase())
      )
    : US_STATES

  const suggestedMetros = licensedStates.flatMap((s) => POPULAR_METROS[s] || [])
    .filter((m) => !metroAreas.includes(m))

  const hasPreferences = licensedStates.length > 0 || metroAreas.length > 0

  const handleAddMetro = () => {
    const trimmed = metroInput.trim()
    if (trimmed) {
      addMetroArea(trimmed)
      setMetroInput("")
    }
  }

  if (!hasPreferences && !expanded) {
    return (
      <div className={cn("rounded-xl border border-dashed border-blue-200 bg-blue-50/50 p-4", className)}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100">
              <Shield className="h-4.5 w-4.5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">Set Up Your Market Targeting</p>
              <p className="text-xs text-gray-500">
                Add your licensed states and metro areas to filter leads to your territory
              </p>
            </div>
          </div>
          <Button size="sm" onClick={() => setExpanded(true)}>
            <Plus className="h-3.5 w-3.5" />
            Configure
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className={cn("rounded-xl border border-gray-200 bg-white shadow-sm", className)}>
      {/* Compact bar */}
      <div className="flex items-center justify-between px-4 py-2.5">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-gray-400" />
            <span className="text-sm font-medium text-gray-700">My Markets</span>
          </div>

          {/* Licensed states pills */}
          {licensedStates.length > 0 && (
            <div className="flex items-center gap-1.5 ml-2">
              <span className="text-xs text-gray-400">Licensed:</span>
              {licensedStates.map((s) => (
                <Badge
                  key={s}
                  variant="secondary"
                  className="text-xs font-semibold bg-blue-50 text-blue-700 border-blue-200 gap-1"
                >
                  <Shield className="h-2.5 w-2.5" />
                  {s}
                  <button
                    onClick={(e) => { e.stopPropagation(); removeLicensedState(s) }}
                    className="ml-0.5 hover:text-red-500"
                  >
                    <X className="h-2.5 w-2.5" />
                  </button>
                </Badge>
              ))}
            </div>
          )}

          {/* Metro area pills */}
          {metroAreas.length > 0 && (
            <div className="flex items-center gap-1.5 ml-2 overflow-hidden">
              <span className="text-xs text-gray-400">Metros:</span>
              {metroAreas.slice(0, 4).map((m) => (
                <Badge
                  key={m}
                  variant="secondary"
                  className="text-xs bg-green-50 text-green-700 border-green-200 gap-1 whitespace-nowrap"
                >
                  <MapPin className="h-2.5 w-2.5" />
                  {m}
                  <button
                    onClick={(e) => { e.stopPropagation(); removeMetroArea(m) }}
                    className="ml-0.5 hover:text-red-500"
                  >
                    <X className="h-2.5 w-2.5" />
                  </button>
                </Badge>
              ))}
              {metroAreas.length > 4 && (
                <span className="text-xs text-gray-400">+{metroAreas.length - 4} more</span>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0 ml-3">
          {/* Filter toggle */}
          {hasPreferences && (
            <button
              onClick={toggleMarketFilter}
              className={cn(
                "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                filterActive ? "bg-blue-600" : "bg-gray-200"
              )}
              title={filterActive ? "Market filter active — showing only your markets" : "Market filter off — showing all leads"}
            >
              <span
                className={cn(
                  "inline-block h-4 w-4 rounded-full bg-white shadow transition-transform",
                  filterActive ? "translate-x-6" : "translate-x-1"
                )}
              />
            </button>
          )}

          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Filter active indicator */}
      {filterActive && hasPreferences && !expanded && (
        <div className="px-4 pb-2">
          <p className="text-[11px] text-blue-600 font-medium flex items-center gap-1">
            <Check className="h-3 w-3" />
            Showing leads only in {licensedStates.join(", ")}{metroAreas.length > 0 ? ` · ${metroAreas.slice(0, 3).join(", ")}${metroAreas.length > 3 ? "..." : ""}` : ""}
          </p>
        </div>
      )}

      {/* Expanded configuration panel */}
      {expanded && (
        <div className="border-t border-gray-100 px-4 py-4 space-y-5">
          {/* Licensed States Section */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
                <Shield className="h-3.5 w-3.5 text-blue-500" />
                Licensed States & Territories
              </label>
              <button
                onClick={() => setShowStatePicker(!showStatePicker)}
                className="text-xs text-blue-600 hover:text-blue-800 font-medium"
              >
                {showStatePicker ? "Done" : "+ Add State"}
              </button>
            </div>

            {showStatePicker && (
              <div className="mb-3 rounded-lg border border-gray-200 bg-gray-50 p-3">
                <Input
                  placeholder="Search states..."
                  value={stateSearch}
                  onChange={(e) => setStateSearch(e.target.value)}
                  className="mb-2 h-8 text-xs"
                />
                <div className="grid grid-cols-6 sm:grid-cols-9 md:grid-cols-12 gap-1 max-h-40 overflow-y-auto">
                  {filteredStates.map((s) => {
                    const selected = licensedStates.includes(s)
                    return (
                      <button
                        key={s}
                        onClick={() => selected ? removeLicensedState(s) : addLicensedState(s)}
                        className={cn(
                          "rounded-md px-2 py-1.5 text-xs font-medium transition-all",
                          selected
                            ? "bg-blue-600 text-white shadow-sm"
                            : "bg-white text-gray-600 border border-gray-200 hover:border-blue-300 hover:bg-blue-50"
                        )}
                        title={STATE_NAMES[s]}
                      >
                        {s}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {licensedStates.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {licensedStates.map((s) => (
                  <div
                    key={s}
                    className="flex items-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 text-sm"
                  >
                    <Shield className="h-3 w-3 text-blue-600" />
                    <span className="font-medium text-blue-800">{s}</span>
                    <span className="text-blue-500 text-xs">({STATE_NAMES[s]})</span>
                    <button
                      onClick={() => removeLicensedState(s)}
                      className="ml-1 text-blue-400 hover:text-red-500 transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-400 italic">No states selected — add your licensed states to filter leads</p>
            )}
          </div>

          {/* Metro Areas Section */}
          <div>
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-1.5 mb-2">
              <MapPin className="h-3.5 w-3.5 text-green-500" />
              Metropolitan Areas
            </label>

            <div className="flex gap-2 mb-3">
              <Input
                placeholder="Type a metro area (e.g. Miami-Dade, Tampa Bay)"
                value={metroInput}
                onChange={(e) => setMetroInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddMetro()}
                className="h-8 text-sm"
              />
              <Button variant="outline" size="sm" className="h-8 shrink-0" onClick={handleAddMetro}>
                <Plus className="h-3.5 w-3.5" />
                Add
              </Button>
            </div>

            {/* Suggested metros based on licensed states */}
            {suggestedMetros.length > 0 && (
              <div className="mb-3">
                <p className="text-xs text-gray-400 mb-1.5">Suggested for your states:</p>
                <div className="flex flex-wrap gap-1.5">
                  {suggestedMetros.slice(0, 12).map((m) => (
                    <button
                      key={m}
                      onClick={() => addMetroArea(m)}
                      className="rounded-full border border-dashed border-green-300 bg-green-50/50 px-2.5 py-1 text-xs text-green-700 hover:bg-green-100 hover:border-green-400 transition-colors"
                    >
                      + {m}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {metroAreas.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {metroAreas.map((m) => (
                  <div
                    key={m}
                    className="flex items-center gap-1.5 rounded-lg border border-green-200 bg-green-50 px-3 py-1.5 text-sm"
                  >
                    <MapPin className="h-3 w-3 text-green-600" />
                    <span className="font-medium text-green-800">{m}</span>
                    <button
                      onClick={() => removeMetroArea(m)}
                      className="ml-1 text-green-400 hover:text-red-500 transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-400 italic">No metro areas added — add metros for more precise targeting</p>
            )}
          </div>

          {/* Activate filter */}
          {hasPreferences && (
            <div className="flex items-center justify-between rounded-lg bg-gray-50 border border-gray-200 px-4 py-3">
              <div>
                <p className="text-sm font-medium text-gray-900">Filter all pages by my markets</p>
                <p className="text-xs text-gray-500">
                  Only show leads, signals, and buyers in your licensed states and metro areas
                </p>
              </div>
              <button
                onClick={toggleMarketFilter}
                className={cn(
                  "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                  filterActive ? "bg-blue-600" : "bg-gray-200"
                )}
              >
                <span
                  className={cn(
                    "inline-block h-4 w-4 rounded-full bg-white shadow transition-transform",
                    filterActive ? "translate-x-6" : "translate-x-1"
                  )}
                />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export function useAgentMarketFilter() {
  const { agentMarket } = useAppStore()
  const { licensedStates, metroAreas, filterActive } = agentMarket

  function matchesMarket(state?: string, city?: string, market?: string): boolean {
    if (!filterActive) return true
    if (licensedStates.length === 0 && metroAreas.length === 0) return true

    const stateMatch = licensedStates.length > 0 && (
      (state && licensedStates.includes(state.toUpperCase())) ||
      (market && licensedStates.some((s) => s.toLowerCase() === market.toLowerCase()))
    )

    if (metroAreas.length === 0) return !!stateMatch

    const metroMatch = city && metroAreas.some((m) => {
      const mLow = m.toLowerCase()
      const cLow = city.toLowerCase()
      return mLow.includes(cLow) || cLow.includes(mLow) ||
        mLow.split(/[-\s]/).some((word) => word.length > 3 && cLow.includes(word)) ||
        cLow.split(/[-\s]/).some((word) => word.length > 3 && mLow.includes(word))
    })

    return !!(stateMatch || metroMatch)
  }

  return { matchesMarket, filterActive, licensedStates, metroAreas }
}
