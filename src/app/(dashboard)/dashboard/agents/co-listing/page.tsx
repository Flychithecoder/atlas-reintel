"use client"

import { useState, useMemo } from "react"
import {
  Handshake,
  ArrowLeft,
  Building2,
  MapPin,
  DollarSign,
  Calendar,
  Eye,
  Send,
  TrendingUp,
  Home,
  Store,
  Factory,
  Layers,
  Users,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
} from "lucide-react"
import Link from "next/link"
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
import { cn, formatCurrency, formatDate } from "@/lib/utils"

interface CoListingOpportunity {
  id: string
  propertyAddress: string
  propertyType: string
  estimatedValue: number
  proposingAgent: string
  proposingBrokerage: string
  commissionSplit: string
  territory: string
  market: "FL" | "PR" | "DR"
  status: "pending" | "accepted" | "under-review"
  description: string
  createdAt: string
  sqft: number
}

interface MyCoListing {
  id: string
  propertyAddress: string
  partnerAgent: string
  partnerBrokerage: string
  commissionSplit: string
  status: "active" | "pending-close" | "closed" | "expired"
  createdAt: string
  estimatedValue: number
  market: "FL" | "PR" | "DR"
}

const OPPORTUNITIES: CoListingOpportunity[] = [
  {
    id: "opp-1",
    propertyAddress: "1420 Brickell Ave, Unit 2801, Miami, FL",
    propertyType: "Commercial",
    estimatedValue: 4250000,
    proposingAgent: "Maria Rodriguez",
    proposingBrokerage: "Keller Williams",
    commissionSplit: "50/50",
    territory: "Miami-Dade",
    market: "FL",
    status: "pending",
    description: "Class A office condo in Brickell. Owner relocating, motivated seller. Need partner with commercial buyer network.",
    createdAt: "2026-05-15T10:30:00Z",
    sqft: 3200,
  },
  {
    id: "opp-2",
    propertyAddress: "789 Ocean Dr, Miami Beach, FL",
    propertyType: "Mixed-Use",
    estimatedValue: 8750000,
    proposingAgent: "James Williams",
    proposingBrokerage: "CBRE",
    commissionSplit: "60/40",
    territory: "Miami Beach",
    market: "FL",
    status: "accepted",
    description: "Boutique retail + residential building on Ocean Drive. Seeking agent with hospitality investor connections.",
    createdAt: "2026-05-12T14:00:00Z",
    sqft: 12500,
  },
  {
    id: "opp-3",
    propertyAddress: "Calle Loiza 1205, San Juan, PR",
    propertyType: "Retail",
    estimatedValue: 1850000,
    proposingAgent: "Carlos Reyes",
    proposingBrokerage: "Puerto Rico Sotheby's",
    commissionSplit: "50/50",
    territory: "San Juan",
    market: "PR",
    status: "pending",
    description: "Prime retail space in Santurce arts district. Act 60 investor selling. Need agent licensed in PR.",
    createdAt: "2026-05-14T09:00:00Z",
    sqft: 4800,
  },
  {
    id: "opp-4",
    propertyAddress: "2300 PGA Blvd, Palm Beach Gardens, FL",
    propertyType: "Office",
    estimatedValue: 3100000,
    proposingAgent: "Patricia Davis",
    proposingBrokerage: "Cushman & Wakefield",
    commissionSplit: "55/45",
    territory: "Palm Beach",
    market: "FL",
    status: "pending",
    description: "Medical office building near PGA corridor. Long-term NNN tenant in place. Cap rate 6.2%.",
    createdAt: "2026-05-13T16:30:00Z",
    sqft: 8400,
  },
  {
    id: "opp-5",
    propertyAddress: "Ave. Winston Churchill 45, Santo Domingo, DR",
    propertyType: "Commercial",
    estimatedValue: 2400000,
    proposingAgent: "Rafael Castillo",
    proposingBrokerage: "Caribbean Properties",
    commissionSplit: "50/50",
    territory: "Santo Domingo",
    market: "DR",
    status: "under-review",
    description: "Commercial plaza in Naco district. CONFOTUR benefits expiring. Owner open to joint listing agreement.",
    createdAt: "2026-05-11T11:00:00Z",
    sqft: 6200,
  },
  {
    id: "opp-6",
    propertyAddress: "450 Las Olas Blvd, Fort Lauderdale, FL",
    propertyType: "Mixed-Use",
    estimatedValue: 6500000,
    proposingAgent: "Jennifer Brown",
    proposingBrokerage: "Marcus & Millichap",
    commissionSplit: "50/50",
    territory: "Broward",
    market: "FL",
    status: "pending",
    description: "Waterfront mixed-use on Las Olas. Restaurant tenant downstairs, 4 condos above. Estate sale.",
    createdAt: "2026-05-10T08:45:00Z",
    sqft: 9800,
  },
  {
    id: "opp-7",
    propertyAddress: "Carr. 413 Km 2.5, Rincon, PR",
    propertyType: "SFR",
    estimatedValue: 975000,
    proposingAgent: "Sofia Rivera",
    proposingBrokerage: "Engel & Volkers PR",
    commissionSplit: "60/40",
    territory: "West Coast PR",
    market: "PR",
    status: "accepted",
    description: "Luxury beachfront home in Rincon surf corridor. Vacation rental income $85K/yr. International buyer interest.",
    createdAt: "2026-05-09T13:15:00Z",
    sqft: 2800,
  },
  {
    id: "opp-8",
    propertyAddress: "Blvd. Turistico del Este, Punta Cana, DR",
    propertyType: "Land",
    estimatedValue: 12000000,
    proposingAgent: "Miguel Santos",
    proposingBrokerage: "Island Real Estate",
    commissionSplit: "50/50",
    territory: "La Altagracia",
    market: "DR",
    status: "pending",
    description: "15-acre beachfront development parcel with CONFOTUR eligibility. Seeking partner with resort developer network.",
    createdAt: "2026-05-08T10:00:00Z",
    sqft: 653400,
  },
  {
    id: "opp-9",
    propertyAddress: "3901 S Dixie Hwy, West Palm Beach, FL",
    propertyType: "Industrial",
    estimatedValue: 5200000,
    proposingAgent: "David Martinez",
    proposingBrokerage: "JLL",
    commissionSplit: "55/45",
    territory: "Palm Beach",
    market: "FL",
    status: "pending",
    description: "Cold storage warehouse with rail access. Tenant vacating Q3. Need partner with industrial buyer contacts.",
    createdAt: "2026-05-07T15:30:00Z",
    sqft: 42000,
  },
]

const MY_CO_LISTINGS: MyCoListing[] = [
  {
    id: "mcl-1",
    propertyAddress: "500 Brickell Key Dr, Miami, FL",
    partnerAgent: "Richard Hernandez",
    partnerBrokerage: "Coldwell Banker",
    commissionSplit: "50/50",
    status: "active",
    createdAt: "2026-04-20T09:00:00Z",
    estimatedValue: 3800000,
    market: "FL",
  },
  {
    id: "mcl-2",
    propertyAddress: "Ave. Sarasota 22, Santo Domingo, DR",
    partnerAgent: "Ana Morales",
    partnerBrokerage: "Inmobiliaria Reyes",
    commissionSplit: "50/50",
    status: "pending-close",
    createdAt: "2026-03-15T14:00:00Z",
    estimatedValue: 1200000,
    market: "DR",
  },
  {
    id: "mcl-3",
    propertyAddress: "Calle San Sebastian 201, San Juan, PR",
    partnerAgent: "Luis Colon",
    partnerBrokerage: "Christie's PR",
    commissionSplit: "60/40",
    status: "active",
    createdAt: "2026-04-02T11:30:00Z",
    estimatedValue: 2100000,
    market: "PR",
  },
  {
    id: "mcl-4",
    propertyAddress: "1200 Gulf Shore Blvd, Naples, FL",
    partnerAgent: "Elizabeth Johnson",
    partnerBrokerage: "Berkshire Hathaway",
    commissionSplit: "50/50",
    status: "closed",
    createdAt: "2026-01-10T10:00:00Z",
    estimatedValue: 7500000,
    market: "FL",
  },
  {
    id: "mcl-5",
    propertyAddress: "4500 N Federal Hwy, Boca Raton, FL",
    partnerAgent: "Thomas Garcia",
    partnerBrokerage: "RE/MAX",
    commissionSplit: "55/45",
    status: "expired",
    createdAt: "2025-12-05T09:00:00Z",
    estimatedValue: 2900000,
    market: "FL",
  },
]

function getStatusBadge(status: CoListingOpportunity["status"]) {
  const map: Record<CoListingOpportunity["status"], { label: string; className: string }> = {
    pending: {
      label: "Pending",
      className: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300",
    },
    accepted: {
      label: "Accepted",
      className: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
    },
    "under-review": {
      label: "Under Review",
      className: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
    },
  }
  return map[status]
}

function getMyListingStatusBadge(status: MyCoListing["status"]) {
  const map: Record<MyCoListing["status"], { label: string; className: string; icon: React.ReactNode }> = {
    active: {
      label: "Active",
      className: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
      icon: <CheckCircle2 className="h-3 w-3" />,
    },
    "pending-close": {
      label: "Pending Close",
      className: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
      icon: <Clock className="h-3 w-3" />,
    },
    closed: {
      label: "Closed",
      className: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
      icon: <CheckCircle2 className="h-3 w-3" />,
    },
    expired: {
      label: "Expired",
      className: "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400",
      icon: <AlertCircle className="h-3 w-3" />,
    },
  }
  return map[status]
}

function getMarketBadgeColor(market: "FL" | "PR" | "DR") {
  const map: Record<string, string> = {
    FL: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
    PR: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
    DR: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  }
  return map[market]
}

function getPropertyIcon(type: string) {
  switch (type) {
    case "SFR": return <Home className="h-4 w-4" />
    case "Commercial": return <Store className="h-4 w-4" />
    case "Industrial": return <Factory className="h-4 w-4" />
    case "Mixed-Use": return <Layers className="h-4 w-4" />
    case "Office": return <Building2 className="h-4 w-4" />
    case "Retail": return <Store className="h-4 w-4" />
    case "Land": return <MapPin className="h-4 w-4" />
    default: return <Building2 className="h-4 w-4" />
  }
}

export default function CoListingPage() {
  const [activeTab, setActiveTab] = useState("opportunities")

  const opportunityStats = useMemo(() => {
    return {
      total: OPPORTUNITIES.length,
      pending: OPPORTUNITIES.filter((o) => o.status === "pending").length,
      accepted: OPPORTUNITIES.filter((o) => o.status === "accepted").length,
      totalValue: OPPORTUNITIES.reduce((sum, o) => sum + o.estimatedValue, 0),
    }
  }, [])

  const myListingStats = useMemo(() => {
    return {
      total: MY_CO_LISTINGS.length,
      active: MY_CO_LISTINGS.filter((l) => l.status === "active").length,
      closed: MY_CO_LISTINGS.filter((l) => l.status === "closed").length,
      totalValue: MY_CO_LISTINGS.filter((l) => l.status === "active" || l.status === "pending-close").reduce((sum, l) => sum + l.estimatedValue, 0),
    }
  }, [])

  return (
    <div className="flex flex-col gap-6 p-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/agents">
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-600 text-white shadow-sm">
            <Handshake className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Co-Listing Marketplace</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Find co-listing partners and manage active agreements
            </p>
          </div>
        </div>
        <Button>
          <FileText className="h-4 w-4" />
          Post Opportunity
        </Button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
              <Handshake className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{opportunityStats.total}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Opportunities</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-yellow-100 dark:bg-yellow-900/30">
              <Clock className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{opportunityStats.pending}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Pending Review</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-green-100 dark:bg-green-900/30">
              <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{myListingStats.active}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">My Active</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900/30">
              <DollarSign className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{formatCurrency(opportunityStats.totalValue)}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Pipeline Value</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="opportunities" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="opportunities">
            Available Opportunities
          </TabsTrigger>
          <TabsTrigger value="my-listings">
            My Co-Listings
          </TabsTrigger>
        </TabsList>

        {/* Available Opportunities Tab */}
        <TabsContent value="opportunities">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mt-4">
            {OPPORTUNITIES.map((opp) => {
              const statusBadge = getStatusBadge(opp.status)
              return (
                <Card key={opp.id} className="group hover:shadow-lg transition-all duration-200 overflow-hidden">
                  {/* Market Strip */}
                  <div
                    className={cn(
                      "h-1",
                      opp.market === "FL" ? "bg-blue-600" : opp.market === "PR" ? "bg-purple-600" : "bg-amber-600"
                    )}
                  />
                  <CardContent className="p-5">
                    {/* Header: Property Type Icon + Address + Status */}
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div className="flex items-start gap-2.5 min-w-0">
                        <div className="flex items-center justify-center h-9 w-9 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 shrink-0 mt-0.5">
                          {getPropertyIcon(opp.propertyType)}
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm leading-tight">
                            {opp.propertyAddress}
                          </h3>
                          <div className="flex items-center gap-1.5 mt-1">
                            <span className="text-xs text-gray-500 dark:text-gray-400">{opp.propertyType}</span>
                            <span className="text-gray-300 dark:text-gray-600">|</span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">{opp.sqft.toLocaleString()} sqft</span>
                          </div>
                        </div>
                      </div>
                      <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold shrink-0", statusBadge.className)}>
                        {statusBadge.label}
                      </span>
                    </div>

                    {/* Value + Market */}
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
                        {formatCurrency(opp.estimatedValue)}
                      </span>
                      <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium", getMarketBadgeColor(opp.market))}>
                        {opp.market}
                      </span>
                    </div>

                    {/* Agent Info */}
                    <div className="flex items-center gap-2 mb-3 p-2.5 rounded-lg bg-gray-50 dark:bg-gray-900/50">
                      <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-600 text-white text-xs font-bold shrink-0">
                        {opp.proposingAgent.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                          {opp.proposingAgent}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {opp.proposingBrokerage}
                        </p>
                      </div>
                    </div>

                    {/* Commission Split + Territory */}
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                        <DollarSign className="h-3 w-3" />
                        <span>Split: <span className="font-semibold text-gray-700 dark:text-gray-200">{opp.commissionSplit}</span></span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                        <MapPin className="h-3 w-3" />
                        <span>{opp.territory}</span>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">
                      {opp.description}
                    </p>

                    {/* Date */}
                    <div className="flex items-center gap-1 text-[10px] text-gray-400 dark:text-gray-500 mb-3">
                      <Calendar className="h-3 w-3" />
                      <span>Posted {formatDate(opp.createdAt)}</span>
                    </div>

                    {/* Actions */}
                    <div className="pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center gap-2">
                      <Button variant="outline" size="sm" className="flex-1 text-xs h-8">
                        <Eye className="h-3 w-3" />
                        View Details
                      </Button>
                      <Button size="sm" className="flex-1 text-xs h-8">
                        <Send className="h-3 w-3" />
                        Apply
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        {/* My Co-Listings Tab */}
        <TabsContent value="my-listings">
          <Card className="mt-4">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Property</TableHead>
                    <TableHead>Partner Agent</TableHead>
                    <TableHead>Commission Split</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {MY_CO_LISTINGS.map((listing) => {
                    const statusBadge = getMyListingStatusBadge(listing.status)
                    return (
                      <TableRow key={listing.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-gray-100 text-sm">
                              {listing.propertyAddress}
                            </p>
                            <span className={cn("inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-medium mt-1", getMarketBadgeColor(listing.market))}>
                              {listing.market}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                              {listing.partnerAgent}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {listing.partnerBrokerage}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="inline-flex items-center gap-1 text-sm font-medium text-gray-700 dark:text-gray-200">
                            <DollarSign className="h-3.5 w-3.5 text-gray-400" />
                            {listing.commissionSplit}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {formatCurrency(listing.estimatedValue)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium", statusBadge.className)}>
                            {statusBadge.icon}
                            {statusBadge.label}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {formatDate(listing.createdAt)}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm" className="text-xs h-8">
                            <Eye className="h-3 w-3" />
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>

            {/* Empty state for when table is empty (kept for future use) */}
            {MY_CO_LISTINGS.length === 0 && (
              <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
                <div className="mb-4 text-gray-400 dark:text-gray-500">
                  <Handshake className="h-12 w-12" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  No co-listings yet
                </h3>
                <p className="mt-1 max-w-sm text-sm text-gray-500 dark:text-gray-400">
                  Apply to available opportunities or post your own to start building co-listing partnerships.
                </p>
              </div>
            )}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
