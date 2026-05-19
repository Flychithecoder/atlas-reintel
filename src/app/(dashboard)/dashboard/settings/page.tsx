"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  User,
  Camera,
  Save,
  CreditCard,
  ArrowUpRight,
  MapPin,
  X,
  Plus,
  Plug,
  Key,
  Copy,
  Check,
  Bell,
  Eye,
  EyeOff,
  Globe,
  Sparkles,
  Phone,
  Mail,
  FileText,
  Mic,
  Award,
  Languages,
  AlertCircle,
} from "lucide-react"
import { AgentMarketFilter } from "@/components/shared/agent-market-filter"

// ----- Profile Tab -----
function ProfileTab() {
  const [profile, setProfile] = useState({
    name: "Bryan Hayes",
    email: "bahayes38@gmail.com",
    phone: "(404) 555-0192",
    company: "Atlas Investments LLC",
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Profile Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Avatar */}
        <div className="flex items-center gap-5">
          <div className="relative">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-100 text-2xl font-bold text-blue-600">
              BH
            </div>
            <button className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-gray-900 text-white hover:bg-gray-700 transition-colors">
              <Camera className="h-3.5 w-3.5" />
            </button>
          </div>
          <div>
            <p className="font-medium text-gray-900">Profile Photo</p>
            <p className="text-xs text-gray-500">JPG, PNG, or GIF. Max 2MB.</p>
          </div>
        </div>

        <Separator />

        {/* Form */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Full Name</label>
            <Input
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Email</label>
            <Input
              type="email"
              value={profile.email}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Phone</label>
            <Input
              value={profile.phone}
              onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Company</label>
            <Input
              value={profile.company}
              onChange={(e) => setProfile({ ...profile, company: e.target.value })}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700">Role</label>
          <div className="flex items-center gap-2">
            <Badge variant="default">Pro</Badge>
            <span className="text-sm text-gray-500">Account Owner</span>
          </div>
        </div>

        <div className="flex justify-end">
          <Button>
            <Save className="h-4 w-4 mr-1" />
            Save Changes
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// ----- Billing Tab -----
const usageItems = [
  { label: "Enrichments", used: 1847, limit: -1, limitLabel: "Unlimited", icon: Sparkles },
  { label: "Outreach Sends", used: 3240, limit: 5000, limitLabel: "5,000", icon: Mail },
  { label: "Voice Minutes", used: 124, limit: 200, limitLabel: "200", icon: Mic },
  { label: "Doc Parses", used: 34, limit: -1, limitLabel: "Unlimited", icon: FileText },
]

const invoices = [
  { id: "INV-2605", date: "May 1, 2026", amount: "$299.00", status: "Paid" },
  { id: "INV-2604", date: "Apr 1, 2026", amount: "$299.00", status: "Paid" },
  { id: "INV-2603", date: "Mar 1, 2026", amount: "$299.00", status: "Paid" },
  { id: "INV-2602", date: "Feb 1, 2026", amount: "$299.00", status: "Paid" },
  { id: "INV-2601", date: "Jan 1, 2026", amount: "$249.00", status: "Paid" },
]

function BillingTab() {
  return (
    <div className="space-y-6">
      {/* Current Plan */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Current Plan</CardTitle>
            <div className="flex items-center gap-2">
              <Badge>Pro</Badge>
              <span className="text-lg font-bold text-gray-900">$299/mo</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {usageItems.map((item) => {
            const pct = item.limit === -1 ? 100 : Math.round((item.used / item.limit) * 100)
            const isUnlimited = item.limit === -1
            return (
              <div key={item.label} className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <item.icon className="h-3.5 w-3.5 text-gray-400" />
                    <span className="text-gray-700">{item.label}</span>
                  </div>
                  <span className="text-gray-500 text-xs">
                    {item.used.toLocaleString()} / {item.limitLabel}
                  </span>
                </div>
                <Progress
                  value={isUnlimited ? 35 : pct}
                  className="h-2"
                  indicatorClassName={
                    isUnlimited
                      ? "bg-green-500"
                      : pct > 90
                      ? "bg-red-500"
                      : pct > 70
                      ? "bg-yellow-500"
                      : "bg-blue-500"
                  }
                />
              </div>
            )
          })}

          <Separator />

          <div className="flex gap-3">
            <Button>
              <ArrowUpRight className="h-4 w-4 mr-1" />
              Upgrade Plan
            </Button>
            <Button variant="outline">
              <CreditCard className="h-4 w-4 mr-1" />
              Manage Billing
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Billing History */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Billing History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((inv) => (
                <TableRow key={inv.id}>
                  <TableCell className="font-medium">{inv.id}</TableCell>
                  <TableCell className="text-gray-500">{inv.date}</TableCell>
                  <TableCell>{inv.amount}</TableCell>
                  <TableCell>
                    <Badge variant="success" className="text-[10px]">
                      {inv.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" className="h-7 text-xs">
                      Download
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

// ----- Territories Tab -----
const initialTerritories = [
  "Atlanta, GA",
  "Dallas, TX",
  "Miami, FL",
  "Houston, TX",
  "Phoenix, AZ",
]

function TerritoriesTab() {
  const [territories, setTerritories] = useState(initialTerritories)
  const [newTerritory, setNewTerritory] = useState("")

  const addTerritory = () => {
    const trimmed = newTerritory.trim()
    if (trimmed && !territories.includes(trimmed)) {
      setTerritories([...territories, trimmed])
      setNewTerritory("")
    }
  }

  const removeTerritory = (t: string) => {
    setTerritories(territories.filter((x) => x !== t))
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Active Territories</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {territories.map((t) => (
              <div
                key={t}
                className="flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-sm"
              >
                <MapPin className="h-3 w-3 text-blue-500" />
                <span>{t}</span>
                <button
                  onClick={() => removeTerritory(t)}
                  className="ml-1 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>

          <Separator />

          <div className="flex gap-2">
            <Input
              placeholder="City, State (e.g. Austin, TX)"
              value={newTerritory}
              onChange={(e) => setNewTerritory(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addTerritory()}
              className="max-w-xs"
            />
            <Button variant="outline" onClick={addTerritory}>
              <Plus className="h-4 w-4 mr-1" />
              Add Territory
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Map Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Territory Coverage</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-64 items-center justify-center rounded-lg border-2 border-dashed border-gray-200 bg-gray-50">
            <div className="text-center">
              <Globe className="h-10 w-10 text-gray-300 mx-auto" />
              <p className="mt-2 text-sm text-gray-500">
                Interactive territory map
              </p>
              <p className="text-xs text-gray-400">
                {territories.length} territories active
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// ----- Integrations Tab -----
function IntegrationsTab() {
  const [showApiKey, setShowApiKey] = useState(false)
  const [copied, setCopied] = useState(false)
  const [webhookUrl, setWebhookUrl] = useState("https://api.example.com/webhooks/atlas")

  const apiKey = "atlas_sk_live_7f3a9b2c4d8e1f6a0b5c3d9e2f4a1b7c"
  const maskedKey = "atlas_sk_live_****************************1b7c"

  const handleCopy = () => {
    navigator.clipboard.writeText(apiKey)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const crmList = [
    { name: "Follow Up Boss", connected: true },
    { name: "HubSpot", connected: true },
    { name: "Salesforce", connected: false },
    { name: "kvCORE", connected: false },
  ]

  return (
    <div className="space-y-6">
      {/* CRM Connections */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Plug className="h-4 w-4 text-blue-500" />
            CRM Connections
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {crmList.map((crm) => (
              <div
                key={crm.name}
                className="flex items-center justify-between rounded-lg border border-gray-200 p-3"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`h-2.5 w-2.5 rounded-full ${
                      crm.connected ? "bg-green-500" : "bg-gray-300"
                    }`}
                  />
                  <span className="text-sm font-medium text-gray-900">{crm.name}</span>
                </div>
                <Button
                  variant={crm.connected ? "outline" : "default"}
                  size="sm"
                  className="text-xs h-7"
                >
                  {crm.connected ? "Disconnect" : "Connect"}
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* API Key */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Key className="h-4 w-4 text-yellow-500" />
            API Key
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="flex-1 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 font-mono text-sm text-gray-700">
              {showApiKey ? apiKey : maskedKey}
            </div>
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9"
              onClick={() => setShowApiKey(!showApiKey)}
            >
              {showApiKey ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9"
              onClick={handleCopy}
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
          <p className="text-xs text-gray-500">
            Use this key to authenticate requests to the ATLAS API.
          </p>
        </CardContent>
      </Card>

      {/* Webhook URL */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Webhook Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Webhook URL</label>
            <Input
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              placeholder="https://your-api.com/webhooks/atlas"
            />
          </div>
          <p className="text-xs text-gray-500">
            ATLAS will send POST requests with lead and event data to this URL.
          </p>
          <Button variant="outline" size="sm">
            Test Webhook
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

// ----- Notifications Tab -----
interface NotificationSetting {
  label: string
  description: string
  key: string
}

const notificationSettings: NotificationSetting[] = [
  { label: "New hot lead alerts", description: "Instant push notification when a lead scores 80+", key: "hotLeads" },
  { label: "Daily digest email", description: "Summary of pipeline changes and new leads each morning", key: "dailyDigest" },
  { label: "Campaign completion", description: "Alert when an outreach campaign finishes all sends", key: "campaignDone" },
  { label: "Voice AI call summaries", description: "Post-call summary with transcript and next steps", key: "voiceSummary" },
  { label: "Weekly analytics report", description: "PDF report of key metrics delivered every Monday", key: "weeklyReport" },
  { label: "System updates", description: "New features, maintenance windows, and platform news", key: "systemUpdates" },
]

function NotificationsTab() {
  const [enabled, setEnabled] = useState<Record<string, boolean>>({
    hotLeads: true,
    dailyDigest: true,
    campaignDone: true,
    voiceSummary: false,
    weeklyReport: true,
    systemUpdates: false,
  })

  const toggle = (key: string) => {
    setEnabled((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Bell className="h-4 w-4 text-blue-500" />
          Notification Preferences
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          {notificationSettings.map((setting, i) => (
            <div key={setting.key}>
              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm font-medium text-gray-900">{setting.label}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{setting.description}</p>
                </div>
                <button
                  onClick={() => toggle(setting.key)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    enabled[setting.key] ? "bg-blue-600" : "bg-gray-200"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${
                      enabled[setting.key] ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
              {i < notificationSettings.length - 1 && <Separator />}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// ----- License & Market Preferences Tab -----
function LicenseAndMarketTab() {
  const [licenses, setLicenses] = useState({
    fl: "",
    pr: "",
    dr: "",
  })
  const [language, setLanguage] = useState<"en" | "es">("en")
  const [marketNotifications, setMarketNotifications] = useState({
    flImminent: true,
    prTaxDelinquent: true,
    drConfotur: false,
    buyer1031: true,
    newAgent: false,
  })

  const toggleMarketNotification = (key: keyof typeof marketNotifications) => {
    setMarketNotifications((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <div className="space-y-6">
      {/* Market Targeting */}
      <Card className="border-blue-200 bg-blue-50/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <MapPin className="h-4 w-4 text-blue-500" />
            Market Targeting
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500 mb-4">
            Configure your licensed states and metro areas to filter all leads, signals, and buyers across the platform to only show your territory.
          </p>
          <AgentMarketFilter />
        </CardContent>
      </Card>

      {/* License Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Award className="h-4 w-4 text-blue-500" />
            License Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                FL Real Estate License #
              </label>
              <Input
                value={licenses.fl}
                onChange={(e) => setLicenses({ ...licenses, fl: e.target.value })}
                placeholder="e.g. SL3456789"
              />
              <p className="text-[10px] text-gray-400">Florida DBPR license number</p>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                PR Real Estate License #
              </label>
              <Input
                value={licenses.pr}
                onChange={(e) => setLicenses({ ...licenses, pr: e.target.value })}
                placeholder="e.g. C-12345"
              />
              <p className="text-[10px] text-gray-400">DACO / Junta Examinadora license</p>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                DR Association Membership
              </label>
              <Input
                value={licenses.dr}
                onChange={(e) => setLicenses({ ...licenses, dr: e.target.value })}
                placeholder="e.g. AEI-2024-001"
              />
              <p className="text-[10px] text-gray-400">AEI or local board membership ID</p>
            </div>
          </div>
          <div className="flex justify-end">
            <Button variant="outline" size="sm">
              <Save className="h-3.5 w-3.5 mr-1" />
              Save Licenses
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Language Preference */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Languages className="h-4 w-4 text-blue-500" />
            Language Preference
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Choose the primary language for outreach templates, AI-generated content, and interface text.
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setLanguage("en")}
              className={`inline-flex items-center gap-2 rounded-lg border-2 px-4 py-3 text-sm font-medium transition-colors ${
                language === "en"
                  ? "border-blue-600 bg-blue-50 text-blue-700 dark:border-blue-400 dark:bg-blue-950/30 dark:text-blue-300"
                  : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600"
              }`}
            >
              <span className="text-lg">EN</span>
              English
            </button>
            <button
              onClick={() => setLanguage("es")}
              className={`inline-flex items-center gap-2 rounded-lg border-2 px-4 py-3 text-sm font-medium transition-colors ${
                language === "es"
                  ? "border-blue-600 bg-blue-50 text-blue-700 dark:border-blue-400 dark:bg-blue-950/30 dark:text-blue-300"
                  : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600"
              }`}
            >
              <span className="text-lg">ES</span>
              Espanol
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Market-Specific Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <AlertCircle className="h-4 w-4 text-blue-500" />
            Market-Specific Notifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Choose which market-specific alert types you want to receive.
          </p>
          <div className="space-y-1">
            {([
              { key: "flImminent" as const, label: "FL Imminent Signals", description: "Pre-foreclosure, lis pendens, code violations in Florida" },
              { key: "prTaxDelinquent" as const, label: "PR Tax Delinquent", description: "CRIM tax delinquency alerts for Puerto Rico properties" },
              { key: "drConfotur" as const, label: "DR CONFOTUR Expiring", description: "Tax incentive expiration alerts for Dominican Republic" },
              { key: "buyer1031" as const, label: "Buyer 1031 Deadlines", description: "1031 exchange deadline approaching for active buyers" },
              { key: "newAgent" as const, label: "New Agent in Territory", description: "Alert when a new competing agent enters your territory" },
            ]).map((item, i, arr) => (
              <div key={item.key}>
                <div className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{item.label}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{item.description}</p>
                  </div>
                  <button
                    onClick={() => toggleMarketNotification(item.key)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      marketNotifications[item.key] ? "bg-blue-600" : "bg-gray-200 dark:bg-gray-700"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${
                        marketNotifications[item.key] ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
                {i < arr.length - 1 && <Separator />}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// ----- Main Settings Page -----
export default function SettingsPage() {
  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage your account, billing, territories, and integrations
        </p>
      </div>

      <Tabs defaultValue="profile">
        <TabsList className="mb-6">
          <TabsTrigger value="profile">
            <User className="h-4 w-4 mr-1.5" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="billing">
            <CreditCard className="h-4 w-4 mr-1.5" />
            Plan & Billing
          </TabsTrigger>
          <TabsTrigger value="territories">
            <MapPin className="h-4 w-4 mr-1.5" />
            Territories
          </TabsTrigger>
          <TabsTrigger value="integrations">
            <Plug className="h-4 w-4 mr-1.5" />
            Integrations
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="h-4 w-4 mr-1.5" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="license-market">
            <Award className="h-4 w-4 mr-1.5" />
            License & Market
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <ProfileTab />
        </TabsContent>
        <TabsContent value="billing">
          <BillingTab />
        </TabsContent>
        <TabsContent value="territories">
          <TerritoriesTab />
        </TabsContent>
        <TabsContent value="integrations">
          <IntegrationsTab />
        </TabsContent>
        <TabsContent value="notifications">
          <NotificationsTab />
        </TabsContent>
        <TabsContent value="license-market">
          <LicenseAndMarketTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}
