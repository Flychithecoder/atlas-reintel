"use client"

import { cn } from "@/lib/utils"
import { Sparkles, AlertTriangle } from "lucide-react"

interface ContactStatusProps {
  count: number
  className?: string
}

function getStatusConfig(count: number) {
  if (count === 0) {
    return {
      label: "First to reach!",
      colors:
        "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
      icon: Sparkles,
      note: null,
    }
  }
  if (count <= 3) {
    return {
      label: `${count} broker${count > 1 ? "s" : ""} contacted`,
      colors:
        "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
      icon: null,
      note: null,
    }
  }
  if (count <= 6) {
    return {
      label: `${count} brokers contacted`,
      colors:
        "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
      icon: null,
      note: null,
    }
  }
  return {
    label: `${count}+ brokers contacted`,
    colors:
      "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    icon: AlertTriangle,
    note: "Consider moving on",
  }
}

export function ContactStatus({ count, className }: ContactStatusProps) {
  const { label, colors, icon: Icon, note } = getStatusConfig(count)

  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <span
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold",
          colors
        )}
      >
        {Icon && <Icon className="h-3.5 w-3.5" />}
        {label}
      </span>
      {note && (
        <span className="text-[10px] font-medium text-red-500 dark:text-red-400">
          {note}
        </span>
      )}
    </div>
  )
}
