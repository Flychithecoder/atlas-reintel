"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import {
  Key,
  Search,
  TrendingUp,
  TrendingDown,
  Building2,
  Home,
  Factory,
  Utensils,
  Store,
  Briefcase,
  GraduationCap,
  Plane,
  Shield,
  Users,
  Truck,
  Globe,
  Landmark,
  FileText,
  ArrowRight,
  Calendar,
  MapPin,
  ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { generateTenantLeads } from "@/hooks/use-mock-data"
import { cn, formatCurrency, formatNumber } from "@/lib/utils"
import { ScoreBadge } from "@/components/shared/score-badge"
import { AgentMarketFilter, useAgentMarketFilter } from "@/components/shared/agent-market-filter"
import type { TenantLead } from "@/types"

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const LEASE_STAGE_COLORS: Record<TenantLead["leaseStage"], string> = {
  new: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  contacted: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
  qualified: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300",
  touring: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300",
  proposal: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  negotiating: "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
  "lease-signed": "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
  lost: "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400",
}

const LEASE_STAGE_LABELS: Record<TenantLead["leaseStage"], string> = {
  new: "New",
  contacted: "Contacted",
  qualified: "Qualified",
  touring: "Touring",
  proposal: "Proposal",
  negotiating: "Negotiating",
  "lease-signed": "Lease Signed",
  lost: "Lost",
}

const TENANT_TYPE_COLORS: Record<string, string> = {
  commercial: "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300",
  residential: "bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300",
  industrial: "bg-slate-100 text-slate-700 dark:bg-slate-900/40 dark:text-slate-300",
  retail: "bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300",
  restaurant: "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
  office: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
}

const FILTER_TABS = [
  { key: "all", label: "All" },
  { key: "commercial", label: "Commercial" },
  { key: "retail", label: "Retail" },
  { key: "restaurant", label: "Restaurant" },
  { key: "office", label: "Office" },
  { key: "industrial", label: "Industrial" },
  { key: "residential", label: "Residential" },
] as const

// ---------------------------------------------------------------------------
// Signal card data
// ---------------------------------------------------------------------------

interface SignalCard {
  icon: React.ReactNode
  title: string
  description: string
  count: number
  trend: "up" | "down" | "stable"
  trendPercent: number
  market: string
}

const COMMERCIAL_SIGNALS: SignalCard[] = [
  {
    icon: <TrendingUp className="h-5 w-5" />,
    title: "Company Expansion",
    description: "LinkedIn job velocity signals",
    count: 47,
    trend: "up",
    trendPercent: 23,
    market: "South Florida",
  },
  {
    icon: <Utensils className="h-5 w-5" />,
    title: "Restaurant/Retail Permits",
    description: "Health dept & business registrations",
    count: 31,
    trend: "up",
    trendPercent: 15,
    market: "Miami-Dade",
  },
  {
    icon: <Truck className="h-5 w-5" />,
    title: "Industrial/Logistics Demand",
    description: "Warehouse & distribution center inquiries",
    count: 18,
    trend: "up",
    trendPercent: 34,
    market: "Central FL",
  },
  {
    icon: <Store className="h-5 w-5" />,
    title: "Franchise Market Entry",
    description: "New franchise FDD filings in market",
    count: 12,
    trend: "up",
    trendPercent: 45,
    market: "FL + PR",
  },
  {
    icon: <Globe className="h-5 w-5" />,
    title: "DR Zona Franca Applications",
    description: "Free trade zone company applications",
    count: 8,
    trend: "stable",
    trendPercent: 3,
    market: "Dominican Republic",
  },
  {
    icon: <Briefcase className="h-5 w-5" />,
    title: "Corporate Relocations",
    description: "Companies moving operations to market",
    count: 22,
    trend: "up",
    trendPercent: 18,
    market: "South FL + PR",
  },
]

const RESIDENTIAL_SIGNALS: SignalCard[] = [
  {
    icon: <GraduationCap className="h-5 w-5" />,
    title: "University Enrollment",
    description: "New student enrollment surges",
    count: 1240,
    trend: "up",
    trendPercent: 8,
    market: "Miami / Orlando",
  },
  {
    icon: <Plane className="h-5 w-5" />,
    title: "Corporate Relocation Packages",
    description: "Employees relocating to market",
    count: 89,
    trend: "up",
    trendPercent: 22,
    market: "South Florida",
  },
  {
    icon: <Shield className="h-5 w-5" />,
    title: "Military PCS Inbound",
    description: "Incoming PCS orders to FL/PR bases",
    count: 156,
    trend: "stable",
    trendPercent: 2,
    market: "MacDill / Ft Buchanan",
  },
  {
    icon: <FileText className="h-5 w-5" />,
    title: "Section 8 Waitlist",
    description: "Housing voucher waitlist movement",
    count: 3400,
    trend: "down",
    trendPercent: 5,
    market: "All Markets",
  },
]

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

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

function formatMoveIn(dateStr?: string) {
  if (!dateStr) return "--"
  const d = new Date(dateStr)
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}

function TrendIndicator({ trend, percent }: { trend: "up" | "down" | "stable"; percent: number }) {
  if (trend === "up") {
    return (
      <span className="inline-flex items-center gap-0.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
        <TrendingUp className="h-3 w-3" />
        +{percent}%
      </span>
    )
  }
  if (trend === "down") {
    return (
      <span className="inline-flex items-center gap-0.5 text-xs font-medium text-red-500 dark:text-red-400">
        <TrendingDown className="h-3 w-3" />
        -{percent}%
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-0.5 text-xs font-medium text-gray-400 dark:text-gray-500">
      ~{percent}%
    </span>
  )
}

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------

export default function TenantsPage() {
  const [leads] = useState<TenantLead[]>(() => generateTenantLeads(35))
  const [search, setSearch] = useState("")
  const [activeTab, setActiveTab] = useState<string>("all")

  const { matchesMarket, filterActive } = useAgentMarketFilter()

  // Stats
  const stats = useMemo(() => {
    const commercial = leads.filter((l) => l.tenant.tenantType !== "residential").length
    const residential = leads.filter((l) => l.tenant.tenantType === "residential").length
    const activeProposals = leads.filter(
      (l) => l.leaseStage === "proposal" || l.leaseStage === "negotiating"
    ).length
    return { total: leads.length, commercial, residential, activeProposals }
  }, [leads])

  // Filtered leads
  const filteredLeads = useMemo(() => {
    let result = leads
    if (activeTab !== "all") {
      result = result.filter((l) => l.tenant.tenantType === activeTab)
    }
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(
        (l) =>
          l.tenant.name.toLowerCase().includes(q) ||
          (l.tenant.company?.toLowerCase().includes(q) ?? false) ||
          l.tenant.tenantType.toLowerCase().includes(q) ||
          (l.tenant.industry?.toLowerCase().includes(q) ?? false)
      )
    }
    // Agent market filter — match against tenant's preferred markets
    if (filterActive) {
      result = result.filter((l) =>
        l.tenant.preferredMarkets.some((m) => matchesMarket(undefined, m, m))
      )
    }
    return result
  }, [leads, activeTab, search, filterActive, matchesMarket])

  return (
    <div className="flex flex-col gap-6 p-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-lg shadow-violet-500/25">
            <Key className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Tenant Intelligence
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Discover tenant demand signals and match spaces
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Tenant Leads", value: stats.total, color: "from-blue-500 to-cyan-500" },
          { label: "Commercial", value: stats.commercial, color: "from-violet-500 to-purple-500" },
          { label: "Residential", value: stats.residential, color: "from-teal-500 to-emerald-500" },
          { label: "Active Proposals", value: stats.activeProposals, color: "from-amber-500 to-orange-500" },
        ].map((stat) => (
          <Card key={stat.label} className="relative overflow-hidden">
            <CardContent className="p-5">
              <div className={cn("absolute top-0 right-0 h-24 w-24 rounded-full bg-gradient-to-br opacity-10 -translate-y-6 translate-x-6", stat.color)} />
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {stat.label}
              </p>
              <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-gray-100">
                {formatNumber(stat.value)}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ---- Agent Market Filter ---- */}
      <AgentMarketFilter className="mb-4" />

      {/* Commercial Tenant Signals */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Building2 className="h-5 w-5 text-violet-500" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Commercial Tenant Signals
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {COMMERCIAL_SIGNALS.map((signal) => (
            <Card key={signal.title} className="group hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-violet-50 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400">
                    {signal.icon}
                  </div>
                  <TrendIndicator trend={signal.trend} percent={signal.trendPercent} />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                  {signal.title}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                  {signal.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {formatNumber(signal.count)}
                  </span>
                  <span className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {signal.market}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Residential Rental Signals */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Home className="h-5 w-5 text-teal-500" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Residential Rental Signals
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {RESIDENTIAL_SIGNALS.map((signal) => (
            <Card key={signal.title} className="group hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-teal-50 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400">
                    {signal.icon}
                  </div>
                  <TrendIndicator trend={signal.trend} percent={signal.trendPercent} />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                  {signal.title}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                  {signal.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {formatNumber(signal.count)}
                  </span>
                  <span className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {signal.market}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Tenant Profiles Table */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Users className="h-5 w-5 text-blue-500" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Tenant Profiles
          </h2>
          <Badge variant="secondary" className="text-xs">
            {filteredLeads.length}
          </Badge>
        </div>

        {/* Search + filter tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search tenants..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            {FILTER_TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-xs font-medium transition-colors",
                  activeTab === tab.key
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs uppercase tracking-wider font-semibold">Name / Company</TableHead>
                <TableHead className="text-xs uppercase tracking-wider font-semibold">Type</TableHead>
                <TableHead className="text-xs uppercase tracking-wider font-semibold">Space Req</TableHead>
                <TableHead className="text-xs uppercase tracking-wider font-semibold">Budget/mo</TableHead>
                <TableHead className="text-xs uppercase tracking-wider font-semibold">Term</TableHead>
                <TableHead className="text-xs uppercase tracking-wider font-semibold">Move-in Date</TableHead>
                <TableHead className="text-xs uppercase tracking-wider font-semibold text-center">Matched</TableHead>
                <TableHead className="text-xs uppercase tracking-wider font-semibold">Stage</TableHead>
                <TableHead className="text-xs uppercase tracking-wider font-semibold">Source</TableHead>
                <TableHead className="text-xs uppercase tracking-wider font-semibold w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLeads.map((lead) => (
                <TableRow
                  key={lead.id}
                  className="group cursor-pointer"
                  onClick={() => {}}
                >
                  <TableCell>
                    <Link
                      href={`/dashboard/tenants/${lead.id}`}
                      className="block"
                    >
                      <div className="font-medium text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {lead.tenant.name}
                      </div>
                      {lead.tenant.company && lead.tenant.company !== lead.tenant.name && (
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {lead.tenant.company}
                        </div>
                      )}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <span
                      className={cn(
                        "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize",
                        TENANT_TYPE_COLORS[lead.tenant.tenantType] ?? "bg-gray-100 text-gray-600"
                      )}
                    >
                      {lead.tenant.tenantType}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap">
                    {formatNumber(lead.tenant.spaceRequirements.minSqft)}
                    {" - "}
                    {formatNumber(lead.tenant.spaceRequirements.maxSqft)} sqft
                  </TableCell>
                  <TableCell className="text-sm font-medium text-gray-900 dark:text-gray-100 whitespace-nowrap">
                    {formatCurrency(lead.tenant.leaseBudget.min)}
                    {" - "}
                    {formatCurrency(lead.tenant.leaseBudget.max)}
                  </TableCell>
                  <TableCell className="text-sm text-gray-600 dark:text-gray-400">
                    {lead.tenant.preferredTerm}
                  </TableCell>
                  <TableCell className="text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3 text-gray-400" />
                      {formatMoveIn(lead.tenant.moveInDate)}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    {lead.matchedSpaces.length > 0 ? (
                      <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold dark:bg-emerald-900/40 dark:text-emerald-300">
                        {lead.matchedSpaces.length}
                      </span>
                    ) : (
                      <span className="text-xs text-gray-400">--</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <span
                      className={cn(
                        "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold",
                        LEASE_STAGE_COLORS[lead.leaseStage]
                      )}
                    >
                      {LEASE_STAGE_LABELS[lead.leaseStage]}
                    </span>
                  </TableCell>
                  <TableCell className="text-xs text-gray-500 dark:text-gray-400">
                    {lead.source}
                  </TableCell>
                  <TableCell>
                    <Link href={`/dashboard/tenants/${lead.id}`}>
                      <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredLeads.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Users className="h-12 w-12 text-gray-300 dark:text-gray-600 mb-3" />
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-1">
                No tenants found
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Try adjusting your search or filter criteria.
              </p>
            </div>
          )}

          {/* Pagination */}
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 dark:border-gray-800">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Showing{" "}
              <span className="font-medium text-gray-700 dark:text-gray-200">
                {filteredLeads.length}
              </span>{" "}
              tenant leads
            </span>
            <div className="flex items-center gap-1">
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
              <Button variant="secondary" size="sm" className="min-w-[32px]">
                1
              </Button>
              <Button variant="outline" size="sm" disabled>
                Next
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
