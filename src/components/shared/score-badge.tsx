"use client"

import { cn } from "@/lib/utils"

interface ScoreBadgeProps {
  score: number
  size?: "sm" | "md" | "lg"
  className?: string
}

const sizeClasses: Record<string, string> = {
  sm: "h-7 w-7 text-xs",
  md: "h-9 w-9 text-sm",
  lg: "h-12 w-12 text-lg",
}

function getScoreColor(score: number): string {
  if (score >= 90)
    return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
  if (score >= 80)
    return "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
  if (score >= 60)
    return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
  if (score >= 40)
    return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
  return "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
}

export function ScoreBadge({ score, size = "md", className }: ScoreBadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center justify-center rounded-full font-bold",
        sizeClasses[size],
        getScoreColor(score),
        className
      )}
    >
      {score}
    </div>
  )
}
