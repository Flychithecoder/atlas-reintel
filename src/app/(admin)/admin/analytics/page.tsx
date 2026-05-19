"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { formatCurrency, formatNumber } from "@/lib/utils"
import {
  Users,
  Clock,
  MousePointerClick,
  Activity,
  Brain,
  Search,
  Mic,
  FileText,
  Mail,
  MonitorSmartphone,
  Code,
  Link2,
  Cpu,
  ChevronDown,
} from "lucide-react"

const featureUsage = [
  { name: "Lead Search", pct: 89, icon: Search, color: "bg-blue-500" },
  { name: "AI Outreach", pct: 67, icon: Mail, color: "bg-purple-500" },
  { name: "Document Parser", pct: 45, icon: FileText, color: "bg-orange-500" },
  { name: "Voice AI", pct: 34, icon: Mic, color: "bg-pink-500" },
  { name: "CRM Sync", pct: 78, icon: Link2, color: "bg-green-500" },
  { name: "Browser Extension", pct: 23, icon: MonitorSmartphone, color: "bg-yellow-500" },
  { name: "API Access", pct: 12, icon: Code, color: "bg-gray-500" },
]

const aiAgents = [
  { name: "Lead Scoring", runs: 45000, unit: "runs/day", avgTime: "1.2s", cost: 124 },
  { name: "Outreach Composer", runs: 12000, unit: "runs/day", avgTime: "2.1s", cost: 89 },
  { name: "Deal Search NL-to-SQL", runs: 8500, unit: "runs/day", avgTime: "1.8s", cost: 67 },
  { name: "Document Parser", runs: 2400, unit: "runs/day", avgTime: "4.5s", cost: 156 },
  { name: "Voice AI Brain", runs: 890, unit: "calls/day", avgTime: "180s", cost: 234 },
  { name: "Property Brief", runs: 3200, unit: "runs/day", avgTime: "3.2s", cost: 78 },
]

const totalDailyCost = aiAgents.reduce((s, a) => s + a.cost, 0)

const funnelSteps = [
  { label: "Visits", value: 100000, pct: 100, color: "bg-blue-100 text-blue-800" },
  { label: "Sign Up", value: 8200, pct: 8.2, color: "bg-indigo-100 text-indigo-800" },
  { label: "Activate", value: 4100, pct: 50, color: "bg-purple-100 text-purple-800" },
  { label: "Convert to Paid", value: 1643, pct: 40.1, color: "bg-pink-100 text-pink-800" },
  { label: "Expand", value: 412, pct: 25.1, color: "bg-red-100 text-red-800" },
]

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Platform Analytics</h1>
        <p className="text-sm text-gray-500 mt-1">User engagement, feature adoption, and AI agent performance</p>
      </div>

      {/* Engagement Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-3">
            <Users className="h-5 w-5 text-blue-600" />
            <span className="text-xs text-gray-500 font-medium">Active Users</span>
          </div>
          <div className="flex items-baseline gap-3">
            <div>
              <p className="text-xs text-gray-400 uppercase">DAU</p>
              <p className="text-xl font-bold text-gray-900">1,247</p>
            </div>
            <div className="border-l border-gray-200 pl-3">
              <p className="text-xs text-gray-400 uppercase">WAU</p>
              <p className="text-xl font-bold text-gray-900">1,923</p>
            </div>
            <div className="border-l border-gray-200 pl-3">
              <p className="text-xs text-gray-400 uppercase">MAU</p>
              <p className="text-xl font-bold text-gray-900">2,456</p>
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center gap-2 mb-3">
            <Activity className="h-5 w-5 text-green-600" />
            <span className="text-xs text-gray-500 font-medium">DAU/MAU Ratio</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">50.8%</p>
          <Badge variant="success" className="text-[10px] mt-1">Healthy</Badge>
        </Card>

        <Card className="p-5">
          <div className="flex items-center gap-2 mb-3">
            <Clock className="h-5 w-5 text-purple-600" />
            <span className="text-xs text-gray-500 font-medium">Avg Session Duration</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">24 min</p>
          <p className="text-xs text-gray-400 mt-1">Across all user segments</p>
        </Card>

        <Card className="p-5">
          <div className="flex items-center gap-2 mb-3">
            <MousePointerClick className="h-5 w-5 text-orange-600" />
            <span className="text-xs text-gray-500 font-medium">Actions per Session</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">18.4</p>
          <p className="text-xs text-gray-400 mt-1">Clicks, searches, exports</p>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Feature Usage */}
        <Card className="p-6">
          <h3 className="font-semibold text-gray-900 mb-1">Feature Usage</h3>
          <p className="text-xs text-gray-500 mb-5">Percentage of active users using each feature</p>
          <div className="space-y-4">
            {featureUsage.map((f) => (
              <div key={f.name}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <f.icon className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">{f.name}</span>
                  </div>
                  <span className="text-sm font-bold text-gray-900">{f.pct}%</span>
                </div>
                <div className="h-2.5 w-full rounded-full bg-gray-100 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${f.color} transition-all`}
                    style={{ width: `${f.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Conversion Funnel */}
        <Card className="p-6">
          <h3 className="font-semibold text-gray-900 mb-1">Conversion Funnel</h3>
          <p className="text-xs text-gray-500 mb-5">From visit to expansion</p>
          <div className="space-y-3">
            {funnelSteps.map((step, i) => {
              const widthPct = (step.value / funnelSteps[0].value) * 100
              return (
                <div key={step.label}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">{step.label}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-gray-900">{formatNumber(step.value)}</span>
                      {i > 0 && (
                        <span className="text-[10px] text-gray-400">
                          ({step.pct}% of prev)
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="relative">
                    <div className="h-8 w-full rounded bg-gray-50 overflow-hidden">
                      <div
                        className={`h-full rounded ${step.color} flex items-center justify-center transition-all`}
                        style={{ width: `${Math.max(widthPct, 5)}%` }}
                      >
                        {widthPct > 15 && (
                          <span className="text-[11px] font-semibold">
                            {formatNumber(step.value)}
                          </span>
                        )}
                      </div>
                    </div>
                    {i < funnelSteps.length - 1 && (
                      <div className="flex justify-center -mb-1">
                        <ChevronDown className="h-4 w-4 text-gray-300" />
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </Card>
      </div>

      {/* AI Agent Metrics */}
      <Card>
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-purple-600" />
              <div>
                <h3 className="font-semibold text-gray-900">AI Agent Metrics</h3>
                <p className="text-xs text-gray-500">Performance and cost breakdown by agent</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Total Daily Cost</p>
              <p className="text-lg font-bold text-gray-900">{formatCurrency(totalDailyCost)}/day</p>
              <p className="text-xs text-gray-400">{formatCurrency(totalDailyCost * 30)}/month</p>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-left py-3 px-4 font-medium text-gray-500">Agent</th>
                <th className="text-right py-3 px-4 font-medium text-gray-500">Volume</th>
                <th className="text-right py-3 px-4 font-medium text-gray-500">Avg Latency</th>
                <th className="text-right py-3 px-4 font-medium text-gray-500">Daily Cost</th>
                <th className="text-right py-3 px-4 font-medium text-gray-500">Monthly Cost</th>
                <th className="text-right py-3 px-4 font-medium text-gray-500">% of Total</th>
              </tr>
            </thead>
            <tbody>
              {aiAgents.map((agent) => (
                <tr key={agent.name} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <Cpu className="h-4 w-4 text-purple-500" />
                      <span className="font-medium text-gray-900">{agent.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right text-gray-700">
                    {formatNumber(agent.runs)} <span className="text-xs text-gray-400">{agent.unit.replace("runs/day", "").replace("calls/day", "")}</span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className={`font-medium ${parseFloat(agent.avgTime) > 5 ? "text-yellow-600" : "text-gray-700"}`}>
                      {agent.avgTime}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right font-semibold text-gray-900">{formatCurrency(agent.cost)}</td>
                  <td className="py-3 px-4 text-right text-gray-600">{formatCurrency(agent.cost * 30)}</td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <span className="text-gray-600">{((agent.cost / totalDailyCost) * 100).toFixed(1)}%</span>
                      <div className="w-16 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-purple-500"
                          style={{ width: `${(agent.cost / totalDailyCost) * 100}%` }}
                        />
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-gray-50 font-semibold">
                <td className="py-3 px-4 text-gray-900">Total</td>
                <td className="py-3 px-4 text-right text-gray-900">{formatNumber(aiAgents.reduce((s, a) => s + a.runs, 0))}</td>
                <td className="py-3 px-4 text-right text-gray-500">-</td>
                <td className="py-3 px-4 text-right text-gray-900">{formatCurrency(totalDailyCost)}</td>
                <td className="py-3 px-4 text-right text-gray-900">{formatCurrency(totalDailyCost * 30)}</td>
                <td className="py-3 px-4 text-right text-gray-500">100%</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </Card>
    </div>
  )
}
