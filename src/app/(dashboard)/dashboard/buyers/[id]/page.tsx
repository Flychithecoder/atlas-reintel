"use client"

import React, { useMemo } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  Phone,
  Mail,
  Calendar,
  Clock,
  Building2,
  DollarSign,
  Target,
  MessageSquare,
  CheckCircle2,
  Circle,
  Plus,
  TrendingUp,
  Percent,
  Timer,
  BarChart3,
  Users,
  FileText,
  Send,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table"
import { generateBuyerLeads } from "@/hooks/use-mock-data"
import { cn, formatCurrency, formatDate } from "@/lib/utils"
import { ScoreBadge } from "@/components/shared/score-badge"
import { PropertyIcon } from "@/components/shared/property-icon"

// ── Pipeline stages ─────────────────────────────────────────────────
const PIPELINE_STAGES = [
  "new",
  "contacted",
  "qualified",
  "matched",
  "showing",
  "offer",
  "under-contract",
  "closed",
] as const

const STAGE_LABELS: Record<string, string> = {
  new: "Lead",
  contacted: "Contacted",
  qualified: "Qualified",
  matched: "Matched",
  showing: "Showing",
  offer: "Offer",
  "under-contract": "Under Contract",
  closed: "Closed",
}

// ── Pre-approval badge helper ───────────────────────────────────────
function preApprovalBadge(status: string) {
  const map: Record<string, { label: string; className: string }> = {
    none: {
      label: "No Pre-Approval",
      className: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
    },
    "pre-qualified": {
      label: "Pre-Qualified",
      className: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    },
    "pre-approved": {
      label: "Pre-Approved",
      className: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    },
    "cash-buyer": {
      label: "Cash Buyer",
      className: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    },
    "hard-money": {
      label: "Hard Money",
      className: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
    },
  }
  const entry = map[status] ?? map.none
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
        entry.className
      )}
    >
      {entry.label}
    </span>
  )
}

// ── Buyer type badge helper ─────────────────────────────────────────
function buyerTypeBadge(type: string) {
  const labels: Record<string, string> = {
    individual: "Individual",
    investor: "Investor",
    corporation: "Corporation",
    reit: "REIT",
    "1031-exchange": "1031 Exchange",
    "first-time": "First-Time Buyer",
  }
  return (
    <Badge variant="secondary" className="capitalize">
      {labels[type] ?? type}
    </Badge>
  )
}

// ── Contact type icon helper ────────────────────────────────────────
function contactIcon(type: string) {
  switch (type) {
    case "phone":
      return <Phone className="h-4 w-4" />
    case "email":
      return <Mail className="h-4 w-4" />
    case "sms":
      return <MessageSquare className="h-4 w-4" />
    case "meeting":
      return <Users className="h-4 w-4" />
    default:
      return <Send className="h-4 w-4" />
  }
}

// ── Sentiment badge ─────────────────────────────────────────────────
function sentimentBadge(s: "positive" | "neutral" | "negative") {
  const map = {
    positive:
      "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    neutral:
      "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
    negative:
      "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  }
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium capitalize",
        map[s]
      )}
    >
      {s}
    </span>
  )
}

// ── Mock communication history ──────────────────────────────────────
function generateCommunicationHistory() {
  return [
    {
      type: "phone" as const,
      date: new Date(Date.now() - 2 * 86400000).toISOString(),
      note: "Initial qualification call. Buyer is actively searching and has strong financing in place. Discussed preferred neighborhoods and must-have features.",
      sentiment: "positive" as const,
    },
    {
      type: "email" as const,
      date: new Date(Date.now() - 5 * 86400000).toISOString(),
      note: "Sent curated list of 8 matching properties based on stated criteria. Buyer responded with interest in 3 of them.",
      sentiment: "positive" as const,
    },
    {
      type: "meeting" as const,
      date: new Date(Date.now() - 10 * 86400000).toISOString(),
      note: "In-person meeting to discuss investment strategy and timeline. Buyer confirmed budget range and preferred hold period.",
      sentiment: "positive" as const,
    },
    {
      type: "sms" as const,
      date: new Date(Date.now() - 15 * 86400000).toISOString(),
      note: "Follow-up text about new listing at 4521 Palm Beach Blvd. Buyer requested showing next week.",
      sentiment: "neutral" as const,
    },
    {
      type: "email" as const,
      date: new Date(Date.now() - 22 * 86400000).toISOString(),
      note: "Initial outreach based on HMDA pre-approval signal. Buyer responded and expressed interest in receiving property matches.",
      sentiment: "positive" as const,
    },
  ]
}

// ══════════════════════════════════════════════════════════════════════
// MAIN PAGE COMPONENT
// ══════════════════════════════════════════════════════════════════════

export default function BuyerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  // Resolve params (Next.js 15 async params)
  const { id } = React.use(params)

  const buyerLead = useMemo(() => generateBuyerLeads(1)[0], [])
  const comms = useMemo(() => generateCommunicationHistory(), [])

  const { buyer, qualificationStage, matchedProperties } = buyerLead

  // Sort matched properties by score descending
  const sortedProperties = useMemo(
    () => [...matchedProperties].sort((a, b) => b.matchScore - a.matchScore),
    [matchedProperties]
  )

  // Determine pipeline stage index
  const currentStageIdx = PIPELINE_STAGES.indexOf(
    qualificationStage as (typeof PIPELINE_STAGES)[number]
  )

  // Check if buyer has investment criteria
  const hasInvestmentCriteria =
    buyer.investmentCriteria &&
    (buyer.buyerType === "investor" ||
      buyer.buyerType === "reit" ||
      buyer.buyerType === "1031-exchange")

  // Timeline label
  const timelineLabels: Record<string, string> = {
    immediate: "Immediate",
    "1-3months": "1-3 Months",
    "3-6months": "3-6 Months",
    "6-12months": "6-12 Months",
    flexible: "Flexible",
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* ── Back Navigation ─────────────────────────────────────────── */}
      <div className="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6">
          <Link
            href="/dashboard/buyers"
            className="inline-flex items-center gap-2 text-sm text-gray-500 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Buyers
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* ════════════════════════════════════════════════════════════
            HEADER -- Buyer info + Contact + Pre-approval
        ════════════════════════════════════════════════════════════ */}
        <Card className="mb-6 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/20 text-2xl font-bold text-white">
                  {buyer.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)}
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">
                    {buyer.name}
                  </h1>
                  <div className="mt-1 flex flex-wrap items-center gap-2">
                    {buyerTypeBadge(buyer.buyerType)}
                    {buyer.company && (
                      <span className="flex items-center gap-1 text-xs text-white/70">
                        <Building2 className="h-3 w-3" />
                        {buyer.company}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                {preApprovalBadge(buyer.preApprovalStatus)}
                <div className="rounded-lg bg-white/10 px-3 py-1.5 text-sm font-semibold text-white backdrop-blur-sm">
                  <DollarSign className="mr-1 inline h-3.5 w-3.5" />
                  {formatCurrency(buyer.budget.min)} - {formatCurrency(buyer.budget.max)}
                </div>
              </div>
            </div>
          </div>

          <CardContent className="p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              {/* Contact Info */}
              <div className="flex flex-wrap items-center gap-4">
                {buyer.phone && (
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span>{buyer.phone}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span>{buyer.email}</span>
                </div>
                {buyer.lender && (
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Building2 className="h-4 w-4 text-gray-400" />
                    <span>Lender: {buyer.lender}</span>
                  </div>
                )}
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                >
                  <Phone className="h-3.5 w-3.5" />
                  Call
                </Button>
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                >
                  <Mail className="h-3.5 w-3.5" />
                  Email
                </Button>
                <Button size="sm" variant="outline">
                  <MessageSquare className="h-3.5 w-3.5" />
                  SMS
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ════════════════════════════════════════════════════════════
            SECTION 1 -- Pipeline Stage Tracker
        ════════════════════════════════════════════════════════════ */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-600" />
              Pipeline Stage
            </CardTitle>
            <CardDescription>
              Current qualification progress
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <div className="flex items-center gap-0 min-w-[640px]">
                {PIPELINE_STAGES.map((stage, idx) => {
                  const isPast = idx < currentStageIdx
                  const isCurrent = idx === currentStageIdx
                  const isFuture = idx > currentStageIdx

                  return (
                    <React.Fragment key={stage}>
                      {/* Stage node */}
                      <div className="flex flex-col items-center gap-1.5">
                        <div
                          className={cn(
                            "flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all",
                            isPast &&
                              "border-green-500 bg-green-500 text-white dark:border-green-400 dark:bg-green-400 dark:text-gray-950",
                            isCurrent &&
                              "border-blue-500 bg-blue-500 text-white shadow-lg shadow-blue-500/30 dark:border-blue-400 dark:bg-blue-400 dark:text-gray-950",
                            isFuture &&
                              "border-gray-300 bg-gray-100 text-gray-400 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-500"
                          )}
                        >
                          {isPast ? (
                            <CheckCircle2 className="h-5 w-5" />
                          ) : (
                            <Circle className="h-5 w-5" />
                          )}
                        </div>
                        <span
                          className={cn(
                            "text-xs font-medium whitespace-nowrap",
                            isPast && "text-green-600 dark:text-green-400",
                            isCurrent && "text-blue-600 font-semibold dark:text-blue-400",
                            isFuture && "text-gray-400 dark:text-gray-500"
                          )}
                        >
                          {STAGE_LABELS[stage]}
                        </span>
                      </div>

                      {/* Connector line */}
                      {idx < PIPELINE_STAGES.length - 1 && (
                        <div
                          className={cn(
                            "h-0.5 flex-1 min-w-[24px]",
                            idx < currentStageIdx
                              ? "bg-green-500 dark:bg-green-400"
                              : "bg-gray-200 dark:bg-gray-700"
                          )}
                        />
                      )}
                    </React.Fragment>
                  )
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ════════════════════════════════════════════════════════════
            SECTION 2 -- Investment Criteria (conditional)
        ════════════════════════════════════════════════════════════ */}
        {hasInvestmentCriteria && buyer.investmentCriteria && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-emerald-600" />
                Investment Criteria
              </CardTitle>
              <CardDescription>
                Target returns and hold strategy
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {buyer.investmentCriteria.targetCapRate !== undefined && (
                  <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                    <div className="flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-400">
                      <Percent className="h-3.5 w-3.5" />
                      Target Cap Rate
                    </div>
                    <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {buyer.investmentCriteria.targetCapRate}%
                    </p>
                  </div>
                )}
                {buyer.investmentCriteria.targetCashOnCash !== undefined && (
                  <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                    <div className="flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-400">
                      <DollarSign className="h-3.5 w-3.5" />
                      Target Cash-on-Cash
                    </div>
                    <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {buyer.investmentCriteria.targetCashOnCash}%
                    </p>
                  </div>
                )}
                {buyer.investmentCriteria.targetIRR !== undefined && (
                  <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                    <div className="flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-400">
                      <TrendingUp className="h-3.5 w-3.5" />
                      Target IRR
                    </div>
                    <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {buyer.investmentCriteria.targetIRR}%
                    </p>
                  </div>
                )}
                {buyer.investmentCriteria.holdPeriod && (
                  <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                    <div className="flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-400">
                      <Timer className="h-3.5 w-3.5" />
                      Hold Period
                    </div>
                    <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {buyer.investmentCriteria.holdPeriod}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* ════════════════════════════════════════════════════════════
            SECTION 3 -- Matched Properties
        ════════════════════════════════════════════════════════════ */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-violet-600" />
                  Matched Properties
                </CardTitle>
                <CardDescription>
                  {sortedProperties.length} properties matching buyer criteria
                </CardDescription>
              </div>
              <Badge variant="secondary" className="text-sm">
                {sortedProperties.length} Matches
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {sortedProperties.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Address</TableHead>
                    <TableHead>Property Type</TableHead>
                    <TableHead className="text-right">Value</TableHead>
                    <TableHead className="text-center">Match Score</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedProperties.map((prop) => {
                    // Infer property type from address patterns or use a default
                    const propertyTypes = [
                      "SFR",
                      "Multi-Family",
                      "Commercial",
                      "Industrial",
                      "Office",
                      "Retail",
                      "Mixed-Use",
                      "Land",
                    ]
                    const propType =
                      buyer.propertyTypes[0] ??
                      propertyTypes[
                        Math.abs(prop.propertyId.charCodeAt(prop.propertyId.length - 1)) %
                          propertyTypes.length
                      ]

                    return (
                      <TableRow key={prop.propertyId} className="cursor-pointer">
                        <TableCell className="font-medium">
                          {prop.address}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1.5">
                            <PropertyIcon type={propType} />
                            <span className="text-xs text-gray-500">
                              {propType}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {formatCurrency(prop.value)}
                        </TableCell>
                        <TableCell className="text-center">
                          <ScoreBadge score={prop.matchScore} size="sm" />
                        </TableCell>
                        <TableCell className="text-right">
                          <Button size="sm" variant="outline">
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            ) : (
              <div className="py-8 text-center">
                <FileText className="mx-auto h-8 w-8 text-gray-300 dark:text-gray-600" />
                <p className="mt-2 text-sm text-gray-500">
                  No matched properties yet
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* ════════════════════════════════════════════════════════════
            SECTION 4 -- Communication History
        ════════════════════════════════════════════════════════════ */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-purple-600" />
                  Communication History
                </CardTitle>
                <CardDescription>
                  {comms.length} contact records
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline">
                  <Plus className="h-3.5 w-3.5" />
                  Add Note
                </Button>
                <Button size="sm" variant="outline">
                  <Calendar className="h-3.5 w-3.5" />
                  Schedule Follow-up
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-0">
              {comms.map((entry, idx) => (
                <div key={idx} className="relative flex gap-4 pb-5">
                  {/* Timeline connector */}
                  <div className="flex flex-col items-center">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                      {contactIcon(entry.type)}
                    </div>
                    {idx < comms.length - 1 && (
                      <div className="h-full w-px bg-gray-200 dark:bg-gray-700" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="min-w-0 flex-1 pt-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium capitalize text-gray-900 dark:text-gray-100">
                        {entry.type}
                      </span>
                      {sentimentBadge(entry.sentiment)}
                    </div>
                    <p className="mt-0.5 text-sm text-gray-600 dark:text-gray-400">
                      {entry.note}
                    </p>
                    <div className="mt-1 flex items-center gap-1 text-xs text-gray-400">
                      <Clock className="h-3 w-3" />
                      {formatDate(entry.date)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* ════════════════════════════════════════════════════════════
            SECTION 5 -- Property Preferences
        ════════════════════════════════════════════════════════════ */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-600" />
              Property Preferences
            </CardTitle>
            <CardDescription>
              Buyer search criteria and requirements
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {/* Preferred Property Types */}
              <div>
                <p className="mb-2 text-xs font-semibold text-gray-500 dark:text-gray-400">
                  Preferred Property Types
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {buyer.propertyTypes.map((pt) => (
                    <Badge key={pt} variant="outline" className="text-xs">
                      {pt}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Preferred Markets */}
              <div>
                <p className="mb-2 text-xs font-semibold text-gray-500 dark:text-gray-400">
                  Preferred Markets
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {buyer.preferredMarkets.map((market) => (
                    <Badge key={market} variant="outline" className="text-xs">
                      {market}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Timeline */}
              <div>
                <p className="mb-2 text-xs font-semibold text-gray-500 dark:text-gray-400">
                  Purchase Timeline
                </p>
                <div className="flex items-center gap-2">
                  <Timer className="h-4 w-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {timelineLabels[buyer.timeline] ?? buyer.timeline}
                  </span>
                </div>
              </div>

              {/* Financing */}
              <div>
                <p className="mb-2 text-xs font-semibold text-gray-500 dark:text-gray-400">
                  Financing Details
                </p>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm">
                    {preApprovalBadge(buyer.preApprovalStatus)}
                  </div>
                  {buyer.preApprovalAmount && (
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Approved: {formatCurrency(buyer.preApprovalAmount)}
                    </p>
                  )}
                  {buyer.lender && (
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Lender: {buyer.lender}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
