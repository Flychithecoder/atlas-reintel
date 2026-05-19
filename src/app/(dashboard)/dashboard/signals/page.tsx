"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import {
  Search,
  Sparkles,
  Phone,
  Mail,
  Eye,
  Filter,
  Radio,
  Zap,
  AlertTriangle,
  Clock,
  MapPin,
  ChevronRight,
  TrendingUp,
  Users,
  Shield,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { generatePreMarketSignals } from "@/hooks/use-mock-data"
import { cn, formatCurrency, formatNumber } from "@/lib/utils"
import { ScoreBadge } from "@/components/shared/score-badge"
import { UrgencyIndicator } from "@/components/shared/urgency-indicator"
import { ContactStatus } from "@/components/shared/contact-status"
import { PropertyIcon } from "@/components/shared/property-icon"
import { RelativeTime } from "@/components/shared/relative-time"
import { AgentMarketFilter, useAgentMarketFilter } from "@/components/shared/agent-market-filter"
import type { PreMarketSignal } from "@/types"

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const SIGNAL_TYPE_OPTIONS = [
  { key: "all", label: "All Types" },
  { key: "distress", label: "Distress" },
  { key: "life-event", label: "Life Event" },
  { key: "financial", label: "Financial" },
  { key: "behavioral", label: "Behavioral" },
  { key: "market", label: "Market" },
] as const

const URGENCY_OPTIONS = [
  { key: "all", label: "All" },
  { key: "imminent", label: "Imminent" },
  { key: "near-term", label: "Near-term" },
  { key: "medium-term", label: "Medium-term" },
] as const

const MARKET_OPTIONS = [
  { key: "all", label: "All Markets", flag: null },
  { key: "FL", label: "Florida", flag: "\u{1F1FA}\u{1F1F8}" },
  { key: "PR", label: "Puerto Rico", flag: "\u{1F1F5}\u{1F1F7}" },
  { key: "DR", label: "Dom. Republic", flag: "\u{1F1E9}\u{1F1F4}" },
] as const

const SIGNAL_TYPE_COLORS: Record<string, string> = {
  distress: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  "life-event": "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  financial: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  behavioral: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  market: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
}

const MARKET_FLAGS: Record<string, string> = {
  FL: "\u{1F1FA}\u{1F1F8}",
  PR: "\u{1F1F5}\u{1F1F7}",
  DR: "\u{1F1E9}\u{1F1F4}",
}

// ---------------------------------------------------------------------------
// Heatmap dots — approximate lat/lng positions projected onto a CSS grid
// Each dot represents a cluster of signals in a geographic area
// ---------------------------------------------------------------------------

interface HeatDot {
  market: "FL" | "PR" | "DR"
  label: string
  // percentage positions within the map container
  top: number
  left: number
}

const FL_DOTS: HeatDot[] = [
  { market: "FL", label: "Miami", top: 82, left: 72 },
  { market: "FL", label: "Fort Lauderdale", top: 76, left: 74 },
  { market: "FL", label: "West Palm Beach", top: 70, left: 75 },
  { market: "FL", label: "Orlando", top: 48, left: 62 },
  { market: "FL", label: "Tampa", top: 52, left: 42 },
  { market: "FL", label: "Jacksonville", top: 22, left: 68 },
  { market: "FL", label: "Naples", top: 72, left: 38 },
  { market: "FL", label: "Sarasota", top: 58, left: 38 },
  { market: "FL", label: "St. Petersburg", top: 54, left: 36 },
  { market: "FL", label: "Boca Raton", top: 74, left: 76 },
]

const PR_DOTS: HeatDot[] = [
  { market: "PR", label: "San Juan", top: 30, left: 65 },
  { market: "PR", label: "Guaynabo", top: 35, left: 58 },
  { market: "PR", label: "Bayamon", top: 32, left: 52 },
  { market: "PR", label: "Carolina", top: 28, left: 72 },
  { market: "PR", label: "Dorado", top: 25, left: 45 },
  { market: "PR", label: "Condado", top: 33, left: 68 },
]

const DR_DOTS: HeatDot[] = [
  { market: "DR", label: "Santo Domingo", top: 60, left: 45 },
  { market: "DR", label: "Punta Cana", top: 50, left: 82 },
  { market: "DR", label: "Santiago", top: 28, left: 32 },
  { market: "DR", label: "Puerto Plata", top: 20, left: 35 },
  { market: "DR", label: "La Romana", top: 55, left: 72 },
  { market: "DR", label: "Samana", top: 30, left: 60 },
]

// ---------------------------------------------------------------------------
// Data generation (stable across renders via module-level call)
// ---------------------------------------------------------------------------

const ALL_SIGNALS = generatePreMarketSignals(150)

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------

export default function SignalsPage() {
  // Filter state — local, not Zustand
  const [marketFilter, setMarketFilter] = useState("all")
  const [urgencyFilter, setUrgencyFilter] = useState("all")
  const [signalTypeFilter, setSignalTypeFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [mapMarketView, setMapMarketView] = useState<"FL" | "PR" | "DR">("FL")
  const [selectedDot, setSelectedDot] = useState<string | null>(null)

  const { matchesMarket, filterActive: agentFilterActive } = useAgentMarketFilter()

  // Filtered signals
  const filteredSignals = useMemo(() => {
    let results = ALL_SIGNALS

    if (marketFilter !== "all") {
      results = results.filter((s) => s.market === marketFilter)
    }
    if (urgencyFilter !== "all") {
      results = results.filter((s) => s.urgency === urgencyFilter)
    }
    if (signalTypeFilter !== "all") {
      results = results.filter((s) => s.signalType === signalTypeFilter)
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      results = results.filter(
        (s) =>
          s.propertyAddress.toLowerCase().includes(q) ||
          s.ownerName.toLowerCase().includes(q) ||
          s.label.toLowerCase().includes(q)
      )
    }

    // Agent market filter (licensed states + metro areas)
    results = results.filter((s) =>
      matchesMarket(s.market, s.propertyAddress, s.market)
    )

    // Sort: imminent first, then by score desc
    const urgencyOrder: Record<string, number> = { imminent: 0, "near-term": 1, "medium-term": 2 }
    return [...results].sort((a, b) => {
      const ua = urgencyOrder[a.urgency] ?? 3
      const ub = urgencyOrder[b.urgency] ?? 3
      if (ua !== ub) return ua - ub
      return b.score - a.score
    })
  }, [marketFilter, urgencyFilter, signalTypeFilter, searchQuery, matchesMarket])

  // Derived stats
  const stats = useMemo(() => {
    const imminent = ALL_SIGNALS.filter((s) => s.urgency === "imminent").length
    const firstToSee = ALL_SIGNALS.filter((s) => s.isFirstToSee).length
    const avgScore = ALL_SIGNALS.length
      ? Math.round(ALL_SIGNALS.reduce((sum, s) => sum + s.score, 0) / ALL_SIGNALS.length)
      : 0
    return { total: ALL_SIGNALS.length, imminent, firstToSee, avgScore }
  }, [])

  // Top leads by urgency + score
  const hottestLeads = useMemo(() => {
    const urgencyWeight: Record<string, number> = { imminent: 30, "near-term": 15, "medium-term": 0 }
    return [...ALL_SIGNALS]
      .sort((a, b) => {
        const wa = (urgencyWeight[a.urgency] ?? 0) + a.score
        const wb = (urgencyWeight[b.urgency] ?? 0) + b.score
        return wb - wa
      })
      .slice(0, 10)
  }, [])

  // Never contacted
  const neverContacted = useMemo(
    () => ALL_SIGNALS.filter((s) => s.contactedByCount === 0),
    []
  )

  // Territory alerts — signals detected in the last 7 days
  const territoryAlerts = useMemo(() => {
    const sevenDaysAgo = Date.now() - 7 * 86400000
    return ALL_SIGNALS.filter(
      (s) => new Date(s.firstDetected).getTime() > sevenDaysAgo
    ).slice(0, 8)
  }, [])

  // Map dots for current view
  const mapDots = useMemo(() => {
    if (mapMarketView === "FL") return FL_DOTS
    if (mapMarketView === "PR") return PR_DOTS
    return DR_DOTS
  }, [mapMarketView])

  // Count signals per dot-label for the active map market
  const dotSignalCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    ALL_SIGNALS.filter((s) => s.market === mapMarketView).forEach((s) => {
      // Match to closest dot by checking if the address contains the city
      const dot = mapDots.find((d) =>
        s.propertyAddress.toLowerCase().includes(d.label.toLowerCase())
      )
      if (dot) {
        counts[dot.label] = (counts[dot.label] || 0) + 1
      }
    })
    return counts
  }, [mapMarketView, mapDots])

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <div className="flex flex-col gap-6">
      {/* ---- Top Section ---- */}
      <div className="flex flex-col gap-4">
        {/* Title row */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-50">
              Signal Intelligence
            </h1>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-700 dark:bg-green-900/30 dark:text-green-400">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
              </span>
              Live
            </span>
          </div>

          {/* Market switcher pills */}
          <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Market filter">
            {MARKET_OPTIONS.map((m) => (
              <button
                key={m.key}
                type="button"
                onClick={() => setMarketFilter(m.key)}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors",
                  marketFilter === m.key
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-800"
                )}
              >
                {m.flag && <span aria-hidden="true">{m.flag}</span>}
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCard label="Total Signals" value={formatNumber(stats.total)} icon={<Radio className="h-4 w-4" />} color="blue" />
          <StatCard label="Imminent" value={stats.imminent.toString()} icon={<AlertTriangle className="h-4 w-4" />} color="red" />
          <StatCard label="First-to-See" value={stats.firstToSee.toString()} icon={<Sparkles className="h-4 w-4" />} color="green" />
          <StatCard label="Avg Score" value={stats.avgScore.toString()} icon={<TrendingUp className="h-4 w-4" />} color="amber" />
        </div>
      </div>

      {/* ---- Agent Market Filter ---- */}
      <AgentMarketFilter className="mb-4" />

      {/* ---- Three-Column Layout ---- */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Column: Signal Feed */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          {/* Search + filters */}
          <Card>
            <CardContent className="p-4 flex flex-col gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search address, owner, signal..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                {/* Urgency filter */}
                <div className="flex items-center gap-1">
                  <span className="text-[11px] font-medium text-gray-500 dark:text-gray-400 mr-1">Urgency:</span>
                  {URGENCY_OPTIONS.map((o) => (
                    <button
                      key={o.key}
                      type="button"
                      onClick={() => setUrgencyFilter(o.key)}
                      className={cn(
                        "rounded-md px-2 py-0.5 text-[11px] font-medium transition-colors",
                        urgencyFilter === o.key
                          ? "bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
                      )}
                    >
                      {o.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap gap-1">
                <span className="text-[11px] font-medium text-gray-500 dark:text-gray-400 mr-1 py-0.5">Type:</span>
                {SIGNAL_TYPE_OPTIONS.map((o) => (
                  <button
                    key={o.key}
                    type="button"
                    onClick={() => setSignalTypeFilter(o.key)}
                    className={cn(
                      "rounded-md px-2 py-0.5 text-[11px] font-medium transition-colors",
                      signalTypeFilter === o.key
                        ? "bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
                    )}
                  >
                    {o.label}
                  </button>
                ))}
              </div>

              <div className="text-xs text-gray-500 dark:text-gray-400">
                {filteredSignals.length} signal{filteredSignals.length !== 1 ? "s" : ""} shown
              </div>
            </CardContent>
          </Card>

          {/* Signal list — scrollable */}
          <div className="flex flex-col gap-2 max-h-[calc(100vh-420px)] overflow-y-auto pr-1 custom-scrollbar">
            {filteredSignals.length === 0 && (
              <div className="py-12 text-center text-sm text-gray-500 dark:text-gray-400">
                No signals match your filters.
              </div>
            )}
            {filteredSignals.map((signal) => (
              <SignalCard key={signal.id} signal={signal} />
            ))}
          </div>
        </div>

        {/* Center Column: Signal Map */}
        <div className="hidden lg:flex lg:col-span-5 flex-col gap-4">
          <Card className="flex-1">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-blue-600" />
                  Signal Density Map
                </CardTitle>
                <div className="flex items-center gap-1">
                  {(["FL", "PR", "DR"] as const).map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => {
                        setMapMarketView(m)
                        setSelectedDot(null)
                      }}
                      className={cn(
                        "rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
                        mapMarketView === m
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
                      )}
                    >
                      {MARKET_FLAGS[m]} {m}
                    </button>
                  ))}
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              {/* Map container */}
              <div className="relative w-full aspect-[4/3] rounded-lg bg-gradient-to-br from-gray-900 to-gray-800 dark:from-gray-950 dark:to-gray-900 overflow-hidden border border-gray-700/50">
                {/* Grid overlay */}
                <div className="absolute inset-0 opacity-10">
                  <div
                    className="h-full w-full"
                    style={{
                      backgroundImage:
                        "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
                      backgroundSize: "10% 10%",
                    }}
                  />
                </div>

                {/* Market label */}
                <div className="absolute top-3 left-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  {mapMarketView === "FL" && "Florida"}
                  {mapMarketView === "PR" && "Puerto Rico"}
                  {mapMarketView === "DR" && "Dominican Republic"}
                </div>

                {/* Dots */}
                {mapDots.map((dot) => {
                  const count = dotSignalCounts[dot.label] || 0
                  const intensity = Math.min(count / 15, 1) // normalized 0-1
                  const isSelected = selectedDot === dot.label

                  return (
                    <button
                      key={dot.label}
                      type="button"
                      onClick={() => setSelectedDot(isSelected ? null : dot.label)}
                      className="absolute group"
                      style={{
                        top: `${dot.top}%`,
                        left: `${dot.left}%`,
                        transform: "translate(-50%, -50%)",
                      }}
                    >
                      {/* Glow ring */}
                      <span
                        className={cn(
                          "absolute inset-0 rounded-full transition-all duration-300",
                          count > 0 ? "animate-pulse" : ""
                        )}
                        style={{
                          width: `${16 + intensity * 24}px`,
                          height: `${16 + intensity * 24}px`,
                          top: "50%",
                          left: "50%",
                          transform: "translate(-50%, -50%)",
                          background: count > 10
                            ? "radial-gradient(circle, rgba(239,68,68,0.4) 0%, transparent 70%)"
                            : count > 5
                              ? "radial-gradient(circle, rgba(249,115,22,0.4) 0%, transparent 70%)"
                              : count > 0
                                ? "radial-gradient(circle, rgba(59,130,246,0.4) 0%, transparent 70%)"
                                : "radial-gradient(circle, rgba(107,114,128,0.3) 0%, transparent 70%)",
                        }}
                      />
                      {/* Core dot */}
                      <span
                        className={cn(
                          "relative block rounded-full border-2 transition-all duration-200",
                          isSelected ? "ring-2 ring-white ring-offset-1 ring-offset-gray-900" : "",
                          count > 10
                            ? "bg-red-500 border-red-300"
                            : count > 5
                              ? "bg-orange-500 border-orange-300"
                              : count > 0
                                ? "bg-blue-500 border-blue-300"
                                : "bg-gray-500 border-gray-400"
                        )}
                        style={{
                          width: `${8 + intensity * 8}px`,
                          height: `${8 + intensity * 8}px`,
                        }}
                      />
                      {/* Tooltip */}
                      <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:flex flex-col items-center">
                        <span className="whitespace-nowrap rounded bg-gray-900 px-2 py-1 text-[10px] font-medium text-white shadow-lg dark:bg-gray-700">
                          {dot.label}: {count} signal{count !== 1 ? "s" : ""}
                        </span>
                        <span className="border-4 border-transparent border-t-gray-900 dark:border-t-gray-700" />
                      </span>
                    </button>
                  )
                })}

                {/* Legend */}
                <div className="absolute bottom-3 right-3 flex items-center gap-3 rounded bg-gray-900/80 px-2.5 py-1.5 backdrop-blur-sm">
                  <span className="flex items-center gap-1 text-[10px] text-gray-300">
                    <span className="h-2 w-2 rounded-full bg-blue-500" /> Low
                  </span>
                  <span className="flex items-center gap-1 text-[10px] text-gray-300">
                    <span className="h-2 w-2 rounded-full bg-orange-500" /> Med
                  </span>
                  <span className="flex items-center gap-1 text-[10px] text-gray-300">
                    <span className="h-2 w-2 rounded-full bg-red-500" /> High
                  </span>
                </div>
              </div>

              {/* Selected dot detail */}
              {selectedDot && (
                <div className="mt-3 rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                      {MARKET_FLAGS[mapMarketView]} {selectedDot}
                    </span>
                    <Badge variant="secondary">
                      {dotSignalCounts[selectedDot] || 0} signals
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {ALL_SIGNALS.filter(
                      (s) =>
                        s.market === mapMarketView &&
                        s.propertyAddress.toLowerCase().includes(selectedDot.toLowerCase())
                    )
                      .slice(0, 4)
                      .map((s) => (
                        <Link
                          key={s.id}
                          href={`/dashboard/signals/${s.id}`}
                          className="flex items-center gap-1.5 rounded-md bg-white px-2 py-1 text-xs text-gray-700 border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 dark:hover:border-blue-600 dark:hover:bg-gray-800"
                        >
                          <span className={cn("h-1.5 w-1.5 rounded-full", SIGNAL_TYPE_COLORS[s.signalType]?.split(" ")[0] || "bg-gray-400")} />
                          {s.label}
                        </Link>
                      ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Signal type breakdown below map */}
          <Card>
            <CardContent className="p-4">
              <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                Signal Breakdown
              </h3>
              <div className="space-y-2">
                {(["distress", "life-event", "financial", "behavioral", "market"] as const).map(
                  (type) => {
                    const count = ALL_SIGNALS.filter((s) => s.signalType === type).length
                    const pct = Math.round((count / ALL_SIGNALS.length) * 100)
                    return (
                      <div key={type} className="flex items-center gap-3">
                        <span className="w-20 text-xs font-medium text-gray-600 dark:text-gray-400 capitalize">
                          {type.replace("-", " ")}
                        </span>
                        <div className="flex-1 h-2 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                          <div
                            className={cn(
                              "h-full rounded-full transition-all",
                              type === "distress" ? "bg-red-500" :
                              type === "life-event" ? "bg-purple-500" :
                              type === "financial" ? "bg-emerald-500" :
                              type === "behavioral" ? "bg-blue-500" :
                              "bg-orange-500"
                            )}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="w-10 text-right text-xs font-semibold text-gray-700 dark:text-gray-300">
                          {count}
                        </span>
                      </div>
                    )
                  }
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Quick Actions */}
        <div className="lg:col-span-3 flex flex-col gap-4">
          {/* Hottest Leads */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Zap className="h-4 w-4 text-red-500" />
                Today&apos;s Hottest Leads
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 pb-3">
              <div className="space-y-1.5">
                {hottestLeads.map((signal, idx) => (
                  <Link
                    key={signal.id}
                    href={`/dashboard/signals/${signal.id}`}
                    className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group"
                  >
                    <span className="text-[10px] font-bold text-gray-400 w-4 text-right">
                      {idx + 1}
                    </span>
                    <ScoreBadge score={signal.score} size="sm" />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium text-gray-900 dark:text-gray-100 truncate">
                        {signal.ownerName}
                      </div>
                      <div className="text-[10px] text-gray-500 dark:text-gray-400 truncate">
                        {signal.propertyAddress}
                      </div>
                    </div>
                    <UrgencyIndicator urgency={signal.urgency} />
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Never Contacted */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-green-500" />
                  Never Contacted
                </CardTitle>
                <Badge variant="success" className="text-[10px]">
                  {neverContacted.length}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-0 pb-3">
              <div className="space-y-1.5 max-h-48 overflow-y-auto">
                {neverContacted.slice(0, 8).map((signal) => (
                  <Link
                    key={signal.id}
                    href={`/dashboard/signals/${signal.id}`}
                    className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    <PropertyIcon type={signal.propertyType} className="text-gray-400 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium text-gray-900 dark:text-gray-100 truncate">
                        {signal.ownerName}
                      </div>
                      <div className="text-[10px] text-gray-500 dark:text-gray-400 truncate">
                        {signal.label}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <Button variant="ghost" size="icon" className="h-6 w-6" aria-label="Quick call">
                        <Phone className="h-3 w-3 text-gray-500" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-6 w-6" aria-label="Quick email">
                        <Mail className="h-3 w-3 text-gray-500" />
                      </Button>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Territory Alerts */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Shield className="h-4 w-4 text-blue-500" />
                Your Territory Alerts
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 pb-3">
              <div className="space-y-1.5">
                {territoryAlerts.map((signal) => (
                  <Link
                    key={signal.id}
                    href={`/dashboard/signals/${signal.id}`}
                    className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    <span className="text-sm" aria-hidden="true">
                      {MARKET_FLAGS[signal.market]}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium text-gray-900 dark:text-gray-100 truncate">
                        {signal.label}
                      </div>
                      <div className="text-[10px] text-gray-500 dark:text-gray-400 truncate">
                        {signal.propertyAddress}
                      </div>
                    </div>
                    <RelativeTime date={signal.firstDetected} className="text-[10px] shrink-0" />
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function StatCard({
  label,
  value,
  icon,
  color,
}: {
  label: string
  value: string
  icon: React.ReactNode
  color: "blue" | "red" | "green" | "amber"
}) {
  const colorMap = {
    blue: "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400",
    red: "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400",
    green: "bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400",
    amber: "bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400",
  }

  return (
    <Card>
      <CardContent className="p-4 flex items-center gap-3">
        <div className={cn("rounded-lg p-2", colorMap[color])}>
          {icon}
        </div>
        <div>
          <div className="text-xl font-bold text-gray-900 dark:text-gray-50">{value}</div>
          <div className="text-[11px] text-gray-500 dark:text-gray-400">{label}</div>
        </div>
      </CardContent>
    </Card>
  )
}

function SignalCard({ signal }: { signal: PreMarketSignal }) {
  return (
    <Link href={`/dashboard/signals/${signal.id}`}>
      <Card className="group hover:border-blue-300 hover:shadow-md dark:hover:border-blue-700 transition-all cursor-pointer">
        <CardContent className="p-3">
          {/* Top row: signal type badge + urgency + market */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <span
                className={cn(
                  "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize",
                  SIGNAL_TYPE_COLORS[signal.signalType] ??
                    "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                )}
              >
                {signal.signalType.replace("-", " ")}
              </span>
              <UrgencyIndicator urgency={signal.urgency} />
            </div>
            <span className="text-sm" aria-hidden="true">
              {MARKET_FLAGS[signal.market]}
            </span>
          </div>

          {/* Signal label */}
          <div className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {signal.label}
          </div>

          {/* Property address + owner */}
          <div className="flex items-start gap-2 mb-2">
            <PropertyIcon type={signal.propertyType} className="text-gray-400 mt-0.5 shrink-0" />
            <div className="min-w-0">
              <div className="text-xs text-gray-700 dark:text-gray-300 truncate">
                {signal.propertyAddress}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {signal.ownerName} &middot; {formatCurrency(signal.propertyValue)}
              </div>
            </div>
          </div>

          {/* Bottom row: score, first-to-see, contact status, time */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ScoreBadge score={signal.score} size="sm" />
              {signal.isFirstToSee && (
                <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-semibold text-green-700 dark:bg-green-900/30 dark:text-green-400">
                  <Sparkles className="h-3 w-3" />
                  First to See!
                </span>
              )}
              {!signal.isFirstToSee && (
                <ContactStatus count={signal.contactedByCount} />
              )}
            </div>
            <RelativeTime date={signal.firstDetected} className="text-[10px]" />
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
