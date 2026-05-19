"use client"

import { useState, useMemo } from "react"
import { AgentMarketFilter, useAgentMarketFilter } from "@/components/shared/agent-market-filter"
import {
  Plus,
  Upload,
  Download,
  SlidersHorizontal,
  List,
  LayoutGrid,
  MapPin,
  Search,
  ChevronDown,
  ChevronUp,
  MoreHorizontal,
  Phone,
  Mail,
  MessageSquare,
  Eye,
  Building2,
  Home,
  Factory,
  Landmark,
  Store,
  Trees,
  Layers,
  Briefcase,
  User,
  Building,
  Shield,
  Users,
  X,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  CheckSquare,
  Square,
  AlertTriangle,
  Heart,
  DollarSign,
  Activity,
  TrendingUp,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { generateLeads } from "@/hooks/use-mock-data"
import { cn, formatCurrency, formatNumber } from "@/lib/utils"
import type { Lead, Signal } from "@/types"

type ViewMode = "list" | "card" | "map"
type LeadMode = "all" | "pre-market-residential" | "pre-market-cre" | "agent-network"
type SortField = "score" | "owner" | "address" | "type" | "value" | "status" | "lastContact"
type SortDir = "asc" | "desc"

const PROPERTY_TYPES = ["SFR", "Multi-Family", "Commercial", "Industrial", "Office", "Retail", "Mixed-Use", "Land"] as const
const OWNER_TYPES = ["Individual", "LLC", "Corporation", "Trust", "Partnership"] as const
const SIGNAL_TYPES = ["distress", "life-event", "financial", "behavioral", "market"] as const
const OCCUPANCY_TYPES = ["Owner-Occupied", "Tenant-Occupied", "Vacant"] as const
const STATUS_OPTIONS = ["New", "Contacted", "Responded", "Meeting", "Negotiating", "Under Contract", "Closed", "Dead"] as const

const SIGNAL_LABELS: Record<string, string> = {
  distress: "Distress",
  "life-event": "Life Event",
  financial: "Financial",
  behavioral: "Behavioral",
  market: "Market",
}

function getScoreColor(score: number) {
  if (score >= 80) return "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/40 dark:text-red-300 dark:border-red-800"
  if (score >= 50) return "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/40 dark:text-amber-300 dark:border-amber-800"
  return "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/40 dark:text-blue-300 dark:border-blue-800"
}

function getStatusColor(status: Lead["status"]) {
  const map: Record<Lead["status"], string> = {
    New: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
    Contacted: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
    Responded: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300",
    Meeting: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300",
    Negotiating: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
    "Under Contract": "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
    Closed: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
    Dead: "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400",
  }
  return map[status]
}

function getSignalColor(type: Signal["type"]) {
  const map: Record<Signal["type"], string> = {
    distress: "bg-red-500",
    "life-event": "bg-purple-500",
    financial: "bg-emerald-500",
    behavioral: "bg-amber-500",
    market: "bg-blue-500",
  }
  return map[type]
}

function getSignalBadgeColor(type: Signal["type"]) {
  const map: Record<Signal["type"], string> = {
    distress: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
    "life-event": "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
    financial: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
    behavioral: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
    market: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  }
  return map[type]
}

function getEntityIcon(entityType: string) {
  switch (entityType) {
    case "Individual": return <User className="h-3.5 w-3.5 text-gray-400" />
    case "LLC": return <Building className="h-3.5 w-3.5 text-gray-400" />
    case "Corporation": return <Briefcase className="h-3.5 w-3.5 text-gray-400" />
    case "Trust": return <Shield className="h-3.5 w-3.5 text-gray-400" />
    case "Partnership": return <Users className="h-3.5 w-3.5 text-gray-400" />
    default: return <User className="h-3.5 w-3.5 text-gray-400" />
  }
}

function getPropertyIcon(type: string) {
  switch (type) {
    case "SFR": return <Home className="h-4 w-4" />
    case "Multi-Family": return <Building2 className="h-4 w-4" />
    case "Commercial": return <Store className="h-4 w-4" />
    case "Industrial": return <Factory className="h-4 w-4" />
    case "Office": return <Landmark className="h-4 w-4" />
    case "Retail": return <Store className="h-4 w-4" />
    case "Mixed-Use": return <Layers className="h-4 w-4" />
    case "Land": return <Trees className="h-4 w-4" />
    default: return <Building2 className="h-4 w-4" />
  }
}

function getPropertyCategory(type: string): "Residential" | "Commercial" {
  return ["SFR", "Multi-Family"].includes(type) ? "Residential" : "Commercial"
}

function getCategoryBadgeColor(category: "Residential" | "Commercial") {
  return category === "Residential"
    ? "bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300"
    : "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300"
}

function formatRelativeDate(dateStr?: string) {
  if (!dateStr) return "--"
  const diff = Date.now() - new Date(dateStr).getTime()
  const days = Math.floor(diff / 86400000)
  if (days === 0) return "Today"
  if (days === 1) return "Yesterday"
  if (days < 7) return `${days}d ago`
  if (days < 30) return `${Math.floor(days / 7)}w ago`
  return `${Math.floor(days / 30)}mo ago`
}

export default function LeadsPage() {
  const [leads] = useState<Lead[]>(() => generateLeads(20))
  const { matchesMarket, filterActive } = useAgentMarketFilter()
  const [viewMode, setViewMode] = useState<ViewMode>("list")
  const [leadMode, setLeadMode] = useState<LeadMode>("all")
  const [showFilters, setShowFilters] = useState(false)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [sortField, setSortField] = useState<SortField>("score")
  const [sortDir, setSortDir] = useState<SortDir>("desc")

  // Filter states
  const [filterPropertyTypes, setFilterPropertyTypes] = useState<Set<string>>(new Set())
  const [filterScoreMin, setFilterScoreMin] = useState("")
  const [filterScoreMax, setFilterScoreMax] = useState("")
  const [filterOwnerTypes, setFilterOwnerTypes] = useState<Set<string>>(new Set())
  const [filterSignals, setFilterSignals] = useState<Set<string>>(new Set())
  const [filterOccupancy, setFilterOccupancy] = useState<Set<string>>(new Set())
  const [filterLocation, setFilterLocation] = useState("")
  const [filterStatus, setFilterStatus] = useState<Set<string>>(new Set())

  const allSelected = selectedIds.size === leads.length && leads.length > 0

  function toggleSelectAll() {
    if (allSelected) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(leads.map((l) => l.id)))
    }
  }

  function toggleSelect(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function toggleFilter<T>(set: Set<T>, value: T, setter: React.Dispatch<React.SetStateAction<Set<T>>>) {
    setter((prev) => {
      const next = new Set(prev)
      if (next.has(value)) next.delete(value)
      else next.add(value)
      return next
    })
  }

  function clearAllFilters() {
    setFilterPropertyTypes(new Set())
    setFilterScoreMin("")
    setFilterScoreMax("")
    setFilterOwnerTypes(new Set())
    setFilterSignals(new Set())
    setFilterOccupancy(new Set())
    setFilterLocation("")
    setFilterStatus(new Set())
  }

  function handleSort(field: SortField) {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"))
    } else {
      setSortField(field)
      setSortDir("desc")
    }
  }

  function SortIcon({ field }: { field: SortField }) {
    if (sortField !== field) return <ArrowUpDown className="h-3 w-3 ml-1 text-gray-400" />
    return sortDir === "asc"
      ? <ArrowUp className="h-3 w-3 ml-1 text-blue-600" />
      : <ArrowDown className="h-3 w-3 ml-1 text-blue-600" />
  }

  const activeFilterCount = useMemo(() => {
    let count = 0
    if (filterPropertyTypes.size) count++
    if (filterScoreMin || filterScoreMax) count++
    if (filterOwnerTypes.size) count++
    if (filterSignals.size) count++
    if (filterOccupancy.size) count++
    if (filterLocation) count++
    if (filterStatus.size) count++
    return count
  }, [filterPropertyTypes, filterScoreMin, filterScoreMax, filterOwnerTypes, filterSignals, filterOccupancy, filterLocation, filterStatus])

  const filteredLeads = useMemo(() => {
    if (!filterActive) return leads
    return leads.filter((lead) => matchesMarket(lead.property.state, lead.property.city))
  }, [leads, filterActive, matchesMarket])

  return (
    <div className="flex flex-col gap-6 p-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Leads</h1>
          <Badge variant="secondary" className="text-sm font-medium">
            {formatNumber(12847)}
          </Badge>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button size="sm">
            <Plus className="h-4 w-4" />
            Add Lead
          </Button>
          <Button variant="outline" size="sm">
            <Upload className="h-4 w-4" />
            Import CSV
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button
            variant={showFilters ? "secondary" : "outline"}
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters
            {activeFilterCount > 0 && (
              <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">
                {activeFilterCount}
              </span>
            )}
          </Button>
          <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden ml-2">
            <button
              onClick={() => setViewMode("list")}
              className={cn(
                "p-2 transition-colors",
                viewMode === "list"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-500 hover:bg-gray-50 dark:bg-gray-900 dark:hover:bg-gray-800"
              )}
            >
              <List className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode("card")}
              className={cn(
                "p-2 transition-colors border-x border-gray-200 dark:border-gray-700",
                viewMode === "card"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-500 hover:bg-gray-50 dark:bg-gray-900 dark:hover:bg-gray-800"
              )}
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode("map")}
              className={cn(
                "p-2 transition-colors",
                viewMode === "map"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-500 hover:bg-gray-50 dark:bg-gray-900 dark:hover:bg-gray-800"
              )}
            >
              <MapPin className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Mode Toggle */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mr-1">Mode</span>
        {([
          { key: "all" as LeadMode, label: "All Leads" },
          { key: "pre-market-residential" as LeadMode, label: "Pre-Market Residential" },
          { key: "pre-market-cre" as LeadMode, label: "Pre-Market CRE" },
          { key: "agent-network" as LeadMode, label: "Agent Network" },
        ]).map((mode) => (
          <button
            key={mode.key}
            onClick={() => setLeadMode(mode.key)}
            className={cn(
              "px-3 py-1.5 rounded-full text-xs font-medium transition-colors",
              leadMode === mode.key
                ? "bg-blue-600 text-white shadow-sm"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            )}
          >
            {mode.label}
          </button>
        ))}
      </div>

      {/* Agent Market Filter */}
      <AgentMarketFilter className="mb-4" />

      {/* Filter Panel */}
      {showFilters && (
        <Card>
          <CardContent className="p-5">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {/* Property Type */}
              <div>
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 block">
                  Property Type
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {PROPERTY_TYPES.map((t) => (
                    <button
                      key={t}
                      onClick={() => toggleFilter(filterPropertyTypes, t, setFilterPropertyTypes)}
                      className={cn(
                        "px-2.5 py-1 rounded-md text-xs font-medium border transition-colors",
                        filterPropertyTypes.has(t)
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-white text-gray-600 border-gray-200 hover:border-blue-300 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700"
                      )}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Score Range */}
              <div>
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 block">
                  Score Range
                </label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    placeholder="Min"
                    value={filterScoreMin}
                    onChange={(e) => setFilterScoreMin(e.target.value)}
                    className="h-8 text-sm"
                    min={0}
                    max={100}
                  />
                  <span className="text-gray-400 text-sm">to</span>
                  <Input
                    type="number"
                    placeholder="Max"
                    value={filterScoreMax}
                    onChange={(e) => setFilterScoreMax(e.target.value)}
                    className="h-8 text-sm"
                    min={0}
                    max={100}
                  />
                </div>
              </div>

              {/* Owner Type */}
              <div>
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 block">
                  Owner Type
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {OWNER_TYPES.map((t) => (
                    <button
                      key={t}
                      onClick={() => toggleFilter(filterOwnerTypes, t, setFilterOwnerTypes)}
                      className={cn(
                        "px-2.5 py-1 rounded-md text-xs font-medium border transition-colors",
                        filterOwnerTypes.has(t)
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-white text-gray-600 border-gray-200 hover:border-blue-300 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700"
                      )}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Signals */}
              <div>
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 block">
                  Signals
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {SIGNAL_TYPES.map((t) => (
                    <button
                      key={t}
                      onClick={() => toggleFilter(filterSignals, t, setFilterSignals)}
                      className={cn(
                        "px-2.5 py-1 rounded-md text-xs font-medium border transition-colors flex items-center gap-1.5",
                        filterSignals.has(t)
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-white text-gray-600 border-gray-200 hover:border-blue-300 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700"
                      )}
                    >
                      <span className={cn("h-2 w-2 rounded-full", getSignalColor(t))} />
                      {SIGNAL_LABELS[t]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Occupancy */}
              <div>
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 block">
                  Occupancy
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {OCCUPANCY_TYPES.map((t) => (
                    <button
                      key={t}
                      onClick={() => toggleFilter(filterOccupancy, t, setFilterOccupancy)}
                      className={cn(
                        "px-2.5 py-1 rounded-md text-xs font-medium border transition-colors",
                        filterOccupancy.has(t)
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-white text-gray-600 border-gray-200 hover:border-blue-300 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700"
                      )}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 block">
                  Location
                </label>
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                  <Input
                    placeholder="City, state, or zip..."
                    value={filterLocation}
                    onChange={(e) => setFilterLocation(e.target.value)}
                    className="h-8 pl-8 text-sm"
                  />
                </div>
              </div>

              {/* Status */}
              <div className="lg:col-span-2">
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 block">
                  Status
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {STATUS_OPTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => toggleFilter(filterStatus, s, setFilterStatus)}
                      className={cn(
                        "px-2.5 py-1 rounded-md text-xs font-medium border transition-colors",
                        filterStatus.has(s)
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-white text-gray-600 border-gray-200 hover:border-blue-300 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700"
                      )}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 mt-5 pt-4 border-t border-gray-100 dark:border-gray-800">
              <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                <X className="h-3.5 w-3.5" />
                Clear All
              </Button>
              <Button size="sm">
                Apply Filters
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Batch Action Bar */}
      {selectedIds.size > 0 && (
        <div className="flex items-center gap-3 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg px-4 py-2.5">
          <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
            {selectedIds.size} selected
          </span>
          <div className="h-4 w-px bg-blue-200 dark:bg-blue-700" />
          <Button variant="ghost" size="sm" className="text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/40">
            Add to Campaign
          </Button>
          <Button variant="ghost" size="sm" className="text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/40">
            Export Selected
          </Button>
          <Button variant="ghost" size="sm" className="text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/40">
            Assign To
          </Button>
          <Button variant="ghost" size="sm" className="text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/40">
            Change Status
          </Button>
          <div className="flex-1" />
          <Button
            variant="ghost"
            size="sm"
            className="text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-900/40"
            onClick={() => setSelectedIds(new Set())}
          >
            <X className="h-3.5 w-3.5" />
            Clear
          </Button>
        </div>
      )}

      {/* List View */}
      {viewMode === "list" && (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-800">
                  <th className="px-4 py-3 text-left w-10">
                    <button onClick={toggleSelectAll} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                      {allSelected
                        ? <CheckSquare className="h-4 w-4 text-blue-600" />
                        : <Square className="h-4 w-4" />
                      }
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left w-20">
                    <button onClick={() => handleSort("score")} className="flex items-center font-semibold text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider hover:text-gray-700 dark:hover:text-gray-200">
                      Score <SortIcon field="score" />
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left">
                    <button onClick={() => handleSort("owner")} className="flex items-center font-semibold text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider hover:text-gray-700 dark:hover:text-gray-200">
                      Owner <SortIcon field="owner" />
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left">
                    <button onClick={() => handleSort("address")} className="flex items-center font-semibold text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider hover:text-gray-700 dark:hover:text-gray-200">
                      Property <SortIcon field="address" />
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left w-28">
                    <button onClick={() => handleSort("type")} className="flex items-center font-semibold text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider hover:text-gray-700 dark:hover:text-gray-200">
                      Type <SortIcon field="type" />
                    </button>
                  </th>
                  <th className="px-4 py-3 text-right w-32">
                    <button onClick={() => handleSort("value")} className="flex items-center justify-end font-semibold text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider hover:text-gray-700 dark:hover:text-gray-200 ml-auto">
                      Est. Value <SortIcon field="value" />
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left w-40">
                    <span className="font-semibold text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">
                      Signals
                    </span>
                  </th>
                  <th className="px-4 py-3 text-left w-28">
                    <button onClick={() => handleSort("status")} className="flex items-center font-semibold text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider hover:text-gray-700 dark:hover:text-gray-200">
                      Status <SortIcon field="status" />
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left w-24">
                    <button onClick={() => handleSort("lastContact")} className="flex items-center font-semibold text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider hover:text-gray-700 dark:hover:text-gray-200">
                      Contact <SortIcon field="lastContact" />
                    </button>
                  </th>
                  <th className="px-4 py-3 text-right w-32">
                    <span className="font-semibold text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">
                      Actions
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-800/50">
                {filteredLeads.map((lead) => (
                  <tr
                    key={lead.id}
                    className={cn(
                      "group transition-colors hover:bg-gray-50/50 dark:hover:bg-gray-900/50",
                      selectedIds.has(lead.id) && "bg-blue-50/50 dark:bg-blue-950/20"
                    )}
                  >
                    <td className="px-4 py-3">
                      <button onClick={() => toggleSelect(lead.id)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                        {selectedIds.has(lead.id)
                          ? <CheckSquare className="h-4 w-4 text-blue-600" />
                          : <Square className="h-4 w-4" />
                        }
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn("inline-flex items-center justify-center w-10 h-7 rounded-md text-xs font-bold border", getScoreColor(lead.score))}>
                        {lead.score}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {getEntityIcon(lead.owner.entityType)}
                        <div>
                          <div className="font-medium text-gray-900 dark:text-gray-100 truncate max-w-[180px]">
                            {lead.owner.name}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {lead.owner.entityType}{lead.owner.outOfState ? " · Out-of-state" : ""}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-gray-900 dark:text-gray-100 truncate max-w-[200px]">
                        {lead.property.address}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {lead.property.city}, {lead.property.state} {lead.property.zip}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-300">
                        {getPropertyIcon(lead.property.propertyType)}
                        <span className="text-xs">{lead.property.propertyType}</span>
                        <span className={cn("inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-medium", getCategoryBadgeColor(getPropertyCategory(lead.property.propertyType)))}>
                          {getPropertyCategory(lead.property.propertyType)}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-gray-900 dark:text-gray-100">
                      {formatCurrency(lead.property.estimatedValue)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        {lead.signals.slice(0, 3).map((signal, i) => (
                          <span
                            key={i}
                            className={cn("h-2.5 w-2.5 rounded-full", getSignalColor(signal.type))}
                            title={signal.label}
                          />
                        ))}
                        {lead.signals.length > 3 && (
                          <span className="text-xs text-gray-400 ml-0.5">+{lead.signals.length - 3}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium", getStatusColor(lead.status))}>
                        {lead.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500 dark:text-gray-400">
                      {formatRelativeDate(lead.lastContactDate)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="icon" className="h-7 w-7" title="View Lead">
                          <Eye className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7" title="Call">
                          <Phone className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7" title="Email">
                          <Mail className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7" title="More Actions">
                          <MoreHorizontal className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 dark:border-gray-800">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Showing <span className="font-medium text-gray-700 dark:text-gray-200">1-20</span> of{" "}
              <span className="font-medium text-gray-700 dark:text-gray-200">12,847</span> leads
            </span>
            <div className="flex items-center gap-1">
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
              <Button variant="secondary" size="sm" className="min-w-[32px]">1</Button>
              <Button variant="ghost" size="sm" className="min-w-[32px]">2</Button>
              <Button variant="ghost" size="sm" className="min-w-[32px]">3</Button>
              <span className="px-2 text-gray-400">...</span>
              <Button variant="ghost" size="sm" className="min-w-[32px]">643</Button>
              <Button variant="outline" size="sm">
                Next
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Card View */}
      {viewMode === "card" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {leads.map((lead) => (
            <Card key={lead.id} className="group hover:shadow-md transition-shadow cursor-pointer relative overflow-hidden">
              <CardContent className="p-4">
                {/* Score Badge - top right */}
                <div className="absolute top-3 right-3">
                  <span className={cn("inline-flex items-center justify-center w-10 h-7 rounded-md text-xs font-bold border", getScoreColor(lead.score))}>
                    {lead.score}
                  </span>
                </div>

                {/* Property Type Icon + Owner */}
                <div className="flex items-start gap-3 mb-3 pr-12">
                  <div className="flex items-center justify-center h-9 w-9 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 shrink-0">
                    {getPropertyIcon(lead.property.propertyType)}
                  </div>
                  <div className="min-w-0">
                    <div className="font-semibold text-gray-900 dark:text-gray-100 truncate">
                      {lead.owner.name}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                      {getEntityIcon(lead.owner.entityType)}
                      {lead.owner.entityType}
                    </div>
                  </div>
                </div>

                {/* Address */}
                <div className="text-sm text-gray-700 dark:text-gray-300 mb-1 truncate">
                  {lead.property.address}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 mb-3">
                  <span>{lead.property.city}, {lead.property.state} {lead.property.zip}</span>
                  <span className={cn("inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-medium", getCategoryBadgeColor(getPropertyCategory(lead.property.propertyType)))}>
                    {getPropertyCategory(lead.property.propertyType)}
                  </span>
                </div>

                {/* Value + Sqft */}
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    {formatCurrency(lead.property.estimatedValue)}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {formatNumber(lead.property.sqft)} sqft
                  </span>
                </div>

                {/* Signal Badges */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {lead.signals.slice(0, 3).map((signal, i) => (
                    <span
                      key={i}
                      className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium", getSignalBadgeColor(signal.type))}
                    >
                      {signal.label.length > 20 ? signal.label.substring(0, 20) + "..." : signal.label}
                    </span>
                  ))}
                </div>

                {/* Status + Actions */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-800">
                  <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium", getStatusColor(lead.status))}>
                    {lead.status}
                  </span>
                  <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="icon" className="h-7 w-7">
                      <Eye className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7">
                      <Phone className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7">
                      <Mail className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Map View Placeholder */}
      {viewMode === "map" && (
        <Card>
          <CardContent className="p-0">
            <div className="flex flex-col items-center justify-center h-[600px] bg-gray-50 dark:bg-gray-900/50 rounded-xl">
              <MapPin className="h-12 w-12 text-gray-300 dark:text-gray-600 mb-3" />
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-1">Map View</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md text-center">
                Interactive map view with property pins, heat map overlays, and territory boundaries. Connect a mapping provider to enable.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Card/Map view pagination */}
      {viewMode !== "list" && (
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Showing <span className="font-medium text-gray-700 dark:text-gray-200">1-20</span> of{" "}
            <span className="font-medium text-gray-700 dark:text-gray-200">12,847</span> leads
          </span>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="sm" disabled>
              Previous
            </Button>
            <Button variant="secondary" size="sm" className="min-w-[32px]">1</Button>
            <Button variant="ghost" size="sm" className="min-w-[32px]">2</Button>
            <Button variant="ghost" size="sm" className="min-w-[32px]">3</Button>
            <span className="px-2 text-gray-400">...</span>
            <Button variant="ghost" size="sm" className="min-w-[32px]">643</Button>
            <Button variant="outline" size="sm">
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
