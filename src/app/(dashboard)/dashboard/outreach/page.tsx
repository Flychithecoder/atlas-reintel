"use client"

import { useState, useMemo } from "react"
import { generateCampaigns, generateLeads } from "@/hooks/use-mock-data"
import type { OutreachCampaign } from "@/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Select, SelectOption } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import {
  Send,
  Mail,
  MessageSquare,
  Phone,
  FileText,
  Link as LinkIcon,
  Plus,
  Pause,
  Play,
  Copy,
  Trash2,
  Edit3,
  BarChart3,
  Calendar,
  Clock,
  Sparkles,
  Check,
  RefreshCw,
  ChevronRight,
  Zap,
  Target,
  TrendingUp,
  Eye,
  Reply,
  CalendarCheck,
  X,
  User,
  ArrowRight,
} from "lucide-react"

const channelConfig: Record<OutreachCampaign["type"], { color: string; bg: string; icon: React.ElementType; label: string }> = {
  email: { color: "text-blue-700", bg: "bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800", icon: Mail, label: "Email" },
  sms: { color: "text-green-700", bg: "bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800", icon: MessageSquare, label: "SMS" },
  voice: { color: "text-purple-700", bg: "bg-purple-50 border-purple-200 dark:bg-purple-950 dark:border-purple-800", icon: Phone, label: "Voice" },
  "direct-mail": { color: "text-orange-700", bg: "bg-orange-50 border-orange-200 dark:bg-orange-950 dark:border-orange-800", icon: FileText, label: "Direct Mail" },
  linkedin: { color: "text-cyan-700", bg: "bg-cyan-50 border-cyan-200 dark:bg-cyan-950 dark:border-cyan-800", icon: LinkIcon, label: "LinkedIn" },
}

const statusConfig: Record<OutreachCampaign["status"], { variant: "success" | "warning" | "secondary" | "default"; label: string }> = {
  active: { variant: "success", label: "Active" },
  paused: { variant: "warning", label: "Paused" },
  draft: { variant: "secondary", label: "Draft" },
  completed: { variant: "default", label: "Completed" },
}

type LeadTypeFilter = "all" | "seller" | "buyer" | "tenant"
type Language = "en" | "es"

const leadTypeTemplates: Record<LeadTypeFilter, { key: string; label: string }[]> = {
  all: [
    { key: "win-listing", label: "Win the Listing" },
    { key: "agent-to-agent", label: "Agent-to-Agent" },
    { key: "pre-market-alert", label: "Pre-Market Alert" },
    { key: "market-update", label: "Market Update" },
  ],
  seller: [
    { key: "win-listing", label: "Win the Listing" },
    { key: "market-value", label: "Your Property's Value" },
    { key: "pre-market-alert", label: "Pre-Market Alert" },
    { key: "seller-cma", label: "Free CMA Offer" },
  ],
  buyer: [
    { key: "property-match", label: "Properties Matching Criteria" },
    { key: "new-listing-alert", label: "New Listing Alert" },
    { key: "buyer-consultation", label: "Buyer Consultation" },
    { key: "market-update", label: "Market Update" },
  ],
  tenant: [
    { key: "space-available", label: "Available Spaces" },
    { key: "lease-expiry", label: "Lease Expiry Reminder" },
    { key: "market-rates", label: "Current Market Rates" },
    { key: "tenant-welcome", label: "Tenant Welcome" },
  ],
}

const aiMessageVariants: Record<Language, { tone: string; subject: string; body: string }[]> = {
  en: [
    {
      tone: "Professional",
      subject: "Investment Opportunity - Off-Market Property",
      body: "Dear [Owner Name],\n\nI noticed your property at [Address] and wanted to reach out regarding a potential acquisition opportunity. As an active investor in the [City] market, I can offer a quick, hassle-free closing with flexible terms tailored to your timeline.\n\nWould you be open to a brief conversation this week?\n\nBest regards,\n[Your Name]",
    },
    {
      tone: "Friendly",
      subject: "Quick Question About Your Property",
      body: "Hi [Owner Name],\n\nHope this finds you well! I came across your property on [Address] and was wondering if you've ever considered selling. I work with several buyers who are specifically looking in your area.\n\nNo pressure at all - just thought I'd reach out in case the timing works for you. Happy to chat whenever is convenient!\n\nCheers,\n[Your Name]",
    },
    {
      tone: "Direct",
      subject: "Cash Offer for [Address]",
      body: "Hi [Owner Name],\n\nI'll get straight to the point - I'm interested in purchasing your property at [Address]. I can make a competitive cash offer with a closing timeline that works for you.\n\nIf you're interested, I'd love to set up a quick 10-minute call. What does your schedule look like this week?\n\n[Your Name]",
    },
  ],
  es: [
    {
      tone: "Profesional",
      subject: "Oportunidad de Inversión - Propiedad Fuera de Mercado",
      body: "Estimado/a [Owner Name],\n\nNoté su propiedad en [Address] y quise comunicarme respecto a una oportunidad de adquisición. Como inversionista activo en el mercado de [City], puedo ofrecer un cierre rápido y sin complicaciones con términos flexibles adaptados a su cronograma.\n\n¿Estaría abierto/a a una breve conversación esta semana?\n\nCordialmente,\n[Your Name]",
    },
    {
      tone: "Amigable",
      subject: "Consulta Rápida Sobre Su Propiedad",
      body: "Hola [Owner Name],\n\n¡Espero que se encuentre bien! Encontré su propiedad en [Address] y me preguntaba si alguna vez ha considerado vender. Trabajo con varios compradores que buscan específicamente en su área.\n\nSin presión - solo pensé en comunicarme por si el momento le resulta oportuno. ¡Con gusto conversamos cuando le sea conveniente!\n\nSaludos,\n[Your Name]",
    },
    {
      tone: "Directo",
      subject: "Oferta en Efectivo por [Address]",
      body: "Hola [Owner Name],\n\nIré directo al punto - estoy interesado/a en comprar su propiedad en [Address]. Puedo hacer una oferta competitiva en efectivo con un cronograma de cierre que funcione para usted.\n\nSi le interesa, me encantaría coordinar una llamada rápida de 10 minutos. ¿Cómo se ve su agenda esta semana?\n\n[Your Name]",
    },
  ],
}

export default function OutreachPage() {
  const [campaigns] = useState<OutreachCampaign[]>(() => generateCampaigns())
  const [campaignFilter, setCampaignFilter] = useState("all")
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [campaignStatuses, setCampaignStatuses] = useState<Record<string, OutreachCampaign["status"]>>({})
  const [showComposer, setShowComposer] = useState(false)

  // Create campaign form state
  const [newCampaignName, setNewCampaignName] = useState("")
  const [newCampaignChannel, setNewCampaignChannel] = useState<OutreachCampaign["type"]>("email")
  const [newCampaignSchedule, setNewCampaignSchedule] = useState("now")
  const [selectedVariant, setSelectedVariant] = useState<number | null>(null)
  const [showAiVariants, setShowAiVariants] = useState(false)
  const [composerChannel, setComposerChannel] = useState("email")
  const [templateType, setTemplateType] = useState("win-listing")
  const [leadTypeFilter, setLeadTypeFilter] = useState<LeadTypeFilter>("all")
  const [language, setLanguage] = useState<Language>("en")

  // Composer lead context
  const [composerLeads] = useState(() => generateLeads(5))
  const composerLead = composerLeads[0]

  const getEffectiveStatus = (c: OutreachCampaign) => campaignStatuses[c.id] ?? c.status

  const filteredCampaigns = useMemo(() => {
    if (campaignFilter === "all") return campaigns
    return campaigns.filter((c) => c.type === campaignFilter)
  }, [campaigns, campaignFilter])

  const stats = useMemo(() => {
    const totalSent = campaigns.reduce((s, c) => s + c.sent, 0)
    const totalOpened = campaigns.reduce((s, c) => s + c.opened, 0)
    const totalReplied = campaigns.reduce((s, c) => s + c.replied, 0)
    const totalMeetings = campaigns.reduce((s, c) => s + c.meetings, 0)
    return {
      totalSent: 15420,
      openRate: 34.2,
      replyRate: 8.7,
      meetings: 67,
      rawSent: totalSent,
      rawOpened: totalOpened,
      rawReplied: totalReplied,
      rawMeetings: totalMeetings,
    }
  }, [campaigns])

  function togglePause(campaignId: string) {
    setCampaignStatuses((prev) => {
      const campaign = campaigns.find((c) => c.id === campaignId)
      if (!campaign) return prev
      const current = prev[campaignId] ?? campaign.status
      const next = current === "active" ? "paused" : current === "paused" ? "active" : current
      return { ...prev, [campaignId]: next }
    })
  }

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  }

  return (
    <div className="flex h-full">
      <div className="flex-1 space-y-6 p-6 overflow-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-50">Outreach Campaigns</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Manage multi-channel outreach campaigns powered by AI
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={() => setShowComposer(!showComposer)}>
              <Sparkles className="h-4 w-4" />
              AI Composer
            </Button>
            <Button onClick={() => setShowCreateDialog(true)}>
              <Plus className="h-4 w-4" />
              Create Campaign
            </Button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Sent</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-50 mt-1">{stats.totalSent.toLocaleString()}</p>
                  <p className="text-xs text-gray-400 mt-1">All channels</p>
                </div>
                <div className="h-10 w-10 rounded-lg bg-blue-50 dark:bg-blue-950 flex items-center justify-center">
                  <Send className="h-5 w-5 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Avg Open Rate</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-50 mt-1">{stats.openRate}%</p>
                  <p className="text-xs text-green-600 mt-1">+2.1% vs last month</p>
                </div>
                <div className="h-10 w-10 rounded-lg bg-green-50 dark:bg-green-950 flex items-center justify-center">
                  <Eye className="h-5 w-5 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Avg Reply Rate</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-50 mt-1">{stats.replyRate}%</p>
                  <p className="text-xs text-green-600 mt-1">+0.8% vs last month</p>
                </div>
                <div className="h-10 w-10 rounded-lg bg-purple-50 dark:bg-purple-950 flex items-center justify-center">
                  <Reply className="h-5 w-5 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Meetings Booked</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-50 mt-1">{stats.meetings}</p>
                  <p className="text-xs text-green-600 mt-1">12 this week</p>
                </div>
                <div className="h-10 w-10 rounded-lg bg-orange-50 dark:bg-orange-950 flex items-center justify-center">
                  <CalendarCheck className="h-5 w-5 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Campaign Tabs and List */}
        <Tabs defaultValue="all">
          <TabsList className="flex-wrap">
            <TabsTrigger value="all" onClick={() => setCampaignFilter("all")}>All Campaigns</TabsTrigger>
            <TabsTrigger value="email" onClick={() => setCampaignFilter("email")}>
              <Mail className="h-3.5 w-3.5 mr-1" /> Email
            </TabsTrigger>
            <TabsTrigger value="sms" onClick={() => setCampaignFilter("sms")}>
              <MessageSquare className="h-3.5 w-3.5 mr-1" /> SMS
            </TabsTrigger>
            <TabsTrigger value="voice" onClick={() => setCampaignFilter("voice")}>
              <Phone className="h-3.5 w-3.5 mr-1" /> Voice
            </TabsTrigger>
            <TabsTrigger value="direct-mail" onClick={() => setCampaignFilter("direct-mail")}>
              <FileText className="h-3.5 w-3.5 mr-1" /> Direct Mail
            </TabsTrigger>
            <TabsTrigger value="linkedin" onClick={() => setCampaignFilter("linkedin")}>
              <LinkIcon className="h-3.5 w-3.5 mr-1" /> LinkedIn
            </TabsTrigger>
          </TabsList>

          {/* All tab contents show the same filtered list */}
          {["all", "email", "sms", "voice", "direct-mail", "linkedin"].map((tab) => (
            <TabsContent key={tab} value={tab}>
              <div className="space-y-4 mt-4">
                {filteredCampaigns.length === 0 ? (
                  <Card>
                    <CardContent className="p-12 text-center">
                      <Send className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500 font-medium">No campaigns found</p>
                      <p className="text-sm text-gray-400 mt-1">Create your first {tab !== "all" ? tab : ""} campaign to get started</p>
                      <Button className="mt-4" onClick={() => setShowCreateDialog(true)}>
                        <Plus className="h-4 w-4" /> Create Campaign
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  filteredCampaigns.map((campaign) => {
                    const ch = channelConfig[campaign.type]
                    const st = statusConfig[getEffectiveStatus(campaign)]
                    const ChannelIcon = ch.icon
                    const progressPct = campaign.totalRecipients > 0 ? (campaign.sent / campaign.totalRecipients) * 100 : 0
                    const openRate = campaign.sent > 0 ? ((campaign.opened / campaign.sent) * 100).toFixed(1) : "0"
                    const replyRate = campaign.sent > 0 ? ((campaign.replied / campaign.sent) * 100).toFixed(1) : "0"
                    const convRate = campaign.sent > 0 ? ((campaign.meetings / campaign.sent) * 100).toFixed(1) : "0"

                    return (
                      <Card key={campaign.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-5">
                          <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                            {/* Left: Campaign info */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <h3 className="font-semibold text-gray-900 dark:text-gray-50 truncate">{campaign.name}</h3>
                                <Badge className={`border ${ch.bg} ${ch.color} text-xs`}>
                                  <ChannelIcon className="h-3 w-3 mr-1" />
                                  {ch.label}
                                </Badge>
                                <Badge variant={st.variant}>{st.label}</Badge>
                              </div>

                              {/* Progress */}
                              <div className="mt-3">
                                <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                                  <span>{campaign.sent.toLocaleString()} / {campaign.totalRecipients.toLocaleString()} sent</span>
                                  <span>{progressPct.toFixed(0)}%</span>
                                </div>
                                <Progress value={progressPct} className="h-1.5" />
                              </div>

                              {/* Stats Row */}
                              <div className="flex items-center gap-5 mt-3 text-sm">
                                <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
                                  <Send className="h-3.5 w-3.5" />
                                  <span className="font-medium">{campaign.sent.toLocaleString()}</span>
                                  <span className="text-gray-400">Sent</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
                                  <Eye className="h-3.5 w-3.5" />
                                  <span className="font-medium">{campaign.opened.toLocaleString()}</span>
                                  <span className="text-gray-400">Opened</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
                                  <Reply className="h-3.5 w-3.5" />
                                  <span className="font-medium">{campaign.replied.toLocaleString()}</span>
                                  <span className="text-gray-400">Replied</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
                                  <CalendarCheck className="h-3.5 w-3.5" />
                                  <span className="font-medium">{campaign.meetings}</span>
                                  <span className="text-gray-400">Meetings</span>
                                </div>
                              </div>

                              {/* Performance metrics */}
                              <div className="flex items-center gap-4 mt-2 text-xs">
                                <span className="text-gray-500">Open Rate: <span className="font-semibold text-gray-700 dark:text-gray-300">{openRate}%</span></span>
                                <span className="text-gray-500">Reply Rate: <span className="font-semibold text-gray-700 dark:text-gray-300">{replyRate}%</span></span>
                                <span className="text-gray-500">Conversion: <span className="font-semibold text-gray-700 dark:text-gray-300">{convRate}%</span></span>
                              </div>

                              <p className="text-xs text-gray-400 mt-2">
                                <Calendar className="h-3 w-3 inline mr-1" />
                                Created {formatDate(campaign.createdAt)}
                              </p>
                            </div>

                            {/* Right: Actions */}
                            <div className="flex items-center gap-2 shrink-0">
                              {(getEffectiveStatus(campaign) === "active" || getEffectiveStatus(campaign) === "paused") && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => togglePause(campaign.id)}
                                >
                                  {getEffectiveStatus(campaign) === "active" ? (
                                    <><Pause className="h-3.5 w-3.5" /> Pause</>
                                  ) : (
                                    <><Play className="h-3.5 w-3.5" /> Resume</>
                                  )}
                                </Button>
                              )}
                              <Button variant="ghost" size="icon" title="Edit">
                                <Edit3 className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" title="Duplicate">
                                <Copy className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" title="Delete" className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        {/* Create Campaign Dialog */}
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Campaign</DialogTitle>
              <DialogDescription>Set up a multi-channel outreach campaign with AI-powered messaging.</DialogDescription>
            </DialogHeader>

            <div className="space-y-5 mt-4">
              {/* Campaign Name */}
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 block">Campaign Name</label>
                <Input
                  placeholder="e.g., Q2 Distressed Properties - Houston"
                  value={newCampaignName}
                  onChange={(e) => setNewCampaignName(e.target.value)}
                />
              </div>

              {/* Lead Type */}
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 block">Lead Type</label>
                <div className="flex gap-2">
                  {([
                    { key: "all" as const, label: "All Leads", color: "bg-gray-600" },
                    { key: "seller" as const, label: "Sellers", color: "bg-red-600" },
                    { key: "buyer" as const, label: "Buyers", color: "bg-green-600" },
                    { key: "tenant" as const, label: "Tenants", color: "bg-purple-600" },
                  ]).map((lt) => (
                    <button
                      key={lt.key}
                      onClick={() => {
                        setLeadTypeFilter(lt.key)
                        setTemplateType(leadTypeTemplates[lt.key][0].key)
                      }}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                        leadTypeFilter === lt.key
                          ? `${lt.color} text-white shadow-sm`
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                      }`}
                    >
                      {lt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Language Toggle */}
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 block">Language</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setLanguage("en")}
                    className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      language === "en"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300"
                    }`}
                  >
                    🇺🇸 English
                  </button>
                  <button
                    onClick={() => setLanguage("es")}
                    className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      language === "es"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300"
                    }`}
                  >
                    🇪🇸 Español
                  </button>
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  {language === "es" ? "Templates optimized for PR & DR markets" : "Templates for all markets"}
                </p>
              </div>

              {/* Template Type */}
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 block">Template Type</label>
                <div className="flex flex-wrap gap-2">
                  {leadTypeTemplates[leadTypeFilter].map((tmpl) => (
                    <button
                      key={tmpl.key}
                      onClick={() => setTemplateType(tmpl.key)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                        templateType === tmpl.key
                          ? "bg-blue-600 text-white shadow-sm"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                      }`}
                    >
                      {tmpl.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Channel Selector */}
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 block">Channel</label>
                <div className="grid grid-cols-5 gap-2">
                  {(Object.entries(channelConfig) as [OutreachCampaign["type"], typeof channelConfig[OutreachCampaign["type"]]][]).map(([key, conf]) => {
                    const Icon = conf.icon
                    return (
                      <button
                        key={key}
                        onClick={() => setNewCampaignChannel(key)}
                        className={`flex flex-col items-center gap-1.5 p-3 rounded-lg border-2 transition-all text-sm ${
                          newCampaignChannel === key
                            ? `${conf.bg} border-current ${conf.color} font-semibold`
                            : "border-gray-200 dark:border-gray-700 text-gray-500 hover:border-gray-300"
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                        {conf.label}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Audience */}
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 block">Audience</label>
                <Select defaultValue="high-score">
                  <SelectOption value="high-score">Hot leads (Score 80+) - 342 leads</SelectOption>
                  <SelectOption value="warm">Warm leads (Score 50-79) - 2,891 leads</SelectOption>
                  <SelectOption value="distressed">Distressed properties - 156 leads</SelectOption>
                  <SelectOption value="absentee">Absentee owners - 1,204 leads</SelectOption>
                  <SelectOption value="all">All leads - 12,847 leads</SelectOption>
                  <SelectOption value="custom">Custom filter...</SelectOption>
                </Select>
              </div>

              {/* AI Message Generator */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Message</label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowAiVariants(true)}
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    Generate with AI
                  </Button>
                </div>

                {showAiVariants ? (
                  <div className="space-y-3">
                    {aiMessageVariants[language].map((variant, idx) => (
                      <div
                        key={idx}
                        className={`border rounded-lg p-3 cursor-pointer transition-all ${
                          selectedVariant === idx
                            ? "border-blue-500 bg-blue-50 dark:bg-blue-950 ring-1 ring-blue-500"
                            : "border-gray-200 dark:border-gray-700 hover:border-gray-300"
                        }`}
                        onClick={() => setSelectedVariant(idx)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="text-xs">{variant.tone}</Badge>
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{variant.subject}</span>
                            <Badge variant="secondary" className="text-[10px]">{language === "es" ? "ES" : "EN"}</Badge>
                          </div>
                          <Button
                            variant={selectedVariant === idx ? "default" : "outline"}
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              setSelectedVariant(idx)
                            }}
                          >
                            {selectedVariant === idx ? (
                              <><Check className="h-3.5 w-3.5" /> Selected</>
                            ) : (
                              "Use This"
                            )}
                          </Button>
                        </div>
                        <pre className="text-xs text-gray-600 dark:text-gray-400 whitespace-pre-wrap font-sans leading-relaxed">
                          {variant.body}
                        </pre>
                      </div>
                    ))}
                    <Button variant="ghost" size="sm" onClick={() => setShowAiVariants(false)}>
                      <RefreshCw className="h-3.5 w-3.5" /> Regenerate Variants
                    </Button>
                  </div>
                ) : (
                  <textarea
                    className="w-full h-32 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400"
                    placeholder="Write your message or use AI to generate variants..."
                  />
                )}
              </div>

              {/* Schedule */}
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 block">Schedule</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { key: "now", label: "Send Now", icon: Zap, desc: "Send immediately" },
                    { key: "schedule", label: "Schedule", icon: Calendar, desc: "Pick date & time" },
                    { key: "drip", label: "Drip Sequence", icon: TrendingUp, desc: "Multi-step campaign" },
                  ].map((opt) => (
                    <button
                      key={opt.key}
                      onClick={() => setNewCampaignSchedule(opt.key)}
                      className={`flex flex-col items-center gap-1 p-3 rounded-lg border-2 transition-all text-sm ${
                        newCampaignSchedule === opt.key
                          ? "border-blue-500 bg-blue-50 dark:bg-blue-950 text-blue-700"
                          : "border-gray-200 dark:border-gray-700 text-gray-500 hover:border-gray-300"
                      }`}
                    >
                      <opt.icon className="h-5 w-5" />
                      <span className="font-medium">{opt.label}</span>
                      <span className="text-xs text-gray-400">{opt.desc}</span>
                    </button>
                  ))}
                </div>

                {newCampaignSchedule === "schedule" && (
                  <div className="mt-3 flex gap-3">
                    <div className="flex-1">
                      <label className="text-xs text-gray-500 mb-1 block">Date</label>
                      <Input type="date" />
                    </div>
                    <div className="flex-1">
                      <label className="text-xs text-gray-500 mb-1 block">Time</label>
                      <Input type="time" defaultValue="09:00" />
                    </div>
                  </div>
                )}
              </div>

              {/* Launch Button */}
              <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-200 dark:border-gray-800">
                <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                  Save as Draft
                </Button>
                <Button onClick={() => setShowCreateDialog(false)}>
                  <Send className="h-4 w-4" />
                  Launch Campaign
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* AI Outreach Composer Sidebar */}
      {showComposer && (
        <div className="hidden lg:block w-96 border-l border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 overflow-y-auto">
          <div className="p-5 space-y-5">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <Sparkles className="h-4 w-4 text-white" />
                </div>
                <h2 className="font-semibold text-gray-900 dark:text-gray-50">AI Outreach Assistant</h2>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setShowComposer(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Lead Context */}
            {composerLead && (
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                      <User className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-gray-900 dark:text-gray-50 truncate">{composerLead.owner.name}</p>
                      <p className="text-xs text-gray-500 truncate">{composerLead.property.address}, {composerLead.property.city}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-gray-100 dark:bg-gray-800 rounded-md p-2">
                      <span className="text-gray-500">Score</span>
                      <p className="font-bold text-gray-900 dark:text-gray-50">{composerLead.score}/100</p>
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-800 rounded-md p-2">
                      <span className="text-gray-500">Label</span>
                      <p className="font-bold text-gray-900 dark:text-gray-50">{composerLead.scoreLabel}</p>
                    </div>
                  </div>
                  {composerLead.signals.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {composerLead.signals.slice(0, 3).map((sig, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {sig.label}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Composer Language Toggle */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-gray-500">Language:</span>
              <div className="flex gap-1">
                <button
                  onClick={() => setLanguage("en")}
                  className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                    language === "en" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
                  }`}
                >
                  EN
                </button>
                <button
                  onClick={() => setLanguage("es")}
                  className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                    language === "es" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
                  }`}
                >
                  ES
                </button>
              </div>
            </div>

            {/* Channel Tabs */}
            <Tabs defaultValue="email">
              <TabsList className="w-full grid grid-cols-4">
                <TabsTrigger value="email" onClick={() => setComposerChannel("email")}>
                  <Mail className="h-3.5 w-3.5" />
                </TabsTrigger>
                <TabsTrigger value="sms" onClick={() => setComposerChannel("sms")}>
                  <MessageSquare className="h-3.5 w-3.5" />
                </TabsTrigger>
                <TabsTrigger value="linkedin" onClick={() => setComposerChannel("linkedin")}>
                  <LinkIcon className="h-3.5 w-3.5" />
                </TabsTrigger>
                <TabsTrigger value="letter" onClick={() => setComposerChannel("letter")}>
                  <FileText className="h-3.5 w-3.5" />
                </TabsTrigger>
              </TabsList>

              {["email", "sms", "linkedin", "letter"].map((ch) => (
                <TabsContent key={ch} value={ch}>
                  <div className="space-y-3 mt-3">
                    {aiMessageVariants[language].map((variant, idx) => (
                      <Card key={idx} className="cursor-pointer hover:shadow-md transition-shadow">
                        <CardContent className="p-3">
                          <div className="flex items-center justify-between mb-1.5">
                            <Badge variant="secondary" className="text-xs">{variant.tone}</Badge>
                            <span className="text-xs text-gray-400">Variant {idx + 1}</span>
                          </div>
                          {ch === "email" && (
                            <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Subject: {variant.subject}
                            </p>
                          )}
                          <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-4 whitespace-pre-line">
                            {ch === "sms"
                              ? variant.body.split("\n").slice(1, 3).join(" ").slice(0, 160)
                              : ch === "linkedin"
                                ? variant.body.split("\n").slice(1, 4).join(" ").slice(0, 300)
                                : variant.body
                            }
                          </p>
                        </CardContent>
                      </Card>
                    ))}

                    <Button variant="outline" size="sm" className="w-full">
                      <RefreshCw className="h-3.5 w-3.5" />
                      Regenerate
                    </Button>

                    <div className="flex gap-2">
                      <Button className="flex-1">
                        <Send className="h-3.5 w-3.5" />
                        Send Now
                      </Button>
                      <Button variant="outline">
                        <Clock className="h-3.5 w-3.5" />
                        Schedule
                      </Button>
                    </div>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </div>
      )}
    </div>
  )
}
