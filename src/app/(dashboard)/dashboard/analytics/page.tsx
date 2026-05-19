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
  TrendingUp,
  Users,
  MessageSquare,
  Calendar,
  Handshake,
  DollarSign,
  BarChart3,
  Bot,
  Search,
  FileText,
  Mail,
  Phone,
  Clock,
  Trophy,
  Target,
  ShoppingCart,
  Key,
  Globe,
} from "lucide-react"

type DateRange = "today" | "7d" | "30d" | "90d" | "custom"

const kpis = [
  {
    label: "Leads Generated",
    value: "4,281",
    change: "+23%",
    positive: true,
    icon: Users,
  },
  {
    label: "Contacted",
    value: "1,847",
    change: "+12%",
    positive: true,
    icon: MessageSquare,
  },
  {
    label: "Response Rate",
    value: "12.8%",
    change: "+2.3pp",
    positive: true,
    icon: TrendingUp,
  },
  {
    label: "Meetings",
    value: "67",
    change: "+34%",
    positive: true,
    icon: Calendar,
  },
  {
    label: "Deals Closed",
    value: "8",
    change: "+60%",
    positive: true,
    icon: Handshake,
  },
  {
    label: "Revenue Attributed",
    value: "$2.4M",
    change: "+18%",
    positive: true,
    icon: DollarSign,
  },
]

const monthlyVolume = [
  { month: "Jun", value: 65 },
  { month: "Jul", value: 72 },
  { month: "Aug", value: 58 },
  { month: "Sep", value: 80 },
  { month: "Oct", value: 74 },
  { month: "Nov", value: 88 },
  { month: "Dec", value: 62 },
  { month: "Jan", value: 91 },
  { month: "Feb", value: 85 },
  { month: "Mar", value: 95 },
  { month: "Apr", value: 78 },
  { month: "May", value: 100 },
]

const leadSources = [
  { name: "ATTOM API", pct: 35, color: "bg-blue-500" },
  { name: "County Scraper", pct: 25, color: "bg-indigo-500" },
  { name: "MLS Feed", pct: 18, color: "bg-purple-500" },
  { name: "Court Records", pct: 12, color: "bg-pink-500" },
  { name: "SEC Filings", pct: 5, color: "bg-orange-500" },
  { name: "User Upload", pct: 5, color: "bg-gray-400" },
]

const scoreDistribution = [
  { range: "90-100", count: 342, color: "bg-red-500", label: "Hot" },
  { range: "80-89", count: 891, color: "bg-orange-500", label: "Warm+" },
  { range: "70-79", count: 1204, color: "bg-yellow-500", label: "Warm" },
  { range: "60-69", count: 2340, color: "bg-blue-500", label: "Cool" },
  { range: "Below 60", count: 8070, color: "bg-gray-400", label: "Cold" },
]

const outreachChannels = [
  {
    channel: "Email",
    metrics: [
      { label: "Open Rate", value: 34 },
      { label: "Reply Rate", value: 8.2 },
    ],
  },
  {
    channel: "SMS",
    metrics: [
      { label: "Delivered", value: 92 },
      { label: "Reply Rate", value: 4.1 },
    ],
  },
  {
    channel: "Voice",
    metrics: [
      { label: "Connect", value: 67 },
      { label: "Meeting", value: 23 },
    ],
  },
  {
    channel: "Direct Mail",
    metrics: [
      { label: "Response", value: 2.1 },
    ],
  },
]

const territories = [
  { city: "Atlanta, GA", leads: 612, hot: 48, meetings: 12, deals: 2, conversion: 3.9 },
  { city: "Dallas, TX", leads: 541, hot: 42, meetings: 9, deals: 1, conversion: 3.1 },
  { city: "Miami, FL", leads: 498, hot: 55, meetings: 14, deals: 2, conversion: 4.4 },
  { city: "Houston, TX", leads: 467, hot: 31, meetings: 7, deals: 1, conversion: 2.8 },
  { city: "Phoenix, AZ", leads: 423, hot: 38, meetings: 8, deals: 1, conversion: 3.3 },
  { city: "Austin, TX", leads: 389, hot: 29, meetings: 6, deals: 0, conversion: 2.1 },
  { city: "Chicago, IL", leads: 356, hot: 27, meetings: 5, deals: 0, conversion: 1.9 },
  { city: "Los Angeles, CA", leads: 334, hot: 25, meetings: 3, deals: 0, conversion: 1.5 },
  { city: "Seattle, WA", leads: 341, hot: 24, meetings: 2, deals: 1, conversion: 2.9 },
  { city: "New York, NY", leads: 320, hot: 23, meetings: 1, deals: 0, conversion: 1.2 },
]

const aiUsage = [
  { label: "Searches", value: "2,340", icon: Search },
  { label: "Document Parses", value: "456", icon: FileText },
  { label: "Outreach Drafts", value: "1,203", icon: Mail },
  { label: "Voice Calls", value: "890", icon: Phone },
]

const leadTypeBreakdown = [
  { type: "Seller Leads", count: 7120, pct: 55, color: "bg-blue-500" },
  { type: "Buyer Leads", count: 3890, pct: 30, color: "bg-emerald-500" },
  { type: "Tenant Leads", count: 1837, pct: 15, color: "bg-purple-500" },
]

const marketPerformance = [
  {
    market: "Florida",
    flag: "US",
    leads: 6240,
    conversionRate: 4.2,
    avgScore: 71,
    pipelineValue: "$28.4M",
  },
  {
    market: "Puerto Rico",
    flag: "PR",
    leads: 3890,
    conversionRate: 3.8,
    avgScore: 68,
    pipelineValue: "$12.1M",
  },
  {
    market: "Dominican Republic",
    flag: "DR",
    leads: 2717,
    conversionRate: 3.1,
    avgScore: 64,
    pipelineValue: "$6.7M",
  },
]

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState<DateRange>("30d")

  const ranges: { label: string; value: DateRange }[] = [
    { label: "Today", value: "today" },
    { label: "7 Days", value: "7d" },
    { label: "30 Days", value: "30d" },
    { label: "90 Days", value: "90d" },
    { label: "Custom", value: "custom" },
  ]

  const scoreMax = Math.max(...scoreDistribution.map((s) => s.count))

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="text-sm text-gray-500 mt-1">
            Performance metrics and insights across your pipeline
          </p>
        </div>
        <div className="flex items-center gap-1 rounded-lg border border-gray-200 bg-white p-1">
          {ranges.map((r) => (
            <Button
              key={r.value}
              variant={dateRange === r.value ? "default" : "ghost"}
              size="sm"
              onClick={() => setDateRange(r.value)}
            >
              {r.label}
            </Button>
          ))}
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        {kpis.map((kpi) => (
          <Card key={kpi.label}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <kpi.icon className="h-4 w-4 text-gray-400" />
                <Badge
                  variant="success"
                  className="text-[10px] px-1.5 py-0"
                >
                  {kpi.change}
                </Badge>
              </div>
              <div className="mt-3">
                <p className="text-2xl font-bold text-gray-900">{kpi.value}</p>
                <p className="text-xs text-gray-500 mt-0.5">{kpi.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts 2x2 Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Lead Volume Over Time */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-base">
              <BarChart3 className="h-4 w-4 text-blue-500" />
              Lead Volume Over Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-2 h-48">
              {monthlyVolume.map((m) => (
                <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full relative" style={{ height: "180px" }}>
                    <div
                      className="absolute bottom-0 w-full rounded-t-sm bg-gradient-to-t from-blue-600 to-blue-400 transition-all duration-500"
                      style={{ height: `${m.value}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-gray-500">{m.month}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Lead Sources Breakdown */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-base">Lead Sources Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {leadSources.map((src) => (
                <div key={src.name} className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-700">{src.name}</span>
                    <span className="font-medium text-gray-900">{src.pct}%</span>
                  </div>
                  <div className="h-2.5 w-full rounded-full bg-gray-100">
                    <div
                      className={`h-full rounded-full ${src.color} transition-all duration-500`}
                      style={{ width: `${src.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Score Distribution */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-base">Score Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {scoreDistribution.map((s) => (
                <div key={s.range} className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-700">{s.range}</span>
                      <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                        {s.label}
                      </Badge>
                    </div>
                    <span className="font-medium text-gray-900">
                      {s.count.toLocaleString()}
                    </span>
                  </div>
                  <div className="h-2.5 w-full rounded-full bg-gray-100">
                    <div
                      className={`h-full rounded-full ${s.color} transition-all duration-500`}
                      style={{ width: `${(s.count / scoreMax) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Outreach Channel Performance */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-base">Outreach Channel Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {outreachChannels.map((ch) => (
                <div key={ch.channel} className="space-y-2">
                  <p className="text-sm font-medium text-gray-900">{ch.channel}</p>
                  <div className="space-y-1.5">
                    {ch.metrics.map((m) => (
                      <div key={m.label} className="flex items-center gap-3">
                        <span className="text-xs text-gray-500 w-20">{m.label}</span>
                        <div className="flex-1 h-2 rounded-full bg-gray-100">
                          <div
                            className="h-full rounded-full bg-blue-500 transition-all duration-500"
                            style={{ width: `${m.value}%` }}
                          />
                        </div>
                        <span className="text-xs font-medium text-gray-700 w-10 text-right">
                          {m.value}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* New Metric Cards Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <Clock className="h-4 w-4 text-gray-400" />
              <Badge variant="success" className="text-[10px] px-1.5 py-0">
                -18%
              </Badge>
            </div>
            <div className="mt-3">
              <p className="text-2xl font-bold text-gray-900">2.4 hrs</p>
              <p className="text-xs text-gray-500 mt-0.5">Time to First Contact</p>
              <p className="text-[10px] text-gray-400 mt-1">Average time from lead creation to first outreach</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <Trophy className="h-4 w-4 text-gray-400" />
              <Badge variant="success" className="text-[10px] px-1.5 py-0">
                +8pp
              </Badge>
            </div>
            <div className="mt-3">
              <p className="text-2xl font-bold text-gray-900">73%</p>
              <p className="text-xs text-gray-500 mt-0.5">First-to-Contact Win Rate</p>
              <p className="text-[10px] text-gray-400 mt-1">Deals won when you are the first agent to contact the lead</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lead Type Breakdown + Market Performance */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Lead Type Breakdown */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-base flex items-center gap-2">
              <Target className="h-4 w-4 text-blue-500" />
              Lead Type Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-5">
              {leadTypeBreakdown.map((item) => (
                <div key={item.type} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      {item.type === "Seller Leads" && <Target className="h-3.5 w-3.5 text-blue-500" />}
                      {item.type === "Buyer Leads" && <ShoppingCart className="h-3.5 w-3.5 text-emerald-500" />}
                      {item.type === "Tenant Leads" && <Key className="h-3.5 w-3.5 text-purple-500" />}
                      <span className="text-gray-700">{item.type}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-gray-500 text-xs">{item.count.toLocaleString()}</span>
                      <span className="font-medium text-gray-900 w-10 text-right">{item.pct}%</span>
                    </div>
                  </div>
                  <div className="h-4 w-full rounded-full bg-gray-100">
                    <div
                      className={`h-full rounded-full ${item.color} transition-all duration-500`}
                      style={{ width: `${item.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            {/* Stacked bar summary */}
            <div className="mt-6">
              <p className="text-xs text-gray-500 mb-2">Combined Distribution</p>
              <div className="flex h-6 w-full overflow-hidden rounded-full">
                {leadTypeBreakdown.map((item) => (
                  <div
                    key={item.type}
                    className={`${item.color} transition-all duration-500`}
                    style={{ width: `${item.pct}%` }}
                    title={`${item.type}: ${item.pct}%`}
                  />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Market Performance Comparison */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-base flex items-center gap-2">
              <Globe className="h-4 w-4 text-blue-500" />
              Market Performance Comparison
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              {marketPerformance.map((mkt) => (
                <div
                  key={mkt.market}
                  className="rounded-lg border border-gray-200 p-3 space-y-3"
                >
                  <div className="text-center">
                    <p className="text-sm font-semibold text-gray-900">{mkt.market}</p>
                    <p className="text-[10px] text-gray-400">{mkt.flag}</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-gray-500">Leads</span>
                      <span className="text-xs font-semibold text-gray-900">{mkt.leads.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-gray-500">Conv. Rate</span>
                      <span className="text-xs font-semibold text-gray-900">{mkt.conversionRate}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-gray-500">Avg Score</span>
                      <span className="text-xs font-semibold text-gray-900">{mkt.avgScore}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-gray-500">Pipeline</span>
                      <span className="text-xs font-semibold text-gray-900">{mkt.pipelineValue}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Top Performing Territories */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Top Performing Territories</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>City</TableHead>
                  <TableHead className="text-right">Leads</TableHead>
                  <TableHead className="text-right">Hot Leads</TableHead>
                  <TableHead className="text-right">Meetings</TableHead>
                  <TableHead className="text-right">Deals</TableHead>
                  <TableHead className="text-right">Conv. Rate</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {territories.map((t) => (
                  <TableRow key={t.city}>
                    <TableCell className="font-medium">{t.city}</TableCell>
                    <TableCell className="text-right">{t.leads}</TableCell>
                    <TableCell className="text-right">
                      <Badge variant="destructive" className="text-[10px] px-1.5 py-0">
                        {t.hot}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">{t.meetings}</TableCell>
                    <TableCell className="text-right">{t.deals}</TableCell>
                    <TableCell className="text-right">
                      <span
                        className={
                          t.conversion >= 3.5
                            ? "text-green-600 font-medium"
                            : "text-gray-700"
                        }
                      >
                        {t.conversion}%
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* AI Agent Usage */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Bot className="h-4 w-4 text-purple-500" />
              AI Agent Usage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {aiUsage.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center gap-3 rounded-lg border border-gray-100 p-3"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50">
                    <item.icon className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-gray-900">{item.value}</p>
                    <p className="text-xs text-gray-500">{item.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
