"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { generateAdminStats, generateUsers } from "@/hooks/use-mock-data"
import { formatCurrency, formatNumber, getInitials, formatDate } from "@/lib/utils"
import {
  Users,
  UserCheck,
  DollarSign,
  TrendingUp,
  TrendingDown,
  ArrowDown,
  Activity,
  Zap,
  Clock,
  Database,
  Send,
  Download,
  FileWarning,
  Flag,
  Server,
} from "lucide-react"

const revenueData = [
  { month: "Jun", value: 180000 },
  { month: "Jul", value: 210000 },
  { month: "Aug", value: 245000 },
  { month: "Sep", value: 268000 },
  { month: "Oct", value: 295000 },
  { month: "Nov", value: 312000 },
  { month: "Dec", value: 340000 },
  { month: "Jan", value: 365000 },
  { month: "Feb", value: 398000 },
  { month: "Mar", value: 425000 },
  { month: "Apr", value: 456000 },
  { month: "May", value: 487000 },
]

const userGrowthData = [
  { month: "Jun", value: 450 },
  { month: "Jul", value: 580 },
  { month: "Aug", value: 740 },
  { month: "Sep", value: 920 },
  { month: "Oct", value: 1100 },
  { month: "Nov", value: 1320 },
  { month: "Dec", value: 1510 },
  { month: "Jan", value: 1740 },
  { month: "Feb", value: 1980 },
  { month: "Mar", value: 2210 },
  { month: "Apr", value: 2540 },
  { month: "May", value: 2847 },
]

const planBadgeColor: Record<string, string> = {
  free: "bg-gray-100 text-gray-700 border-gray-200",
  starter: "bg-blue-100 text-blue-700 border-blue-200",
  pro: "bg-indigo-100 text-indigo-700 border-indigo-200",
  pro_cre: "bg-purple-100 text-purple-700 border-purple-200",
  team: "bg-teal-100 text-teal-700 border-teal-200",
  enterprise: "bg-amber-100 text-amber-700 border-amber-200",
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
  return `${days}d ago`
}

export default function AdminOverviewPage() {
  const [stats, setStats] = useState<ReturnType<typeof generateAdminStats> | null>(null)
  const [recentUsers, setRecentUsers] = useState<ReturnType<typeof generateUsers>>([])

  useEffect(() => {
    setStats(generateAdminStats())
    setRecentUsers(generateUsers(10))
  }, [])

  if (!stats) return null

  const maxRevenue = Math.max(...revenueData.map((d) => d.value))
  const maxUsers = Math.max(...userGrowthData.map((d) => d.value))

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Overview</h1>
        <p className="text-sm text-gray-500 mt-1">Platform health and key metrics at a glance</p>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <Users className="h-5 w-5 text-blue-600" />
            <span className="flex items-center gap-0.5 text-xs font-medium text-green-600">
              <TrendingUp className="h-3 w-3" />
              18%
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{formatNumber(stats.totalUsers)}</p>
          <p className="text-xs text-gray-500 mt-0.5">Total Users</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <UserCheck className="h-5 w-5 text-green-600" />
            <span className="text-xs font-medium text-gray-500">67.5%</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{formatNumber(stats.activeUsers)}</p>
          <p className="text-xs text-gray-500 mt-0.5">Active Users</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <DollarSign className="h-5 w-5 text-emerald-600" />
            <span className="flex items-center gap-0.5 text-xs font-medium text-green-600">
              <TrendingUp className="h-3 w-3" />
              12%
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.mrr)}</p>
          <p className="text-xs text-gray-500 mt-0.5">MRR</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="h-5 w-5 text-indigo-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">${(stats.arr / 1000000).toFixed(2)}M</p>
          <p className="text-xs text-gray-500 mt-0.5">ARR</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <ArrowDown className="h-5 w-5 text-green-600" />
            <span className="flex items-center gap-0.5 text-xs font-medium text-green-600">
              <TrendingDown className="h-3 w-3" />
              Good
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.churnRate}%</p>
          <p className="text-xs text-gray-500 mt-0.5">Churn Rate</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <Activity className="h-5 w-5 text-emerald-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.systemUptime}%</p>
          <p className="text-xs text-gray-500 mt-0.5">System Uptime</p>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-semibold text-gray-900">Monthly Revenue</h3>
              <p className="text-sm text-gray-500">Last 12 months</p>
            </div>
            <Badge className="bg-green-100 text-green-700 border-green-200">+170%</Badge>
          </div>
          <div className="flex items-end gap-2 h-48">
            {revenueData.map((d) => (
              <div key={d.month} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-[10px] text-gray-500 font-medium">
                  ${(d.value / 1000).toFixed(0)}K
                </span>
                <div
                  className="w-full rounded-t bg-gradient-to-t from-emerald-600 to-emerald-400 transition-all"
                  style={{ height: `${(d.value / maxRevenue) * 140}px` }}
                />
                <span className="text-[10px] text-gray-400">{d.month}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* User Growth Chart */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-semibold text-gray-900">User Growth</h3>
              <p className="text-sm text-gray-500">Last 12 months</p>
            </div>
            <Badge className="bg-blue-100 text-blue-700 border-blue-200">+533%</Badge>
          </div>
          <div className="flex items-end gap-2 h-48">
            {userGrowthData.map((d) => (
              <div key={d.month} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-[10px] text-gray-500 font-medium">
                  {formatNumber(d.value)}
                </span>
                <div
                  className="w-full rounded-t bg-gradient-to-t from-blue-600 to-blue-400 transition-all"
                  style={{ height: `${(d.value / maxUsers) * 140}px` }}
                />
                <span className="text-[10px] text-gray-400">{d.month}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Recent Signups Table */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-gray-900">Recent Signups</h3>
            <p className="text-sm text-gray-500">Last 10 users who joined the platform</p>
          </div>
          <Button variant="outline" size="sm">View All Users</Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-3 px-3 font-medium text-gray-500">Name</th>
                <th className="text-left py-3 px-3 font-medium text-gray-500">Email</th>
                <th className="text-left py-3 px-3 font-medium text-gray-500">Plan</th>
                <th className="text-left py-3 px-3 font-medium text-gray-500">Company</th>
                <th className="text-left py-3 px-3 font-medium text-gray-500">Territory</th>
                <th className="text-left py-3 px-3 font-medium text-gray-500">Signed Up</th>
                <th className="text-left py-3 px-3 font-medium text-gray-500">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentUsers.map((user) => (
                <tr key={user.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2.5">
                      <Avatar size="sm" fallback={getInitials(user.name)} className="bg-gray-200 text-gray-700" />
                      <span className="font-medium text-gray-900">{user.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-gray-600">{user.email}</td>
                  <td className="py-3 px-3">
                    <Badge className={`${planBadgeColor[user.plan]} text-[11px] capitalize`}>
                      {user.plan.replace("_", " ")}
                    </Badge>
                  </td>
                  <td className="py-3 px-3 text-gray-600">{user.company || "-"}</td>
                  <td className="py-3 px-3 text-gray-600">{user.territories[0] || "-"}</td>
                  <td className="py-3 px-3 text-gray-500">{formatDate(user.createdAt)}</td>
                  <td className="py-3 px-3">
                    <Badge className={`${statusBadge[user.status].color} text-[11px]`}>
                      {statusBadge[user.status].label}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* System Health + Quick Actions */}
      <div className="grid lg:grid-cols-4 gap-4">
        {/* System Health Cards */}
        <Card className="p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
              <Zap className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">API Response Time</p>
              <p className="text-xs text-gray-500">Average latency</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-gray-900">{stats.avgResponseTime}ms</span>
            <Badge variant="success" className="text-[10px]">Healthy</Badge>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
              <Clock className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Data Freshness</p>
              <p className="text-xs text-gray-500">Last data sync</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-gray-900">{stats.dataFreshness}</span>
            <Badge variant="success" className="text-[10px]">Fresh</Badge>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
              <Database className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">API Calls Today</p>
              <p className="text-xs text-gray-500">Usage vs quota</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold text-gray-900">{formatNumber(stats.apiCalls)}</span>
              <span className="text-xs text-gray-500">/ 50M</span>
            </div>
            <Progress value={stats.apiCalls} max={50000000} indicatorClassName="bg-blue-600" />
          </div>
        </Card>

        {/* Quick Actions */}
        <Card className="p-5">
          <h3 className="font-semibold text-gray-900 mb-3">Quick Actions</h3>
          <div className="space-y-2">
            <Button variant="outline" size="sm" className="w-full justify-start gap-2 text-xs">
              <Send className="h-3.5 w-3.5" />
              Send Announcement
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start gap-2 text-xs">
              <Download className="h-3.5 w-3.5" />
              Export User Data
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start gap-2 text-xs">
              <FileWarning className="h-3.5 w-3.5" />
              View Error Logs
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start gap-2 text-xs">
              <Flag className="h-3.5 w-3.5" />
              Manage Feature Flags
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}
