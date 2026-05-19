"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { formatCurrency } from "@/lib/utils"
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Users,
  ArrowUpRight,
  ArrowDownRight,
  CreditCard,
  Receipt,
  PieChart,
  Zap,
} from "lucide-react"

const revenueByPlan = [
  { plan: "Free", price: "$0", users: 1204, mrr: 0, color: "bg-gray-400" },
  { plan: "Starter", price: "$79/mo", users: 847, mrr: 66913, color: "bg-blue-500" },
  { plan: "Pro", price: "$299/mo", users: 523, mrr: 156377, color: "bg-indigo-500" },
  { plan: "Pro CRE", price: "$499/mo", users: 189, mrr: 94311, color: "bg-purple-500" },
  { plan: "Team", price: "$1,499/mo", users: 60, mrr: 89940, color: "bg-teal-500" },
  { plan: "Enterprise", price: "Custom", users: 24, mrr: 79459, color: "bg-amber-500" },
]

const totalMRR = revenueByPlan.reduce((s, p) => s + p.mrr, 0)

const churnReasons = [
  { reason: "Too expensive", pct: 34 },
  { reason: "Switched to competitor", pct: 21 },
  { reason: "No longer in RE", pct: 18 },
  { reason: "Missing features", pct: 15 },
  { reason: "Other", pct: 12 },
]

const transactions = [
  { user: "Sarah Chen", plan: "Pro", amount: 299, type: "Upgrade", date: "May 19, 2026", status: "Paid" },
  { user: "Marcus Johnson", plan: "Starter", amount: 79, type: "Renewal", date: "May 19, 2026", status: "Paid" },
  { user: "Emily Rodriguez", plan: "Pro CRE", amount: 499, type: "New", date: "May 18, 2026", status: "Paid" },
  { user: "David Kim", plan: "Team", amount: 1499, type: "Renewal", date: "May 18, 2026", status: "Paid" },
  { user: "Lisa Thompson", plan: "Starter", amount: -79, type: "Refund", date: "May 18, 2026", status: "Refunded" },
  { user: "James Wilson", plan: "Pro", amount: 299, type: "New", date: "May 17, 2026", status: "Paid" },
  { user: "Rachel Brown", plan: "Enterprise", amount: 4500, type: "Renewal", date: "May 17, 2026", status: "Paid" },
  { user: "Tom Anderson", plan: "Pro", amount: 299, type: "Downgrade", date: "May 17, 2026", status: "Pending" },
  { user: "Nina Patel", plan: "Starter", amount: 79, type: "New", date: "May 16, 2026", status: "Paid" },
  { user: "Chris Martinez", plan: "Pro CRE", amount: 499, type: "Upgrade", date: "May 16, 2026", status: "Failed" },
]

const typeBadge: Record<string, string> = {
  New: "bg-green-100 text-green-700",
  Renewal: "bg-blue-100 text-blue-700",
  Upgrade: "bg-purple-100 text-purple-700",
  Downgrade: "bg-yellow-100 text-yellow-700",
  Refund: "bg-red-100 text-red-700",
}

const statusBadge: Record<string, string> = {
  Paid: "bg-green-100 text-green-700",
  Pending: "bg-yellow-100 text-yellow-700",
  Failed: "bg-red-100 text-red-700",
  Refunded: "bg-gray-100 text-gray-600",
}

const topAPICustomers = [
  { name: "Keller Williams Corp", calls: 520000, revenue: 10400 },
  { name: "Realogy Holdings", calls: 380000, revenue: 7600 },
  { name: "RE/MAX Integration", calls: 290000, revenue: 5800 },
  { name: "eXp Realty Tech", calls: 245000, revenue: 4900 },
  { name: "Compass Data Team", calls: 210000, revenue: 4200 },
]

export default function BillingPage() {
  const [activeTab, setActiveTab] = useState<"overview" | "transactions" | "api">("overview")

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Billing & Revenue</h1>
          <p className="text-sm text-gray-500 mt-1">Revenue metrics, subscription management, and billing analytics</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-1.5 text-xs">
            <Receipt className="h-3.5 w-3.5" /> Export Report
          </Button>
        </div>
      </div>

      {/* Revenue KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100">
              <DollarSign className="h-5 w-5 text-emerald-600" />
            </div>
            <span className="flex items-center gap-0.5 text-xs font-medium text-green-600">
              <TrendingUp className="h-3 w-3" /> +12.3%
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(487000)}</p>
          <p className="text-xs text-gray-500 mt-0.5">Monthly Recurring Revenue</p>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
              <TrendingUp className="h-5 w-5 text-blue-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(5844000)}</p>
          <p className="text-xs text-gray-500 mt-0.5">Annual Recurring Revenue</p>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100">
              <Users className="h-5 w-5 text-indigo-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">$171</p>
          <p className="text-xs text-gray-500 mt-0.5">Average Revenue Per User</p>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100">
              <CreditCard className="h-5 w-5 text-purple-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(8208)}</p>
          <p className="text-xs text-gray-500 mt-0.5">Lifetime Value (LTV)</p>
        </Card>
      </div>

      {/* Tab Selector */}
      <div className="flex gap-1 p-1 rounded-lg bg-gray-100 w-fit">
        {(["overview", "transactions", "api"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab === "api" ? "API Revenue" : tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {activeTab === "overview" && (
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Revenue by Plan */}
          <Card className="p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Revenue by Plan</h3>

            {/* Stacked bar */}
            <div className="flex rounded-lg overflow-hidden h-8 mb-6">
              {revenueByPlan.filter((p) => p.mrr > 0).map((p) => (
                <div
                  key={p.plan}
                  className={`${p.color} transition-all relative group`}
                  style={{ width: `${(p.mrr / totalMRR) * 100}%` }}
                  title={`${p.plan}: ${formatCurrency(p.mrr)}`}
                />
              ))}
            </div>

            <div className="space-y-3">
              {revenueByPlan.map((p) => (
                <div key={p.plan} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`h-3 w-3 rounded-sm ${p.color}`} />
                    <div>
                      <span className="text-sm font-medium text-gray-900">{p.plan}</span>
                      <span className="text-xs text-gray-400 ml-2">@ {p.price}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">{formatCurrency(p.mrr)}/mo</p>
                    <p className="text-[11px] text-gray-400">{p.users.toLocaleString()} users</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Churn Analysis */}
          <Card className="p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Churn Analysis</h3>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="rounded-lg bg-gray-50 p-3">
                <p className="text-xs text-gray-500">MRR Churn</p>
                <p className="text-xl font-bold text-gray-900">2.1%</p>
              </div>
              <div className="rounded-lg bg-gray-50 p-3">
                <p className="text-xs text-gray-500">Logo Churn</p>
                <p className="text-xl font-bold text-gray-900">3.4%</p>
              </div>
              <div className="rounded-lg bg-green-50 p-3">
                <p className="text-xs text-gray-500">Net Revenue Retention</p>
                <p className="text-xl font-bold text-green-700">118%</p>
              </div>
              <div className="rounded-lg bg-red-50 p-3">
                <p className="text-xs text-gray-500">Churned This Month</p>
                <p className="text-xl font-bold text-red-700">47</p>
              </div>
            </div>

            <h4 className="text-sm font-medium text-gray-700 mb-3">Top Churn Reasons</h4>
            <div className="space-y-3">
              {churnReasons.map((r) => (
                <div key={r.reason}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700">{r.reason}</span>
                    <span className="font-medium text-gray-900">{r.pct}%</span>
                  </div>
                  <Progress
                    value={r.pct}
                    max={100}
                    className="h-2"
                    indicatorClassName={r.pct > 30 ? "bg-red-500" : r.pct > 20 ? "bg-yellow-500" : "bg-blue-500"}
                  />
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {activeTab === "transactions" && (
        <Card>
          <div className="p-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900">Recent Transactions</h3>
            <p className="text-xs text-gray-500 mt-0.5">Last 10 billing events</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="text-left py-3 px-4 font-medium text-gray-500">User</th>
                  <th className="text-left py-3 px-3 font-medium text-gray-500">Plan</th>
                  <th className="text-right py-3 px-3 font-medium text-gray-500">Amount</th>
                  <th className="text-left py-3 px-3 font-medium text-gray-500">Type</th>
                  <th className="text-left py-3 px-3 font-medium text-gray-500">Date</th>
                  <th className="text-left py-3 px-3 font-medium text-gray-500">Status</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx, i) => (
                  <tr key={i} className="border-b border-gray-50 hover:bg-gray-50/50">
                    <td className="py-3 px-4 font-medium text-gray-900">{tx.user}</td>
                    <td className="py-3 px-3 text-gray-600">{tx.plan}</td>
                    <td className={`py-3 px-3 text-right font-semibold ${tx.amount < 0 ? "text-red-600" : "text-gray-900"}`}>
                      {tx.amount < 0 ? `-${formatCurrency(Math.abs(tx.amount))}` : formatCurrency(tx.amount)}
                    </td>
                    <td className="py-3 px-3">
                      <Badge className={`${typeBadge[tx.type]} text-[11px]`}>{tx.type}</Badge>
                    </td>
                    <td className="py-3 px-3 text-gray-500">{tx.date}</td>
                    <td className="py-3 px-3">
                      <Badge className={`${statusBadge[tx.status]} text-[11px]`}>{tx.status}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {activeTab === "api" && (
        <div className="grid lg:grid-cols-3 gap-6">
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                <Zap className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">API Calls This Month</p>
                <p className="text-2xl font-bold text-gray-900">2.4M</p>
              </div>
            </div>
            <p className="text-xs text-gray-400">Billable API requests across all customers</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
                <DollarSign className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">API Revenue</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(48000)}</p>
              </div>
            </div>
            <p className="text-xs text-gray-400">Usage-based billing revenue this month</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100">
                <PieChart className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Avg Price per 1K calls</p>
                <p className="text-2xl font-bold text-gray-900">$20.00</p>
              </div>
            </div>
            <p className="text-xs text-gray-400">Blended rate across all tiers</p>
          </Card>

          <Card className="lg:col-span-3">
            <div className="p-4 border-b border-gray-100">
              <h3 className="font-semibold text-gray-900">Top API Customers</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    <th className="text-left py-3 px-4 font-medium text-gray-500">#</th>
                    <th className="text-left py-3 px-3 font-medium text-gray-500">Customer</th>
                    <th className="text-right py-3 px-3 font-medium text-gray-500">API Calls</th>
                    <th className="text-right py-3 px-3 font-medium text-gray-500">Revenue</th>
                    <th className="text-right py-3 px-3 font-medium text-gray-500">% of Total</th>
                  </tr>
                </thead>
                <tbody>
                  {topAPICustomers.map((c, i) => (
                    <tr key={i} className="border-b border-gray-50 hover:bg-gray-50/50">
                      <td className="py-3 px-4 text-gray-400 font-medium">{i + 1}</td>
                      <td className="py-3 px-3 font-medium text-gray-900">{c.name}</td>
                      <td className="py-3 px-3 text-right text-gray-700">{(c.calls / 1000).toFixed(0)}K</td>
                      <td className="py-3 px-3 text-right font-semibold text-gray-900">{formatCurrency(c.revenue)}</td>
                      <td className="py-3 px-3 text-right text-gray-500">{((c.revenue / 48000) * 100).toFixed(1)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
