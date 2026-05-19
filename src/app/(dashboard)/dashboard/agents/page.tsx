"use client"

import { useState, useMemo } from "react"
import {
  UserCheck,
  Star,
  MapPin,
  Building2,
  Phone,
  Mail,
  Award,
  TrendingUp,
  Search,
  SlidersHorizontal,
  X,
  Users,
  Handshake,
  Send,
  Calendar,
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { generateAgentProfiles } from "@/hooks/use-mock-data"
import { cn, formatCurrency, formatNumber } from "@/lib/utils"
import type { AgentProfile } from "@/types"

const MARKETS = ["all", "FL", "PR", "DR"] as const
const SPECIALTIES = ["all", "residential", "commercial", "both"] as const

function getMarketColor(market: AgentProfile["licenseState"]) {
  const map: Record<AgentProfile["licenseState"], string> = {
    FL: "bg-blue-600",
    PR: "bg-purple-600",
    DR: "bg-amber-600",
  }
  return map[market]
}

function getMarketBadgeColor(market: AgentProfile["licenseState"]) {
  const map: Record<AgentProfile["licenseState"], string> = {
    FL: "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/40 dark:text-blue-300 dark:border-blue-800",
    PR: "bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/40 dark:text-purple-300 dark:border-purple-800",
    DR: "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/40 dark:text-amber-300 dark:border-amber-800",
  }
  return map[market]
}

function getSpecialtyBadgeColor(specialty: AgentProfile["specialty"]) {
  const map: Record<AgentProfile["specialty"], string> = {
    residential: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
    commercial: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
    both: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
  }
  return map[specialty]
}

function getSpecialtyLabel(specialty: AgentProfile["specialty"]) {
  const map: Record<AgentProfile["specialty"], string> = {
    residential: "Residential",
    commercial: "Commercial",
    both: "Residential & Commercial",
  }
  return map[specialty]
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

function renderStars(rating: number) {
  const full = Math.floor(rating)
  const hasHalf = rating - full >= 0.5
  const empty = 5 - full - (hasHalf ? 1 : 0)
  return (
    <span className="inline-flex items-center gap-0.5 text-amber-500">
      {"★".repeat(full)}
      {hasHalf && "★"}
      <span className="text-gray-300 dark:text-gray-600">{"☆".repeat(empty)}</span>
    </span>
  )
}

function getMarketFlag(market: AgentProfile["licenseState"]) {
  const map: Record<AgentProfile["licenseState"], string> = {
    FL: "US",
    PR: "PR",
    DR: "DO",
  }
  return map[market]
}

export default function AgentsPage() {
  const [agents] = useState<AgentProfile[]>(() => generateAgentProfiles(24))
  const [searchQuery, setSearchQuery] = useState("")
  const [marketFilter, setMarketFilter] = useState<(typeof MARKETS)[number]>("all")
  const [specialtyFilter, setSpecialtyFilter] = useState<(typeof SPECIALTIES)[number]>("all")
  const [brokerageFilter, setBrokerageFilter] = useState("")

  const brokerages = useMemo(() => {
    const set = new Set(agents.map((a) => a.brokerage))
    return Array.from(set).sort()
  }, [agents])

  const filtered = useMemo(() => {
    return agents.filter((agent) => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase()
        const matchesSearch =
          agent.name.toLowerCase().includes(q) ||
          agent.brokerage.toLowerCase().includes(q) ||
          agent.territories.some((t) => t.toLowerCase().includes(q)) ||
          agent.licenseNumber.toLowerCase().includes(q)
        if (!matchesSearch) return false
      }
      if (marketFilter !== "all" && agent.licenseState !== marketFilter) return false
      if (specialtyFilter !== "all" && agent.specialty !== specialtyFilter) return false
      if (brokerageFilter && agent.brokerage !== brokerageFilter) return false
      return true
    })
  }, [agents, searchQuery, marketFilter, specialtyFilter, brokerageFilter])

  const stats = useMemo(() => {
    return {
      total: agents.length,
      fl: agents.filter((a) => a.licenseState === "FL").length,
      pr: agents.filter((a) => a.licenseState === "PR").length,
      dr: agents.filter((a) => a.licenseState === "DR").length,
    }
  }, [agents])

  function clearFilters() {
    setSearchQuery("")
    setMarketFilter("all")
    setSpecialtyFilter("all")
    setBrokerageFilter("")
  }

  const hasActiveFilters = searchQuery || marketFilter !== "all" || specialtyFilter !== "all" || brokerageFilter

  return (
    <div className="flex flex-col gap-6 p-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-sm">
            <UserCheck className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Agent Network</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Connect, co-list, and build referral partnerships
            </p>
          </div>
        </div>
        <Link href="/dashboard/agents/co-listing">
          <Button>
            <Handshake className="h-4 w-4" />
            Co-Listing Marketplace
          </Button>
        </Link>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-gray-100 dark:bg-gray-800">
              <Users className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.total}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Total Agents</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900/30">
              <span className="text-lg">US</span>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.fl}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">FL Agents</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-purple-100 dark:bg-purple-900/30">
              <span className="text-lg">PR</span>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.pr}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">PR Agents</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-amber-100 dark:bg-amber-900/30">
              <span className="text-lg">DO</span>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.dr}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">DR Agents</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by name, brokerage, territory, or license..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Market Filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mr-1 shrink-0">Market</span>
              {MARKETS.map((m) => (
                <button
                  key={m}
                  onClick={() => setMarketFilter(m)}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-xs font-medium transition-colors",
                    marketFilter === m
                      ? "bg-blue-600 text-white shadow-sm"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                  )}
                >
                  {m === "all" ? "All" : m}
                </button>
              ))}
            </div>

            {/* Specialty Filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mr-1 shrink-0">Specialty</span>
              {SPECIALTIES.map((s) => (
                <button
                  key={s}
                  onClick={() => setSpecialtyFilter(s)}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-xs font-medium transition-colors",
                    specialtyFilter === s
                      ? "bg-blue-600 text-white shadow-sm"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                  )}
                >
                  {s === "all" ? "All" : s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>

            {/* Brokerage Filter */}
            <select
              value={brokerageFilter}
              onChange={(e) => setBrokerageFilter(e.target.value)}
              className="h-9 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
            >
              <option value="">All Brokerages</option>
              {brokerages.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>

            {/* Clear Filters */}
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                <X className="h-3.5 w-3.5" />
                Clear
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Showing <span className="font-medium text-gray-700 dark:text-gray-200">{filtered.length}</span> of{" "}
          <span className="font-medium text-gray-700 dark:text-gray-200">{agents.length}</span> agents
        </p>
      </div>

      {/* Agent Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((agent) => (
          <Card key={agent.id} className="group hover:shadow-lg transition-all duration-200 overflow-hidden">
            {/* Market Color Strip */}
            <div className={cn("h-1", getMarketColor(agent.licenseState))} />
            <CardContent className="p-5">
              {/* Header: Avatar + Name */}
              <div className="flex items-start gap-3 mb-4">
                <div
                  className={cn(
                    "flex items-center justify-center h-12 w-12 rounded-full text-white font-bold text-sm shrink-0",
                    getMarketColor(agent.licenseState)
                  )}
                >
                  {getInitials(agent.name)}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate">
                    {agent.name}
                  </h3>
                  <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                    <Building2 className="h-3 w-3 shrink-0" />
                    <span className="truncate">{agent.brokerage}</span>
                  </div>
                </div>
              </div>

              {/* License */}
              <div className="flex items-center gap-2 mb-3">
                <Award className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  <span className="font-medium">{getMarketFlag(agent.licenseState)}</span> {agent.licenseNumber}
                </span>
              </div>

              {/* Specialty Badge */}
              <div className="flex items-center gap-2 mb-3">
                <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium", getSpecialtyBadgeColor(agent.specialty))}>
                  {getSpecialtyLabel(agent.specialty)}
                </span>
                {agent.coListingAvailable && (
                  <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300">
                    <Handshake className="h-2.5 w-2.5 mr-0.5" />
                    Co-Listing
                  </span>
                )}
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-3 gap-2 mb-3 p-2.5 rounded-lg bg-gray-50 dark:bg-gray-900/50">
                <div className="text-center">
                  <p className="text-sm font-bold text-gray-900 dark:text-gray-100">{agent.dealsClosedLTM}</p>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase">Deals</p>
                </div>
                <div className="text-center border-x border-gray-200 dark:border-gray-700">
                  <p className="text-sm font-bold text-gray-900 dark:text-gray-100">{agent.avgDaysOnMarket}d</p>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase">Avg DOM</p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-bold text-gray-900 dark:text-gray-100">{formatCurrency(agent.totalVolumeLTM)}</p>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase">Volume</p>
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-3">
                {renderStars(agent.rating)}
                <span className="text-xs font-medium text-gray-600 dark:text-gray-300">{agent.rating}</span>
              </div>

              {/* Territories */}
              <div className="flex flex-wrap gap-1 mb-3">
                {agent.territories.map((territory) => (
                  <span
                    key={territory}
                    className="inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-[10px] font-medium bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                  >
                    <MapPin className="h-2.5 w-2.5" />
                    {territory}
                  </span>
                ))}
              </div>

              {/* Referral Fee */}
              {agent.referralFeePercent && (
                <div className="flex items-center gap-1.5 mb-3 text-xs text-gray-500 dark:text-gray-400">
                  <TrendingUp className="h-3 w-3" />
                  <span>Referral fee: <span className="font-medium text-gray-700 dark:text-gray-200">{agent.referralFeePercent}%</span></span>
                </div>
              )}

              {/* Divider + Actions */}
              <div className="pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center gap-1.5">
                <Button variant="outline" size="sm" className="flex-1 text-xs h-8">
                  <Mail className="h-3 w-3" />
                  Connect
                </Button>
                <Button variant="outline" size="sm" className="flex-1 text-xs h-8">
                  <Handshake className="h-3 w-3" />
                  Co-List
                </Button>
                <Button variant="outline" size="sm" className="flex-1 text-xs h-8">
                  <Send className="h-3 w-3" />
                  Referral
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filtered.length === 0 && (
        <Card>
          <CardContent className="p-0">
            <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
              <div className="mb-4 text-gray-400 dark:text-gray-500">
                <UserCheck className="h-12 w-12" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                No agents found
              </h3>
              <p className="mt-1 max-w-sm text-sm text-gray-500 dark:text-gray-400">
                Try adjusting your filters or search query to find agents in your network.
              </p>
              <Button className="mt-4" onClick={clearFilters}>
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
