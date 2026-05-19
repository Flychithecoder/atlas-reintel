"use client"

import { cn } from "@/lib/utils"

type Language = "en" | "es"

interface LanguageToggleProps {
  value: Language
  onChange: (lang: Language) => void
  className?: string
}

const options: { key: Language; label: string }[] = [
  { key: "en", label: "EN" },
  { key: "es", label: "ES" },
]

export function LanguageToggle({
  value,
  onChange,
  className,
}: LanguageToggleProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-0.5 rounded-full bg-gray-100 p-0.5 dark:bg-gray-800",
        className
      )}
      role="group"
      aria-label="Language selection"
    >
      {options.map(({ key, label }) => {
        const isActive = value === key
        return (
          <button
            key={key}
            type="button"
            onClick={() => onChange(key)}
            className={cn(
              "rounded-full px-3 py-1 text-xs font-semibold transition-colors",
              isActive
                ? "bg-blue-600 text-white shadow-sm"
                : "text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100"
            )}
            aria-pressed={isActive}
          >
            {label}
          </button>
        )
      })}
    </div>
  )
}
