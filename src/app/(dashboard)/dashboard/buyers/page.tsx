"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import {
  ShoppingCart,
  Search,
  TrendingUp,
  TrendingDown,
  Minus,
  Users,
  DollarSign,
  ArrowRightLeft,
  BadgeCheck,
  Briefcase,
  Building2,
  GraduationCap,
  Landmark,
  Shield,
  Plane,
  Store,
  FileText,
  UserCheck,
  ChevronRight,
  Handshake,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table"
import { generateBuyerSignals, generateBuyerLeads } from "@/hooks/use-mock-data"
import { cn, formatCurrency, formatNumber } from "@/lib/utils"
import { ScoreBadge } from "@/components/shared/score-badge"
import { MarketSwitcher } from "@/components/shared/market-switcher"
import { RelativeTime } from "@/components/shared/relative-time"
import { EmptyState } from "@/components/shared/empty-state"
import { AgentMarketFilter, useAgentMarketFilter } from "@/components/shared/agent-market-filter"
import type { BuyerSignal, BuyerLead, BuyerProfile } from "@/types"

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const BUYER_TYPE_TABS = [
  { key: "all", label: "All" },
  { key: "individual", label: "Individual" },
  { key: "investor", label: "Investor" },
  { key: "corporation", label: "Corporation" },
  { key: "reit", label: "REIT" },
  { key: "1031-exchange", label: "1031 Exchange" },
  { key: "first-time", label: "First-Time" },
] as const

const BUYER_TYPE_COLORS: Record<BuyerProfile["buyerType"], string> = {
  individual: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  investor: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  corporation: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  reit: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  "1031-exchange": "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  "first-time": "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400",
}

const PRE_APPROVAL_COLORS: Record<BuyerProfile["preApprovalStatus"], string> = {
  none: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
  "pre-qualified": "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  "pre-approved": "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  "cash-buyer": "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300",
  "hard-money": "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
}

const STAGE_COLORS: Record<BuyerLead["qualificationStage"], string> = {
  new: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
  contacted: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  qualified: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400",
  matched: "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400",
  showing: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  offer: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  "under-contract": "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  closed: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  lost: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
}

const SIGNAL_ICON_MAP: Record<BuyerSignal["type"], React.ReactNode> = {
  hmda: <Landmark className="h-5 w-5" />,
  "linkedin-jobs": <Briefcase className="h-5 w-5" />,
  "sba-loan": <FileText className="h-5 w-5" />,
  franchise: <Store className="h-5 w-5" />,
  "military-pcs": <Shield className="h-5 w-5" />,
  "1031-exchange": <ArrowRightLeft className="h-5 w-5" />,
  "corporate-relocation": <Plane className="h-5 w-5" />,
}

const SIGNAL_COLORS: Record<BuyerSignal["type"], string> = {
  hmda: "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400",
  "linkedin-jobs": "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400",
  "sba-loan": "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400",
  franchise: "bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400",
  "military-pcs": "bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400",
  "1031-exchange": "bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400",
  "corporate-relocation": "bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400",
}

const TIMELINE_LABELS: Record<BuyerProfile["timeline"], string> = {
  immediate: "Immediate",
  "1-3months": "1-3 mo",
  "3-6months": "3-6 mo",
  "6-12months": "6-12 mo",
  flexible: "Flexible",
}

// ---------------------------------------------------------------------------
// Data generation (stable across renders)
// ---------------------------------------------------------------------------

const ALL_BUYER_SIGNALS = generateBuyerSignals()
const ALL_BUYER_LEADS = generateBuyerLeads(40)

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------

export default function BuyersPage() {
  const [marketFilter, setMarketFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedBuyerId, setSelectedBuyerId] = useState<string | null>(
    ALL_BUYER_LEADS[0]?.id ?? null
  )

  const { matchesMarket, filterActive } = useAgentMarketFilter()

  // Filtered buyer leads
  const filteredLeads = useMemo(() => {
    let results = ALL_BUYER_LEADS

    if (typeFilter !== "all") {
      results = results.filter((l) => l.buyer.buyerType === typeFilter)
    }

    if (marketFilter !== "all") {
      results = results.filter((l) => {
        const markets = l.buyer.preferredMarkets.map((m) => m.toLowerCase())
        if (marketFilter === "florida") {
          return markets.some(
            (m) =>
              m.includes("miami") ||
              m.includes("fort lauderdale") ||
              m.includes("west palm") ||
              m.includes("orlando") ||
              m.includes("tampa") ||
              m.includes("jacksonville") ||
              m.includes("naples") ||
              m.includes("sarasota") ||
              m.includes("st. petersburg") ||
              m.includes("boca")
          )
        }
        if (marketFilter === "puerto-rico") {
          return markets.some(
            (m) =>
              m.includes("san juan") ||
              m.includes("guaynabo") ||
              m.includes("bayam") ||
              m.includes("carolina") ||
              m.includes("dorado") ||
              m.includes("condado")
          )
        }
        if (marketFilter === "dominican-republic") {
          return markets.some(
            (m) =>
              m.includes("santo domingo") ||
              m.includes("punta cana") ||
              m.includes("santiago") ||
              m.includes("puerto plata") ||
              m.includes("la romana") ||
              m.includes("saman")
          )
        }
        return true
      })
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      results = results.filter(
        (l) =>
          l.buyer.name.toLowerCase().includes(q) ||
          (l.buyer.company && l.buyer.company.toLowerCase().includes(q)) ||
          l.buyer.email.toLowerCase().includes(q) ||
          l.source.toLowerCase().includes(q)
      )
    }

    // Agent market filter — match against buyer's preferred markets
    if (filterActive) {
      results = results.filter((l) =>
        l.buyer.preferredMarkets.some((m) => matchesMarket(undefined, m, m))
      )
    }

    return results
  }, [typeFilter, marketFilter, searchQuery, filterActive, matchesMarket])

  // Selected buyer for matching panel
  const selectedBuyer = useMemo(() => {
    if (selectedBuyerId) {
      return ALL_BUYER_LEADS.find((l) => l.id === selectedBuyerId) ?? ALL_BUYER_LEADS[0]
    }
    return ALL_BUYER_LEADS[0]
  }, [selectedBuyerId])

  // Derived stats
  const stats = useMemo(() => {
    const total = ALL_BUYER_LEADS.length
    const qualified = ALL_BUYER_LEADS.filter(
      (l) =>
        l.qualificationStage === "qualified" ||
        l.qualificationStage === "matched" ||
        l.qualificationStage === "showing" ||
        l.qualificationStage === "offer" ||
        l.qualificationStage === "under-contract" ||
        l.qualificationStage === "closed"
    ).length
    const cashBuyers = ALL_BUYER_LEADS.filter(
      (l) => l.buyer.preApprovalStatus === "cash-buyer"
    ).length
    const exchange1031 = ALL_BUYER_LEADS.filter(
      (l) => l.buyer.buyerType === "1031-exchange"
    ).length
    return { total, qualified, cashBuyers, exchange1031 }
  }, [])

  return (
    <div className="flex flex-col gap-6">
      {/* ---- Top Section ---- */}
      <div className="flex flex-col gap-4">
        {/* Title row */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-50">
              Buyer Intelligence
            </h1>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
              <ShoppingCart className="h-3.5 w-3.5" />
              Demand-Side
            </span>
          </div>
          <MarketSwitcher value={marketFilter} onChange={setMarketFilter} />
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCard
            label="Total Buyer Leads"
            value={formatNumber(stats.total)}
            icon={<Users className="h-4 w-4" />}
            color="blue"
          />
          <StatCard
            label="Qualified"
            value={stats.qualified.toString()}
            icon={<UserCheck className="h-4 w-4" />}
            color="green"
          />
          <StatCard
            label="Cash Buyers"
            value={stats.cashBuyers.toString()}
            icon={<DollarSign className="h-4 w-4" />}
            color="emerald"
          />
          <StatCard
            label="Active 1031 Exchange"
            value={stats.exchange1031.toString()}
            icon={<ArrowRightLeft className="h-4 w-4" />}
            color="amber"
          />
        </div>
      </div>

      {/* ---- Agent Market Filter ---- */}
      <AgentMarketFilter className="mb-4" />

      {/* ---- Section 1: Buyer Signal Sources ---- */}
      <div>
        <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-50 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-blue-600" />
          Buyer Signal Sources
        </h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {ALL_BUYER_SIGNALS.map((signal) => (
            <SignalSourceCard key={signal.id} signal={signal} />
          ))}
        </div>
      </div>

      {/* ---- Section 2 + 3: Buyer Table + Matching Panel ---- */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        {/* Buyer Profiles Table */}
        <div className="xl:col-span-8 flex flex-col gap-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <Users className="h-4 w-4 text-blue-600" />
                  Buyer Profiles
                  <Badge variant="secondary" className="ml-1">
                    {filteredLeads.length}
                  </Badge>
                </CardTitle>
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="Search name, company..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>

              {/* Type filter tabs */}
              <div className="flex flex-wrap gap-1 mt-2">
                {BUYER_TYPE_TABS.map((tab) => (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setTypeFilter(tab.key)}
                    className={cn(
                      "rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
                      typeFilter === tab.key
                        ? "bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
                    )}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {filteredLeads.length === 0 ? (
                <EmptyState
                  icon={<Users />}
                  title="No buyers found"
                  description="Try adjusting your filters or search query."
                />
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="min-w-[160px]">Name</TableHead>
                        <TableHead className="min-w-[100px]">Type</TableHead>
                        <TableHead className="min-w-[140px]">Budget Range</TableHead>
                        <TableHead className="min-w-[110px]">Pre-Approval</TableHead>
                        <TableHead>Timeline</TableHead>
                        <TableHead className="text-center">Matches</TableHead>
                        <TableHead className="min-w-[110px]">Stage</TableHead>
                        <TableHead>Source</TableHead>
                        <TableHead className="min-w-[100px]">Last Contact</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredLeads.map((lead) => (
                        <TableRow
                          key={lead.id}
                          className={cn(
                            "cursor-pointer",
                            selectedBuyerId === lead.id &&
                              "bg-blue-50/50 dark:bg-blue-900/10"
                          )}
                          onClick={() => setSelectedBuyerId(lead.id)}
                        >
                          <TableCell>
                            <Link
                              href={`/dashboard/buyers/${lead.id}`}
                              className="group flex flex-col"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <span className="text-sm font-medium text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                {lead.buyer.name}
                              </span>
                              {lead.buyer.company && (
                                <span className="text-[11px] text-gray-500 dark:text-gray-400 truncate max-w-[160px]">
                                  {lead.buyer.company}
                                </span>
                              )}
                            </Link>
                          </TableCell>
                          <TableCell>
                            <span
                              className={cn(
                                "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize",
                                BUYER_TYPE_COLORS[lead.buyer.buyerType]
                              )}
                            >
                              {lead.buyer.buyerType.replace("-", " ")}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm text-gray-700 dark:text-gray-300">
                              {formatCurrency(lead.buyer.budget.min)} &ndash;{" "}
                              {formatCurrency(lead.buyer.budget.max)}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span
                              className={cn(
                                "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize",
                                PRE_APPROVAL_COLORS[lead.buyer.preApprovalStatus]
                              )}
                            >
                              {lead.buyer.preApprovalStatus.replace("-", " ")}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              {TIMELINE_LABELS[lead.buyer.timeline]}
                            </span>
                          </TableCell>
                          <TableCell className="text-center">
                            {lead.matchedProperties.length > 0 ? (
                              <Badge variant="secondary" className="text-[10px]">
                                {lead.matchedProperties.length}
                              </Badge>
                            ) : (
                              <span className="text-xs text-gray-400">--</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <span
                              className={cn(
                                "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize",
                                STAGE_COLORS[lead.qualificationStage]
                              )}
                            >
                              {lead.qualificationStage.replace("-", " ")}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span className="text-xs text-gray-600 dark:text-gray-400">
                              {lead.source}
                            </span>
                          </TableCell>
                          <TableCell>
                            {lead.lastContactDate ? (
                              <RelativeTime
                                date={lead.lastContactDate}
                                className="text-[11px]"
                              />
                            ) : (
                              <span className="text-[11px] text-gray-400">Never</span>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Buyer-Property Matching Panel */}
        <div className="xl:col-span-4 flex flex-col gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Handshake className="h-4 w-4 text-blue-600" />
                Buyer-Property Matching
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              {selectedBuyer ? (
                <div className="flex flex-col gap-4">
                  {/* Selected buyer summary */}
                  <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800/50">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                        {selectedBuyer.buyer.name}
                      </span>
                      <span
                        className={cn(
                          "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize",
                          BUYER_TYPE_COLORS[selectedBuyer.buyer.buyerType]
                        )}
                      >
                        {selectedBuyer.buyer.buyerType.replace("-", " ")}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Budget: {formatCurrency(selectedBuyer.buyer.budget.min)} &ndash;{" "}
                      {formatCurrency(selectedBuyer.buyer.budget.max)}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Markets: {selectedBuyer.buyer.preferredMarkets.join(", ")}
                    </div>
                  </div>

                  {/* Matched properties */}
                  {selectedBuyer.matchedProperties.length === 0 ? (
                    <div className="py-6 text-center text-sm text-gray-500 dark:text-gray-400">
                      No matched properties yet.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Top Matches
                      </span>
                      {selectedBuyer.matchedProperties
                        .sort((a, b) => b.matchScore - a.matchScore)
                        .slice(0, 5)
                        .map((match) => (
                          <div
                            key={match.propertyId}
                            className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-900"
                          >
                            <Building2 className="h-4 w-4 text-gray-400 shrink-0" />
                            <div className="flex-1 min-w-0">
                              <div className="text-xs font-medium text-gray-900 dark:text-gray-100 truncate">
                                {match.address}
                              </div>
                              <div className="text-[10px] text-gray-500 dark:text-gray-400">
                                {formatCurrency(match.value)}
                              </div>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <ScoreBadge score={match.matchScore} size="sm" />
                              <Button variant="outline" size="sm" className="h-7 text-[11px] px-2">
                                Introduce
                              </Button>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}

                  {/* View full profile */}
                  <Link
                    href={`/dashboard/buyers/${selectedBuyer.id}`}
                    className="inline-flex items-center justify-center gap-1 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700"
                  >
                    View Full Profile
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
              ) : (
                <div className="py-8 text-center text-sm text-gray-500 dark:text-gray-400">
                  Select a buyer from the table to see matches.
                </div>
              )}
            </CardContent>
          </Card>

          {/* Investment criteria summary for selected buyer */}
          {selectedBuyer?.buyer.investmentCriteria && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-emerald-500" />
                  Investment Criteria
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2">
                  {selectedBuyer.buyer.investmentCriteria.targetCapRate && (
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        Target Cap Rate
                      </span>
                      <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                        {selectedBuyer.buyer.investmentCriteria.targetCapRate}%
                      </span>
                    </div>
                  )}
                  {selectedBuyer.buyer.investmentCriteria.targetCashOnCash && (
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        Cash-on-Cash
                      </span>
                      <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                        {selectedBuyer.buyer.investmentCriteria.targetCashOnCash}%
                      </span>
                    </div>
                  )}
                  {selectedBuyer.buyer.investmentCriteria.targetIRR && (
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        Target IRR
                      </span>
                      <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                        {selectedBuyer.buyer.investmentCriteria.targetIRR}%
                      </span>
                    </div>
                  )}
                  {selectedBuyer.buyer.investmentCriteria.holdPeriod && (
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        Hold Period
                      </span>
                      <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                        {selectedBuyer.buyer.investmentCriteria.holdPeriod}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
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
  color: "blue" | "green" | "emerald" | "amber"
}) {
  const colorMap = {
    blue: "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400",
    green: "bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400",
    emerald:
      "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400",
    amber: "bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400",
  }

  return (
    <Card>
      <CardContent className="p-4 flex items-center gap-3">
        <div className={cn("rounded-lg p-2", colorMap[color])}>{icon}</div>
        <div>
          <div className="text-xl font-bold text-gray-900 dark:text-gray-50">
            {value}
          </div>
          <div className="text-[11px] text-gray-500 dark:text-gray-400">
            {label}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function SignalSourceCard({ signal }: { signal: BuyerSignal }) {
  const TrendIcon =
    signal.trend === "up"
      ? TrendingUp
      : signal.trend === "down"
        ? TrendingDown
        : Minus

  const trendColor =
    signal.trend === "up"
      ? "text-green-600 dark:text-green-400"
      : signal.trend === "down"
        ? "text-red-600 dark:text-red-400"
        : "text-gray-500 dark:text-gray-400"

  return (
    <Card className="group hover:border-blue-300 hover:shadow-md dark:hover:border-blue-700 transition-all">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div
            className={cn("rounded-lg p-2", SIGNAL_COLORS[signal.type])}
          >
            {SIGNAL_ICON_MAP[signal.type]}
          </div>
          <div className={cn("flex items-center gap-1 text-xs font-medium", trendColor)}>
            <TrendIcon className="h-3.5 w-3.5" />
            {signal.trendPercent}%
          </div>
        </div>

        <div className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-0.5">
          {signal.title}
        </div>
        <div className="text-2xl font-bold text-gray-900 dark:text-gray-50 mb-1">
          {formatNumber(signal.count)}
        </div>

        <div className="text-[11px] text-gray-500 dark:text-gray-400 mb-2 line-clamp-2">
          {signal.description}
        </div>

        <div className="flex items-center justify-between">
          <span className="text-[10px] font-medium text-gray-500 dark:text-gray-400">
            {signal.market}
          </span>
          <RelativeTime date={signal.lastUpdated} className="text-[10px]" />
        </div>
      </CardContent>
    </Card>
  )
}
