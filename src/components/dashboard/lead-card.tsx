"use client"

import { useState } from "react"
import { cn, formatCurrency, formatDate } from "@/lib/utils"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar } from "@/components/ui/avatar"
import type { Lead, Signal } from "@/types"
import {
  MapPin,
  Building2,
  Calendar,
  Ruler,
  DollarSign,
  ChevronDown,
  Eye,
  Phone,
  Mail,
  MessageSquare,
  ExternalLink,
  Globe,
  Clock,
  Check,
} from "lucide-react"
import { useAppStore } from "@/store"

const signalColorMap: Record<Signal["type"], { bg: string; text: string }> = {
  distress: { bg: "bg-red-100", text: "text-red-800" },
  "life-event": { bg: "bg-purple-100", text: "text-purple-800" },
  financial: { bg: "bg-green-100", text: "text-green-800" },
  behavioral: { bg: "bg-blue-100", text: "text-blue-800" },
  market: { bg: "bg-orange-100", text: "text-orange-800" },
}

const statusColors: Record<Lead["status"], string> = {
  New: "bg-blue-100 text-blue-800",
  Contacted: "bg-yellow-100 text-yellow-800",
  Responded: "bg-green-100 text-green-800",
  Meeting: "bg-indigo-100 text-indigo-800",
  Negotiating: "bg-purple-100 text-purple-800",
  "Under Contract": "bg-teal-100 text-teal-800",
  Closed: "bg-emerald-100 text-emerald-800",
  Dead: "bg-gray-100 text-gray-800",
}

function ScoreBadge({ score }: { score: number }) {
  const color =
    score >= 80
      ? "bg-red-600 text-white"
      : score >= 50
        ? "bg-yellow-500 text-white"
        : "bg-gray-400 text-white"
  return (
    <div
      className={cn(
        "flex h-12 w-12 items-center justify-center rounded-xl text-lg font-bold shadow-sm",
        color
      )}
    >
      {score}
    </div>
  )
}

interface LeadCardProps {
  lead: Lead
  onView?: (lead: Lead) => void
  onContact?: (lead: Lead, method: string) => void
  className?: string
}

export function LeadCard({ lead, onView, onContact, className }: LeadCardProps) {
  const [contactOpen, setContactOpen] = useState(false)
  const [statusOpen, setStatusOpen] = useState(false)
  const { selectedLeads, selectLead, deselectLead } = useAppStore()
  const isSelected = selectedLeads.includes(lead.id)

  const toggleSelect = () => {
    if (isSelected) {
      deselectLead(lead.id)
    } else {
      selectLead(lead.id)
    }
  }

  return (
    <Card
      className={cn(
        "relative p-5 transition-all hover:shadow-md",
        isSelected && "ring-2 ring-blue-500",
        className
      )}
    >
      {/* Checkbox + Score Row */}
      <div className="flex items-start gap-4">
        <div className="flex flex-col items-center gap-2 pt-0.5">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={toggleSelect}
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <ScoreBadge score={lead.score} />
        </div>

        <div className="min-w-0 flex-1 space-y-3">
          {/* Owner + Entity */}
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-semibold text-gray-900">
                  {lead.owner.name}
                </h3>
                <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                  {lead.owner.entityType}
                </Badge>
                {lead.owner.outOfState && (
                  <span className="inline-flex items-center gap-0.5 rounded bg-amber-50 px-1.5 py-0.5 text-[10px] font-medium text-amber-700">
                    <Globe className="h-3 w-3" />
                    Out-of-State
                  </span>
                )}
              </div>
            </div>
            {/* Status */}
            <div className="relative">
              <button
                onClick={() => setStatusOpen(!statusOpen)}
                className={cn(
                  "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold",
                  statusColors[lead.status]
                )}
              >
                {lead.status}
                <ChevronDown className="h-3 w-3" />
              </button>
              {statusOpen && (
                <div className="absolute right-0 z-20 mt-1 w-40 rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
                  {Object.keys(statusColors).map((s) => (
                    <button
                      key={s}
                      onClick={() => setStatusOpen(false)}
                      className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-xs text-gray-700 hover:bg-gray-50"
                    >
                      {s === lead.status && (
                        <Check className="h-3 w-3 text-blue-600" />
                      )}
                      <span className={s === lead.status ? "font-semibold" : ""}>
                        {s}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Property Info */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 text-sm text-gray-600">
              <MapPin className="h-3.5 w-3.5 text-gray-400" />
              <span className="font-medium">
                {lead.property.address}, {lead.property.city},{" "}
                {lead.property.state} {lead.property.zip}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <Building2 className="h-3 w-3" />
                {lead.property.propertyType}
              </span>
              <span className="flex items-center gap-1">
                <Ruler className="h-3 w-3" />
                {lead.property.sqft.toLocaleString()} sqft
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                Built {lead.property.yearBuilt}
              </span>
              <span className="flex items-center gap-1 font-semibold text-gray-700">
                <DollarSign className="h-3 w-3" />
                {formatCurrency(lead.property.estimatedValue)}
              </span>
            </div>
          </div>

          {/* Signals */}
          <div className="flex flex-wrap gap-1.5">
            {lead.signals.map((signal, i) => {
              const colors = signalColorMap[signal.type]
              return (
                <span
                  key={i}
                  className={cn(
                    "inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-medium",
                    colors.bg,
                    colors.text
                  )}
                >
                  {signal.label}
                </span>
              )
            })}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-1">
            <div className="text-xs text-gray-400">
              {lead.lastContactDate ? (
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Last contact: {formatDate(lead.lastContactDate)}
                </span>
              ) : (
                <span className="text-amber-500 font-medium">Never contacted</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {/* Contact Dropdown */}
              <div className="relative">
                <Button
                  size="sm"
                  onClick={() => setContactOpen(!contactOpen)}
                  className="h-7 gap-1 text-xs"
                >
                  Contact
                  <ChevronDown className="h-3 w-3" />
                </Button>
                {contactOpen && (
                  <div className="absolute right-0 z-20 mt-1 w-36 rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
                    {[
                      { icon: Phone, label: "Call", method: "call" },
                      { icon: Mail, label: "Email", method: "email" },
                      { icon: MessageSquare, label: "SMS", method: "sms" },
                      { icon: ExternalLink, label: "LinkedIn", method: "linkedin" },
                    ].map(({ icon: Ic, label, method }) => (
                      <button
                        key={method}
                        onClick={() => {
                          onContact?.(lead, method)
                          setContactOpen(false)
                        }}
                        className="flex w-full items-center gap-2 px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-50"
                      >
                        <Ic className="h-3.5 w-3.5 text-gray-400" />
                        {label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onView?.(lead)}
                className="h-7 gap-1 text-xs"
              >
                <Eye className="h-3.5 w-3.5" />
                View
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
