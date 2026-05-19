"use client"

import { cn } from "@/lib/utils"
import {
  Home,
  Building2,
  Building,
  Factory,
  Landmark,
  Store,
  LayoutGrid,
  Map,
  HelpCircle,
} from "lucide-react"
import type { LucideProps } from "lucide-react"

const iconMap: Record<string, React.ComponentType<LucideProps>> = {
  SFR: Home,
  "Multi-Family": Building2,
  Commercial: Building,
  Industrial: Factory,
  Office: Landmark,
  Retail: Store,
  "Mixed-Use": LayoutGrid,
  Land: Map,
}

interface PropertyIconProps {
  type: string
  className?: string
}

export function PropertyIcon({ type, className }: PropertyIconProps) {
  const Icon = iconMap[type] ?? HelpCircle

  return <Icon className={cn("h-4 w-4", className)} />
}
