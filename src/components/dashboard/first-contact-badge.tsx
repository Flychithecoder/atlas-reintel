"use client"

import { cn } from "@/lib/utils"
import { Sparkles, AlertTriangle, Users, XCircle } from "lucide-react"

interface FirstContactBadgeProps {
  contactedByCount: number
  className?: string
  size?: "sm" | "md" | "lg"
}

const sizeStyles = {
  sm: "gap-1 px-2 py-0.5 text-xs",
  md: "gap-1.5 px-2.5 py-1 text-sm",
  lg: "gap-2 px-3 py-1.5 text-base",
}

const iconSizes = {
  sm: "h-3 w-3",
  md: "h-4 w-4",
  lg: "h-5 w-5",
}

function getBadgeConfig(count: number) {
  if (count === 0) {
    return {
      icon: Sparkles,
      label: "You're first!",
      sublabel: "First to reach!",
      bg: "bg-green-100 dark:bg-green-900/50",
      text: "text-green-800 dark:text-green-200",
      border: "border-green-200 dark:border-green-800",
    }
  }
  if (count <= 3) {
    return {
      icon: AlertTriangle,
      label: `${count} broker${count > 1 ? "s" : ""} contacted`,
      sublabel: null,
      bg: "bg-yellow-100 dark:bg-yellow-900/50",
      text: "text-yellow-800 dark:text-yellow-200",
      border: "border-yellow-200 dark:border-yellow-800",
    }
  }
  if (count <= 6) {
    return {
      icon: Users,
      label: `${count} brokers contacted`,
      sublabel: "act fast",
      bg: "bg-orange-100 dark:bg-orange-900/50",
      text: "text-orange-800 dark:text-orange-200",
      border: "border-orange-200 dark:border-orange-800",
    }
  }
  return {
    icon: XCircle,
    label: `${count}+ brokers`,
    sublabel: "consider moving on",
    bg: "bg-red-100 dark:bg-red-900/50",
    text: "text-red-800 dark:text-red-200",
    border: "border-red-200 dark:border-red-800",
  }
}

export function FirstContactBadge({
  contactedByCount,
  className,
  size = "md",
}: FirstContactBadgeProps) {
  const config = getBadgeConfig(contactedByCount)
  const Icon = config.icon

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border font-semibold",
        sizeStyles[size],
        config.bg,
        config.text,
        config.border,
        className
      )}
    >
      <Icon className={iconSizes[size]} />
      <span>{config.label}</span>
      {config.sublabel && (
        <>
          <span className="opacity-60">&mdash;</span>
          <span className="opacity-80">{config.sublabel}</span>
        </>
      )}
    </span>
  )
}
