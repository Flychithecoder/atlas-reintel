"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import {
  MapPin,
  Shield,
  Target,
  Eye,
  Sparkles,
  TrendingUp,
  Users,
  BarChart3,
  Flag,
  Globe2,
  Clock,
  Zap,
  Crown,
  AlertTriangle,
  ChevronRight,
  DollarSign,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { generateTerritories } from "@/hooks/use-mock-data"
import { cn, formatCurrency, formatNumber } from "@/lib/utils"
import { ScoreBadge } from "@/components/shared/score-badge"
import { RelativeTime } from "@/components/shared/relative-time"
import type { Territory } from "@/types"

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const MARKET_FLAGS: Record<string, string> = {
  FL: "\u{1F1FA}\u{1F1F8}",
  PR: "\u{1F1F5}\u{1F1F7}",
  DR: "\u{1F1E9}\u{1F1F4}",
}

const MARKET_LABELS: Record<string, string> = {
  FL: "Florida",
  PR: "Puerto Rico",
  DR: "Dominican Republic",
}

const COMPETITION_CONFIG: Record<
  Territory["competitionLevel"],
  { label: string; color: string; bg: string }
> = {
  low: {
    label: "Low",
    color: "text-green-700 dark:text-green-400",
    bg: "bg-green-100 dark:bg-green-900/30",
  },
  medium: {
    label: "Medium",
    color: "text-yellow-700 dark:text-yellow-400",
    bg: "bg-yellow-100 dark:bg-yellow-900/30",
  },
  high: {
    label: "High",
    color: "text-red-700 dark:text-red-400",
    bg: "bg-red-100 dark:bg-red-900/30",
  },
}

const CURRENT_USER = "You"

// ---------------------------------------------------------------------------
// Mock data — stable across renders
// ---------------------------------------------------------------------------

const ALL_TERRITORIES = generateTerritories()

// Assign some territories to the current user
const TERRITORIES: Territory[] = ALL_TERRITORIES.map((t, i) => {
  // Assign first 3 FL territories + first PR + first DR territory to user
  if (
    (t.market === "FL" && i < 3) ||
    (t.market === "PR" && t.name === "San Juan") ||
    (t.market === "DR" && t.name === "Santo Domingo")
  ) {
    return { ...t, assignedTo: CURRENT_USER }
  }
  return t
})

// Mock contested leads
const CONTESTED_LEADS = [
  { id: "cl-1", address: "1250 Brickell Ave, Miami FL", brokerCount: 8, value: 4200000 },
  { id: "cl-2", address: "200 SE 1st St, Fort Lauderdale FL", brokerCount: 7, value: 3100000 },
  { id: "cl-3", address: "400 Royal Palm Way, Palm Beach FL", brokerCount: 6, value: 8500000 },
  { id: "cl-4", address: "Calle El Conde 102, Santo Domingo DR", brokerCount: 5, value: 1800000 },
  { id: "cl-5", address: "Ave Ashford 1054, Condado PR", brokerCount: 5, value: 2900000 },
]

// Mock untouched gold leads
const UNTOUCHED_GOLD = [
  { id: "ug-1", address: "8700 NW 36th St, Doral FL", score: 94, value: 5200000 },
  { id: "ug-2", address: "1500 San Sebastian, San Juan PR", score: 91, value: 2100000 },
  { id: "ug-3", address: "14200 Biscayne Blvd, Miami FL", score: 89, value: 3800000 },
  { id: "ug-4", address: "Ave 27 de Febrero, Santiago DR", score: 87, value: 1500000 },
  { id: "ug-5", address: "3300 Coral Way, Miami FL", score: 85, value: 2700000 },
]

// Mock solo advantage territories
const SOLO_ADVANTAGE = [
  { territory: "Collier", signalCount: 142, market: "FL" as const },
  { territory: "Dorado", signalCount: 89, market: "PR" as const },
  { territory: "Samana", signalCount: 67, market: "DR" as const },
]

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------

export default function TerritoryPage() {
  const [mapMarket, setMapMarket] = useState<"FL" | "PR" | "DR">("FL")
  const [selectedTerritory, setSelectedTerritory] = useState<Territory | null>(null)

  // Filtered territories by market
  const marketTerritories = useMemo(
    () => TERRITORIES.filter((t) => t.market === mapMarket),
    [mapMarket]
  )

  // User territories
  const myTerritories = useMemo(
    () => TERRITORIES.filter((t) => t.assignedTo === CURRENT_USER),
    []
  )

  // Unclaimed territories
  const unclaimedTerritories = useMemo(
    () => TERRITORIES.filter((t) => !t.assignedTo),
    []
  )

  // Stats
  const stats = useMemo(() => {
    const total = TERRITORIES.length
    const assigned = myTerritories.length
    const hotSignals = TERRITORIES.reduce((sum, t) => sum + t.hotLeads, 0)
    const unclaimed = unclaimedTerritories.length
    return { total, assigned, hotSignals, unclaimed }
  }, [myTerritories, unclaimedTerritories])

  // Signal intensity for territory cards
  const maxSignals = useMemo(
    () => Math.max(...marketTerritories.map((t) => t.signalCount), 1),
    [marketTerritories]
  )

  return (
    <div className="flex flex-col gap-6">
      {/* ---- Top Section ---- */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900/30">
              <MapPin className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-50">
                Territory Command Center
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Claim, manage, and dominate your markets
              </p>
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCard
            label="Total Territories"
            value={stats.total.toString()}
            icon={<Globe2 className="h-4 w-4" />}
            color="blue"
          />
          <StatCard
            label="Assigned to You"
            value={stats.assigned.toString()}
            icon={<Shield className="h-4 w-4" />}
            color="green"
          />
          <StatCard
            label="Hot Signals"
            value={formatNumber(stats.hotSignals)}
            icon={<Zap className="h-4 w-4" />}
            color="red"
          />
          <StatCard
            label="Unclaimed Zones"
            value={stats.unclaimed.toString()}
            icon={<Target className="h-4 w-4" />}
            color="amber"
          />
        </div>
      </div>

      {/* ---- Section 1: Interactive Territory Map ---- */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <MapPin className="h-4 w-4 text-blue-600" />
              Territory Overview
            </CardTitle>
            <Tabs
              defaultValue="FL"
              value={mapMarket}
              onValueChange={(v) => {
                setMapMarket(v as "FL" | "PR" | "DR")
                setSelectedTerritory(null)
              }}
            >
              <TabsList>
                <TabsTrigger value="FL">
                  {MARKET_FLAGS.FL} Florida
                </TabsTrigger>
                <TabsTrigger value="PR">
                  {MARKET_FLAGS.PR} Puerto Rico
                </TabsTrigger>
                <TabsTrigger value="DR">
                  {MARKET_FLAGS.DR} Dom. Republic
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            {/* Territory Grid */}
            <div className="lg:col-span-2">
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4">
                {marketTerritories.map((territory) => {
                  const intensity = territory.signalCount / maxSignals
                  const isSelected = selectedTerritory?.id === territory.id
                  const isMine = territory.assignedTo === CURRENT_USER

                  return (
                    <button
                      key={territory.id}
                      type="button"
                      onClick={() =>
                        setSelectedTerritory(isSelected ? null : territory)
                      }
                      className={cn(
                        "relative rounded-lg border p-3 text-left transition-all hover:shadow-md",
                        isSelected
                          ? "border-blue-500 ring-2 ring-blue-500/20 shadow-md dark:border-blue-400"
                          : "border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600",
                        isMine && "border-l-4 border-l-blue-500"
                      )}
                      style={{
                        background: isSelected
                          ? undefined
                          : `rgba(59, 130, 246, ${0.03 + intensity * 0.12})`,
                      }}
                    >
                      {/* Mine indicator */}
                      {isMine && (
                        <div className="absolute -top-1.5 -right-1.5">
                          <span className="flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-[8px] text-white">
                            <Shield className="h-2.5 w-2.5" />
                          </span>
                        </div>
                      )}

                      <div className="text-xs font-semibold text-gray-900 dark:text-gray-100 truncate">
                        {territory.name}
                      </div>
                      <div className="mt-1 flex items-center gap-1.5">
                        <span className="text-[10px] text-gray-500 dark:text-gray-400">
                          {territory.signalCount} signals
                        </span>
                        <span className="text-[10px] text-gray-400 dark:text-gray-500">
                          &middot;
                        </span>
                        <span className="text-[10px] text-gray-500 dark:text-gray-400">
                          {territory.activeLeads} leads
                        </span>
                      </div>
                      <div className="mt-1.5 flex items-center justify-between">
                        {territory.hotLeads > 0 && (
                          <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-red-600 dark:text-red-400">
                            <Zap className="h-2.5 w-2.5" />
                            {territory.hotLeads} hot
                          </span>
                        )}
                        <CompetitionBadge level={territory.competitionLevel} />
                      </div>
                    </button>
                  )
                })}
              </div>

              {/* Legend */}
              <div className="mt-3 flex flex-wrap items-center gap-4 text-[11px] text-gray-500 dark:text-gray-400">
                <span className="flex items-center gap-1.5">
                  <span className="h-3 w-3 rounded border border-l-4 border-l-blue-500 border-gray-200 dark:border-gray-700" />
                  Your territory
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-3 w-3 rounded" style={{ background: "rgba(59,130,246,0.15)" }} />
                  High signal density
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-3 w-3 rounded" style={{ background: "rgba(59,130,246,0.05)" }} />
                  Low signal density
                </span>
              </div>
            </div>

            {/* Selected Territory Detail Panel */}
            <div className="lg:col-span-1">
              {selectedTerritory ? (
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-lg">{MARKET_FLAGS[selectedTerritory.market]}</span>
                    <div>
                      <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100">
                        {selectedTerritory.name}
                      </h3>
                      <p className="text-[11px] text-gray-500 dark:text-gray-400">
                        {selectedTerritory.region} &middot; {MARKET_LABELS[selectedTerritory.market]}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <MiniStat label="Signals" value={selectedTerritory.signalCount} />
                    <MiniStat label="Active Leads" value={selectedTerritory.activeLeads} />
                    <MiniStat label="Hot Leads" value={selectedTerritory.hotLeads} />
                    <MiniStat label="Agents Active" value={selectedTerritory.agentsActive} />
                  </div>

                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs text-gray-500 dark:text-gray-400">Competition</span>
                    <CompetitionBadge level={selectedTerritory.competitionLevel} />
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs text-gray-500 dark:text-gray-400">Assigned to</span>
                    <span className="text-xs font-medium text-gray-900 dark:text-gray-100">
                      {selectedTerritory.assignedTo || "Unclaimed"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs text-gray-500 dark:text-gray-400">Last Activity</span>
                    <RelativeTime date={selectedTerritory.lastActivity} className="text-[11px]" />
                  </div>

                  <div className="flex flex-col gap-2">
                    <Link href="/dashboard/signals" className="w-full">
                      <Button size="sm" className="w-full">
                        <Eye className="mr-1.5 h-3.5 w-3.5" />
                        View Signals
                      </Button>
                    </Link>
                    {!selectedTerritory.assignedTo && (
                      <Button size="sm" variant="outline" className="w-full border-green-300 text-green-700 hover:bg-green-50 dark:border-green-700 dark:text-green-400 dark:hover:bg-green-900/20">
                        <Flag className="mr-1.5 h-3.5 w-3.5" />
                        Claim Territory
                      </Button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 p-8 text-center dark:border-gray-700">
                  <MapPin className="h-8 w-8 text-gray-300 dark:text-gray-600 mb-2" />
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Select a territory
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    Click a territory card to view details
                  </p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ---- Section 2: Territory Assignment Panel ---- */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* Your Territories */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <Shield className="h-4 w-4 text-blue-600" />
                Your Territories
              </CardTitle>
              <Badge variant="secondary">{myTerritories.length}</Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            {myTerritories.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Market</TableHead>
                      <TableHead className="hidden sm:table-cell">Region</TableHead>
                      <TableHead className="text-right">Signals</TableHead>
                      <TableHead className="text-right hidden md:table-cell">Active</TableHead>
                      <TableHead className="text-right hidden md:table-cell">Hot</TableHead>
                      <TableHead className="hidden lg:table-cell">Competition</TableHead>
                      <TableHead className="hidden lg:table-cell">Last Activity</TableHead>
                      <TableHead />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {myTerritories.map((t) => (
                      <TableRow key={t.id}>
                        <TableCell className="font-medium text-gray-900 dark:text-gray-100">
                          {t.name}
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">{MARKET_FLAGS[t.market]}</span>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell text-gray-500 dark:text-gray-400">
                          {t.region}
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {formatNumber(t.signalCount)}
                        </TableCell>
                        <TableCell className="text-right hidden md:table-cell">
                          {t.activeLeads}
                        </TableCell>
                        <TableCell className="text-right hidden md:table-cell">
                          <span className="font-semibold text-red-600 dark:text-red-400">
                            {t.hotLeads}
                          </span>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          <CompetitionBadge level={t.competitionLevel} />
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          <RelativeTime date={t.lastActivity} className="text-xs" />
                        </TableCell>
                        <TableCell>
                          <Link href="/dashboard/signals">
                            <Button size="sm" variant="ghost" className="text-xs">
                              <Eye className="mr-1 h-3 w-3" />
                              View Signals
                            </Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="py-8 text-center text-sm text-gray-500 dark:text-gray-400">
                No territories assigned yet. Claim one below.
              </div>
            )}
          </CardContent>
        </Card>

        {/* Unclaimed Territories */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <Target className="h-4 w-4 text-amber-500" />
                Unclaimed Territories
              </CardTitle>
              <Badge variant="secondary">{unclaimedTerritories.length}</Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            {unclaimedTerritories.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Market</TableHead>
                      <TableHead className="hidden sm:table-cell">Region</TableHead>
                      <TableHead className="text-right">Signals</TableHead>
                      <TableHead className="text-right hidden md:table-cell">Active</TableHead>
                      <TableHead className="text-right hidden md:table-cell">Hot</TableHead>
                      <TableHead className="hidden lg:table-cell">Competition</TableHead>
                      <TableHead />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {unclaimedTerritories.map((t) => (
                      <TableRow key={t.id}>
                        <TableCell className="font-medium text-gray-900 dark:text-gray-100">
                          {t.name}
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">{MARKET_FLAGS[t.market]}</span>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell text-gray-500 dark:text-gray-400">
                          {t.region}
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {formatNumber(t.signalCount)}
                        </TableCell>
                        <TableCell className="text-right hidden md:table-cell">
                          {t.activeLeads}
                        </TableCell>
                        <TableCell className="text-right hidden md:table-cell">
                          <span className="font-semibold text-red-600 dark:text-red-400">
                            {t.hotLeads}
                          </span>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          <CompetitionBadge level={t.competitionLevel} />
                        </TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            className="bg-green-600 text-white hover:bg-green-700 text-xs"
                          >
                            <Flag className="mr-1 h-3 w-3" />
                            Claim
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="py-8 text-center text-sm text-gray-500 dark:text-gray-400">
                All territories have been claimed.
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* ---- Section 3: Competitive Intelligence ---- */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Most Contested Leads */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              Most Contested Leads
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 pb-3">
            <div className="space-y-2">
              {CONTESTED_LEADS.map((lead) => (
                <div
                  key={lead.id}
                  className="flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-100 text-xs font-bold text-red-700 dark:bg-red-900/30 dark:text-red-400">
                    {lead.brokerCount}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium text-gray-900 dark:text-gray-100 truncate">
                      {lead.address}
                    </div>
                    <div className="text-[10px] text-gray-500 dark:text-gray-400">
                      {lead.brokerCount} brokers &middot; {formatCurrency(lead.value)}
                    </div>
                  </div>
                  <ChevronRight className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Untouched Gold */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-amber-500" />
              Untouched Gold
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 pb-3">
            <div className="space-y-2">
              {UNTOUCHED_GOLD.map((lead) => (
                <div
                  key={lead.id}
                  className="flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <ScoreBadge score={lead.score} size="sm" />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium text-gray-900 dark:text-gray-100 truncate">
                      {lead.address}
                    </div>
                    <div className="text-[10px] text-gray-500 dark:text-gray-400">
                      {formatCurrency(lead.value)}
                    </div>
                  </div>
                  <Badge className="shrink-0 bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 text-[10px] border-0">
                    <Eye className="mr-0.5 h-2.5 w-2.5" />
                    First to See
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Your Advantage */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Crown className="h-4 w-4 text-blue-500" />
              Your Advantage
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 pb-3">
            <div className="space-y-2">
              {SOLO_ADVANTAGE.map((item) => (
                <div
                  key={item.territory}
                  className="flex items-center gap-3 rounded-lg border border-blue-100 bg-blue-50/50 px-3 py-3 dark:border-blue-900/30 dark:bg-blue-900/10"
                >
                  <span className="text-lg">{MARKET_FLAGS[item.market]}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold text-gray-900 dark:text-gray-100">
                      {item.territory}
                    </div>
                    <div className="text-[10px] text-gray-500 dark:text-gray-400">
                      {item.signalCount} signals
                    </div>
                  </div>
                  <Badge className="shrink-0 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 text-[10px] border-0">
                    <Shield className="mr-0.5 h-2.5 w-2.5" />
                    Solo Coverage
                  </Badge>
                </div>
              ))}
            </div>
            <p className="mt-3 text-[11px] text-gray-500 dark:text-gray-400 text-center">
              You&apos;re the only active broker in these territories
            </p>
          </CardContent>
        </Card>
      </div>

      {/* ---- Section 4: Territory Performance Metrics ---- */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-blue-600" />
            Territory Performance
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <PerformanceMetric
              label="Leads Contacted"
              value="342"
              subtext="Last 30 days"
              icon={<Users className="h-5 w-5" />}
              color="blue"
            />
            <PerformanceMetric
              label="Conversion Rate"
              value="8.4%"
              subtext="+1.2pp vs prev"
              icon={<TrendingUp className="h-5 w-5" />}
              color="green"
            />
            <PerformanceMetric
              label="Pipeline Value"
              value={formatCurrency(12400000)}
              subtext="Across all territories"
              icon={<DollarSign className="h-5 w-5" />}
              color="amber"
            />
            <PerformanceMetric
              label="Avg Response Time"
              value="2.3 days"
              subtext="-0.5 days vs prev"
              icon={<Clock className="h-5 w-5" />}
              color="purple"
            />
          </div>
        </CardContent>
      </Card>
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

function CompetitionBadge({ level }: { level: Territory["competitionLevel"] }) {
  const config = COMPETITION_CONFIG[level]
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold",
        config.bg,
        config.color
      )}
    >
      {config.label}
    </span>
  )
}

function MiniStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-md bg-white p-2 dark:bg-gray-900">
      <div className="text-lg font-bold text-gray-900 dark:text-gray-100">{value}</div>
      <div className="text-[10px] text-gray-500 dark:text-gray-400">{label}</div>
    </div>
  )
}

function PerformanceMetric({
  label,
  value,
  subtext,
  icon,
  color,
}: {
  label: string
  value: string
  subtext: string
  icon: React.ReactNode
  color: "blue" | "green" | "amber" | "purple"
}) {
  const colorMap = {
    blue: "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400",
    green: "bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400",
    amber: "bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400",
    purple: "bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400",
  }

  return (
    <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
      <div className={cn("mb-3 inline-flex rounded-lg p-2", colorMap[color])}>
        {icon}
      </div>
      <div className="text-2xl font-bold text-gray-900 dark:text-gray-50">{value}</div>
      <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{label}</div>
      <div className="text-[10px] text-gray-400 dark:text-gray-500 mt-1">{subtext}</div>
    </div>
  )
}
