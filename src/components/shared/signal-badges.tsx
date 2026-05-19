"use client"

import { cn } from "@/lib/utils"

interface SignalBadgesProps {
  signals: { type: string; label: string }[]
  max?: number
  className?: string
}

const signalColors: Record<string, string> = {
  distress:
    "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  "life-event":
    "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  financial:
    "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  behavioral:
    "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  market:
    "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
}

export function SignalBadges({
  signals,
  max = 3,
  className,
}: SignalBadgesProps) {
  const visible = signals.slice(0, max)
  const remaining = signals.length - max

  return (
    <div className={cn("flex flex-wrap items-center gap-1.5", className)}>
      {visible.map((signal, i) => (
        <span
          key={i}
          className={cn(
            "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium",
            signalColors[signal.type] ??
              "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
          )}
        >
          {signal.label}
        </span>
      ))}
      {remaining > 0 && (
        <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-500 dark:bg-gray-800 dark:text-gray-400">
          +{remaining} more
        </span>
      )}
    </div>
  )
}
