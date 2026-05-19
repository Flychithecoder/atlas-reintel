"use client"

import { cn } from "@/lib/utils"

type Urgency = "imminent" | "near-term" | "medium-term"

interface UrgencyIndicatorProps {
  urgency: Urgency
  className?: string
}

const config: Record<Urgency, { label: string; bg: string; dot: string; pulse: boolean }> = {
  imminent: {
    label: "Imminent",
    bg: "bg-red-600 text-white",
    dot: "bg-white",
    pulse: true,
  },
  "near-term": {
    label: "Near-term",
    bg: "bg-orange-500 text-white",
    dot: "bg-white",
    pulse: false,
  },
  "medium-term": {
    label: "Medium-term",
    bg: "bg-yellow-500 text-white",
    dot: "bg-white",
    pulse: false,
  },
}

export function UrgencyIndicator({
  urgency,
  className,
}: UrgencyIndicatorProps) {
  const { label, bg, dot, pulse } = config[urgency]

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold",
        bg,
        className
      )}
    >
      <span className="relative flex h-2 w-2">
        {pulse && (
          <span
            className={cn(
              "absolute inline-flex h-full w-full animate-ping rounded-full opacity-75",
              dot
            )}
          />
        )}
        <span
          className={cn("relative inline-flex h-2 w-2 rounded-full", dot)}
        />
      </span>
      {label}
    </span>
  )
}
