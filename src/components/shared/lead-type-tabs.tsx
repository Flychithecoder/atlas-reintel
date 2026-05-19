"use client"

import { cn } from "@/lib/utils"
import { Target, ShoppingCart, Key } from "lucide-react"

type LeadType = "seller" | "buyer" | "tenant"

interface LeadTypeTabsProps {
  value: LeadType
  onChange: (type: LeadType) => void
  className?: string
}

const tabs: { key: LeadType; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { key: "seller", label: "Sellers", icon: Target },
  { key: "buyer", label: "Buyers", icon: ShoppingCart },
  { key: "tenant", label: "Tenants", icon: Key },
]

export function LeadTypeTabs({
  value,
  onChange,
  className,
}: LeadTypeTabsProps) {
  return (
    <div
      className={cn("flex items-center border-b border-gray-200 dark:border-gray-700", className)}
      role="tablist"
      aria-label="Lead type"
    >
      {tabs.map(({ key, label, icon: Icon }) => {
        const isActive = value === key
        return (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(key)}
            className={cn(
              "inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium transition-colors",
              isActive
                ? "border-b-2 border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400"
                : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        )
      })}
    </div>
  )
}
