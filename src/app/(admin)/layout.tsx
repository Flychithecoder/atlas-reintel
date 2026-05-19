"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn, getInitials } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar } from "@/components/ui/avatar"
import {
  Radar,
  LayoutDashboard,
  Users,
  Target,
  Database,
  CreditCard,
  BarChart3,
  Server,
  ArrowLeft,
  Bell,
  Search,
  Menu,
  X,
  ChevronDown,
  LogOut,
  Settings,
  Shield,
} from "lucide-react"

const adminNavItems = [
  { label: "Overview", icon: LayoutDashboard, href: "/admin" },
  { label: "Users", icon: Users, href: "/admin/users" },
  { label: "Leads Management", icon: Target, href: "/admin/leads-management" },
  { label: "Data Pipeline", icon: Database, href: "/admin/data-pipeline" },
  { label: "Billing", icon: CreditCard, href: "/admin/billing" },
  { label: "Analytics", icon: BarChart3, href: "/admin/analytics" },
  { label: "System", icon: Server, href: "/admin/system" },
]

const adminUser = {
  name: "Brandon Hayes",
  email: "brandon@atlasrealty.com",
  role: "Super Admin",
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin"
    return pathname.startsWith(href)
  }

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="flex h-16 items-center gap-2.5 px-4 border-b border-gray-800">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-600">
          <Radar className="h-5 w-5 text-white" />
        </div>
        <span className="text-lg font-bold tracking-tight text-white">
          ATLAS
        </span>
        <Badge className="ml-1 bg-red-600 text-white border-0 text-[10px] px-1.5 py-0">
          Admin
        </Badge>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {adminNavItems.map((item) => {
          const active = isActive(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                active
                  ? "bg-red-600 text-white shadow-sm"
                  : "text-gray-400 hover:bg-gray-800 hover:text-white"
              )}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Back to Dashboard */}
      <div className="px-3 pb-3">
        <Link
          href="/dashboard"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-400 transition-colors hover:bg-gray-800 hover:text-white"
        >
          <ArrowLeft className="h-5 w-5 shrink-0" />
          <span>Back to Dashboard</span>
        </Link>
      </div>

      {/* Admin user info */}
      <div className="border-t border-gray-800 p-3">
        <div className="flex items-center gap-3 rounded-lg p-2">
          <Avatar
            size="sm"
            fallback={getInitials(adminUser.name)}
            className="bg-red-700 text-white"
          />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-white">
              {adminUser.name}
            </p>
            <div className="flex items-center gap-1 mt-0.5">
              <Shield className="h-3 w-3 text-red-400" />
              <span className="text-[11px] text-red-400 font-medium">{adminUser.role}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  )

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
      <aside className="hidden lg:flex w-[280px] flex-col bg-gray-900">
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

          <div className="flex items-center gap-2">
            <h1 className="text-lg font-semibold text-gray-900">Admin Panel</h1>
            <Badge className="bg-red-100 text-red-700 border-red-200 text-[10px]">
              Restricted Access
            </Badge>
          </div>

          <div className="flex flex-1 items-center justify-end gap-3">
            {/* Search */}
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search users, settings..."
                className="w-64 pl-9 h-9 text-sm bg-gray-50 border-gray-200"
              />
            </div>

            {/* Notifications */}
            <button className="relative rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900">
              <Bell className="h-5 w-5" />
              <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                5
              </span>
            </button>

            {/* Admin avatar dropdown */}
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 rounded-lg p-1.5 transition-colors hover:bg-gray-100"
              >
                <Avatar
                  size="sm"
                  fallback={getInitials(adminUser.name)}
                  className="bg-red-600 text-white"
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
                      <p className="text-sm font-medium text-gray-900">{adminUser.name}</p>
                      <p className="text-xs text-gray-500">{adminUser.email}</p>
                    </div>
                    <button className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
                      <Settings className="h-4 w-4 text-gray-400" />
                      Admin Settings
                    </button>
                    <div className="my-1 border-t border-gray-100" />
                    <button className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50">
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
    </div>
  )
}
