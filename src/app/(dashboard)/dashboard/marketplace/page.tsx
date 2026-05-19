"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Store,
  Home,
  Building2,
  Landmark,
  Eye,
  ShoppingCart,
  Check,
  Star,
  Signal,
  MapPin,
  Phone,
  Mail,
  TrendingUp,
  Shield,
  Zap,
  Users,
  FileText,
  Clock,
  ChevronRight,
  Search,
  Filter,
} from "lucide-react"
import { cn, formatCurrency } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { AgentMarketFilter } from "@/components/shared/agent-market-filter"

/* ------------------------------------------------------------------ */
/*  Mock Data                                                          */
/* ------------------------------------------------------------------ */

const pricingTiers = [
  {
    name: "Residential Lead",
    price: 50,
    description: "Single family, condo, townhome leads with 60+ score",
    icon: Home,
    color: "from-emerald-500 to-teal-600",
    borderColor: "border-emerald-200 dark:border-emerald-800",
    bgAccent: "bg-emerald-50 dark:bg-emerald-950/40",
    iconColor: "text-emerald-600 dark:text-emerald-400",
    includes: [
      "Full owner contact info",
      "Property details & valuation",
      "Pre-market signal breakdown",
      "30-day data refresh",
    ],
  },
  {
    name: "Commercial Lead",
    price: 500,
    description: "Office, retail, industrial, mixed-use leads with 70+ score",
    icon: Building2,
    color: "from-blue-500 to-indigo-600",
    borderColor: "border-blue-200 dark:border-blue-800",
    bgAccent: "bg-blue-50 dark:bg-blue-950/40",
    iconColor: "text-blue-600 dark:text-blue-400",
    popular: true,
    includes: [
      "Full owner & entity data",
      "LLC unwrapping & beneficial owners",
      "Tenant roll & lease data",
      "60-day data refresh",
    ],
  },
  {
    name: "Institutional CRE",
    price: 1500,
    description: "Multi-family 100+ units, portfolios, CMBS leads with 80+ score",
    icon: Landmark,
    color: "from-violet-500 to-purple-600",
    borderColor: "border-violet-200 dark:border-violet-800",
    bgAccent: "bg-violet-50 dark:bg-violet-950/40",
    iconColor: "text-violet-600 dark:text-violet-400",
    includes: [
      "Complete ownership structure",
      "CMBS / debt maturity data",
      "Portfolio cross-reference",
      "90-day data refresh + alerts",
    ],
  },
]

const availableLeads = [
  { id: "ml-1", address: "•••• Oak St", city: "Miami", state: "FL", type: "SFR", tier: "residential" as const, score: 87, value: 485000, signals: 5, icon: Home },
  { id: "ml-2", address: "•••• Brickell Ave", city: "Miami", state: "FL", type: "Office", tier: "commercial" as const, score: 74, value: 4200000, signals: 4, icon: Building2 },
  { id: "ml-3", address: "•••• Peachtree Rd", city: "Atlanta", state: "GA", type: "Retail", tier: "commercial" as const, score: 71, value: 2100000, signals: 3, icon: Building2 },
  { id: "ml-4", address: "•••• Elm Dr", city: "Dallas", state: "TX", type: "SFR", tier: "residential" as const, score: 92, value: 375000, signals: 6, icon: Home },
  { id: "ml-5", address: "•••• Congress Ave", city: "Austin", state: "TX", type: "Mixed-Use", tier: "commercial" as const, score: 78, value: 6800000, signals: 5, icon: Building2 },
  { id: "ml-6", address: "•••• Westheimer Rd", city: "Houston", state: "TX", type: "Multi-Family", tier: "institutional" as const, score: 84, value: 28500000, signals: 7, icon: Landmark },
  { id: "ml-7", address: "•••• Ponce de Leon", city: "Coral Gables", state: "FL", type: "Condo", tier: "residential" as const, score: 65, value: 520000, signals: 3, icon: Home },
  { id: "ml-8", address: "•••• Buckhead Loop", city: "Atlanta", state: "GA", type: "Office", tier: "commercial" as const, score: 76, value: 12400000, signals: 4, icon: Building2 },
  { id: "ml-9", address: "•••• Industrial Blvd", city: "Phoenix", state: "AZ", type: "Industrial", tier: "commercial" as const, score: 70, value: 3700000, signals: 3, icon: Building2 },
  { id: "ml-10", address: "•••• Lake Shore Dr", city: "Chicago", state: "IL", type: "Multi-Family", tier: "institutional" as const, score: 88, value: 45000000, signals: 8, icon: Landmark },
  { id: "ml-11", address: "•••• Magnolia Ave", city: "Fort Worth", state: "TX", type: "Townhome", tier: "residential" as const, score: 63, value: 310000, signals: 2, icon: Home },
  { id: "ml-12", address: "•••• Biscayne Blvd", city: "Miami", state: "FL", type: "Retail", tier: "commercial" as const, score: 73, value: 5600000, signals: 5, icon: Building2 },
]

const purchasedLeads = [
  { id: "pl-1", address: "1247 Oak Street", city: "Miami", state: "FL", owner: "Riverside Holdings LLC", score: 87, value: 485000, purchaseDate: "2026-05-12", status: "New" as const },
  { id: "pl-2", address: "8901 Peachtree Road NE", city: "Atlanta", state: "GA", owner: "Marcus Thompson", score: 74, value: 2100000, purchaseDate: "2026-05-08", status: "Contacted" as const },
  { id: "pl-3", address: "3320 Elm Drive", city: "Dallas", state: "TX", owner: "Sandra Chen", score: 92, value: 375000, purchaseDate: "2026-05-03", status: "Meeting" as const },
  { id: "pl-4", address: "5500 Westheimer Road", city: "Houston", state: "TX", owner: "Westheimer Properties Inc", score: 84, value: 28500000, purchaseDate: "2026-04-28", status: "Negotiating" as const },
  { id: "pl-5", address: "2100 Congress Avenue", city: "Austin", state: "TX", owner: "Capitol Ventures LLC", score: 78, value: 6800000, purchaseDate: "2026-04-15", status: "Responded" as const },
]

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function getTierPrice(tier: "residential" | "commercial" | "institutional") {
  switch (tier) {
    case "residential": return 50
    case "commercial": return 500
    case "institutional": return 1500
  }
}

function getTierGradient(tier: "residential" | "commercial" | "institutional") {
  switch (tier) {
    case "residential": return ""
    case "commercial": return "ring-1 ring-blue-200 dark:ring-blue-800"
    case "institutional": return "ring-1 ring-violet-200 dark:ring-violet-800"
  }
}

function getStatusBadge(status: string) {
  switch (status) {
    case "New": return "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"
    case "Contacted": return "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300"
    case "Responded": return "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300"
    case "Meeting": return "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300"
    case "Negotiating": return "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300"
    default: return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
  }
}

function getScoreColor(score: number) {
  if (score >= 80) return "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/40 dark:text-red-300 dark:border-red-800"
  if (score >= 50) return "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/40 dark:text-amber-300 dark:border-amber-800"
  return "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/40 dark:text-blue-300 dark:border-blue-800"
}

/* ------------------------------------------------------------------ */
/*  Page Component                                                     */
/* ------------------------------------------------------------------ */

export default function MarketplacePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilter, setActiveFilter] = useState<"all" | "residential" | "commercial" | "institutional">("all")

  const filteredLeads = availableLeads.filter((lead) => {
    if (activeFilter !== "all" && lead.tier !== activeFilter) return false
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      return (
        lead.city.toLowerCase().includes(q) ||
        lead.state.toLowerCase().includes(q) ||
        lead.type.toLowerCase().includes(q)
      )
    }
    return true
  })

  return (
    <div className="flex flex-col gap-8 p-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-1">
          <div className="flex items-center justify-center h-9 w-9 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
            <Store className="h-5 w-5" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Lead Marketplace</h1>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 ml-12">
          Purchase qualified pre-market leads
        </p>
      </div>

      <AgentMarketFilter className="mb-4" />

      {/* Pricing Tier Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {pricingTiers.map((tier) => (
          <Card
            key={tier.name}
            className={cn(
              "relative overflow-hidden transition-shadow hover:shadow-lg",
              tier.popular && "ring-2 ring-blue-500 dark:ring-blue-400"
            )}
          >
            {tier.popular && (
              <div className="absolute top-0 right-0">
                <div className="bg-blue-600 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-bl-lg">
                  Most Popular
                </div>
              </div>
            )}
            <CardContent className="p-6">
              {/* Icon + Title */}
              <div className={cn("inline-flex items-center justify-center h-12 w-12 rounded-xl mb-4", tier.bgAccent)}>
                <tier.icon className={cn("h-6 w-6", tier.iconColor)} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
                {tier.name}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                {tier.description}
              </p>

              {/* Price */}
              <div className="mb-5">
                <span className="text-4xl font-bold text-gray-900 dark:text-gray-100">
                  {formatCurrency(tier.price)}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400 ml-1.5">/ lead</span>
              </div>

              {/* Includes */}
              <ul className="space-y-2.5 mb-6">
                {tier.includes.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-gray-700 dark:text-gray-300">
                    <Check className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <Button
                className={cn(
                  "w-full",
                  tier.popular
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md"
                    : ""
                )}
                variant={tier.popular ? undefined : "outline"}
              >
                Browse Leads
                <ChevronRight className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Available Leads Section */}
      <div>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-5">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Available Leads</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {filteredLeads.length} leads match your criteria
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by city, state, type..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9 w-64"
              />
            </div>
            <div className="flex items-center gap-1 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-0.5">
              {(["all", "residential", "commercial", "institutional"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className={cn(
                    "px-3 py-1.5 rounded-md text-xs font-medium transition-colors capitalize",
                    activeFilter === f
                      ? "bg-blue-600 text-white shadow-sm"
                      : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                  )}
                >
                  {f === "all" ? "All" : f}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Leads Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredLeads.map((lead) => {
            const price = getTierPrice(lead.tier)
            const isHighTier = lead.tier !== "residential"
            return (
              <Card
                key={lead.id}
                className={cn(
                  "group relative overflow-hidden transition-all hover:shadow-md",
                  getTierGradient(lead.tier)
                )}
              >
                {isHighTier && (
                  <div className={cn(
                    "absolute top-0 left-0 right-0 h-1",
                    lead.tier === "commercial"
                      ? "bg-gradient-to-r from-blue-500 to-indigo-500"
                      : "bg-gradient-to-r from-violet-500 to-purple-500"
                  )} />
                )}
                <CardContent className="p-4">
                  {/* Top row: icon + type badge + score */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className={cn(
                        "flex items-center justify-center h-8 w-8 rounded-lg",
                        isHighTier
                          ? "bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/60 dark:to-indigo-950/60"
                          : "bg-gray-100 dark:bg-gray-800"
                      )}>
                        <lead.icon className={cn(
                          "h-4 w-4",
                          isHighTier ? "text-blue-600 dark:text-blue-400" : "text-gray-500 dark:text-gray-400"
                        )} />
                      </div>
                      <Badge
                        variant="secondary"
                        className="text-[10px] px-1.5 py-0"
                      >
                        {lead.type}
                      </Badge>
                    </div>
                    <span className={cn(
                      "inline-flex items-center justify-center w-10 h-7 rounded-md text-xs font-bold border",
                      getScoreColor(lead.score)
                    )}>
                      {lead.score}
                    </span>
                  </div>

                  {/* Address (blurred) */}
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-0.5">
                    {lead.address}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mb-3">
                    <MapPin className="h-3 w-3" />
                    {lead.city}, {lead.state}
                  </p>

                  {/* Value + Signals */}
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                      {formatCurrency(lead.value)}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                      <Signal className="h-3 w-3" />
                      {lead.signals} signals
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 pt-3 border-t border-gray-100 dark:border-gray-800">
                    <Button variant="outline" size="sm" className="flex-1 text-xs">
                      <Eye className="h-3.5 w-3.5" />
                      Preview
                    </Button>
                    <Button
                      size="sm"
                      className={cn(
                        "flex-1 text-xs",
                        isHighTier
                          ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                          : ""
                      )}
                    >
                      <ShoppingCart className="h-3.5 w-3.5" />
                      Purchase &mdash; {formatCurrency(price)}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* My Purchased Leads */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">My Purchased Leads</h2>
          <Badge variant="secondary" className="text-xs">
            {purchasedLeads.length} leads
          </Badge>
        </div>
        <Card>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Address</TableHead>
                  <TableHead>Owner</TableHead>
                  <TableHead className="text-center">Score</TableHead>
                  <TableHead className="text-right">Est. Value</TableHead>
                  <TableHead>Purchase Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {purchasedLeads.map((lead) => (
                  <TableRow key={lead.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-gray-100">
                          {lead.address}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {lead.city}, {lead.state}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-700 dark:text-gray-300">
                      {lead.owner}
                    </TableCell>
                    <TableCell className="text-center">
                      <span className={cn(
                        "inline-flex items-center justify-center w-10 h-7 rounded-md text-xs font-bold border",
                        getScoreColor(lead.score)
                      )}>
                        {lead.score}
                      </span>
                    </TableCell>
                    <TableCell className="text-right font-medium text-gray-900 dark:text-gray-100">
                      {formatCurrency(lead.value)}
                    </TableCell>
                    <TableCell className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(lead.purchaseDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </TableCell>
                    <TableCell>
                      <span className={cn(
                        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
                        getStatusBadge(lead.status)
                      )}>
                        {lead.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button size="sm" variant="outline" className="text-xs">
                        <Phone className="h-3.5 w-3.5" />
                        Contact
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>
    </div>
  )
}
