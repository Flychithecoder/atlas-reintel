"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatNumber } from "@/lib/utils"
import {
  Target,
  Users,
  Building2,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Copy,
  MapPin,
  BarChart3,
  Palmtree,
  Globe,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  RefreshCw,
  Search,
  Filter,
  ChevronRight,
} from "lucide-react"

// --- Lead Distribution Data ---

const leadDistribution = {
  byType: [
    { label: "Seller Leads", count: 8420, icon: Building2, color: "bg-red-100 text-red-700", trend: 12, trendDir: "up" as const },
    { label: "Buyer Leads", count: 3180, icon: Users, color: "bg-blue-100 text-blue-700", trend: 8, trendDir: "up" as const },
    { label: "Tenant Leads", count: 1247, icon: Target, color: "bg-purple-100 text-purple-700", trend: -3, trendDir: "down" as const },
  ],
  byMarket: [
    { label: "Florida", count: 7840, icon: Palmtree, color: "bg-emerald-100 text-emerald-700", trend: 15, trendDir: "up" as const },
    { label: "Puerto Rico", count: 3120, icon: MapPin, color: "bg-sky-100 text-sky-700", trend: 22, trendDir: "up" as const },
    { label: "Dominican Republic", count: 1887, icon: Globe, color: "bg-amber-100 text-amber-700", trend: 31, trendDir: "up" as const },
  ],
}

// --- Signal Source Performance ---

const signalSources = [
  { name: "FL Clerk of Court", leads: 2840, conversion: 4.2, avgScore: 78, freshness: "1h ago", status: "fresh" as const },
  { name: "ATTOM Property API", leads: 2120, conversion: 3.1, avgScore: 71, freshness: "2h ago", status: "fresh" as const },
  { name: "County Assessor Scraper", leads: 1890, conversion: 2.8, avgScore: 65, freshness: "3d ago", status: "stale" as const },
  { name: "CRIM/KARIBE", leads: 1640, conversion: 5.1, avgScore: 82, freshness: "2h ago", status: "fresh" as const },
  { name: "Catastro Nacional", leads: 1280, conversion: 4.8, avgScore: 79, freshness: "4h ago", status: "fresh" as const },
  { name: "Court Records ETL", leads: 1150, conversion: 6.2, avgScore: 85, freshness: "1h ago", status: "fresh" as const },
  { name: "Sunbiz.org", leads: 980, conversion: 3.5, avgScore: 68, freshness: "2h ago", status: "fresh" as const },
  { name: "HMDA/CFPB", leads: 890, conversion: 2.1, avgScore: 62, freshness: "4h ago", status: "fresh" as const },
  { name: "SEC EDGAR", leads: 420, conversion: 7.8, avgScore: 88, freshness: "4h ago", status: "fresh" as const },
  { name: "LinkedIn Jobs API", leads: 380, conversion: 3.9, avgScore: 74, freshness: "30m ago", status: "fresh" as const },
  { name: "Registro de Títulos", leads: 340, conversion: 5.5, avgScore: 81, freshness: "1h ago", status: "fresh" as const },
  { name: "DGII Tax Records", leads: 310, conversion: 4.4, avgScore: 76, freshness: "2h ago", status: "fresh" as const },
  { name: "Corotos.com.do", leads: 280, conversion: 1.8, avgScore: 54, freshness: "3h ago", status: "fresh" as const },
  { name: "SBA Loans", leads: 220, conversion: 3.2, avgScore: 70, freshness: "3h ago", status: "fresh" as const },
  { name: "Satellite Imagery", leads: 150, conversion: 1.2, avgScore: 48, freshness: "5d ago", status: "outdated" as const },
  { name: "MLS Feed", leads: 0, conversion: 0, avgScore: 0, freshness: "FAILED", status: "outdated" as const },
]

// --- Score Distribution (mock histogram) ---

const scoreDistribution = [
  { range: "90-100", count: 342, pct: 2.7, color: "bg-red-600" },
  { range: "80-89", count: 1280, pct: 10.0, color: "bg-red-500" },
  { range: "70-79", count: 2890, pct: 22.5, color: "bg-orange-500" },
  { range: "60-69", count: 3420, pct: 26.6, color: "bg-yellow-500" },
  { range: "50-59", count: 2180, pct: 17.0, color: "bg-blue-400" },
  { range: "40-49", count: 1540, pct: 12.0, color: "bg-blue-300" },
  { range: "30-39", count: 890, pct: 6.9, color: "bg-gray-400" },
  { range: "0-29", count: 305, pct: 2.4, color: "bg-gray-300" },
]

const totalLeads = scoreDistribution.reduce((s, d) => s + d.count, 0)

// --- Data Freshness by Source ---

const dataFreshnessSources = [
  { source: "FL Clerk of Court", lastUpdate: "May 19, 2026 01:12 AM", records: 127000, status: "fresh" as const },
  { source: "ATTOM Property API", lastUpdate: "May 19, 2026 12:00 AM", records: 1250000, status: "fresh" as const },
  { source: "CRIM/KARIBE", lastUpdate: "May 18, 2026 11:45 PM", records: 95000, status: "fresh" as const },
  { source: "County Assessor", lastUpdate: "May 16, 2026 08:00 AM", records: 48000, status: "stale" as const },
  { source: "Court Records ETL", lastUpdate: "May 19, 2026 01:30 AM", records: 89000, status: "fresh" as const },
  { source: "Catastro Nacional", lastUpdate: "May 18, 2026 09:00 PM", records: 78000, status: "fresh" as const },
  { source: "Registro de Títulos", lastUpdate: "May 19, 2026 12:45 AM", records: 22000, status: "fresh" as const },
  { source: "DGII Tax Records", lastUpdate: "May 18, 2026 10:00 PM", records: 45000, status: "fresh" as const },
  { source: "Sunbiz.org", lastUpdate: "May 18, 2026 11:00 PM", records: 34500, status: "fresh" as const },
  { source: "SEC EDGAR", lastUpdate: "May 18, 2026 08:00 PM", records: 5600, status: "fresh" as const },
  { source: "HMDA/CFPB", lastUpdate: "May 18, 2026 08:00 PM", records: 340000, status: "fresh" as const },
  { source: "Satellite Imagery", lastUpdate: "May 14, 2026 06:00 AM", records: 5000, status: "outdated" as const },
  { source: "MLS Feed", lastUpdate: "FAILED", records: 0, status: "outdated" as const },
]

const freshnessStatusBadge: Record<string, { label: string; className: string }> = {
  fresh: { label: "Fresh", className: "bg-green-100 text-green-700 border-green-200" },
  stale: { label: "Stale", className: "bg-yellow-100 text-yellow-700 border-yellow-200" },
  outdated: { label: "Outdated", className: "bg-red-100 text-red-700 border-red-200" },
}

function TrendIndicator({ value, dir }: { value: number; dir: "up" | "down" | "stable" }) {
  if (dir === "up") {
    return (
      <span className="inline-flex items-center gap-0.5 text-[11px] font-medium text-green-600">
        <ArrowUpRight className="h-3 w-3" />
        {value}%
      </span>
    )
  }
  if (dir === "down") {
    return (
      <span className="inline-flex items-center gap-0.5 text-[11px] font-medium text-red-600">
        <ArrowDownRight className="h-3 w-3" />
        {Math.abs(value)}%
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-0.5 text-[11px] font-medium text-gray-500">
      <Minus className="h-3 w-3" />
      {value}%
    </span>
  )
}

export default function LeadsManagementPage() {
  const [sourceSort, setSourceSort] = useState<"leads" | "conversion" | "score">("leads")

  const sortedSources = [...signalSources].sort((a, b) => {
    if (sourceSort === "leads") return b.leads - a.leads
    if (sourceSort === "conversion") return b.conversion - a.conversion
    return b.avgScore - a.avgScore
  })

  const avgScore = Math.round(
    scoreDistribution.reduce((s, d) => {
      const midpoint = parseInt(d.range.split("-")[0]) + 5
      return s + midpoint * d.count
    }, 0) / totalLeads
  )

  const medianBucket = (() => {
    let cumulative = 0
    const half = totalLeads / 2
    for (const d of [...scoreDistribution].reverse()) {
      cumulative += d.count
      if (cumulative >= half) return parseInt(d.range.split("-")[0]) + 5
    }
    return 50
  })()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Leads Management</h1>
          <p className="text-sm text-gray-500 mt-1">
            Lead distribution, quality metrics, and data source performance across all markets
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2 text-sm">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
          <Button className="gap-2 bg-red-600 hover:bg-red-700 text-sm">
            <Filter className="h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Lead Distribution Cards */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Lead Distribution</h2>
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {leadDistribution.byType.map((item) => {
            const Icon = item.icon
            return (
              <Card key={item.label} className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${item.color}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <TrendIndicator value={item.trend} dir={item.trendDir} />
                </div>
                <p className="text-2xl font-bold text-gray-900">{formatNumber(item.count)}</p>
                <p className="text-xs text-gray-500 mt-0.5">{item.label}</p>
              </Card>
            )
          })}
          {leadDistribution.byMarket.map((item) => {
            const Icon = item.icon
            return (
              <Card key={item.label} className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${item.color}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <TrendIndicator value={item.trend} dir={item.trendDir} />
                </div>
                <p className="text-2xl font-bold text-gray-900">{formatNumber(item.count)}</p>
                <p className="text-xs text-gray-500 mt-0.5">{item.label}</p>
              </Card>
            )
          })}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Signal Source Performance - spans 2 cols */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Signal Source Performance</h3>
              <div className="flex items-center gap-1">
                {(["leads", "conversion", "score"] as const).map((key) => (
                  <button
                    key={key}
                    onClick={() => setSourceSort(key)}
                    className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
                      sourceSort === key
                        ? "bg-red-600 text-white"
                        : "text-gray-500 hover:bg-gray-100"
                    }`}
                  >
                    {key === "leads" ? "By Leads" : key === "conversion" ? "By Conv." : "By Score"}
                  </button>
                ))}
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Source</th>
                    <th className="text-right py-3 px-3 font-medium text-gray-500">Leads Generated</th>
                    <th className="text-right py-3 px-3 font-medium text-gray-500">Conv. Rate</th>
                    <th className="text-right py-3 px-3 font-medium text-gray-500">Avg Score</th>
                    <th className="text-left py-3 px-3 font-medium text-gray-500">Freshness</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedSources.map((source) => (
                    <tr key={source.name} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className={`h-2 w-2 rounded-full ${
                            source.status === "fresh" ? "bg-green-500" :
                            source.status === "stale" ? "bg-yellow-500" : "bg-red-500"
                          }`} />
                          <span className="font-medium text-gray-900">{source.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-right font-medium text-gray-700">
                        {formatNumber(source.leads)}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <span className={`font-medium ${
                          source.conversion >= 5 ? "text-green-600" :
                          source.conversion >= 3 ? "text-blue-600" :
                          source.conversion > 0 ? "text-gray-600" : "text-red-500"
                        }`}>
                          {source.conversion > 0 ? `${source.conversion}%` : "-"}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <div className="w-12 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                source.avgScore >= 80 ? "bg-green-500" :
                                source.avgScore >= 60 ? "bg-blue-500" :
                                source.avgScore > 0 ? "bg-yellow-500" : "bg-gray-300"
                              }`}
                              style={{ width: `${source.avgScore}%` }}
                            />
                          </div>
                          <span className="font-medium text-gray-700 text-xs w-6 text-right">
                            {source.avgScore > 0 ? source.avgScore : "-"}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <Badge className={`text-[10px] ${freshnessStatusBadge[source.status].className}`}>
                          {source.freshness}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Right column */}
        <div className="space-y-4">
          {/* Lead Quality Metrics */}
          <Card className="p-4">
            <h3 className="font-semibold text-gray-900 mb-4">Lead Quality Metrics</h3>

            {/* Summary stats */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="text-center p-2.5 rounded-lg bg-gray-50">
                <p className="text-lg font-bold text-gray-900">{formatNumber(totalLeads)}</p>
                <p className="text-[10px] text-gray-500">Total Leads</p>
              </div>
              <div className="text-center p-2.5 rounded-lg bg-blue-50">
                <p className="text-lg font-bold text-blue-700">{avgScore}</p>
                <p className="text-[10px] text-gray-500">Avg Score</p>
              </div>
              <div className="text-center p-2.5 rounded-lg bg-green-50">
                <p className="text-lg font-bold text-green-700">{medianBucket}</p>
                <p className="text-[10px] text-gray-500">Median Score</p>
              </div>
            </div>

            {/* Score Distribution Histogram */}
            <div className="space-y-2">
              <p className="text-xs text-gray-500 font-medium">Score Distribution</p>
              {scoreDistribution.map((bucket) => {
                const maxCount = Math.max(...scoreDistribution.map((d) => d.count))
                const barWidth = (bucket.count / maxCount) * 100
                return (
                  <div key={bucket.range} className="flex items-center gap-2">
                    <span className="text-[11px] text-gray-500 w-10 text-right font-mono">{bucket.range}</span>
                    <div className="flex-1 h-5 bg-gray-50 rounded overflow-hidden relative">
                      <div
                        className={`h-full ${bucket.color} rounded transition-all`}
                        style={{ width: `${barWidth}%` }}
                      />
                      <span className="absolute inset-0 flex items-center px-2 text-[10px] font-medium text-gray-700">
                        {formatNumber(bucket.count)} ({bucket.pct}%)
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </Card>

          {/* Duplicate Detection */}
          <Card className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-100">
                <Copy className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Duplicate Detection</h3>
                <p className="text-xs text-gray-500">Cross-source dedup analysis</p>
              </div>
            </div>
            <div className="rounded-lg border border-yellow-200 bg-yellow-50/50 p-3 mb-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-yellow-800">Potential duplicates found</span>
                <span className="text-xl font-bold text-yellow-700">47</span>
              </div>
              <p className="text-[11px] text-yellow-600">
                Across 12 data sources, matching on address + owner name with fuzzy logic
              </p>
            </div>
            <div className="grid grid-cols-3 gap-2 mb-3">
              <div className="text-center p-2 rounded bg-gray-50">
                <p className="text-sm font-bold text-gray-900">23</p>
                <p className="text-[10px] text-gray-500">High Conf.</p>
              </div>
              <div className="text-center p-2 rounded bg-gray-50">
                <p className="text-sm font-bold text-gray-900">15</p>
                <p className="text-[10px] text-gray-500">Medium</p>
              </div>
              <div className="text-center p-2 rounded bg-gray-50">
                <p className="text-sm font-bold text-gray-900">9</p>
                <p className="text-[10px] text-gray-500">Low Conf.</p>
              </div>
            </div>
            <Button variant="outline" size="sm" className="w-full gap-1.5 text-xs">
              <Search className="h-3.5 w-3.5" />
              Review Duplicates
            </Button>
          </Card>
        </div>
      </div>

      {/* Data Freshness by Source - full width */}
      <Card>
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-gray-400" />
            <h3 className="font-semibold text-gray-900">Data Freshness by Source</h3>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <div className="h-2 w-2 rounded-full bg-green-500" />
              <span className="text-[11px] text-gray-500">Fresh (&lt;24h)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-2 w-2 rounded-full bg-yellow-500" />
              <span className="text-[11px] text-gray-500">Stale (1-5d)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-2 w-2 rounded-full bg-red-500" />
              <span className="text-[11px] text-gray-500">Outdated (&gt;5d / Failed)</span>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-left py-3 px-4 font-medium text-gray-500">Data Source</th>
                <th className="text-left py-3 px-3 font-medium text-gray-500">Last Update</th>
                <th className="text-right py-3 px-3 font-medium text-gray-500">Record Count</th>
                <th className="text-left py-3 px-3 font-medium text-gray-500">Status</th>
              </tr>
            </thead>
            <tbody>
              {dataFreshnessSources.map((source) => {
                const badge = freshnessStatusBadge[source.status]
                return (
                  <tr key={source.source} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className={`h-2 w-2 rounded-full ${
                          source.status === "fresh" ? "bg-green-500" :
                          source.status === "stale" ? "bg-yellow-500" : "bg-red-500"
                        }`} />
                        <span className="font-medium text-gray-900">{source.source}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-gray-500 text-xs">
                      {source.lastUpdate}
                    </td>
                    <td className="py-3 px-3 text-right font-medium text-gray-700">
                      {source.records > 0 ? formatNumber(source.records) : "-"}
                    </td>
                    <td className="py-3 px-3">
                      <Badge className={`text-[10px] ${badge.className}`}>
                        {badge.label}
                      </Badge>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
