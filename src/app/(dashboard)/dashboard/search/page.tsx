"use client"

import { useState } from "react"
import {
  Search,
  Mic,
  Sparkles,
  BookmarkPlus,
  Bell,
  BellOff,
  ChevronRight,
  ArrowUpDown,
  Eye,
  Phone,
  Mail,
  MoreHorizontal,
  Building2,
  Home,
  Factory,
  Landmark,
  Store,
  Trees,
  Layers,
  User,
  Building,
  Shield,
  Users,
  Briefcase,
  Clock,
  TrendingUp,
  Zap,
  X,
  Target,
  ShoppingCart,
  Key as KeyIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { generateLeads } from "@/hooks/use-mock-data"
import { cn, formatCurrency, formatNumber } from "@/lib/utils"
import type { Lead, Signal } from "@/types"

type SearchMode = "seller" | "buyer" | "tenant"

const EXAMPLE_QUERIES_BY_MODE: Record<SearchMode, { label: string; queries: string[] }> = {
  seller: {
    label: "Find Sellers",
    queries: [
      "Distressed multifamily in Atlanta with >70% equity",
      "Properties with 3+ distress signals in Miami-Dade",
      "CRIM tax delinquent owners in San Juan with equity > $500K",
      "CONFOTUR expiring properties in Punta Cana",
      "Owners with lis pendens filed in Broward County",
      "Probate properties in Houston under $500K",
      "Vacant SFR in Miami owned by out-of-state LLCs",
      "Pre-foreclosure commercial in Fort Lauderdale",
    ],
  },
  buyer: {
    label: "Find Buyers",
    queries: [
      "Active investors with 1031 exchange deadlines in next 90 days",
      "Cash buyers seeking multifamily in South Florida",
      "International buyers pre-approved for $1M+ in PR",
      "Portfolio buyers active in Dominican Republic hospitality",
      "Repeat buyers with 3+ closings in Miami-Dade last 12 months",
      "Institutional buyers seeking NNN retail in FL",
    ],
  },
  tenant: {
    label: "Find Tenants",
    queries: [
      "Companies with leases expiring in 6 months in Miami",
      "Medical tenants seeking 5K+ sqft in San Juan PR",
      "Retail franchises expanding in Punta Cana DR",
      "Tech companies seeking Class A office in Fort Lauderdale",
      "Restaurant operators seeking 2K-5K sqft in Brickell",
      "Coworking operators looking for 10K+ sqft in San Juan",
    ],
  },
}

const EXAMPLE_QUERIES = [
  "Distressed multifamily in Atlanta with >70% equity",
  "Class B office in Austin with leases expiring in 18 months",
  "Vacant SFR in Miami owned by out-of-state LLCs",
  "Probate properties in Houston under $500K",
  "Commercial properties near new transit stations",
  "Beachfront commercial in Punta Cana with tourism permits",
  "Tax delinquent properties in San Juan PR",
  "Residential listings about to expire in Santo Domingo",
]

const SAVED_SEARCHES = [
  {
    id: "ss-1",
    name: "Distressed MF - Atlanta",
    query: "Distressed multifamily in Atlanta with >70% equity",
    results: 847,
    newLeads: 12,
    updatedAgo: "2h ago",
    alertsOn: true,
  },
  {
    id: "ss-2",
    name: "High Equity SFR - Miami",
    query: "Vacant SFR in Miami owned by out-of-state LLCs",
    results: 1234,
    newLeads: 5,
    updatedAgo: "4h ago",
    alertsOn: true,
  },
  {
    id: "ss-3",
    name: "CRE Lease Expiry - Austin",
    query: "Class B office in Austin with leases expiring in 18 months",
    results: 156,
    newLeads: 0,
    updatedAgo: "1d ago",
    alertsOn: false,
  },
  {
    id: "ss-4",
    name: "Probate - Houston",
    query: "Probate properties in Houston under $500K",
    results: 423,
    newLeads: 8,
    updatedAgo: "6h ago",
    alertsOn: true,
  },
]

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

export default function SearchPage() {
  const [query, setQuery] = useState("")
  const [hasSearched, setHasSearched] = useState(false)
  const [results] = useState<Lead[]>(() => generateLeads(10))
  const [sortBy, setSortBy] = useState("relevance")
  const [searchMode, setSearchMode] = useState<SearchMode>("seller")
  const [savedSearchAlerts, setSavedSearchAlerts] = useState<Record<string, boolean>>(
    Object.fromEntries(SAVED_SEARCHES.map((s) => [s.id, s.alertsOn]))
  )

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (query.trim()) {
      setHasSearched(true)
    }
  }

  function handleExampleClick(exampleQuery: string) {
    setQuery(exampleQuery)
    setHasSearched(true)
  }

  function toggleAlert(id: string) {
    setSavedSearchAlerts((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <div className="flex flex-col min-h-full">
      {/* Hero Search Section */}
      <div className={cn(
        "flex flex-col items-center px-6 transition-all duration-500",
        hasSearched ? "pt-8 pb-6" : "pt-20 pb-12"
      )}>
        <div className="w-full max-w-3xl">
          {!hasSearched && (
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-full px-3 py-1 mb-4">
                <Sparkles className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                <span className="text-xs font-medium text-blue-700 dark:text-blue-300">AI-Powered Search</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                Search 26M+ Properties with AI
              </h1>
              <p className="text-gray-500 dark:text-gray-400 text-base max-w-lg mx-auto">
                Use natural language to find your ideal leads. Our AI understands complex queries across property, owner, and signal data.
              </p>

              {/* Search Mode Toggle */}
              <div className="flex items-center justify-center gap-1 mt-5 bg-gray-100 dark:bg-gray-800 rounded-lg p-1 max-w-md mx-auto">
                {([
                  { key: "seller" as SearchMode, label: "Find Sellers", icon: Target },
                  { key: "buyer" as SearchMode, label: "Find Buyers", icon: ShoppingCart },
                  { key: "tenant" as SearchMode, label: "Find Tenants", icon: KeyIcon },
                ]).map(({ key, label, icon: Icon }) => (
                  <button
                    key={key}
                    onClick={() => setSearchMode(key)}
                    className={cn(
                      "flex-1 inline-flex items-center justify-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium transition-all",
                      searchMode === key
                        ? "bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 shadow-sm"
                        : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="relative">
            <div className="relative flex items-center">
              <Search className="absolute left-4 h-5 w-5 text-gray-400 pointer-events-none" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask anything... e.g. distressed multifamily in Atlanta with high equity"
                className={cn(
                  "w-full bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-2xl pl-12 pr-24 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all",
                  hasSearched ? "h-12 text-sm" : "h-14 text-base shadow-lg"
                )}
              />
              <div className="absolute right-2 flex items-center gap-1">
                <button
                  type="button"
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                  title="Voice search"
                >
                  <Mic className="h-4 w-4" />
                </button>
                <Button type="submit" size="sm" className="rounded-xl">
                  Search
                </Button>
              </div>
            </div>
          </form>

          {/* Example Chips - mode-aware */}
          {!hasSearched && (
            <div className="flex flex-wrap items-center justify-center gap-2 mt-5">
              {EXAMPLE_QUERIES_BY_MODE[searchMode].queries.map((eq) => (
                <button
                  key={eq}
                  onClick={() => handleExampleClick(eq)}
                  className="inline-flex items-center gap-1.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full px-3 py-1.5 text-xs text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-colors"
                >
                  <Zap className="h-3 w-3 text-amber-500" />
                  {eq}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Results Area */}
      {hasSearched && (
        <div className="flex-1 px-6 pb-6">
          <div className="max-w-[1600px] mx-auto flex gap-6">
            {/* Main Results */}
            <div className="flex-1 min-w-0">
              {/* Results Count */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Found <span className="text-blue-600 dark:text-blue-400">847</span> properties
                  </h2>
                  <Button variant="ghost" size="sm" className="text-gray-500">
                    <BookmarkPlus className="h-4 w-4 mr-1" />
                    Save Search
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 dark:text-gray-400">Sort by</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="h-8 px-2 pr-7 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm text-gray-700 dark:text-gray-300 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="relevance">Relevance</option>
                    <option value="score">Score</option>
                    <option value="value">Value</option>
                    <option value="date">Date Added</option>
                  </select>
                </div>
              </div>

              {/* AI Explanation Card */}
              <Card className="mb-5 border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/20">
                <CardContent className="p-4">
                  <div className="flex gap-3">
                    <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-blue-100 dark:bg-blue-900/50 shrink-0">
                      <Sparkles className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                        I found <strong>847 properties</strong> matching distressed multifamily criteria in Atlanta.
                        The top results show properties with multiple distress signals including tax delinquency,
                        code violations, and high equity positions. <strong>23</strong> of these owners have been
                        identified as likely sellers based on our scoring model.
                      </p>
                      <div className="flex items-center gap-4 mt-2.5">
                        <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                          <TrendingUp className="h-3 w-3" />
                          <span>Avg. Score: <strong className="text-gray-700 dark:text-gray-200">74</strong></span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                          <Clock className="h-3 w-3" />
                          <span>Query: <strong className="text-gray-700 dark:text-gray-200">1.2s</strong></span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Results List */}
              <div className="space-y-2">
                {results.map((lead) => (
                  <Card key={lead.id} className="group hover:shadow-sm transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        {/* Score */}
                        <span className={cn("inline-flex items-center justify-center w-10 h-8 rounded-md text-xs font-bold border shrink-0 mt-0.5", getScoreColor(lead.score))}>
                          {lead.score}
                        </span>

                        {/* Property Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <div className="flex items-center gap-2 mb-0.5">
                                <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                                  {lead.property.address}
                                </h3>
                                <div className="flex items-center gap-1 text-gray-400">
                                  {getPropertyIcon(lead.property.propertyType)}
                                  <span className="text-xs">{lead.property.propertyType}</span>
                                </div>
                              </div>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {lead.property.city}, {lead.property.state} {lead.property.zip}
                              </p>
                            </div>
                            <div className="text-right shrink-0">
                              <div className="font-semibold text-gray-900 dark:text-gray-100">
                                {formatCurrency(lead.property.estimatedValue)}
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                {formatNumber(lead.property.sqft)} sqft
                              </div>
                            </div>
                          </div>

                          {/* Owner Row */}
                          <div className="flex items-center gap-4 mt-2">
                            <div className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-300">
                              {getEntityIcon(lead.owner.entityType)}
                              <span>{lead.owner.name}</span>
                              {lead.owner.outOfState && (
                                <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 font-normal">
                                  Out-of-state
                                </Badge>
                              )}
                            </div>
                          </div>

                          {/* Signals + Status Row */}
                          <div className="flex items-center justify-between mt-2.5">
                            <div className="flex items-center gap-1.5">
                              {lead.signals.slice(0, 3).map((signal, i) => (
                                <span
                                  key={i}
                                  className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium",
                                    signal.type === "distress" ? "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300" :
                                    signal.type === "life-event" ? "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300" :
                                    signal.type === "financial" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300" :
                                    signal.type === "behavioral" ? "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300" :
                                    "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"
                                  )}
                                >
                                  <span className={cn("h-1.5 w-1.5 rounded-full", getSignalColor(signal.type))} />
                                  {signal.label.length > 25 ? signal.label.substring(0, 25) + "..." : signal.label}
                                </span>
                              ))}
                              {lead.signals.length > 3 && (
                                <span className="text-xs text-gray-400">+{lead.signals.length - 3}</span>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium", getStatusColor(lead.status))}>
                                {lead.status}
                              </span>
                              <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button variant="ghost" size="icon" className="h-7 w-7" title="View">
                                  <Eye className="h-3.5 w-3.5" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-7 w-7" title="Call">
                                  <Phone className="h-3.5 w-3.5" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-7 w-7" title="Email">
                                  <Mail className="h-3.5 w-3.5" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-7 w-7" title="More">
                                  <MoreHorizontal className="h-3.5 w-3.5" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Load More */}
              <div className="flex items-center justify-center mt-6">
                <Button variant="outline" className="w-full max-w-xs">
                  Load More Results
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>

            {/* Saved Searches Sidebar */}
            <div className="hidden lg:block w-80 shrink-0">
              <div className="sticky top-6">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center justify-between">
                      <span>Saved Searches</span>
                      <Badge variant="secondary" className="text-xs">
                        {SAVED_SEARCHES.length}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="divide-y divide-gray-100 dark:divide-gray-800">
                      {SAVED_SEARCHES.map((search) => (
                        <div
                          key={search.id}
                          className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors cursor-pointer group/item"
                        >
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <div className="flex items-center gap-2 min-w-0">
                              <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                                {search.name}
                              </h4>
                              {search.newLeads > 0 && (
                                <span className="flex items-center justify-center h-5 min-w-[20px] px-1 rounded-full bg-blue-600 text-[10px] font-bold text-white shrink-0">
                                  {search.newLeads}
                                </span>
                              )}
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                toggleAlert(search.id)
                              }}
                              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 opacity-0 group-hover/item:opacity-100 transition-opacity shrink-0"
                              title={savedSearchAlerts[search.id] ? "Disable alerts" : "Enable alerts"}
                            >
                              {savedSearchAlerts[search.id]
                                ? <Bell className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                                : <BellOff className="h-3.5 w-3.5" />
                              }
                            </button>
                          </div>
                          <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                            <span>{formatNumber(search.results)} results</span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {search.updatedAgo}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="p-3 border-t border-gray-100 dark:border-gray-800">
                      <Button variant="ghost" size="sm" className="w-full text-gray-500 hover:text-gray-700 dark:hover:text-gray-200">
                        View All Saved Searches
                        <ChevronRight className="h-3.5 w-3.5 ml-1" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Stats */}
                <Card className="mt-4">
                  <CardContent className="p-4">
                    <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                      Search Stats
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-300">Searches Today</span>
                        <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">24</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-300">Properties Scanned</span>
                        <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">26.4M</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-300">Avg. Response</span>
                        <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">1.2s</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-300">Data Freshness</span>
                        <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">2h ago</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Empty State - when not searched */}
      {!hasSearched && (
        <div className="flex-1 px-6 pb-6">
          <div className="max-w-5xl mx-auto">
            {/* Feature Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
              <Card className="border-dashed">
                <CardContent className="p-5 text-center">
                  <div className="inline-flex items-center justify-center h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900/40 mb-3">
                    <Search className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Natural Language</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Search in plain English. No complex filters needed.
                  </p>
                </CardContent>
              </Card>
              <Card className="border-dashed">
                <CardContent className="p-5 text-center">
                  <div className="inline-flex items-center justify-center h-10 w-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 mb-3">
                    <Sparkles className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">AI-Scored Results</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Results ranked by our proprietary lead scoring model.
                  </p>
                </CardContent>
              </Card>
              <Card className="border-dashed">
                <CardContent className="p-5 text-center">
                  <div className="inline-flex items-center justify-center h-10 w-10 rounded-lg bg-amber-100 dark:bg-amber-900/40 mb-3">
                    <Bell className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Smart Alerts</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Save searches and get notified when new matches appear.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Saved Searches - shown in pre-search state too */}
            {SAVED_SEARCHES.length > 0 && (
              <div className="mt-8">
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                  Your Saved Searches
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {SAVED_SEARCHES.map((search) => (
                    <Card
                      key={search.id}
                      className="cursor-pointer hover:shadow-sm transition-shadow"
                      onClick={() => handleExampleClick(search.query)}
                    >
                      <CardContent className="p-4 flex items-center justify-between">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <h4 className="font-medium text-gray-900 dark:text-gray-100 text-sm truncate">
                              {search.name}
                            </h4>
                            {search.newLeads > 0 && (
                              <span className="flex items-center justify-center h-5 min-w-[20px] px-1 rounded-full bg-blue-600 text-[10px] font-bold text-white shrink-0">
                                +{search.newLeads} new
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                            <span>{formatNumber(search.results)} results</span>
                            <span>Updated {search.updatedAgo}</span>
                          </div>
                        </div>
                        <ChevronRight className="h-4 w-4 text-gray-400 shrink-0" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
