"use client"

import { useMemo, useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { StatsCard } from "@/components/dashboard/stats-card"
import { ActivityFeed } from "@/components/dashboard/activity-feed"
import { LeadTypeTabs } from "@/components/shared/lead-type-tabs"
import { AgentMarketFilter } from "@/components/shared/agent-market-filter"
import {
  generateLeads,
  generateDashboardStats,
  generateCampaigns,
} from "@/hooks/use-mock-data"
import { cn, formatCurrency } from "@/lib/utils"
import {
  Users,
  Flame,
  DollarSign,
  TrendingUp,
  Eye,
  Phone as PhoneIcon,
  Mail,
  MessageSquare,
  Printer,
  MoreHorizontal,
  Pause,
  Play,
  BarChart3,
  Target,
  ShoppingCart,
  Key,
  AlertTriangle,
  Clock,
  ArrowRight,
} from "lucide-react"
import type { OutreachCampaign } from "@/types"

const scoreDistribution = [
  { range: "90-100", count: 127, color: "bg-red-500" },
  { range: "80-89", count: 215, color: "bg-red-400" },
  { range: "70-79", count: 489, color: "bg-orange-400" },
  { range: "60-69", count: 843, color: "bg-yellow-400" },
  { range: "50-59", count: 1417, color: "bg-blue-400" },
  { range: "40-49", count: 2150, color: "bg-blue-300" },
  { range: "30-39", count: 3890, color: "bg-gray-400" },
  { range: "< 30", count: 3716, color: "bg-gray-300" },
]

const maxDistCount = Math.max(...scoreDistribution.map((s) => s.count))

const outreachMetrics = [
  {
    channel: "Email",
    icon: Mail,
    color: "text-blue-600",
    bg: "bg-blue-50",
    sent: 2340,
    metric1Label: "Open Rate",
    metric1: "34%",
    metric2Label: "Reply Rate",
    metric2: "8.2%",
  },
  {
    channel: "SMS",
    icon: MessageSquare,
    color: "text-green-600",
    bg: "bg-green-50",
    sent: 890,
    metric1Label: "Delivered",
    metric1: "92%",
    metric2Label: "Reply Rate",
    metric2: "4.1%",
  },
  {
    channel: "Voice AI",
    icon: PhoneIcon,
    color: "text-purple-600",
    bg: "bg-purple-50",
    sent: 156,
    metric1Label: "Connect",
    metric1: "67%",
    metric2Label: "Meetings",
    metric2: "12",
  },
  {
    channel: "Direct Mail",
    icon: Printer,
    color: "text-orange-600",
    bg: "bg-orange-50",
    sent: 500,
    metric1Label: "Delivered",
    metric1: "98%",
    metric2Label: "Response",
    metric2: "2.1%",
  },
]

const campaignStatusColors: Record<
  OutreachCampaign["status"],
  string
> = {
  draft: "bg-gray-100 text-gray-700",
  active: "bg-green-100 text-green-700",
  paused: "bg-yellow-100 text-yellow-700",
  completed: "bg-blue-100 text-blue-700",
}

const campaignTypeIcons: Record<
  OutreachCampaign["type"],
  typeof Mail
> = {
  email: Mail,
  sms: MessageSquare,
  voice: PhoneIcon,
  "direct-mail": Printer,
  linkedin: Users,
}

const markets = [
  { key: "all", label: "All Markets" },
  { key: "us", label: "US", flag: "🇺🇸" },
  { key: "pr", label: "Puerto Rico", flag: "🇵🇷" },
  { key: "do", label: "Dominican Republic", flag: "🇩🇴" },
] as const

type LeadTab = "all" | "seller" | "buyer" | "tenant"

const statsByTab: Record<LeadTab, { totalLeads: number; hotLeads: number; pipelineValue: number; responseRate: number }> = {
  all:    { totalLeads: 12847, hotLeads: 342,  pipelineValue: 47_200_000, responseRate: 12.8 },
  seller: { totalLeads: 7120,  hotLeads: 215,  pipelineValue: 31_500_000, responseRate: 14.2 },
  buyer:  { totalLeads: 3890,  hotLeads: 89,   pipelineValue: 11_800_000, responseRate: 10.1 },
  tenant: { totalLeads: 1837,  hotLeads: 38,   pipelineValue: 3_900_000,  responseRate: 9.7  },
}

const priorityLeadsByTab: Record<LeadTab, { name: string; address: string; score: number; signal: string; signalType: "distress" | "financial" | "behavioral" | "life-event" | "market"; urgency: string }[]> = {
  all: [
    { name: "Meridian Capital LLC", address: "1200 Brickell Ave, Miami FL", score: 94, signal: "Lis Pendens Filed", signalType: "distress", urgency: "Act today" },
    { name: "Rodriguez Family Trust", address: "Calle Luna 45, San Juan PR", score: 91, signal: "CRIM Delinquent 3yr", signalType: "financial", urgency: "This week" },
    { name: "Sarah Chen", address: "8901 Collins Ave, Surfside FL", score: 88, signal: "Divorce Filing", signalType: "life-event", urgency: "Act today" },
    { name: "Punta Cana Resorts SRL", address: "Blvd Turistico, Bavaro DR", score: 85, signal: "CONFOTUR Expiring", signalType: "market", urgency: "30 days" },
  ],
  seller: [
    { name: "Meridian Capital LLC", address: "1200 Brickell Ave, Miami FL", score: 94, signal: "Lis Pendens Filed", signalType: "distress", urgency: "Act today" },
    { name: "Rodriguez Family Trust", address: "Calle Luna 45, San Juan PR", score: 91, signal: "CRIM Delinquent 3yr", signalType: "financial", urgency: "This week" },
    { name: "Sarah Chen", address: "8901 Collins Ave, Surfside FL", score: 88, signal: "Divorce Filing", signalType: "life-event", urgency: "Act today" },
    { name: "Punta Cana Resorts SRL", address: "Blvd Turistico, Bavaro DR", score: 85, signal: "CONFOTUR Expiring", signalType: "market", urgency: "30 days" },
    { name: "Atlantic Holdings Corp", address: "500 SE 2nd St, Fort Lauderdale FL", score: 82, signal: "Pre-Foreclosure", signalType: "distress", urgency: "This week" },
  ],
  buyer: [
    { name: "Apex Capital Partners", address: "Seeking: Miami-Dade Multifamily", score: 92, signal: "1031 Deadline in 45d", signalType: "financial", urgency: "Act today" },
    { name: "James Morrison", address: "Seeking: San Juan Commercial", score: 87, signal: "Pre-Approved $2.5M", signalType: "financial", urgency: "This week" },
    { name: "Caribbean Ventures LLC", address: "Seeking: Punta Cana Hotels", score: 84, signal: "Active Buyer Tour", signalType: "behavioral", urgency: "This week" },
    { name: "Jennifer Walsh", address: "Seeking: Broward SFR Portfolio", score: 79, signal: "Cash Buyer Verified", signalType: "financial", urgency: "30 days" },
  ],
  tenant: [
    { name: "TechFlow Inc", address: "Seeking: 15K+ sqft Class A, Miami", score: 90, signal: "Lease Expiring 60d", signalType: "market", urgency: "Act today" },
    { name: "Isla Medical Group", address: "Seeking: 8K sqft, San Juan", score: 86, signal: "Expansion Planned", signalType: "behavioral", urgency: "This week" },
    { name: "Blue Ocean Retail", address: "Seeking: Retail Space, Bavaro DR", score: 81, signal: "New Market Entry", signalType: "market", urgency: "30 days" },
  ],
}

export default function DashboardPage() {
  const [activeMarket, setActiveMarket] = useState<string>("all")
  const [leadTab, setLeadTab] = useState<LeadTab>("all")
  const stats = useMemo(() => generateDashboardStats(), [])
  const leads = useMemo(() => generateLeads(20), [])
  const campaigns = useMemo(() => generateCampaigns(), [])

  const activeStats = statsByTab[leadTab]
  const activePriorityLeads = priorityLeadsByTab[leadTab]

  const topLeads = useMemo(
    () =>
      [...leads]
        .sort((a, b) => b.score - a.score)
        .slice(0, 5),
    [leads]
  )

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Welcome back. Here is your lead intelligence overview.
        </p>
      </div>

      <AgentMarketFilter className="mb-4" />

      {/* Market Quick-Switch */}
      <div className="flex items-center gap-2">
        {markets.map((m) => (
          <button
            key={m.key}
            onClick={() => setActiveMarket(m.key)}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
              activeMarket === m.key
                ? "bg-blue-600 text-white shadow-sm"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            )}
          >
            {"flag" in m && <span className="text-base leading-none">{m.flag}</span>}
            {m.label}
          </button>
        ))}
      </div>

      {/* Lead Type Tab Bar */}
      <div className="flex items-center gap-1 border-b border-gray-200 dark:border-gray-700">
        {([
          { key: "all" as LeadTab, label: "All Leads", icon: Users },
          { key: "seller" as LeadTab, label: "Pre-Market Listings", icon: Target },
          { key: "buyer" as LeadTab, label: "Buyer Leads", icon: ShoppingCart },
          { key: "tenant" as LeadTab, label: "Tenant Leads", icon: Key },
        ]).map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setLeadTab(key)}
            className={cn(
              "inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium transition-colors",
              leadTab === key
                ? "border-b-2 border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400"
                : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Top Stats Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          label={leadTab === "all" ? "Total Leads" : `${leadTab.charAt(0).toUpperCase() + leadTab.slice(1)} Leads`}
          value={activeStats.totalLeads.toLocaleString()}
          icon={Users}
          trend={{ value: "18%", positive: true }}
          iconBg="bg-blue-50"
          iconColor="text-blue-600"
        />
        <StatsCard
          label="Hot Leads"
          value={activeStats.hotLeads.toLocaleString()}
          icon={Flame}
          iconBg="bg-red-50"
          iconColor="text-red-600"
        />
        <StatsCard
          label="Pipeline Value"
          value={`$${(activeStats.pipelineValue / 1_000_000).toFixed(1)}M`}
          icon={DollarSign}
          trend={{ value: "$2.1M", positive: true }}
          iconBg="bg-green-50"
          iconColor="text-green-600"
        />
        <StatsCard
          label="Response Rate"
          value={`${activeStats.responseRate}%`}
          icon={TrendingUp}
          trend={{ value: "2.3%", positive: true }}
          iconBg="bg-purple-50"
          iconColor="text-purple-600"
        />
      </div>

      {/* Today's Priority Section */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              Today&apos;s Priority
              <Badge variant="secondary" className="text-[10px]">
                {leadTab === "all" ? "All Types" : leadTab.charAt(0).toUpperCase() + leadTab.slice(1) + "s"}
              </Badge>
            </CardTitle>
            <Button variant="ghost" size="sm" className="text-xs text-blue-600 h-7">
              View all
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
            {activePriorityLeads.slice(0, 5).map((lead, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 rounded-lg border border-gray-100 dark:border-gray-800 p-3 transition-colors hover:bg-gray-50 dark:hover:bg-gray-900/50"
              >
                <div
                  className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-sm font-bold text-white",
                    lead.score >= 90 ? "bg-red-500" : lead.score >= 80 ? "bg-orange-500" : "bg-yellow-500"
                  )}
                >
                  {lead.score}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-gray-900 dark:text-gray-100">{lead.name}</p>
                  <p className="truncate text-xs text-gray-500 dark:text-gray-400">{lead.address}</p>
                  <div className="mt-1.5 flex items-center gap-2">
                    <span
                      className={cn(
                        "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium",
                        lead.signalType === "distress" && "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
                        lead.signalType === "financial" && "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
                        lead.signalType === "life-event" && "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
                        lead.signalType === "behavioral" && "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
                        lead.signalType === "market" && "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300"
                      )}
                    >
                      {lead.signal}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[10px] text-gray-400">
                      <Clock className="h-3 w-3" />
                      {lead.urgency}
                    </span>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="h-7 shrink-0 text-xs gap-1">
                  <ArrowRight className="h-3 w-3" />
                  Act
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Second Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Priority Leads */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Today&apos;s Priority Leads</CardTitle>
              <Button variant="ghost" size="sm" className="text-xs text-blue-600 h-7">
                View all
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {topLeads.map((lead) => (
              <div
                key={lead.id}
                className="flex items-center gap-3 rounded-lg border border-gray-100 p-3 transition-colors hover:bg-gray-50"
              >
                {/* Score */}
                <div
                  className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-sm font-bold text-white",
                    lead.score >= 80
                      ? "bg-red-500"
                      : lead.score >= 50
                        ? "bg-yellow-500"
                        : "bg-gray-400"
                  )}
                >
                  {lead.score}
                </div>
                {/* Info */}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-gray-900">
                    {lead.owner.name}
                  </p>
                  <p className="truncate text-xs text-gray-500">
                    {lead.property.address}, {lead.property.city}{" "}
                    {lead.property.state} &middot;{" "}
                    {lead.property.propertyType}
                  </p>
                </div>
                {/* Top signal */}
                {lead.signals[0] && (
                  <Badge
                    variant="secondary"
                    className={cn(
                      "hidden shrink-0 text-[10px] sm:inline-flex",
                      lead.signals[0].type === "distress" &&
                        "bg-red-100 text-red-700 border-0",
                      lead.signals[0].type === "life-event" &&
                        "bg-purple-100 text-purple-700 border-0",
                      lead.signals[0].type === "financial" &&
                        "bg-green-100 text-green-700 border-0",
                      lead.signals[0].type === "behavioral" &&
                        "bg-blue-100 text-blue-700 border-0",
                      lead.signals[0].type === "market" &&
                        "bg-orange-100 text-orange-700 border-0"
                    )}
                  >
                    {lead.signals[0].label}
                  </Badge>
                )}
                {/* Actions */}
                <div className="flex shrink-0 items-center gap-1.5">
                  <Button variant="outline" size="sm" className="h-7 text-xs">
                    Contact
                  </Button>
                  <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                    <Eye className="h-3.5 w-3.5 text-gray-400" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Score Distribution */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Lead Score Distribution</CardTitle>
              <Badge variant="secondary" className="text-[10px]">
                {stats.totalLeads.toLocaleString()} total
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {scoreDistribution.map((item) => (
                <div key={item.range} className="flex items-center gap-3">
                  <span className="w-14 text-right text-xs font-medium text-gray-500">
                    {item.range}
                  </span>
                  <div className="flex-1">
                    <div className="h-7 w-full overflow-hidden rounded-md bg-gray-100">
                      <div
                        className={cn("h-full rounded-md transition-all", item.color)}
                        style={{
                          width: `${(item.count / maxDistCount) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                  <span className="w-12 text-right text-xs text-gray-500">
                    {item.count.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Third Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Activity */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Recent Activity</CardTitle>
              <span className="flex h-2 w-2 rounded-full bg-green-500" title="Live" />
            </div>
          </CardHeader>
          <CardContent className="p-0 px-2 pb-2">
            <ActivityFeed maxItems={8} />
          </CardContent>
        </Card>

        {/* Outreach Performance */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Outreach Performance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {outreachMetrics.map((m) => (
              <div
                key={m.channel}
                className="flex items-center gap-4 rounded-lg border border-gray-100 p-3"
              >
                <div
                  className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
                    m.bg
                  )}
                >
                  <m.icon className={cn("h-5 w-5", m.color)} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900">
                      {m.channel}
                    </p>
                    <span className="text-xs text-gray-500">
                      {m.sent.toLocaleString()} sent
                    </span>
                  </div>
                  <div className="mt-1.5 flex gap-4">
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase tracking-wider">
                        {m.metric1Label}
                      </p>
                      <p className="text-sm font-semibold text-gray-900">
                        {m.metric1}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase tracking-wider">
                        {m.metric2Label}
                      </p>
                      <p className="text-sm font-semibold text-gray-900">
                        {m.metric2}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Fourth Row - Active Campaigns */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Active Campaigns</CardTitle>
            <Button size="sm" className="h-8 text-xs gap-1">
              <Mail className="h-3.5 w-3.5" />
              New Campaign
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  <th className="pb-3 pr-4">Campaign</th>
                  <th className="pb-3 pr-4">Type</th>
                  <th className="pb-3 pr-4">Status</th>
                  <th className="pb-3 pr-4 text-right">Sent</th>
                  <th className="pb-3 pr-4 text-right">Opened</th>
                  <th className="pb-3 pr-4 text-right">Replied</th>
                  <th className="pb-3 pr-4 text-right">Meetings</th>
                  <th className="pb-3 w-10"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {campaigns.map((campaign) => {
                  const TypeIcon = campaignTypeIcons[campaign.type]
                  return (
                    <tr
                      key={campaign.id}
                      className="transition-colors hover:bg-gray-50"
                    >
                      <td className="py-3 pr-4">
                        <span className="font-medium text-gray-900">
                          {campaign.name}
                        </span>
                      </td>
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-1.5 text-gray-500">
                          <TypeIcon className="h-3.5 w-3.5" />
                          <span className="capitalize">{campaign.type.replace("-", " ")}</span>
                        </div>
                      </td>
                      <td className="py-3 pr-4">
                        <span
                          className={cn(
                            "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold capitalize",
                            campaignStatusColors[campaign.status]
                          )}
                        >
                          {campaign.status}
                        </span>
                      </td>
                      <td className="py-3 pr-4 text-right text-gray-600">
                        {campaign.sent.toLocaleString()}
                      </td>
                      <td className="py-3 pr-4 text-right text-gray-600">
                        {campaign.opened.toLocaleString()}
                      </td>
                      <td className="py-3 pr-4 text-right text-gray-600">
                        {campaign.replied.toLocaleString()}
                      </td>
                      <td className="py-3 pr-4 text-right font-medium text-gray-900">
                        {campaign.meetings}
                      </td>
                      <td className="py-3">
                        <div className="flex items-center gap-1">
                          {campaign.status === "active" ? (
                            <button
                              className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                              title="Pause"
                            >
                              <Pause className="h-3.5 w-3.5" />
                            </button>
                          ) : campaign.status === "paused" ? (
                            <button
                              className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                              title="Resume"
                            >
                              <Play className="h-3.5 w-3.5" />
                            </button>
                          ) : null}
                          <button
                            className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                            title="More"
                          >
                            <BarChart3 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
