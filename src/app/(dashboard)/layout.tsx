"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn, getInitials } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar } from "@/components/ui/avatar"
import {
  Radar,
  LayoutDashboard,
  Users,
  Search,
  Send,
  Phone,
  FileText,
  Database,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  Bell,
  Sparkles,
  Menu,
  X,
  ChevronDown,
  LogOut,
  User as UserIcon,
  CreditCard,
  ArrowUpRight,
  Activity,
  ShoppingCart,
  Key,
  UserCheck,
  MapPin,
} from "lucide-react"
import { useAppStore } from "@/store"
import { AtlasChat } from "@/components/ai/atlas-chat"

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { label: "Signals", icon: Activity, href: "/dashboard/signals", badge: "NEW" },
  { label: "Leads", icon: Users, href: "/dashboard/leads" },
  { label: "Buyers", icon: ShoppingCart, href: "/dashboard/buyers" },
  { label: "Tenants", icon: Key, href: "/dashboard/tenants" },
  { label: "Search", icon: Search, href: "/dashboard/search" },
  { label: "Outreach", icon: Send, href: "/dashboard/outreach" },
  { label: "Voice AI", icon: Phone, href: "/dashboard/voice-ai" },
  { label: "Agents", icon: UserCheck, href: "/dashboard/agents" },
  { label: "Territory", icon: MapPin, href: "/dashboard/territory" },
  { label: "Documents", icon: FileText, href: "/dashboard/documents" },
  { label: "CRM", icon: Database, href: "/dashboard/crm" },
  { label: "Analytics", icon: BarChart3, href: "/dashboard/analytics" },
  { label: "Settings", icon: Settings, href: "/dashboard/settings" },
]

const mockUser = {
  name: "Brandon Hayes",
  email: "brandon@atlasrealty.com",
  plan: "starter" as "free" | "starter" | "pro" | "pro_cre",
  avatar: null as string | null,
}

function Breadcrumb() {
  const pathname = usePathname()
  const segments = pathname.split("/").filter(Boolean)

  return (
    <nav className="flex items-center gap-1.5 text-sm text-gray-500">
      <Link href="/dashboard" className="hover:text-gray-900 transition-colors">
        ATLAS
      </Link>
      {segments.map((segment, i) => (
        <span key={i} className="flex items-center gap-1.5">
          <span className="text-gray-300">/</span>
          <span
            className={cn(
              i === segments.length - 1
                ? "font-medium text-gray-900 capitalize"
                : "hover:text-gray-900 capitalize"
            )}
          >
            {segment.replace(/-/g, " ")}
          </span>
        </span>
      ))}
    </nav>
  )
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { sidebarOpen, toggleSidebar } = useAppStore()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [chatOpen, setChatOpen] = useState(false)
  const pathname = usePathname()

  const isFreePlan =
    mockUser.plan === "free" || mockUser.plan === "starter"

  // Cmd+K handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        document.getElementById("global-search")?.focus()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  // Close mobile sidebar on navigation
  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  const SidebarContent = useCallback(() => (
    <>
      {/* Logo */}
      <div className="flex h-16 items-center gap-2.5 px-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-600">
          <Radar className="h-5 w-5 text-white" />
        </div>
        {sidebarOpen && (
          <span className="text-lg font-bold tracking-tight text-white">
            ATLAS
          </span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = item.href === '/dashboard'
            ? pathname === '/dashboard'
            : pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                sidebarOpen ? "" : "justify-center",
                isActive
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-gray-400 hover:bg-gray-800 hover:text-white"
              )}
              title={!sidebarOpen ? item.label : undefined}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {sidebarOpen && (
                <>
                  <span className="flex-1">{item.label}</span>
                  {'badge' in item && item.badge && (
                    <span className="rounded-full bg-green-500/20 px-1.5 py-0.5 text-[10px] font-semibold text-green-400">
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Upgrade CTA */}
      {isFreePlan && sidebarOpen && (
        <div className="mx-3 mb-3 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 p-4">
          <p className="text-sm font-semibold text-white">Upgrade to Pro</p>
          <p className="mt-1 text-xs text-blue-200">
            Unlock unlimited leads, voice AI, and advanced analytics.
          </p>
          <button className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg bg-white px-3 py-2 text-xs font-semibold text-blue-700 transition-colors hover:bg-blue-50">
            Upgrade Now
            <ArrowUpRight className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Collapse toggle (desktop only) */}
      <div className="hidden lg:block border-t border-gray-800 px-3 py-2">
        <button
          onClick={toggleSidebar}
          className="flex w-full items-center justify-center gap-2 rounded-lg py-2 text-xs text-gray-500 transition-colors hover:bg-gray-800 hover:text-gray-300"
        >
          {sidebarOpen ? (
            <>
              <ChevronLeft className="h-4 w-4" />
              <span>Collapse</span>
            </>
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* User section */}
      <div className="border-t border-gray-800 p-3">
        <div
          className={cn(
            "flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-gray-800",
            sidebarOpen ? "" : "justify-center"
          )}
        >
          <Avatar
            size="sm"
            fallback={getInitials(mockUser.name)}
            className="bg-blue-700 text-white"
          />
          {sidebarOpen && (
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-white">
                {mockUser.name}
              </p>
              <Badge className="mt-0.5 bg-gray-700 text-gray-300 text-[10px] px-1.5 py-0 border-0">
                {mockUser.plan.charAt(0).toUpperCase() +
                  mockUser.plan.slice(1)}
              </Badge>
            </div>
          )}
        </div>
      </div>
    </>
  ), [sidebarOpen, pathname, isFreePlan, toggleSidebar])

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar - Mobile */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-[280px] flex-col bg-gray-900 transition-transform duration-200 lg:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="absolute right-3 top-3">
          <button
            onClick={() => setMobileOpen(false)}
            className="rounded-lg p-1 text-gray-400 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <SidebarContent />
      </aside>

      {/* Sidebar - Desktop */}
      <aside
        className={cn(
          "hidden lg:flex flex-col bg-gray-900 transition-all duration-200",
          sidebarOpen ? "w-[280px]" : "w-16"
        )}
      >
        <SidebarContent />
      </aside>

      {/* Main area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex h-16 shrink-0 items-center gap-4 border-b border-gray-200 bg-white px-4 lg:px-6">
          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(true)}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>

          <Breadcrumb />

          <div className="flex flex-1 items-center justify-end gap-3">
            {/* Global search */}
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                id="global-search"
                placeholder="Search leads, properties..."
                className="w-72 pl-9 pr-16 h-9 text-sm bg-gray-50 border-gray-200"
              />
              <kbd className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 rounded border border-gray-200 bg-gray-100 px-1.5 py-0.5 text-[10px] font-medium text-gray-400">
                Cmd+K
              </kbd>
            </div>

            {/* AI Assistant */}
            <Button variant="outline" size="sm" className="hidden sm:flex gap-1.5 h-9 text-xs" onClick={() => setChatOpen(true)}>
              <Sparkles className="h-3.5 w-3.5 text-blue-600" />
              Ask Atlas AI
            </Button>

            {/* Notifications */}
            <button className="relative rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900">
              <Bell className="h-5 w-5" />
              <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                3
              </span>
            </button>

            {/* User avatar dropdown */}
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 rounded-lg p-1.5 transition-colors hover:bg-gray-100"
              >
                <Avatar
                  size="sm"
                  fallback={getInitials(mockUser.name)}
                  className="bg-blue-600 text-white"
                />
                <ChevronDown className="hidden h-3.5 w-3.5 text-gray-400 sm:block" />
              </button>
              {userMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-30"
                    onClick={() => setUserMenuOpen(false)}
                  />
                  <div className="absolute right-0 z-40 mt-1 w-56 rounded-xl border border-gray-200 bg-white p-1.5 shadow-lg">
                    <div className="border-b border-gray-100 px-3 py-2 mb-1">
                      <p className="text-sm font-medium text-gray-900">
                        {mockUser.name}
                      </p>
                      <p className="text-xs text-gray-500">{mockUser.email}</p>
                    </div>
                    {[
                      { icon: UserIcon, label: "Profile" },
                      { icon: CreditCard, label: "Billing" },
                      { icon: Settings, label: "Settings" },
                    ].map(({ icon: Ic, label }) => (
                      <button
                        key={label}
                        className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50"
                      >
                        <Ic className="h-4 w-4 text-gray-400" />
                        {label}
                      </button>
                    ))}
                    <div className="my-1 border-t border-gray-100" />
                    <button className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-red-600 transition-colors hover:bg-red-50">
                      <LogOut className="h-4 w-4" />
                      Sign out
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">{children}</main>
      </div>

      {/* Atlas AI Chat Drawer */}
      <AtlasChat open={chatOpen} onClose={() => setChatOpen(false)} context={{ currentPage: pathname }} />
    </div>
  )
}
