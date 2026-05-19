"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { formatCurrency } from "@/lib/utils"
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Server,
  Database,
  Search,
  Cpu,
  Mic,
  Globe,
  HardDrive,
  Mail,
  Wifi,
  RefreshCw,
  FileText,
  Clock,
  Shield,
} from "lucide-react"

type ServiceStatus = "operational" | "degraded" | "down"

interface Service {
  name: string
  provider: string
  status: ServiceStatus
  metric: string
  metricLabel: string
  icon: typeof Server
}

const services: Service[] = [
  { name: "API Server", provider: "Vercel", status: "operational", metric: "145ms", metricLabel: "avg latency", icon: Server },
  { name: "Database", provider: "Neon", status: "operational", metric: "12ms", metricLabel: "avg query", icon: Database },
  { name: "Search", provider: "Typesense", status: "operational", metric: "8ms", metricLabel: "avg query", icon: Search },
  { name: "AI Pipeline", provider: "Inngest", status: "operational", metric: "2.1s", metricLabel: "avg job", icon: Cpu },
  { name: "Voice AI", provider: "Retell", status: "operational", metric: "620ms", metricLabel: "latency", icon: Mic },
  { name: "Scraping", provider: "Browserbase", status: "degraded", metric: "3 queued", metricLabel: "jobs", icon: Globe },
  { name: "Cache", provider: "Upstash", status: "operational", metric: "1ms", metricLabel: "avg", icon: Wifi },
  { name: "Storage", provider: "R2", status: "operational", metric: "45ms", metricLabel: "avg", icon: HardDrive },
  { name: "Email", provider: "Resend", status: "operational", metric: "1.2s", metricLabel: "avg send", icon: Mail },
]

const statusConfig: Record<ServiceStatus, { bg: string; text: string; icon: typeof CheckCircle2; label: string; dot: string }> = {
  operational: { bg: "bg-green-50 border-green-200", text: "text-green-700", icon: CheckCircle2, label: "Operational", dot: "bg-green-500" },
  degraded: { bg: "bg-yellow-50 border-yellow-200", text: "text-yellow-700", icon: AlertTriangle, label: "Degraded", dot: "bg-yellow-500 animate-pulse" },
  down: { bg: "bg-red-50 border-red-200", text: "text-red-700", icon: XCircle, label: "Down", dot: "bg-red-500 animate-pulse" },
}

const resourceUsage = [
  { name: "Database", used: 2.4, total: 10, unit: "GB", color: "bg-blue-600" },
  { name: "Vector Store", used: 48, total: 100, unit: "GB", detail: "26M embeddings", color: "bg-purple-600" },
  { name: "Document Storage", used: 234, total: 1000, unit: "GB", color: "bg-indigo-600" },
  { name: "Cache", used: 1.2, total: 5, unit: "GB", color: "bg-green-600" },
  { name: "API Rate Limit", used: 12.5, total: 50, unit: "M monthly", color: "bg-orange-600" },
]

const errorLog = [
  { message: "MLS Feed connection timeout", level: "ERROR" as const, time: "30m ago", source: "CoreLogic Trestle" },
  { message: "Browserbase scraper rate limited", level: "WARN" as const, time: "1h ago", source: "Browserbase" },
  { message: "Voice AI call dropped - network", level: "ERROR" as const, time: "2h ago", source: "Retell AI" },
  { message: "Document parse OOM on 500-page PDF", level: "ERROR" as const, time: "3h ago", source: "AI Pipeline" },
  { message: "ATTOM API 429 - rate limit reached", level: "WARN" as const, time: "5h ago", source: "ATTOM Data" },
]

const levelConfig = {
  ERROR: { color: "bg-red-100 text-red-700 border-red-200", icon: XCircle },
  WARN: { color: "bg-yellow-100 text-yellow-700 border-yellow-200", icon: AlertTriangle },
  INFO: { color: "bg-blue-100 text-blue-700 border-blue-200", icon: CheckCircle2 },
}

const infraCosts = [
  { name: "Vercel", cost: 320 },
  { name: "Neon DB", cost: 89 },
  { name: "Upstash Redis", cost: 20 },
  { name: "Cloudflare R2", cost: 45 },
  { name: "AI/LLM (all providers)", cost: 22440 },
  { name: "ATTOM Data", cost: 8500 },
  { name: "CoreLogic", cost: 4200 },
  { name: "Browserbase", cost: 99 },
  { name: "Other APIs", cost: 3200 },
]

const totalInfraCost = infraCosts.reduce((s, c) => s + c.cost, 0)

export default function SystemPage() {
  const degradedCount = services.filter((s) => s.status !== "operational").length
  const allOperational = degradedCount === 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">System Health</h1>
          <p className="text-sm text-gray-500 mt-1">Infrastructure monitoring, error logs, and cost breakdown</p>
        </div>
        <Button variant="outline" size="sm" className="gap-1.5 text-xs">
          <RefreshCw className="h-3.5 w-3.5" /> Refresh Status
        </Button>
      </div>

      {/* System Status Banner */}
      {allOperational ? (
        <div className="flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 p-4">
          <CheckCircle2 className="h-5 w-5 text-green-600" />
          <div>
            <p className="font-semibold text-green-800">All Systems Operational</p>
            <p className="text-sm text-green-600">All {services.length} services are running normally</p>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-3 rounded-lg border border-yellow-200 bg-yellow-50 p-4">
          <AlertTriangle className="h-5 w-5 text-yellow-600" />
          <div>
            <p className="font-semibold text-yellow-800">{degradedCount} System{degradedCount > 1 ? "s" : ""} Degraded</p>
            <p className="text-sm text-yellow-600">
              {services.filter((s) => s.status !== "operational").map((s) => s.name).join(", ")}
            </p>
          </div>
        </div>
      )}

      {/* Service Status Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {services.map((service) => {
          const sc = statusConfig[service.status]
          const StatusIcon = sc.icon
          return (
            <Card key={service.name} className={`p-4 border ${sc.bg}`}>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${service.status === "operational" ? "bg-green-100" : service.status === "degraded" ? "bg-yellow-100" : "bg-red-100"}`}>
                    <service.icon className={`h-5 w-5 ${sc.text}`} />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{service.name}</p>
                    <p className="text-xs text-gray-500">{service.provider}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className={`h-2 w-2 rounded-full ${sc.dot}`} />
                  <span className={`text-xs font-medium ${sc.text}`}>{sc.label}</span>
                </div>
              </div>
              <div className="mt-3 flex items-baseline gap-1.5">
                <span className="text-lg font-bold text-gray-900">{service.metric}</span>
                <span className="text-xs text-gray-500">{service.metricLabel}</span>
              </div>
            </Card>
          )
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Resource Usage */}
        <Card className="p-6">
          <h3 className="font-semibold text-gray-900 mb-1">Resource Usage</h3>
          <p className="text-xs text-gray-500 mb-5">Current consumption across infrastructure</p>
          <div className="space-y-5">
            {resourceUsage.map((r) => {
              const pct = (r.used / r.total) * 100
              return (
                <div key={r.name}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-medium text-gray-700">{r.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-gray-900">
                        {r.used}{r.unit === "M monthly" ? "M" : r.unit}
                      </span>
                      <span className="text-xs text-gray-400">/ {r.total}{r.unit === "M monthly" ? "M" : r.unit}</span>
                    </div>
                  </div>
                  <Progress
                    value={pct}
                    max={100}
                    className="h-2.5"
                    indicatorClassName={pct > 80 ? "bg-red-500" : pct > 60 ? "bg-yellow-500" : r.color}
                  />
                  {r.detail && <p className="text-[11px] text-gray-400 mt-1">{r.detail}</p>}
                </div>
              )
            })}
          </div>
        </Card>

        {/* Error Log */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-gray-900">Error Log</h3>
              <p className="text-xs text-gray-500">Recent errors and warnings</p>
            </div>
            <Button variant="outline" size="sm" className="text-xs gap-1.5">
              <FileText className="h-3.5 w-3.5" /> View All
            </Button>
          </div>
          <div className="space-y-3">
            {errorLog.map((err, i) => {
              const lc = levelConfig[err.level]
              const LevelIcon = lc.icon
              return (
                <div key={i} className="rounded-lg border border-gray-100 bg-gray-50/50 p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <LevelIcon className={`h-3.5 w-3.5 ${err.level === "ERROR" ? "text-red-500" : "text-yellow-500"}`} />
                    <Badge className={`${lc.color} text-[9px] px-1.5 py-0`}>{err.level}</Badge>
                    <span className="text-[11px] text-gray-400 ml-auto flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {err.time}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700">{err.message}</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">Source: {err.source}</p>
                </div>
              )
            })}
          </div>
        </Card>
      </div>

      {/* Infrastructure Costs */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-gray-900">Infrastructure Costs</h3>
            <p className="text-xs text-gray-500">Monthly spend breakdown by service</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Total Monthly</p>
            <p className="text-xl font-bold text-gray-900">~{formatCurrency(totalInfraCost)}/mo</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {infraCosts.map((item) => {
            const pctOfTotal = (item.cost / totalInfraCost) * 100
            return (
              <div key={item.name} className="flex items-center justify-between rounded-lg border border-gray-100 p-3">
                <div>
                  <p className="text-sm font-medium text-gray-900">{item.name}</p>
                  <p className="text-[11px] text-gray-400">{pctOfTotal.toFixed(1)}% of total</p>
                </div>
                <p className={`font-semibold ${item.cost > 5000 ? "text-red-600" : item.cost > 1000 ? "text-yellow-700" : "text-gray-900"}`}>
                  {formatCurrency(item.cost)}/mo
                </p>
              </div>
            )
          })}
        </div>

        {/* Cost breakdown bar */}
        <div className="mt-4">
          <div className="flex rounded-lg overflow-hidden h-6">
            {infraCosts.map((item, i) => {
              const pct = (item.cost / totalInfraCost) * 100
              const colors = [
                "bg-blue-500", "bg-green-500", "bg-teal-500", "bg-cyan-500",
                "bg-purple-600", "bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-gray-500"
              ]
              return (
                <div
                  key={item.name}
                  className={`${colors[i]} transition-all`}
                  style={{ width: `${pct}%` }}
                  title={`${item.name}: ${formatCurrency(item.cost)}`}
                />
              )
            })}
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
            {infraCosts.map((item, i) => {
              const colors = [
                "bg-blue-500", "bg-green-500", "bg-teal-500", "bg-cyan-500",
                "bg-purple-600", "bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-gray-500"
              ]
              return (
                <div key={item.name} className="flex items-center gap-1.5">
                  <div className={`h-2.5 w-2.5 rounded-sm ${colors[i]}`} />
                  <span className="text-[11px] text-gray-500">{item.name}</span>
                </div>
              )
            })}
          </div>
        </div>
      </Card>
    </div>
  )
}
