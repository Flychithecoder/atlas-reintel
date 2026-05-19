"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Code,
  Key,
  Copy,
  RefreshCw,
  BarChart3,
  Globe,
  Shield,
  Zap,
  Clock,
  CheckCircle,
  Activity,
  Users,
  DollarSign,
  Terminal,
  ArrowUpRight,
  Eye,
  EyeOff,
  ChevronRight,
  Search,
  FileText,
  Send,
} from "lucide-react"
import { cn, formatCurrency, formatNumber } from "@/lib/utils"

/* ------------------------------------------------------------------ */
/*  Mock Data                                                          */
/* ------------------------------------------------------------------ */

const usageStats = [
  { label: "API Calls This Month", value: "12,847", max: "50,000", pct: 25.7, icon: BarChart3, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-950/40" },
  { label: "Rate Limit", value: "100", unit: "req/min", icon: Zap, color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-950/40" },
  { label: "Avg Response Time", value: "145", unit: "ms", icon: Clock, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-950/40" },
  { label: "Uptime", value: "99.97", unit: "%", icon: Activity, color: "text-violet-600 dark:text-violet-400", bg: "bg-violet-50 dark:bg-violet-950/40" },
]

const dailyUsage = [
  { day: "Mon", calls: 2134 },
  { day: "Tue", calls: 1856 },
  { day: "Wed", calls: 2410 },
  { day: "Thu", calls: 1998 },
  { day: "Fri", calls: 1643 },
  { day: "Sat", calls: 987 },
  { day: "Sun", calls: 819 },
]

const endpoints = [
  {
    method: "GET" as const,
    path: "/api/v1/leads",
    description: "Search and filter leads by location, score, signals",
    category: "Leads",
  },
  {
    method: "POST" as const,
    path: "/api/v1/enrich",
    description: "Enrich a property with owner data, signals, and scoring",
    category: "Enrichment",
  },
  {
    method: "GET" as const,
    path: "/api/v1/signals",
    description: "Real-time pre-market signal feed",
    category: "Signals",
  },
  {
    method: "GET" as const,
    path: "/api/v1/owners/{id}",
    description: "Full owner dossier with LLC unwrapping",
    category: "Owners",
  },
  {
    method: "POST" as const,
    path: "/api/v1/outreach",
    description: "Queue outreach campaign via API",
    category: "Outreach",
  },
]

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function getMethodBadge(method: "GET" | "POST") {
  return method === "GET"
    ? "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-300 dark:border-emerald-800"
    : "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/40 dark:text-blue-300 dark:border-blue-800"
}

/* ------------------------------------------------------------------ */
/*  Page Component                                                     */
/* ------------------------------------------------------------------ */

export default function ApiPage() {
  const [showKey, setShowKey] = useState(false)
  const [copied, setCopied] = useState(false)

  const maxCalls = Math.max(...dailyUsage.map((d) => d.calls))

  function handleCopy() {
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex flex-col gap-8 p-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-1">
          <div className="flex items-center justify-center h-9 w-9 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 text-white">
            <Code className="h-5 w-5" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">API Access</h1>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 ml-12">
          Integrate ATLAS intelligence into your applications
        </p>
      </div>

      {/* API Key Management */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-base">
            <Key className="h-4 w-4 text-amber-500" />
            API Key Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex-1">
              {/* Key Display */}
              <div className="flex items-center gap-3 mb-3">
                <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2.5 font-mono text-sm text-gray-700 dark:text-gray-300 flex-1 max-w-lg">
                  <Terminal className="h-4 w-4 text-gray-400 shrink-0" />
                  {showKey ? "atlas_live_a8f2k9m3x7p1q4w6n0b5v2c8j" : "atlas_live_•••••••••••••k3j7"}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowKey(!showKey)}
                  className="shrink-0"
                >
                  {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopy}
                  className="shrink-0"
                >
                  {copied ? <CheckCircle className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                  {copied ? "Copied" : "Copy"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="shrink-0 text-amber-600 hover:text-amber-700 dark:text-amber-400"
                >
                  <RefreshCw className="h-4 w-4" />
                  Regenerate
                </Button>
              </div>

              {/* Key Metadata */}
              <div className="flex items-center gap-6 text-xs text-gray-500 dark:text-gray-400">
                <span className="flex items-center gap-1.5">
                  <Clock className="h-3 w-3" />
                  Created: Jan 15, 2026
                </span>
                <span className="flex items-center gap-1.5">
                  <Activity className="h-3 w-3" />
                  Last used: 2 minutes ago
                </span>
                <Badge variant="success" className="text-[10px] px-1.5 py-0">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 mr-1 inline-block" />
                  Active
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Usage Dashboard Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {usageStats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={cn("flex items-center justify-center h-10 w-10 rounded-lg", stat.bg)}>
                  <stat.icon className={cn("h-5 w-5", stat.color)} />
                </div>
                <div className="min-w-0">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {stat.value}
                    </span>
                    {stat.max && (
                      <span className="text-xs text-gray-400">/ {stat.max}</span>
                    )}
                    {stat.unit && (
                      <span className="text-xs text-gray-500 dark:text-gray-400">{stat.unit}</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{stat.label}</p>
                </div>
              </div>
              {stat.pct != null && (
                <div className="mt-3">
                  <div className="h-1.5 w-full rounded-full bg-gray-100 dark:bg-gray-800">
                    <div
                      className="h-full rounded-full bg-blue-500 transition-all duration-500"
                      style={{ width: `${stat.pct}%` }}
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Usage Chart + Revenue Tracking side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Usage Chart */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-base">
              <BarChart3 className="h-4 w-4 text-blue-500" />
              API Calls &mdash; Last 7 Days
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-3 h-52">
              {dailyUsage.map((d) => (
                <div key={d.day} className="flex-1 flex flex-col items-center gap-2">
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                    {formatNumber(d.calls)}
                  </span>
                  <div className="w-full relative" style={{ height: "160px" }}>
                    <div
                      className="absolute bottom-0 w-full rounded-t-md bg-gradient-to-t from-blue-600 to-indigo-400 transition-all duration-500 hover:from-blue-500 hover:to-indigo-300"
                      style={{ height: `${(d.calls / maxCalls) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">{d.day}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Revenue Tracking */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-base">
              <DollarSign className="h-4 w-4 text-emerald-500" />
              Revenue Tracking
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-5">
              <div className="flex items-center gap-3 rounded-lg border border-gray-100 dark:border-gray-800 p-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-950/40">
                  <DollarSign className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{formatCurrency(12400)}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Monthly API Revenue</p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-lg border border-gray-100 dark:border-gray-800 p-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-950/40">
                  <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">23</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Active API Customers</p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-lg border border-gray-100 dark:border-gray-800 p-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-violet-50 dark:bg-violet-950/40">
                  <ArrowUpRight className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{formatCurrency(539)}<span className="text-sm font-normal text-gray-500 dark:text-gray-400">/mo</span></p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Avg Revenue per Customer</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Endpoints Documentation */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">API Endpoints</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Core endpoints for integrating ATLAS data
            </p>
          </div>
          <Button variant="outline" size="sm">
            <FileText className="h-4 w-4" />
            Full Documentation
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {endpoints.map((ep) => (
            <Card key={ep.path} className="group hover:shadow-sm transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  {/* Method Badge */}
                  <span className={cn(
                    "inline-flex items-center justify-center w-16 h-7 rounded-md text-xs font-bold border shrink-0",
                    getMethodBadge(ep.method)
                  )}>
                    {ep.method}
                  </span>

                  {/* Path */}
                  <code className="font-mono text-sm font-medium text-gray-900 dark:text-gray-100 shrink-0">
                    {ep.path}
                  </code>

                  {/* Separator */}
                  <div className="hidden sm:block h-4 w-px bg-gray-200 dark:bg-gray-700 shrink-0" />

                  {/* Description */}
                  <p className="text-sm text-gray-500 dark:text-gray-400 flex-1 min-w-0">
                    {ep.description}
                  </p>

                  {/* Category Badge */}
                  <Badge variant="secondary" className="text-[10px] px-2 py-0 shrink-0 hidden md:inline-flex">
                    {ep.category}
                  </Badge>

                  {/* Arrow */}
                  <ChevronRight className="h-4 w-4 text-gray-300 dark:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Quick Start Snippet */}
      <Card className="border-dashed border-gray-300 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 text-white shrink-0">
              <Terminal className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">Quick Start</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                Make your first API call in seconds
              </p>
              <div className="bg-gray-900 dark:bg-black rounded-lg p-4 font-mono text-xs text-gray-300 overflow-x-auto">
                <div className="text-gray-500">{"# Search for pre-market leads in Miami"}</div>
                <div className="mt-1">
                  <span className="text-emerald-400">curl</span>
                  {" -H "}
                  <span className="text-amber-300">{'"Authorization: Bearer atlas_live_..."'}</span>
                  {" \\"}
                </div>
                <div className="ml-4">
                  <span className="text-blue-300">{"https://api.atlas.re/v1/leads?city=Miami&min_score=70"}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
