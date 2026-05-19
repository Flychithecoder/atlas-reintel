"use client"

import { cn } from "@/lib/utils"

interface EntityBadgeProps {
  type: string
  size?: "sm" | "md"
  className?: string
}

const entityColors: Record<string, string> = {
  Individual:
    "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
  LLC:
    "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  Corporation:
    "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400",
  Trust:
    "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  Partnership:
    "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400",
}

const sizeClasses: Record<string, string> = {
  sm: "px-1.5 py-0 text-[10px]",
  md: "px-2 py-0.5 text-xs",
}

export function EntityBadge({
  type,
  size = "md",
  className,
}: EntityBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full font-medium",
        sizeClasses[size],
        entityColors[type] ??
          "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
        className
      )}
    >
      {type}
    </span>
  )
}
