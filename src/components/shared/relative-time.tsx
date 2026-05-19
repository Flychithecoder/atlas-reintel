"use client"

import { cn } from "@/lib/utils"
import { formatDistanceToNow } from "date-fns"

interface RelativeTimeProps {
  date: string
  className?: string
}

export function RelativeTime({ date, className }: RelativeTimeProps) {
  const parsed = new Date(date)

  const diffMs = Date.now() - parsed.getTime()
  if (diffMs < 60_000) {
    return <span className={cn("text-sm text-gray-500 dark:text-gray-400", className)}>Just now</span>
  }

  const relative = formatDistanceToNow(parsed, { addSuffix: true })

  return (
    <time
      dateTime={parsed.toISOString()}
      title={parsed.toLocaleString()}
      className={cn("text-sm text-gray-500 dark:text-gray-400", className)}
    >
      {relative}
    </time>
  )
}
