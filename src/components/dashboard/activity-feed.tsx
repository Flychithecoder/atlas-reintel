"use client"

import { cn } from "@/lib/utils"
import {
  Zap,
  Mail,
  Phone,
  FileText,
  AlertTriangle,
  Building2,
  UserPlus,
  Target,
  Calendar,
  TrendingUp,
  Shield,
  MapPin,
  type LucideIcon,
} from "lucide-react"

interface ActivityItem {
  id: string
  icon: LucideIcon
  iconColor: string
  iconBg: string
  text: string
  time: string
}

const activities: ActivityItem[] = [
  {
    id: "1",
    icon: Zap,
    iconColor: "text-red-600",
    iconBg: "bg-red-50",
    text: "New lead scored 94 - 1234 Oak St, Miami FL",
    time: "2m ago",
  },
  {
    id: "2",
    icon: Mail,
    iconColor: "text-blue-600",
    iconBg: "bg-blue-50",
    text: "Maria Garcia responded to email campaign",
    time: "15m ago",
  },
  {
    id: "3",
    icon: Phone,
    iconColor: "text-green-600",
    iconBg: "bg-green-50",
    text: "Voice AI completed call - meeting booked with Robert Chen",
    time: "1h ago",
  },
  {
    id: "4",
    icon: FileText,
    iconColor: "text-purple-600",
    iconBg: "bg-purple-50",
    text: "45 new probate filings ingested - Houston, TX",
    time: "2h ago",
  },
  {
    id: "5",
    icon: AlertTriangle,
    iconColor: "text-orange-600",
    iconBg: "bg-orange-50",
    text: "SEC 8-K detected office closure - Acme Corp",
    time: "3h ago",
  },
  {
    id: "6",
    icon: Building2,
    iconColor: "text-indigo-600",
    iconBg: "bg-indigo-50",
    text: "3 new pre-foreclosure NODs filed - Dallas County",
    time: "3h ago",
  },
  {
    id: "7",
    icon: UserPlus,
    iconColor: "text-teal-600",
    iconBg: "bg-teal-50",
    text: "Skip trace enrichment completed - 847 records updated",
    time: "4h ago",
  },
  {
    id: "8",
    icon: Target,
    iconColor: "text-pink-600",
    iconBg: "bg-pink-50",
    text: "Lead score recalculated for 1,200 properties in Phoenix",
    time: "4h ago",
  },
  {
    id: "9",
    icon: Calendar,
    iconColor: "text-amber-600",
    iconBg: "bg-amber-50",
    text: "Meeting scheduled with Johnson Holdings LLC - 3:00 PM",
    time: "5h ago",
  },
  {
    id: "10",
    icon: TrendingUp,
    iconColor: "text-emerald-600",
    iconBg: "bg-emerald-50",
    text: "Pipeline value increased $2.1M this week",
    time: "6h ago",
  },
  {
    id: "11",
    icon: Shield,
    iconColor: "text-cyan-600",
    iconBg: "bg-cyan-50",
    text: "CMBS special servicer transfer detected - 500 Market St",
    time: "7h ago",
  },
  {
    id: "12",
    icon: MapPin,
    iconColor: "text-violet-600",
    iconBg: "bg-violet-50",
    text: "New vacancy detected via satellite - 2847 Commerce Dr, Atlanta",
    time: "8h ago",
  },
  {
    id: "13",
    icon: Mail,
    iconColor: "text-blue-600",
    iconBg: "bg-blue-50",
    text: "Direct mail campaign delivered - 500 pieces to LA market",
    time: "9h ago",
  },
  {
    id: "14",
    icon: Building2,
    iconColor: "text-amber-600",
    iconBg: "bg-amber-50",
    text: "New pre-market signal: Hotel property in Punta Cana — owner exploring sale",
    time: "10h ago",
  },
  {
    id: "15",
    icon: AlertTriangle,
    iconColor: "text-red-600",
    iconBg: "bg-red-50",
    text: "CRIM tax delinquency detected — 3 properties in San Juan",
    time: "11h ago",
  },
  {
    id: "16",
    icon: FileText,
    iconColor: "text-indigo-600",
    iconBg: "bg-indigo-50",
    text: "Registro de Títulos ownership transfer — Santo Domingo commercial district",
    time: "12h ago",
  },
]

interface ActivityFeedProps {
  maxItems?: number
  className?: string
}

export function ActivityFeed({ maxItems = 8, className }: ActivityFeedProps) {
  const visibleItems = activities.slice(0, maxItems)
  const remaining = activities.length - maxItems

  return (
    <div className={cn("space-y-1", className)}>
      {visibleItems.map((item, index) => (
        <div
          key={item.id}
          className="flex items-start gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-gray-50"
        >
          <div
            className={cn(
              "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
              item.iconBg
            )}
          >
            <item.icon className={cn("h-4 w-4", item.iconColor)} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm text-gray-700 leading-snug">{item.text}</p>
            <p className="mt-0.5 text-xs text-gray-400">{item.time}</p>
          </div>
          {index === 0 && (
            <span className="mt-1 inline-flex h-2 w-2 shrink-0 rounded-full bg-blue-500" />
          )}
        </div>
      ))}
      {remaining > 0 && (
        <button className="w-full rounded-lg px-3 py-2 text-center text-sm font-medium text-blue-600 transition-colors hover:bg-blue-50">
          View {remaining} more activities
        </button>
      )}
    </div>
  )
}
