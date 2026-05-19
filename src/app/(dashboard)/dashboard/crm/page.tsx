"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  GripVertical,
  RefreshCcw,
  CheckCircle,
  XCircle,
  Clock,
  ArrowRight,
  Plug,
  Activity,
  UserPlus,
  FileBarChart,
  MessageSquare,
  Users,
  MapPin,
  Handshake,
  Building2,
} from "lucide-react"

type DealStage =
  | "New"
  | "Contacted"
  | "Responded"
  | "Meeting Scheduled"
  | "Negotiating"
  | "Under Contract"
  | "Closed"
  | "Dead"

interface PipelineCard {
  id: string
  ownerName: string
  address: string
  value: string
  score: number
  scoreLabel: "Hot" | "Warm" | "Cold"
  daysInStage: number
}

const pipelineData: Record<DealStage, { count: number; cards: PipelineCard[] }> = {
  New: {
    count: 23,
    cards: [
      { id: "1", ownerName: "James Smith", address: "1420 Oak St, Atlanta GA", value: "$1.2M", score: 87, scoreLabel: "Hot", daysInStage: 2 },
      { id: "2", ownerName: "Martinez Holdings LLC", address: "3201 Broadway, Dallas TX", value: "$3.4M", score: 72, scoreLabel: "Warm", daysInStage: 1 },
      { id: "3", ownerName: "Patricia Chen", address: "890 Elm Ave, Miami FL", value: "$890K", score: 91, scoreLabel: "Hot", daysInStage: 0 },
    ],
  },
  Contacted: {
    count: 15,
    cards: [
      { id: "4", ownerName: "Davis Properties Inc", address: "567 Market St, Houston TX", value: "$2.1M", score: 83, scoreLabel: "Hot", daysInStage: 5 },
      { id: "5", ownerName: "Robert Johnson", address: "2340 Pine St, Phoenix AZ", value: "$445K", score: 68, scoreLabel: "Warm", daysInStage: 3 },
    ],
  },
  Responded: {
    count: 8,
    cards: [
      { id: "6", ownerName: "Williams Capital Group", address: "1100 Commerce Dr, Austin TX", value: "$5.6M", score: 94, scoreLabel: "Hot", daysInStage: 4 },
      { id: "7", ownerName: "Linda Garcia", address: "3455 Sunset Blvd, LA CA", value: "$1.8M", score: 76, scoreLabel: "Warm", daysInStage: 7 },
    ],
  },
  "Meeting Scheduled": {
    count: 5,
    cards: [
      { id: "8", ownerName: "Brown Realty Trust", address: "890 Highland Ave, Seattle WA", value: "$4.2M", score: 89, scoreLabel: "Hot", daysInStage: 2 },
      { id: "9", ownerName: "Michael Lopez", address: "1256 Maple Ln, Chicago IL", value: "$920K", score: 81, scoreLabel: "Hot", daysInStage: 1 },
    ],
  },
  Negotiating: {
    count: 3,
    cards: [
      { id: "10", ownerName: "Patel Investments LLC", address: "4501 Park Blvd, Atlanta GA", value: "$7.8M", score: 96, scoreLabel: "Hot", daysInStage: 12 },
    ],
  },
  "Under Contract": {
    count: 2,
    cards: [
      { id: "11", ownerName: "Kim Development Corp", address: "2200 Washington Ave, Dallas TX", value: "$3.1M", score: 92, scoreLabel: "Hot", daysInStage: 8 },
    ],
  },
  Closed: {
    count: 12,
    cards: [
      { id: "12", ownerName: "Jennifer Miller", address: "678 Cedar Rd, Miami FL", value: "$1.5M", score: 88, scoreLabel: "Hot", daysInStage: 0 },
      { id: "13", ownerName: "Rodriguez Holdings LLC", address: "934 Lincoln Dr, Houston TX", value: "$2.9M", score: 85, scoreLabel: "Hot", daysInStage: 0 },
    ],
  },
  Dead: {
    count: 45,
    cards: [
      { id: "14", ownerName: "Thomas Williams", address: "1100 Willow Way, Phoenix AZ", value: "$340K", score: 42, scoreLabel: "Cold", daysInStage: 30 },
      { id: "15", ownerName: "Lopez Properties Inc", address: "5600 Main Ave, Austin TX", value: "$1.1M", score: 55, scoreLabel: "Warm", daysInStage: 21 },
    ],
  },
}

const stageColors: Record<DealStage, string> = {
  New: "bg-blue-500",
  Contacted: "bg-cyan-500",
  Responded: "bg-teal-500",
  "Meeting Scheduled": "bg-green-500",
  Negotiating: "bg-yellow-500",
  "Under Contract": "bg-orange-500",
  Closed: "bg-emerald-600",
  Dead: "bg-gray-400",
}

interface CrmIntegration {
  name: string
  connected: boolean
  contactsSynced?: string
  comingSoon?: boolean
}

const integrations: CrmIntegration[] = [
  { name: "Follow Up Boss", connected: true, contactsSynced: "2,340" },
  { name: "HubSpot", connected: true, contactsSynced: "1,203" },
  { name: "Salesforce", connected: false },
  { name: "kvCORE", connected: false },
  { name: "Lofty", connected: false, comingSoon: true },
  { name: "BoomTown", connected: false, comingSoon: true },
]

interface TimelineEvent {
  id: string
  message: string
  time: string
  icon: typeof RefreshCcw
  iconColor: string
}

const timeline: TimelineEvent[] = [
  { id: "1", message: "Lead synced to Follow Up Boss", time: "5m ago", icon: RefreshCcw, iconColor: "text-blue-500" },
  { id: "2", message: "Deal stage updated: Negotiating → Under Contract", time: "1h ago", icon: ArrowRight, iconColor: "text-green-500" },
  { id: "3", message: "New contact added from ATLAS enrichment", time: "2h ago", icon: UserPlus, iconColor: "text-purple-500" },
  { id: "4", message: "12 leads bulk-synced to HubSpot", time: "3h ago", icon: RefreshCcw, iconColor: "text-blue-500" },
  { id: "5", message: "Campaign metrics updated in Follow Up Boss", time: "4h ago", icon: FileBarChart, iconColor: "text-orange-500" },
  { id: "6", message: "Voice call transcript synced to Salesforce", time: "6h ago", icon: MessageSquare, iconColor: "text-teal-500" },
  { id: "7", message: "Deal marked as Closed - $1.5M", time: "8h ago", icon: CheckCircle, iconColor: "text-emerald-500" },
  { id: "8", message: "New lead auto-assigned to John Peterson", time: "12h ago", icon: UserPlus, iconColor: "text-purple-500" },
]

interface AgentContact {
  id: string
  name: string
  brokerage: string
  specialty: "Residential" | "Commercial" | "Both"
  market: string
  deals: number
}

const agentNetwork: AgentContact[] = [
  { id: "a1", name: "María Santos", brokerage: "RE/MAX Dominican", specialty: "Commercial", market: "Santo Domingo", deals: 45 },
  { id: "a2", name: "Carlos Reyes", brokerage: "Coldwell Banker PR", specialty: "Residential", market: "San Juan", deals: 78 },
  { id: "a3", name: "Jennifer Williams", brokerage: "Keller Williams", specialty: "Both", market: "Miami", deals: 123 },
  { id: "a4", name: "Rafael Díaz", brokerage: "Century 21 DR", specialty: "Residential", market: "Punta Cana", deals: 34 },
  { id: "a5", name: "Patricia Brown", brokerage: "Marcus & Millichap", specialty: "Commercial", market: "New York", deals: 89 },
]

function getSpecialtyColor(specialty: AgentContact["specialty"]) {
  switch (specialty) {
    case "Residential": return "bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300"
    case "Commercial": return "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300"
    case "Both": return "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"
  }
}

function ScoreBadge({ score, label }: { score: number; label: string }) {
  const variant =
    label === "Hot" ? "destructive" : label === "Warm" ? "warning" : "secondary"
  return (
    <Badge variant={variant} className="text-[10px] px-1.5 py-0">
      {score}
    </Badge>
  )
}

export default function CrmPage() {
  const stages = Object.keys(pipelineData) as DealStage[]

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">CRM Integration Hub</h1>
          <p className="text-sm text-gray-500 mt-1">
            Pipeline management and CRM sync across all connected platforms
          </p>
        </div>
        <Button variant="outline" size="sm">
          <RefreshCcw className="h-4 w-4 mr-1" />
          Sync All
        </Button>
      </div>

      {/* Pipeline Kanban */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Deal Pipeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3 overflow-x-auto pb-4">
            {stages.map((stage) => {
              const data = pipelineData[stage]
              return (
                <div
                  key={stage}
                  className="min-w-[220px] flex-shrink-0 rounded-lg bg-gray-50 p-3"
                >
                  {/* Column Header */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div
                        className={`h-2.5 w-2.5 rounded-full ${stageColors[stage]}`}
                      />
                      <span className="text-sm font-medium text-gray-900">{stage}</span>
                    </div>
                    <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-gray-200 px-1.5 text-[10px] font-semibold text-gray-600">
                      {data.count}
                    </span>
                  </div>

                  {/* Cards */}
                  <div className="space-y-2">
                    {data.cards.map((card) => (
                      <div
                        key={card.id}
                        className="rounded-lg border border-gray-200 bg-white p-3 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                      >
                        <div className="flex items-start justify-between">
                          <p className="text-sm font-medium text-gray-900 leading-tight">
                            {card.ownerName}
                          </p>
                          <GripVertical className="h-3.5 w-3.5 text-gray-300 shrink-0 mt-0.5" />
                        </div>
                        <p className="text-xs text-gray-500 mt-1 truncate">
                          {card.address}
                        </p>
                        <div className="flex items-center justify-between mt-2.5">
                          <span className="text-sm font-semibold text-gray-900">
                            {card.value}
                          </span>
                          <ScoreBadge score={card.score} label={card.scoreLabel} />
                        </div>
                        <div className="flex items-center gap-1 mt-2 text-[10px] text-gray-400">
                          <Clock className="h-2.5 w-2.5" />
                          {card.daysInStage === 0
                            ? "Today"
                            : `${card.daysInStage}d in stage`}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Connected CRMs + Activity Timeline */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Connected CRMs */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Plug className="h-4 w-4 text-blue-500" />
              Connected CRMs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {integrations.map((crm) => (
                <div
                  key={crm.name}
                  className="rounded-lg border border-gray-200 p-4 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-semibold text-gray-900">
                        {crm.name}
                      </h4>
                      {crm.connected ? (
                        <Badge variant="success" className="text-[10px] px-1.5 py-0">
                          Connected
                        </Badge>
                      ) : crm.comingSoon ? (
                        <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                          Coming Soon
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                          Not Connected
                        </Badge>
                      )}
                    </div>
                    {crm.connected && crm.contactsSynced && (
                      <p className="text-xs text-gray-500 mt-2">
                        {crm.contactsSynced} contacts synced
                      </p>
                    )}
                  </div>
                  <div className="mt-3">
                    {crm.connected ? (
                      <Button variant="outline" size="sm" className="w-full text-xs h-7">
                        Disconnect
                      </Button>
                    ) : crm.comingSoon ? (
                      <Button
                        variant="secondary"
                        size="sm"
                        className="w-full text-xs h-7"
                        disabled
                      >
                        Coming Soon
                      </Button>
                    ) : (
                      <Button size="sm" className="w-full text-xs h-7">
                        Connect
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Activity Timeline */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Activity className="h-4 w-4 text-green-500" />
              Activity Timeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {timeline.map((event, i) => (
                <div key={event.id} className="flex gap-3">
                  <div className="relative flex flex-col items-center">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-100">
                      <event.icon className={`h-3.5 w-3.5 ${event.iconColor}`} />
                    </div>
                    {i < timeline.length - 1 && (
                      <div className="mt-1 w-px flex-1 bg-gray-200" />
                    )}
                  </div>
                  <div className="pb-4">
                    <p className="text-xs text-gray-700 leading-relaxed">
                      {event.message}
                    </p>
                    <p className="text-[10px] text-gray-400 mt-0.5">{event.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Agent Network */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Users className="h-4 w-4 text-indigo-500" />
            Agent Network
          </CardTitle>
          <p className="text-sm text-gray-500 mt-1">
            Connect with agents for co-listings, referrals, and pre-market intel
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {agentNetwork.map((agent) => (
              <div
                key={agent.id}
                className="rounded-lg border border-gray-200 dark:border-gray-700 p-4 flex flex-col justify-between hover:shadow-md transition-shadow"
              >
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center shrink-0">
                      <span className="text-sm font-bold text-indigo-600 dark:text-indigo-300">
                        {agent.name.split(" ").map(n => n[0]).join("")}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-900 dark:text-gray-50 truncate">{agent.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{agent.brokerage}</p>
                    </div>
                  </div>
                  <div className="space-y-2 mb-3">
                    <Badge className={`text-[10px] ${getSpecialtyColor(agent.specialty)}`}>
                      {agent.specialty}
                    </Badge>
                    <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                      <MapPin className="h-3 w-3" />
                      {agent.market}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                      <Handshake className="h-3 w-3" />
                      {agent.deals} deals
                    </div>
                  </div>
                </div>
                <Button size="sm" variant="outline" className="w-full text-xs h-7">
                  <Users className="h-3 w-3 mr-1" />
                  Connect
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
