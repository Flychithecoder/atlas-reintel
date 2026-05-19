"use client"

import { cn } from "@/lib/utils"

interface MotivationMeterProps {
  score: number
  size?: "sm" | "md" | "lg"
  className?: string
}

const sizeConfig: Record<string, { container: string; text: string; label: string; stroke: number }> = {
  sm: { container: "h-16 w-16", text: "text-sm", label: "text-[10px]", stroke: 6 },
  md: { container: "h-24 w-24", text: "text-xl", label: "text-xs", stroke: 8 },
  lg: { container: "h-32 w-32", text: "text-2xl", label: "text-sm", stroke: 10 },
}

function getMotivationColor(score: number): string {
  if (score >= 80) return "#ef4444"  // red-500
  if (score >= 60) return "#f97316"  // orange-500
  if (score >= 40) return "#eab308"  // yellow-500
  return "#22c55e"                    // green-500
}

function getMotivationLabel(score: number): string {
  if (score >= 80) return "Very High"
  if (score >= 60) return "High"
  if (score >= 40) return "Moderate"
  return "Low"
}

export function MotivationMeter({
  score,
  size = "md",
  className,
}: MotivationMeterProps) {
  const clamped = Math.max(0, Math.min(100, score))
  const cfg = sizeConfig[size]
  const color = getMotivationColor(clamped)
  const label = getMotivationLabel(clamped)

  // Semi-circle gauge using SVG
  const radius = 40
  const circumference = Math.PI * radius // half-circle
  const filled = (clamped / 100) * circumference

  return (
    <div className={cn("flex flex-col items-center", className)}>
      <div className={cn("relative", cfg.container)}>
        <svg
          viewBox="0 0 100 60"
          className="h-full w-full overflow-visible"
        >
          {/* Background arc */}
          <path
            d="M 10 55 A 40 40 0 0 1 90 55"
            fill="none"
            stroke="currentColor"
            strokeWidth={cfg.stroke}
            strokeLinecap="round"
            className="text-gray-200 dark:text-gray-700"
          />
          {/* Filled arc */}
          <path
            d="M 10 55 A 40 40 0 0 1 90 55"
            fill="none"
            stroke={color}
            strokeWidth={cfg.stroke}
            strokeLinecap="round"
            strokeDasharray={`${filled} ${circumference}`}
          />
        </svg>
        {/* Center number */}
        <div className="absolute inset-0 flex items-end justify-center pb-0">
          <span
            className={cn("font-bold", cfg.text)}
            style={{ color }}
          >
            {clamped}
          </span>
        </div>
      </div>
      <span
        className={cn(
          "mt-0.5 font-medium text-gray-600 dark:text-gray-400",
          cfg.label
        )}
      >
        {label}
      </span>
    </div>
  )
}
