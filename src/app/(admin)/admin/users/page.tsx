"use client"

import { useState, useEffect, useMemo } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { generateUsers } from "@/hooks/use-mock-data"
import type { User } from "@/types"
import { getInitials } from "@/lib/utils"
import {
  Search,
  Filter,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  UserPlus,
  Download,
  Mail,
  Ban,
  Trash2,
  Eye,
  Pencil,
  Users as UsersIcon,
  CheckSquare,
  Square,
} from "lucide-react"

const planBadge: Record<string, { color: string; label: string }> = {
  free: { color: "bg-gray-100 text-gray-700 border-gray-200", label: "Free" },
  starter: { color: "bg-blue-100 text-blue-700 border-blue-200", label: "Starter" },
  pro: { color: "bg-indigo-100 text-indigo-700 border-indigo-200", label: "Pro" },
  pro_cre: { color: "bg-purple-100 text-purple-700 border-purple-200", label: "Pro CRE" },
  team: { color: "bg-teal-100 text-teal-700 border-teal-200", label: "Team" },
  enterprise: { color: "bg-amber-100 text-amber-700 border-amber-200", label: "Enterprise" },
}

const statusBadge: Record<string, { color: string; label: string }> = {
  active: { color: "bg-green-100 text-green-700", label: "Active" },
  inactive: { color: "bg-gray-100 text-gray-600", label: "Inactive" },
  trial: { color: "bg-blue-100 text-blue-700", label: "Trial" },
  suspended: { color: "bg-red-100 text-red-700", label: "Suspended" },
}

function relativeTime(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d ago`
  return `${Math.floor(days / 7)}w ago`
}

type SortKey = "name" | "lastActive" | "enrichmentsUsed" | "createdAt"

export default function AdminUsersPage() {
  const [allUsers, setAllUsers] = useState<User[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [planFilter, setPlanFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [sortBy, setSortBy] = useState<SortKey>("lastActive")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [page, setPage] = useState(1)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [openActionId, setOpenActionId] = useState<string | null>(null)
  const [showPlanFilter, setShowPlanFilter] = useState(false)
  const [showStatusFilter, setShowStatusFilter] = useState(false)
  const [showSortMenu, setShowSortMenu] = useState(false)
  const perPage = 20

  useEffect(() => {
    setAllUsers(generateUsers(200))
  }, [])

  const filteredUsers = useMemo(() => {
    let result = allUsers
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      result = result.filter(
        (u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
      )
    }
    if (planFilter !== "all") {
      result = result.filter((u) => u.plan === planFilter)
    }
    if (statusFilter !== "all") {
      result = result.filter((u) => u.status === statusFilter)
    }
    result = [...result].sort((a, b) => {
      let cmp = 0
      switch (sortBy) {
        case "name":
          cmp = a.name.localeCompare(b.name)
          break
        case "lastActive":
          cmp = new Date(a.lastActive).getTime() - new Date(b.lastActive).getTime()
          break
        case "enrichmentsUsed":
          cmp = a.enrichmentsUsed - b.enrichmentsUsed
          break
        case "createdAt":
          cmp = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          break
      }
      return sortOrder === "asc" ? cmp : -cmp
    })
    return result
  }, [allUsers, searchQuery, planFilter, statusFilter, sortBy, sortOrder])

  const totalPages = Math.ceil(filteredUsers.length / perPage)
  const pagedUsers = filteredUsers.slice((page - 1) * perPage, page * perPage)

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const toggleSelectAll = () => {
    if (selectedIds.size === pagedUsers.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(pagedUsers.map((u) => u.id)))
    }
  }

  // Plan distribution counts (from total 2847)
  const planCounts = { free: 1204, starter: 847, pro: 523, pro_cre: 189, team: 60, enterprise: 84 }
  const total = 2847

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="text-sm text-gray-500 mt-1">Manage platform users, plans, and access</p>
        </div>
        <Button className="gap-2 bg-red-600 hover:bg-red-700">
          <UserPlus className="h-4 w-4" />
          Add User
        </Button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <Card className="p-3 text-center">
          <p className="text-xl font-bold text-gray-900">{total.toLocaleString()}</p>
          <p className="text-xs text-gray-500">Total Users</p>
        </Card>
        {Object.entries(planCounts).map(([plan, count]) => (
          <Card key={plan} className="p-3 text-center">
            <p className="text-xl font-bold text-gray-900">{count.toLocaleString()}</p>
            <div className="flex items-center justify-center gap-1.5 mt-0.5">
              <Badge className={`${planBadge[plan].color} text-[10px]`}>{planBadge[plan].label}</Badge>
              <span className="text-[10px] text-gray-400">
                {((count / total) * 100).toFixed(0)}%
              </span>
            </div>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setPage(1) }}
              className="pl-9 h-9 text-sm"
            />
          </div>

          {/* Plan Filter */}
          <div className="relative">
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 text-xs"
              onClick={() => { setShowPlanFilter(!showPlanFilter); setShowStatusFilter(false); setShowSortMenu(false) }}
            >
              <Filter className="h-3.5 w-3.5" />
              Plan{planFilter !== "all" && `: ${planBadge[planFilter]?.label}`}
              <ChevronDown className="h-3 w-3" />
            </Button>
            {showPlanFilter && (
              <>
                <div className="fixed inset-0 z-20" onClick={() => setShowPlanFilter(false)} />
                <div className="absolute right-0 z-30 mt-1 w-40 rounded-lg border bg-white p-1 shadow-lg">
                  {["all", "free", "starter", "pro", "pro_cre", "team", "enterprise"].map((p) => (
                    <button
                      key={p}
                      className={`w-full text-left rounded px-3 py-1.5 text-xs hover:bg-gray-50 ${planFilter === p ? "bg-gray-100 font-medium" : ""}`}
                      onClick={() => { setPlanFilter(p); setShowPlanFilter(false); setPage(1) }}
                    >
                      {p === "all" ? "All Plans" : planBadge[p]?.label || p}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Status Filter */}
          <div className="relative">
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 text-xs"
              onClick={() => { setShowStatusFilter(!showStatusFilter); setShowPlanFilter(false); setShowSortMenu(false) }}
            >
              <Filter className="h-3.5 w-3.5" />
              Status{statusFilter !== "all" && `: ${statusBadge[statusFilter]?.label}`}
              <ChevronDown className="h-3 w-3" />
            </Button>
            {showStatusFilter && (
              <>
                <div className="fixed inset-0 z-20" onClick={() => setShowStatusFilter(false)} />
                <div className="absolute right-0 z-30 mt-1 w-40 rounded-lg border bg-white p-1 shadow-lg">
                  {["all", "active", "inactive", "trial", "suspended"].map((s) => (
                    <button
                      key={s}
                      className={`w-full text-left rounded px-3 py-1.5 text-xs hover:bg-gray-50 ${statusFilter === s ? "bg-gray-100 font-medium" : ""}`}
                      onClick={() => { setStatusFilter(s); setShowStatusFilter(false); setPage(1) }}
                    >
                      {s === "all" ? "All Statuses" : statusBadge[s]?.label || s}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Sort */}
          <div className="relative">
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 text-xs"
              onClick={() => { setShowSortMenu(!showSortMenu); setShowPlanFilter(false); setShowStatusFilter(false) }}
            >
              Sort: {sortBy === "name" ? "Name" : sortBy === "lastActive" ? "Last Active" : sortBy === "enrichmentsUsed" ? "Enrichments" : "Created"}
              <ChevronDown className="h-3 w-3" />
            </Button>
            {showSortMenu && (
              <>
                <div className="fixed inset-0 z-20" onClick={() => setShowSortMenu(false)} />
                <div className="absolute right-0 z-30 mt-1 w-44 rounded-lg border bg-white p-1 shadow-lg">
                  {([
                    ["name", "Name"],
                    ["lastActive", "Last Active"],
                    ["enrichmentsUsed", "Enrichments"],
                    ["createdAt", "Created Date"],
                  ] as const).map(([key, label]) => (
                    <button
                      key={key}
                      className={`w-full text-left rounded px-3 py-1.5 text-xs hover:bg-gray-50 ${sortBy === key ? "bg-gray-100 font-medium" : ""}`}
                      onClick={() => {
                        if (sortBy === key) setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                        else { setSortBy(key); setSortOrder("desc") }
                        setShowSortMenu(false)
                      }}
                    >
                      {label} {sortBy === key && (sortOrder === "asc" ? "↑" : "↓")}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </Card>

      {/* Bulk Actions Bar */}
      {selectedIds.size > 0 && (
        <Card className="p-3 bg-red-50 border-red-200">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-red-800">
              {selectedIds.size} user{selectedIds.size > 1 ? "s" : ""} selected
            </span>
            <div className="flex items-center gap-2 ml-auto">
              <Button variant="outline" size="sm" className="gap-1.5 text-xs h-7">
                <Pencil className="h-3 w-3" /> Change Plan
              </Button>
              <Button variant="outline" size="sm" className="gap-1.5 text-xs h-7">
                <Mail className="h-3 w-3" /> Send Email
              </Button>
              <Button variant="outline" size="sm" className="gap-1.5 text-xs h-7 text-yellow-700 border-yellow-300 hover:bg-yellow-50">
                <Ban className="h-3 w-3" /> Suspend
              </Button>
              <Button variant="outline" size="sm" className="gap-1.5 text-xs h-7">
                <Download className="h-3 w-3" /> Export
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* User Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="w-10 py-3 px-3">
                  <button onClick={toggleSelectAll} className="text-gray-400 hover:text-gray-600">
                    {selectedIds.size === pagedUsers.length && pagedUsers.length > 0 ? (
                      <CheckSquare className="h-4 w-4 text-red-600" />
                    ) : (
                      <Square className="h-4 w-4" />
                    )}
                  </button>
                </th>
                <th className="text-left py-3 px-3 font-medium text-gray-500">User</th>
                <th className="text-left py-3 px-3 font-medium text-gray-500">Email</th>
                <th className="text-left py-3 px-3 font-medium text-gray-500">Plan</th>
                <th className="text-left py-3 px-3 font-medium text-gray-500">Company</th>
                <th className="text-left py-3 px-3 font-medium text-gray-500">Territory</th>
                <th className="text-left py-3 px-3 font-medium text-gray-500">Enrichments</th>
                <th className="text-left py-3 px-3 font-medium text-gray-500">Last Active</th>
                <th className="text-left py-3 px-3 font-medium text-gray-500">Status</th>
                <th className="w-12 py-3 px-3"></th>
              </tr>
            </thead>
            <tbody>
              {pagedUsers.map((user) => {
                const enrichLimit = user.enrichmentsLimit === -1 ? "Unlimited" : user.enrichmentsLimit
                const enrichPct = user.enrichmentsLimit === -1 ? (user.enrichmentsUsed / 500) * 100 : (user.enrichmentsUsed / user.enrichmentsLimit) * 100
                return (
                  <tr key={user.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="py-3 px-3">
                      <button onClick={() => toggleSelect(user.id)} className="text-gray-400 hover:text-gray-600">
                        {selectedIds.has(user.id) ? (
                          <CheckSquare className="h-4 w-4 text-red-600" />
                        ) : (
                          <Square className="h-4 w-4" />
                        )}
                      </button>
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2.5">
                        <Avatar size="sm" fallback={getInitials(user.name)} className="bg-gray-200 text-gray-700" />
                        <span className="font-medium text-gray-900 whitespace-nowrap">{user.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-gray-600 max-w-[180px] truncate">{user.email}</td>
                    <td className="py-3 px-3">
                      <Badge className={`${planBadge[user.plan].color} text-[11px]`}>
                        {planBadge[user.plan].label}
                      </Badge>
                    </td>
                    <td className="py-3 px-3 text-gray-600 whitespace-nowrap">{user.company || "-"}</td>
                    <td className="py-3 px-3 text-gray-600 whitespace-nowrap">{user.territories[0] || "-"}</td>
                    <td className="py-3 px-3">
                      <div className="w-28">
                        <div className="flex justify-between text-[11px] mb-1">
                          <span className="text-gray-700">{user.enrichmentsUsed}</span>
                          <span className="text-gray-400">/ {enrichLimit}</span>
                        </div>
                        <Progress
                          value={Math.min(enrichPct, 100)}
                          max={100}
                          className="h-1.5"
                          indicatorClassName={enrichPct > 90 ? "bg-red-500" : enrichPct > 70 ? "bg-yellow-500" : "bg-blue-600"}
                        />
                      </div>
                    </td>
                    <td className="py-3 px-3 text-gray-500 whitespace-nowrap text-xs">{relativeTime(user.lastActive)}</td>
                    <td className="py-3 px-3">
                      <Badge className={`${statusBadge[user.status].color} text-[11px]`}>
                        {statusBadge[user.status].label}
                      </Badge>
                    </td>
                    <td className="py-3 px-3">
                      <div className="relative">
                        <button
                          onClick={() => setOpenActionId(openActionId === user.id ? null : user.id)}
                          className="rounded p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
                        {openActionId === user.id && (
                          <>
                            <div className="fixed inset-0 z-20" onClick={() => setOpenActionId(null)} />
                            <div className="absolute right-0 z-30 mt-1 w-44 rounded-lg border bg-white p-1 shadow-lg">
                              <button className="flex w-full items-center gap-2 rounded px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-50">
                                <Eye className="h-3.5 w-3.5" /> View Profile
                              </button>
                              <button className="flex w-full items-center gap-2 rounded px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-50">
                                <Pencil className="h-3.5 w-3.5" /> Edit Plan
                              </button>
                              <button className="flex w-full items-center gap-2 rounded px-3 py-1.5 text-xs text-yellow-700 hover:bg-yellow-50">
                                <Ban className="h-3.5 w-3.5" /> Suspend
                              </button>
                              <button className="flex w-full items-center gap-2 rounded px-3 py-1.5 text-xs text-red-600 hover:bg-red-50">
                                <Trash2 className="h-3.5 w-3.5" /> Delete
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-gray-100 px-4 py-3">
          <p className="text-sm text-gray-500">
            Showing {(page - 1) * perPage + 1}-{Math.min(page * perPage, filteredUsers.length)} of{" "}
            {filteredUsers.length.toLocaleString()} users
          </p>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="h-8 w-8 p-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              const pageNum = i + 1
              return (
                <Button
                  key={pageNum}
                  variant={page === pageNum ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPage(pageNum)}
                  className={`h-8 w-8 p-0 text-xs ${page === pageNum ? "bg-red-600 hover:bg-red-700" : ""}`}
                >
                  {pageNum}
                </Button>
              )
            })}
            {totalPages > 5 && <span className="text-gray-400 px-1">...</span>}
            <Button
              variant="outline"
              size="sm"
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
              className="h-8 w-8 p-0"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
