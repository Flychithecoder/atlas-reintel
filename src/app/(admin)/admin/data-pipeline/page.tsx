"use client"

import { useState, useEffect, useMemo } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { generatePipelines, type PipelineMarket, type DataPipelineExtended } from "@/hooks/use-mock-data"
import { formatNumber } from "@/lib/utils"
import {
  Activity,
  Database,
  AlertTriangle,
  Clock,
  Play,
  Pause,
  Settings,
  RefreshCw,
  CheckCircle2,
  Filter,
  Globe,
  Palmtree,
  Building2,
  TrendingUp,
  MapPin,
} from "lucide-react"

const statusConfig: Record<string, { color: string; dot: string; label: string }> = {
  running: { color: "bg-green-100 text-green-700 border-green-200", dot: "bg-green-500 animate-pulse", label: "Running" },
  completed: { color: "bg-green-100 text-green-700 border-green-200", dot: "bg-green-500", label: "Completed" },
  failed: { color: "bg-red-100 text-red-700 border-red-200", dot: "bg-red-500", label: "Failed" },
  scheduled: { color: "bg-blue-100 text-blue-700 border-blue-200", dot: "bg-blue-500", label: "Scheduled" },
  paused: { color: "bg-yellow-100 text-yellow-700 border-yellow-200", dot: "bg-yellow-500", label: "Paused" },
}

const typeBadge: Record<string, string> = {
  api: "bg-blue-50 text-blue-700 border-blue-200",
  scraper: "bg-orange-50 text-orange-700 border-orange-200",
  "file-upload": "bg-gray-100 text-gray-700 border-gray-200",
  webhook: "bg-purple-50 text-purple-700 border-purple-200",
}

const marketFilters: { key: PipelineMarket | "all"; label: string; icon: React.ElementType }[] = [
  { key: "all", label: "All Markets", icon: Globe },
  { key: "general", label: "General", icon: Database },
  { key: "florida", label: "Florida", icon: Palmtree },
  { key: "puerto-rico", label: "Puerto Rico", icon: MapPin },
  { key: "dominican-republic", label: "Dominican Republic", icon: Building2 },
  { key: "buyer-signals", label: "Buyer Signals", icon: TrendingUp },
]

const marketLabels: Record<PipelineMarket, { label: string; color: string }> = {
  general: { label: "General", color: "bg-gray-100 text-gray-700 border-gray-200" },
  florida: { label: "Florida", color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  "puerto-rico": { label: "Puerto Rico", color: "bg-sky-50 text-sky-700 border-sky-200" },
  "dominican-republic": { label: "Dominican Republic", color: "bg-amber-50 text-amber-700 border-amber-200" },
  "buyer-signals": { label: "Buyer Signals", color: "bg-violet-50 text-violet-700 border-violet-200" },
}

const freshnessData = [
  { source: "ATTOM Properties", freshness: "2 hours ago", status: "green" },
  { source: "County Assessor", freshness: "3 days ago", status: "yellow" },
  { source: "Court Records", freshness: "1 hour ago", status: "green" },
  { source: "SEC Filings", freshness: "4 hours ago", status: "green" },
  { source: "MLS Feed", freshness: "FAILED", status: "red" },
  { source: "Building Permits", freshness: "1 day ago", status: "green" },
  { source: "Skip Trace", freshness: "1.5 hours ago", status: "green" },
  { source: "Satellite", freshness: "5 days ago", status: "yellow" },
  { source: "FL Clerk of Court", freshness: "1 hour ago", status: "green" },
  { source: "CRIM/KARIBE", freshness: "2 hours ago", status: "green" },
  { source: "Catastro Nacional", freshness: "4 hours ago", status: "green" },
  { source: "HMDA/CFPB", freshness: "4 hours ago", status: "green" },
]

const mockRunHistory = [
  { id: 1, startedAt: "May 19, 2026 02:00 AM", duration: "43m", records: 1248200, failed: 312, status: "completed" },
  { id: 2, startedAt: "May 18, 2026 02:00 AM", duration: "47m", records: 1251000, failed: 289, status: "completed" },
  { id: 3, startedAt: "May 17, 2026 02:00 AM", duration: "52m", records: 1245800, failed: 401, status: "completed" },
  { id: 4, startedAt: "May 16, 2026 02:00 AM", duration: "1h 02m", records: 1250100, failed: 1200, status: "completed" },
  { id: 5, startedAt: "May 15, 2026 02:00 AM", duration: "44m", records: 1247600, failed: 298, status: "completed" },
]

const mockErrors = [
  { time: "02:12 AM", message: "Connection timeout to ATTOM endpoint /property/detail after 30s", level: "WARN" },
  { time: "02:18 AM", message: "Rate limit 429 received, backing off 60s", level: "WARN" },
  { time: "02:34 AM", message: "Invalid property record skipped: missing parcel ID for APN 1234-567", level: "ERROR" },
  { time: "02:41 AM", message: "Duplicate record detected and merged: prop-892341", level: "INFO" },
]

function relativeTime(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

function futureTime(dateStr: string) {
  const diff = new Date(dateStr).getTime() - Date.now()
  if (diff < 0) return "Overdue"
  const hours = Math.floor(diff / 3600000)
  if (hours < 1) return `${Math.floor(diff / 60000)}m`
  if (hours < 24) return `${hours}h`
  return `${Math.floor(hours / 24)}d`
}

export default function DataPipelinePage() {
  const [pipelines, setPipelines] = useState<DataPipelineExtended[]>([])
  const [selectedPipeline, setSelectedPipeline] = useState<DataPipelineExtended | null>(null)
  const [marketFilter, setMarketFilter] = useState<PipelineMarket | "all">("all")

  useEffect(() => {
    const data = generatePipelines()
    setPipelines(data)
    setSelectedPipeline(data[0])
  }, [])

  const filteredPipelines = useMemo(() => {
    if (marketFilter === "all") return pipelines
    return pipelines.filter((p) => p.market === marketFilter)
  }, [pipelines, marketFilter])

  const activePipelines = pipelines.filter((p) => p.status === "running" || p.status === "completed" || p.status === "scheduled").length
  const totalProcessed = pipelines.reduce((sum, p) => sum + p.recordsProcessed, 0)
  const totalFailed = pipelines.reduce((sum, p) => sum + p.recordsFailed, 0)
  const failRate = totalProcessed > 0 ? ((totalFailed / totalProcessed) * 100).toFixed(2) : "0"

  // Group filtered pipelines by market for section headers
  const groupedPipelines = useMemo(() => {
    if (marketFilter !== "all") return [{ market: marketFilter as PipelineMarket, pipelines: filteredPipelines }]
    const groups: { market: PipelineMarket; pipelines: DataPipelineExtended[] }[] = []
    const marketOrder: PipelineMarket[] = ["general", "florida", "puerto-rico", "dominican-republic", "buyer-signals"]
    for (const m of marketOrder) {
      const items = filteredPipelines.filter((p) => p.market === m)
      if (items.length > 0) groups.push({ market: m, pipelines: items })
    }
    return groups
  }, [filteredPipelines, marketFilter])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Data Pipeline Monitor</h1>
          <p className="text-sm text-gray-500 mt-1">Monitor and manage data ingestion pipelines across all markets</p>
        </div>
        <Button className="gap-2 bg-red-600 hover:bg-red-700">
          <Play className="h-4 w-4" />
          Run All Pipelines
        </Button>
      </div>

      {/* Pipeline Health Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
              <Activity className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{activePipelines}/{pipelines.length}</p>
              <p className="text-xs text-gray-500">Pipelines Active</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
              <Database className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{formatNumber(totalProcessed)}</p>
              <p className="text-xs text-gray-500">Records Processed Today</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{formatNumber(totalFailed)}</p>
              <p className="text-xs text-gray-500">Failed Records ({failRate}%)</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100">
              <Clock className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">1h 42m</p>
              <p className="text-xs text-gray-500">Avg Pipeline Duration</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Market Filter Tabs */}
      <div className="flex items-center gap-2 flex-wrap">
        <Filter className="h-4 w-4 text-gray-400 mr-1" />
        {marketFilters.map((filter) => {
          const Icon = filter.icon
          const isActive = marketFilter === filter.key
          const count = filter.key === "all" ? pipelines.length : pipelines.filter((p) => p.market === filter.key).length
          return (
            <button
              key={filter.key}
              onClick={() => setMarketFilter(filter.key)}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-all ${
                isActive
                  ? "bg-red-600 text-white shadow-sm"
                  : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {filter.label}
              <span className={`text-[10px] rounded-full px-1.5 py-0.5 ${isActive ? "bg-red-700 text-white" : "bg-gray-100 text-gray-500"}`}>
                {count}
              </span>
            </button>
          )
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Pipeline Table */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">
                {marketFilter === "all" ? "All Pipelines" : marketLabels[marketFilter as PipelineMarket]?.label + " Pipelines"}
              </h3>
              <span className="text-xs text-gray-400">{filteredPipelines.length} pipelines</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Pipeline</th>
                    <th className="text-left py-3 px-3 font-medium text-gray-500">Type</th>
                    <th className="text-left py-3 px-3 font-medium text-gray-500">Market</th>
                    <th className="text-left py-3 px-3 font-medium text-gray-500">Last Run</th>
                    <th className="text-left py-3 px-3 font-medium text-gray-500">Next Run</th>
                    <th className="text-right py-3 px-3 font-medium text-gray-500">Processed</th>
                    <th className="text-right py-3 px-3 font-medium text-gray-500">Failed</th>
                    <th className="text-left py-3 px-3 font-medium text-gray-500">Duration</th>
                    <th className="w-20 py-3 px-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {groupedPipelines.map((group) => (
                    <>
                      {marketFilter === "all" && (
                        <tr key={`header-${group.market}`} className="bg-gray-50/80">
                          <td colSpan={9} className="py-2 px-4">
                            <div className="flex items-center gap-2">
                              <Badge className={`${marketLabels[group.market].color} text-[10px]`}>
                                {marketLabels[group.market].label}
                              </Badge>
                              <span className="text-[11px] text-gray-400">{group.pipelines.length} pipelines</span>
                            </div>
                          </td>
                        </tr>
                      )}
                      {group.pipelines.map((pipeline) => {
                        const errorRate = pipeline.recordsProcessed > 0
                          ? ((pipeline.recordsFailed / pipeline.recordsProcessed) * 100).toFixed(1)
                          : "0"
                        const sc = statusConfig[pipeline.status]
                        return (
                          <tr
                            key={pipeline.id}
                            className={`border-b border-gray-50 hover:bg-gray-50/50 transition-colors cursor-pointer ${selectedPipeline?.id === pipeline.id ? "bg-red-50/50" : ""}`}
                            onClick={() => setSelectedPipeline(pipeline)}
                          >
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2.5">
                                <div className={`h-2.5 w-2.5 rounded-full shrink-0 ${sc.dot}`} />
                                <div>
                                  <p className="font-medium text-gray-900 whitespace-nowrap">{pipeline.name}</p>
                                  <p className="text-[11px] text-gray-400">{pipeline.source}</p>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-3">
                              <Badge className={`${typeBadge[pipeline.type]} text-[10px] capitalize`}>
                                {pipeline.type}
                              </Badge>
                            </td>
                            <td className="py-3 px-3">
                              <Badge className={`${marketLabels[pipeline.market].color} text-[10px]`}>
                                {marketLabels[pipeline.market].label}
                              </Badge>
                            </td>
                            <td className="py-3 px-3 text-gray-500 text-xs whitespace-nowrap">{relativeTime(pipeline.lastRun)}</td>
                            <td className="py-3 px-3 text-gray-500 text-xs whitespace-nowrap">
                              {pipeline.nextRun ? futureTime(pipeline.nextRun) : "-"}
                            </td>
                            <td className="py-3 px-3 text-right text-gray-700 font-medium whitespace-nowrap">
                              {formatNumber(pipeline.recordsProcessed)}
                            </td>
                            <td className="py-3 px-3 text-right whitespace-nowrap">
                              <span className={pipeline.recordsFailed > 500 ? "text-red-600 font-medium" : "text-gray-500"}>
                                {formatNumber(pipeline.recordsFailed)}
                              </span>
                              <span className="text-[10px] text-gray-400 ml-1">({errorRate}%)</span>
                            </td>
                            <td className="py-3 px-3 text-gray-500 text-xs">{pipeline.avgDuration}</td>
                            <td className="py-3 px-3">
                              <div className="flex items-center gap-1">
                                <button className="rounded p-1 text-gray-400 hover:text-green-600 hover:bg-green-50" title="Run Now">
                                  <Play className="h-3.5 w-3.5" />
                                </button>
                                <button className="rounded p-1 text-gray-400 hover:text-yellow-600 hover:bg-yellow-50" title="Pause">
                                  <Pause className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        )
                      })}
                    </>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Data Freshness Dashboard */}
          <Card className="p-4">
            <h3 className="font-semibold text-gray-900 mb-4">Data Freshness</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {freshnessData.map((item) => (
                <div
                  key={item.source}
                  className={`rounded-lg border p-3 ${
                    item.status === "green"
                      ? "border-green-200 bg-green-50/50"
                      : item.status === "yellow"
                      ? "border-yellow-200 bg-yellow-50/50"
                      : "border-red-200 bg-red-50/50"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <div
                      className={`h-2 w-2 rounded-full ${
                        item.status === "green" ? "bg-green-500" : item.status === "yellow" ? "bg-yellow-500" : "bg-red-500"
                      }`}
                    />
                    <span className="text-xs font-medium text-gray-700">{item.source}</span>
                  </div>
                  <p
                    className={`text-sm font-semibold ${
                      item.status === "green" ? "text-green-700" : item.status === "yellow" ? "text-yellow-700" : "text-red-700"
                    }`}
                  >
                    {item.freshness}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Pipeline Detail Panel */}
        <div className="space-y-4">
          {selectedPipeline ? (
            <>
              <Card className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-gray-900">{selectedPipeline.name}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">{selectedPipeline.source}</p>
                  </div>
                  <Badge className={`${statusConfig[selectedPipeline.status].color} text-[11px]`}>
                    {statusConfig[selectedPipeline.status].label}
                  </Badge>
                </div>

                {/* Market + Description */}
                <div className="mb-3 p-2.5 rounded-lg bg-gray-50 border border-gray-100">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge className={`${marketLabels[selectedPipeline.market].color} text-[10px]`}>
                      {marketLabels[selectedPipeline.market].label}
                    </Badge>
                    <Badge className={`${typeBadge[selectedPipeline.type]} text-[10px] capitalize`}>
                      {selectedPipeline.type}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">{selectedPipeline.description}</p>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Schedule</span>
                    <span className="font-medium text-gray-900">{selectedPipeline.schedule}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Avg Duration</span>
                    <span className="font-medium text-gray-900">{selectedPipeline.avgDuration}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Last Run</span>
                    <span className="font-medium text-gray-900">{relativeTime(selectedPipeline.lastRun)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Records</span>
                    <span className="font-medium text-gray-900">{formatNumber(selectedPipeline.recordsProcessed)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Failed</span>
                    <span className={`font-medium ${selectedPipeline.recordsFailed > 500 ? "text-red-600" : "text-gray-900"}`}>
                      {formatNumber(selectedPipeline.recordsFailed)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Auth</span>
                    <span className="font-medium text-gray-900">API Key</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Rate Limit</span>
                    <span className="font-medium text-gray-900">100 req/s</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Retry Policy</span>
                    <span className="font-medium text-gray-900">3x exponential</span>
                  </div>
                </div>

                <div className="flex gap-2 mt-4">
                  <Button variant="outline" size="sm" className="flex-1 gap-1.5 text-xs">
                    <Play className="h-3.5 w-3.5" /> Run Now
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 gap-1.5 text-xs">
                    <Settings className="h-3.5 w-3.5" /> Configure
                  </Button>
                </div>
              </Card>

              {/* Run History */}
              <Card className="p-4">
                <h4 className="font-semibold text-gray-900 mb-3 text-sm">Run History</h4>
                <div className="space-y-2">
                  {mockRunHistory.map((run) => (
                    <div key={run.id} className="flex items-center justify-between py-1.5 border-b border-gray-50 last:border-0">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                        <div>
                          <p className="text-xs text-gray-700">{run.startedAt}</p>
                          <p className="text-[10px] text-gray-400">{run.duration} | {formatNumber(run.records)} records</p>
                        </div>
                      </div>
                      <span className="text-[10px] text-red-500">{run.failed} failed</span>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Error Log */}
              <Card className="p-4">
                <h4 className="font-semibold text-gray-900 mb-3 text-sm">Recent Errors</h4>
                <div className="space-y-2">
                  {mockErrors.map((err, i) => (
                    <div key={i} className="rounded bg-gray-50 p-2">
                      <div className="flex items-center gap-2 mb-0.5">
                        <Badge
                          className={`text-[9px] px-1 py-0 ${
                            err.level === "ERROR" ? "bg-red-100 text-red-700 border-red-200" :
                            err.level === "WARN" ? "bg-yellow-100 text-yellow-700 border-yellow-200" :
                            "bg-blue-100 text-blue-700 border-blue-200"
                          }`}
                        >
                          {err.level}
                        </Badge>
                        <span className="text-[10px] text-gray-400">{err.time}</span>
                      </div>
                      <p className="text-[11px] text-gray-600 leading-relaxed">{err.message}</p>
                    </div>
                  ))}
                </div>
              </Card>
            </>
          ) : (
            <Card className="p-8 text-center">
              <Database className="h-8 w-8 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-500">Select a pipeline to view details</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
