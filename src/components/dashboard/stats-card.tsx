"use client"

import { cn } from "@/lib/utils"
import { Card } from "@/components/ui/card"
import { type LucideIcon } from "lucide-react"

interface StatsCardProps {
  label: string
  value: string
  icon: LucideIcon
  trend?: {
    value: string
    positive: boolean
  }
  iconColor?: string
  iconBg?: string
  className?: string
}

export function StatsCard({
  label,
  value,
  icon: Icon,
  trend,
  iconColor = "text-blue-600",
  iconBg = "bg-blue-50",
  className,
}: StatsCardProps) {
  return (
    <Card className={cn("p-6", className)}>
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-500">{label}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {trend && (
            <div className="flex items-center gap-1">
              <span
                className={cn(
                  "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold",
                  trend.positive
                    ? "bg-green-50 text-green-700"
                    : "bg-red-50 text-red-700"
                )}
              >
                {trend.positive ? "+" : ""}
                {trend.value}
              </span>
              <span className="text-xs text-gray-400">vs last month</span>
            </div>
          )}
        </div>
        <div className={cn("rounded-xl p-3", iconBg)}>
          <Icon className={cn("h-6 w-6", iconColor)} />
        </div>
      </div>
    </Card>
  )
}
