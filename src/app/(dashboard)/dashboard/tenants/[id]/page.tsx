"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  Building2,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Clock,
  Ruler,
  DollarSign,
  Users,
  Briefcase,
  Eye,
  MessageSquare,
  CheckCircle2,
  Circle,
  Send,
  PhoneCall,
  FileText,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { generateTenantLeads } from "@/hooks/use-mock-data"
import { cn, formatCurrency, formatNumber } from "@/lib/utils"
import { ScoreBadge } from "@/components/shared/score-badge"
import type { TenantLead } from "@/types"

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const LEASE_STAGES: TenantLead["leaseStage"][] = [
  "new",
  "contacted",
  "qualified",
  "touring",
  "proposal",
  "negotiating",
  "lease-signed",
]

const LEASE_STAGE_LABELS: Record<TenantLead["leaseStage"], string> = {
  new: "Lead",
  contacted: "Contacted",
  qualified: "Qualified",
  touring: "Touring",
  proposal: "Proposal",
  negotiating: "Negotiating",
  "lease-signed": "Lease Signed",
  lost: "Lost",
}

const TENANT_TYPE_COLORS: Record<string, string> = {
  commercial: "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300",
  residential: "bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300",
  industrial: "bg-slate-100 text-slate-700 dark:bg-slate-900/40 dark:text-slate-300",
  retail: "bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300",
  restaurant: "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
  office: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
}

// ---------------------------------------------------------------------------
// Mock communication timeline
// ---------------------------------------------------------------------------

interface TimelineEntry {
  id: string
  type: "email" | "call" | "note" | "tour" | "proposal"
  title: string
  description: string
  date: string
  agent?: string
}

function generateTimeline(): TimelineEntry[] {
  return [
    {
      id: "t-1",
      type: "email",
      title: "Initial outreach sent",
      description: "Automated welcome email with available spaces matching their requirements.",
      date: new Date(Date.now() - 14 * 86400000).toISOString(),
      agent: "Sarah Martinez",
    },
    {
      id: "t-2",
      type: "call",
      title: "Discovery call completed",
      description: "Discussed space requirements, timeline, and budget. Tenant confirmed move-in date flexibility.",
      date: new Date(Date.now() - 10 * 86400000).toISOString(),
      agent: "Sarah Martinez",
    },
    {
      id: "t-3",
      type: "tour",
      title: "Property tour scheduled",
      description: "Tour of 3 matched spaces arranged. Tenant bringing operations manager.",
      date: new Date(Date.now() - 7 * 86400000).toISOString(),
      agent: "James Chen",
    },
    {
      id: "t-4",
      type: "note",
      title: "Follow-up notes",
      description: "Tenant liked unit B at Commerce Dr. Requesting detailed floor plan and CAM breakdown.",
      date: new Date(Date.now() - 5 * 86400000).toISOString(),
      agent: "Sarah Martinez",
    },
    {
      id: "t-5",
      type: "proposal",
      title: "Lease proposal drafted",
      description: "Draft LOI prepared with 3-year term, $28/sqft NNN. Awaiting tenant review.",
      date: new Date(Date.now() - 2 * 86400000).toISOString(),
      agent: "Sarah Martinez",
    },
  ]
}

const TIMELINE_ICONS: Record<TimelineEntry["type"], React.ReactNode> = {
  email: <Send className="h-4 w-4" />,
  call: <PhoneCall className="h-4 w-4" />,
  note: <MessageSquare className="h-4 w-4" />,
  tour: <Eye className="h-4 w-4" />,
  proposal: <FileText className="h-4 w-4" />,
}

const TIMELINE_COLORS: Record<TimelineEntry["type"], string> = {
  email: "bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400",
  call: "bg-green-100 text-green-600 dark:bg-green-900/40 dark:text-green-400",
  note: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
  tour: "bg-purple-100 text-purple-600 dark:bg-purple-900/40 dark:text-purple-400",
  proposal: "bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400",
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatDate(dateStr: string) {
  const d = new Date(dateStr)
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

function formatRelativeDate(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const days = Math.floor(diff / 86400000)
  if (days === 0) return "Today"
  if (days === 1) return "Yesterday"
  if (days < 7) return `${days} days ago`
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`
  return `${Math.floor(days / 30)} months ago`
}

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------

export default function TenantDetailPage() {
  const [lead] = useState<TenantLead>(() => generateTenantLeads(1)[0])
  const [timeline] = useState<TimelineEntry[]>(() => generateTimeline())

  const tenant = lead.tenant
  const stageIndex = LEASE_STAGES.indexOf(lead.leaseStage)

  return (
    <div className="flex flex-col gap-6 p-6 max-w-[1400px] mx-auto">
      {/* Back + Header */}
      <div>
        <Link
          href="/dashboard/tenants"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Tenants
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <div className="flex items-center justify-center h-14 w-14 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 text-white text-lg font-bold shadow-lg shadow-violet-500/25 shrink-0">
              {tenant.name.charAt(0)}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 truncate">
                  {tenant.name}
                </h1>
                <span
                  className={cn(
                    "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize",
                    TENANT_TYPE_COLORS[tenant.tenantType] ?? "bg-gray-100 text-gray-600"
                  )}
                >
                  {tenant.tenantType}
                </span>
                {tenant.industry && (
                  <Badge variant="secondary" className="text-xs">
                    {tenant.industry}
                  </Badge>
                )}
              </div>
              {tenant.company && tenant.company !== tenant.name && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                  {tenant.company}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Phone className="h-4 w-4" />
              Call
            </Button>
            <Button variant="outline" size="sm">
              <Mail className="h-4 w-4" />
              Email
            </Button>
            <Button size="sm">
              <FileText className="h-4 w-4" />
              New Proposal
            </Button>
          </div>
        </div>
      </div>

      {/* Contact Info Row */}
      <div className="flex items-center gap-6 flex-wrap text-sm text-gray-600 dark:text-gray-400">
        <span className="flex items-center gap-1.5">
          <Mail className="h-4 w-4 text-gray-400" />
          {tenant.email}
        </span>
        {tenant.phone && (
          <span className="flex items-center gap-1.5">
            <Phone className="h-4 w-4 text-gray-400" />
            {tenant.phone}
          </span>
        )}
        {tenant.preferredMarkets.length > 0 && (
          <span className="flex items-center gap-1.5">
            <MapPin className="h-4 w-4 text-gray-400" />
            {tenant.preferredMarkets.join(", ")}
          </span>
        )}
        {tenant.employeeCount && (
          <span className="flex items-center gap-1.5">
            <Users className="h-4 w-4 text-gray-400" />
            {tenant.employeeCount} employees
          </span>
        )}
      </div>

      {/* Lease Pipeline Tracker */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base">Lease Pipeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center">
            {LEASE_STAGES.map((stage, i) => {
              const isCurrent = stage === lead.leaseStage
              const isComplete = stageIndex >= 0 && i < stageIndex
              const isPast = isComplete || isCurrent

              return (
                <div key={stage} className="flex items-center flex-1 last:flex-initial">
                  <div className="flex flex-col items-center gap-1.5">
                    <div
                      className={cn(
                        "flex items-center justify-center h-8 w-8 rounded-full border-2 transition-colors",
                        isCurrent
                          ? "border-blue-600 bg-blue-600 text-white"
                          : isComplete
                            ? "border-emerald-500 bg-emerald-500 text-white"
                            : "border-gray-200 bg-white text-gray-400 dark:border-gray-700 dark:bg-gray-900"
                      )}
                    >
                      {isComplete ? (
                        <CheckCircle2 className="h-4 w-4" />
                      ) : isCurrent ? (
                        <Circle className="h-3 w-3 fill-current" />
                      ) : (
                        <Circle className="h-3 w-3" />
                      )}
                    </div>
                    <span
                      className={cn(
                        "text-[10px] font-medium text-center whitespace-nowrap",
                        isCurrent
                          ? "text-blue-600 dark:text-blue-400 font-semibold"
                          : isComplete
                            ? "text-emerald-600 dark:text-emerald-400"
                            : "text-gray-400 dark:text-gray-500"
                      )}
                    >
                      {LEASE_STAGE_LABELS[stage]}
                    </span>
                  </div>
                  {i < LEASE_STAGES.length - 1 && (
                    <div
                      className={cn(
                        "flex-1 h-0.5 mx-2 rounded-full mt-[-18px]",
                        i < stageIndex
                          ? "bg-emerald-500"
                          : i === stageIndex
                            ? "bg-gradient-to-r from-blue-500 to-gray-200 dark:to-gray-700"
                            : "bg-gray-200 dark:bg-gray-700"
                      )}
                    />
                  )}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - 2/3 */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Space Requirements */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <Ruler className="h-4 w-4 text-gray-400" />
                Space Requirements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                <div>
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Min Sqft
                  </p>
                  <p className="mt-1 text-lg font-bold text-gray-900 dark:text-gray-100">
                    {formatNumber(tenant.spaceRequirements.minSqft)}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Max Sqft
                  </p>
                  <p className="mt-1 text-lg font-bold text-gray-900 dark:text-gray-100">
                    {formatNumber(tenant.spaceRequirements.maxSqft)}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Budget/mo
                  </p>
                  <p className="mt-1 text-lg font-bold text-gray-900 dark:text-gray-100">
                    {formatCurrency(tenant.leaseBudget.min)} - {formatCurrency(tenant.leaseBudget.max)}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Preferred Term
                  </p>
                  <p className="mt-1 text-lg font-bold text-gray-900 dark:text-gray-100">
                    {tenant.preferredTerm}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                {tenant.spaceRequirements.preferredLayout && (
                  <div>
                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Preferred Layout
                    </p>
                    <p className="mt-1 text-sm font-medium text-gray-900 dark:text-gray-100 capitalize">
                      {tenant.spaceRequirements.preferredLayout}
                    </p>
                  </div>
                )}
                {tenant.moveInDate && (
                  <div>
                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Target Move-in
                    </p>
                    <p className="mt-1 text-sm font-medium text-gray-900 dark:text-gray-100 flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-gray-400" />
                      {formatDate(tenant.moveInDate)}
                    </p>
                  </div>
                )}
              </div>

              {tenant.specialRequirements && tenant.specialRequirements.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                    Special Requirements
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {tenant.specialRequirements.map((req) => (
                      <Badge key={req} variant="secondary" className="text-xs">
                        {req}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Matched Spaces Table */}
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-gray-400" />
                  Matched Spaces
                  {lead.matchedSpaces.length > 0 && (
                    <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold dark:bg-emerald-900/40 dark:text-emerald-300">
                      {lead.matchedSpaces.length}
                    </span>
                  )}
                </CardTitle>
                <Button variant="outline" size="sm">
                  Find More
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {lead.matchedSpaces.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs uppercase tracking-wider font-semibold">Address</TableHead>
                      <TableHead className="text-xs uppercase tracking-wider font-semibold">Rent/mo</TableHead>
                      <TableHead className="text-xs uppercase tracking-wider font-semibold text-center">Match Score</TableHead>
                      <TableHead className="text-xs uppercase tracking-wider font-semibold w-20" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {lead.matchedSpaces.map((space) => (
                      <TableRow key={space.propertyId}>
                        <TableCell className="font-medium text-gray-900 dark:text-gray-100">
                          {space.address}
                        </TableCell>
                        <TableCell className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {formatCurrency(space.rent)}
                        </TableCell>
                        <TableCell className="text-center">
                          <ScoreBadge score={space.matchScore} size="sm" />
                        </TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm" className="h-7 text-xs">
                            <Eye className="h-3 w-3" />
                            Tour
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Building2 className="h-10 w-10 text-gray-300 dark:text-gray-600 mb-2" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    No matched spaces yet. Click &quot;Find More&quot; to search.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right column - 1/3 */}
        <div className="flex flex-col gap-6">
          {/* Lead Details Card */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base">Lead Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Source
                </span>
                <span className="text-sm text-gray-900 dark:text-gray-100">
                  {lead.source}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Assigned To
                </span>
                <span className="text-sm text-gray-900 dark:text-gray-100">
                  {lead.assignedTo ?? "Unassigned"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Created
                </span>
                <span className="text-sm text-gray-900 dark:text-gray-100">
                  {formatDate(lead.createdAt)}
                </span>
              </div>
              {lead.lastContactDate && (
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Last Contact
                  </span>
                  <span className="text-sm text-gray-900 dark:text-gray-100">
                    {formatRelativeDate(lead.lastContactDate)}
                  </span>
                </div>
              )}
              {lead.nextFollowUp && (
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Next Follow-up
                  </span>
                  <span className="text-sm text-amber-600 dark:text-amber-400 font-medium">
                    {formatDate(lead.nextFollowUp)}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Communication History */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-400" />
                Communication History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                {/* Vertical line */}
                <div className="absolute left-4 top-2 bottom-2 w-px bg-gray-200 dark:bg-gray-700" />

                <div className="space-y-5">
                  {timeline.map((entry) => (
                    <div key={entry.id} className="relative flex gap-4 pl-2">
                      <div
                        className={cn(
                          "relative z-10 flex items-center justify-center h-8 w-8 rounded-full shrink-0",
                          TIMELINE_COLORS[entry.type]
                        )}
                      >
                        {TIMELINE_ICONS[entry.type]}
                      </div>
                      <div className="flex-1 min-w-0 pt-0.5">
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {entry.title}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2">
                          {entry.description}
                        </p>
                        <div className="flex items-center gap-2 mt-1.5">
                          <span className="text-[10px] text-gray-400 dark:text-gray-500">
                            {formatRelativeDate(entry.date)}
                          </span>
                          {entry.agent && (
                            <>
                              <span className="text-gray-300 dark:text-gray-600">
                                &middot;
                              </span>
                              <span className="text-[10px] text-gray-400 dark:text-gray-500">
                                {entry.agent}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
