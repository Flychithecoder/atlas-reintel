"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  Phone,
  Mail,
  MessageSquare,
  Send,
  Link2,
  MapPin,
  Calendar,
  Building2,
  User,
  FileText,
  Sparkles,
  AlertTriangle,
  ChevronDown,
  Globe,
  ExternalLink,
  Clock,
  TrendingUp,
  TrendingDown,
  Home,
  DollarSign,
  BarChart3,
  Wand2,
  Download,
  RefreshCw,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table"
import { Separator } from "@/components/ui/separator"
import { generateOwnerDossier } from "@/hooks/use-mock-data"
import { cn, formatCurrency, formatDate } from "@/lib/utils"
import { MotivationMeter } from "@/components/shared/motivation-meter"
import { EntityBadge } from "@/components/shared/entity-badge"
import { ContactStatus } from "@/components/shared/contact-status"
import { PropertyIcon } from "@/components/shared/property-icon"
import { RelativeTime } from "@/components/shared/relative-time"
import { SignalBadges } from "@/components/shared/signal-badges"
import { LanguageToggle } from "@/components/shared/language-toggle"
import type { Signal } from "@/types"

// ── Severity dot helper ──────────────────────────────────────────────
function severityColor(sev: Signal["severity"]): string {
  if (sev === "high") return "bg-red-500"
  if (sev === "medium") return "bg-orange-400"
  return "bg-yellow-400"
}

// ── Outreach type icon helper ────────────────────────────────────────
function outreachIcon(type: string) {
  switch (type) {
    case "call":
      return <Phone className="h-4 w-4" />
    case "email":
      return <Mail className="h-4 w-4" />
    case "sms":
      return <MessageSquare className="h-4 w-4" />
    case "letter":
      return <FileText className="h-4 w-4" />
    case "linkedin":
      return <Link2 className="h-4 w-4" />
    default:
      return <Send className="h-4 w-4" />
  }
}

// ── Sentiment badge ──────────────────────────────────────────────────
function sentimentBadge(s?: "positive" | "neutral" | "negative") {
  if (!s) return null
  const map = {
    positive:
      "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    neutral:
      "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
    negative:
      "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  }
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium capitalize",
        map[s]
      )}
    >
      {s}
    </span>
  )
}

// ── LLC chain node type icon ─────────────────────────────────────────
function entityIcon(type: string) {
  if (type === "Individual") return <User className="h-4 w-4" />
  if (type === "LLC" || type === "Corporation")
    return <Building2 className="h-4 w-4" />
  return <FileText className="h-4 w-4" />
}

// ── Pitch content by style and language ──────────────────────────────
function getPitchContent(style: string, lang: "en" | "es") {
  const pitches: Record<string, Record<"en" | "es", {
    headline: string
    valueProposition: string
    marketAnalysis: string
    comparables: { address: string; soldPrice: number; soldDate: string }[]
    suggestedListPrice: number
    projectedDOM: number
  }>> = {
    "market-expert": {
      en: {
        headline: "Your Property Deserves a Market Expert",
        valueProposition:
          "With 15+ years navigating the South Florida and Caribbean markets, I bring deep institutional knowledge to maximize your property's value. My track record includes 92% list-to-sale ratios and an average of 34 days on market -- well below the local median of 67 days.",
        marketAnalysis:
          "Current market conditions favor sellers in your submarket. Inventory remains 23% below the 5-year average while demand from 1031 exchange buyers and Act 60 relocations continues to accelerate. Properties in your price bracket have appreciated 11.4% YoY, and interest rate stabilization is bringing sidelined buyers back.",
        comparables: [
          { address: "4521 Palm Beach Blvd", soldPrice: 2850000, soldDate: "2026-03-15" },
          { address: "1200 Bayshore Dr #PH4", soldPrice: 3100000, soldDate: "2026-02-28" },
          { address: "789 Ocean View Terrace", soldPrice: 2675000, soldDate: "2026-04-02" },
        ],
        suggestedListPrice: 2950000,
        projectedDOM: 38,
      },
      es: {
        headline: "Su Propiedad Merece un Experto del Mercado",
        valueProposition:
          "Con mas de 15 anos navegando los mercados del Sur de Florida y el Caribe, aporto un profundo conocimiento institucional para maximizar el valor de su propiedad. Mi historial incluye una relacion lista-venta del 92% y un promedio de 34 dias en el mercado.",
        marketAnalysis:
          "Las condiciones actuales del mercado favorecen a los vendedores en su subzona. El inventario se mantiene un 23% por debajo del promedio de 5 anos, mientras que la demanda de compradores 1031 y reubicaciones de la Ley 60 continua acelerandose. Las propiedades en su rango de precio se han apreciado un 11.4% interanual.",
        comparables: [
          { address: "4521 Palm Beach Blvd", soldPrice: 2850000, soldDate: "2026-03-15" },
          { address: "1200 Bayshore Dr #PH4", soldPrice: 3100000, soldDate: "2026-02-28" },
          { address: "789 Ocean View Terrace", soldPrice: 2675000, soldDate: "2026-04-02" },
        ],
        suggestedListPrice: 2950000,
        projectedDOM: 38,
      },
    },
    "data-driven": {
      en: {
        headline: "The Numbers Tell the Story",
        valueProposition:
          "My approach is rooted in data analytics and market intelligence. Using proprietary algorithms analyzing 26M+ property records, court filings, and permit data, I identify the optimal pricing window with statistical precision. Clients who list with data-backed strategies see 7% higher final sale prices on average.",
        marketAnalysis:
          "Absorption rate in your ZIP code is 2.3 months -- firmly a seller's market (below 4 months). Median price per sqft rose from $342 to $381 over the last 12 months (+11.4%). Cap rates for comparable commercial assets compressed from 6.8% to 5.9%, signaling strong investor appetite. Your property's equity position places you in the top 15% of portfolio owners in this submarket.",
        comparables: [
          { address: "3300 Commerce Park Dr", soldPrice: 3250000, soldDate: "2026-01-20" },
          { address: "8901 Biscayne Blvd", soldPrice: 2790000, soldDate: "2026-03-08" },
          { address: "555 Flagler Memorial", soldPrice: 3050000, soldDate: "2026-04-11" },
        ],
        suggestedListPrice: 3050000,
        projectedDOM: 42,
      },
      es: {
        headline: "Los Numeros Cuentan la Historia",
        valueProposition:
          "Mi enfoque esta basado en analisis de datos e inteligencia de mercado. Utilizando algoritmos propietarios que analizan mas de 26 millones de registros de propiedades, presentaciones judiciales y datos de permisos, identifico la ventana de precios optima con precision estadistica.",
        marketAnalysis:
          "La tasa de absorcion en su codigo postal es de 2.3 meses, firmemente un mercado de vendedores. El precio medio por pie cuadrado aumento de $342 a $381 en los ultimos 12 meses (+11.4%). Las tasas de capitalizacion para activos comerciales comparables se comprimieron del 6.8% al 5.9%.",
        comparables: [
          { address: "3300 Commerce Park Dr", soldPrice: 3250000, soldDate: "2026-01-20" },
          { address: "8901 Biscayne Blvd", soldPrice: 2790000, soldDate: "2026-03-08" },
          { address: "555 Flagler Memorial", soldPrice: 3050000, soldDate: "2026-04-11" },
        ],
        suggestedListPrice: 3050000,
        projectedDOM: 42,
      },
    },
    "relationship-first": {
      en: {
        headline: "Your Goals Are My Priority",
        valueProposition:
          "I believe the best transactions begin with understanding your unique situation and timeline. Whether you need a quick close due to life circumstances or want to maximize every dollar, I tailor my approach to your needs -- not a one-size-fits-all playbook. My clients return because I listen first and strategize second.",
        marketAnalysis:
          "The current market offers flexibility for sellers in your position. With buyer demand remaining strong and multiple financing options available, we can structure the sale to align with your specific goals -- whether that means a 30-day close, a leaseback arrangement, or a staged portfolio disposition. I will guide you through each option with complete transparency.",
        comparables: [
          { address: "2100 Las Olas Blvd", soldPrice: 2700000, soldDate: "2026-02-14" },
          { address: "6789 Coral Ridge Dr", soldPrice: 2920000, soldDate: "2026-03-22" },
          { address: "1450 Intracoastal Way", soldPrice: 2830000, soldDate: "2026-04-18" },
        ],
        suggestedListPrice: 2875000,
        projectedDOM: 45,
      },
      es: {
        headline: "Sus Objetivos Son Mi Prioridad",
        valueProposition:
          "Creo que las mejores transacciones comienzan con la comprension de su situacion y cronograma unicos. Ya sea que necesite un cierre rapido debido a circunstancias de la vida o quiera maximizar cada dolar, adapto mi enfoque a sus necesidades.",
        marketAnalysis:
          "El mercado actual ofrece flexibilidad para vendedores en su posicion. Con la demanda de compradores manteniendose fuerte y multiples opciones de financiamiento disponibles, podemos estructurar la venta para alinearse con sus objetivos especificos.",
        comparables: [
          { address: "2100 Las Olas Blvd", soldPrice: 2700000, soldDate: "2026-02-14" },
          { address: "6789 Coral Ridge Dr", soldPrice: 2920000, soldDate: "2026-03-22" },
          { address: "1450 Intracoastal Way", soldPrice: 2830000, soldDate: "2026-04-18" },
        ],
        suggestedListPrice: 2875000,
        projectedDOM: 45,
      },
    },
  }

  return pitches[style]?.[lang] ?? pitches["market-expert"][lang]
}

// ══════════════════════════════════════════════════════════════════════
// MAIN PAGE COMPONENT
// ══════════════════════════════════════════════════════════════════════

export default function OwnerDossierPage() {
  const dossier = useMemo(() => generateOwnerDossier(), [])
  const [pitchStyle, setPitchStyle] = useState<string>("market-expert")
  const [pitchLang, setPitchLang] = useState<"en" | "es">("en")

  const { owner, properties, llcChain, motivationScore, motivationFactors, outreachHistory, competitorContacts, totalPortfolioValue, totalEquity, ownerSince } = dossier

  // Group signals by property for the timeline
  const allSignals = useMemo(() => {
    const result: { signal: Signal; propertyAddress: string }[] = []
    for (const p of properties) {
      for (const s of p.signals) {
        result.push({ signal: s, propertyAddress: `${p.address}, ${p.city}` })
      }
    }
    return result.sort(
      (a, b) =>
        new Date(b.signal.detectedAt).getTime() -
        new Date(a.signal.detectedAt).getTime()
    )
  }, [properties])

  const pitch = getPitchContent(pitchStyle, pitchLang)

  // Market context mock data
  const marketContext = {
    medianHomeValue: 485000,
    priceChangeYoY: 8.2,
    avgDOM: 52,
    inventoryLevel: "Low",
    isAct60Zone: properties.some((p) => p.state === "PR"),
    isConfoturZone: properties.some((p) => p.country === "DO"),
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* ── Back Navigation ─────────────────────────────────────────── */}
      <div className="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6">
          <Link
            href="/dashboard/signals"
            className="inline-flex items-center gap-2 text-sm text-gray-500 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Signals
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* ════════════════════════════════════════════════════════════
            HEADER — Owner Info + Motivation + Contact CTAs
        ════════════════════════════════════════════════════════════ */}
        <Card className="mb-6 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/20 text-2xl font-bold text-white">
                  {owner.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)}
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">{owner.name}</h1>
                  <div className="mt-1 flex flex-wrap items-center gap-2">
                    <EntityBadge type={owner.entityType} size="sm" />
                    {owner.beneficialOwner && (
                      <span className="text-xs text-white/70">
                        Beneficial Owner: {owner.beneficialOwner}
                      </span>
                    )}
                    {owner.outOfState && (
                      <Badge variant="warning" className="text-[10px]">
                        Out-of-State
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              {competitorContacts > 0 && (
                <div className="flex items-center gap-2 rounded-lg bg-red-500/20 px-3 py-2 text-sm text-white backdrop-blur-sm">
                  <AlertTriangle className="h-4 w-4" />
                  <span className="font-medium">
                    {competitorContacts} other broker{competitorContacts > 1 ? "s" : ""} have contacted this owner
                  </span>
                </div>
              )}
            </div>
          </div>

          <CardContent className="p-6">
            <div className="grid gap-6 md:grid-cols-[1fr_auto_1fr]">
              {/* Contact Info */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                  Contact Information
                </h3>
                <div className="space-y-2">
                  {owner.phone && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span>{owner.phone}</span>
                    </div>
                  )}
                  {owner.email && (
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span>{owner.email}</span>
                    </div>
                  )}
                  {owner.mailingAddress && (
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span>{owner.mailingAddress}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span>Owner since {formatDate(ownerSince)}</span>
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-wrap gap-2 pt-2">
                  <Button size="sm" className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700">
                    <Phone className="h-3.5 w-3.5" />
                    Call
                  </Button>
                  <Button size="sm" className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700">
                    <Mail className="h-3.5 w-3.5" />
                    Email
                  </Button>
                  <Button size="sm" variant="outline">
                    <MessageSquare className="h-3.5 w-3.5" />
                    SMS
                  </Button>
                </div>
              </div>

              {/* Divider */}
              <Separator orientation="vertical" className="hidden md:block" />

              {/* Motivation Gauge + Factors */}
              <div className="flex flex-col items-center gap-3 md:items-start">
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                  Motivation Score
                </h3>
                <div className="flex items-start gap-6">
                  <MotivationMeter score={motivationScore} size="lg" />
                  <div className="space-y-1.5 pt-2">
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                      Key Factors
                    </p>
                    {motivationFactors.map((f, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-1.5 text-xs text-gray-700 dark:text-gray-300"
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-orange-400" />
                        {f}
                      </div>
                    ))}
                  </div>
                </div>
                <ContactStatus count={competitorContacts} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ════════════════════════════════════════════════════════════
            SECTION 1 — Property Portfolio
        ════════════════════════════════════════════════════════════ */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Home className="h-5 w-5 text-blue-600" />
                  Property Portfolio
                </CardTitle>
                <CardDescription>
                  {properties.length} properties &middot; Total Value{" "}
                  {formatCurrency(totalPortfolioValue)} &middot; Total Equity{" "}
                  {formatCurrency(totalEquity)}
                </CardDescription>
              </div>
              <Badge variant="secondary" className="text-sm">
                {properties.length} Properties
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Address</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>City</TableHead>
                  <TableHead className="text-right">Value</TableHead>
                  <TableHead className="text-right">Equity</TableHead>
                  <TableHead className="text-right">Equity %</TableHead>
                  <TableHead>Signals</TableHead>
                  <TableHead>Last Contact</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {properties.map((p) => {
                  const equityPct =
                    p.estimatedValue > 0
                      ? Math.round((p.equity / p.estimatedValue) * 100)
                      : 0
                  return (
                    <TableRow
                      key={p.id}
                      className="cursor-pointer"
                    >
                      <TableCell className="font-medium">{p.address}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5">
                          <PropertyIcon type={p.propertyType} />
                          <span className="text-xs text-gray-500">
                            {p.propertyType}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {p.city}, {p.state}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(p.estimatedValue)}
                      </TableCell>
                      <TableCell className="text-right text-green-600 dark:text-green-400">
                        {formatCurrency(p.equity)}
                      </TableCell>
                      <TableCell className="text-right">
                        <span
                          className={cn(
                            "text-sm font-semibold",
                            equityPct >= 70
                              ? "text-green-600 dark:text-green-400"
                              : equityPct >= 40
                                ? "text-yellow-600 dark:text-yellow-400"
                                : "text-gray-500"
                          )}
                        >
                          {equityPct}%
                        </span>
                      </TableCell>
                      <TableCell>
                        <SignalBadges signals={p.signals} max={2} />
                      </TableCell>
                      <TableCell>
                        {p.lastContact ? (
                          <RelativeTime date={p.lastContact} />
                        ) : (
                          <span className="text-xs text-gray-400">Never</span>
                        )}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>

            {/* Portfolio summary row */}
            <div className="mt-4 flex items-center justify-end gap-8 border-t border-gray-100 pt-4 dark:border-gray-800">
              <div className="text-sm">
                <span className="text-gray-500">Total Value: </span>
                <span className="font-bold">
                  {formatCurrency(totalPortfolioValue)}
                </span>
              </div>
              <div className="text-sm">
                <span className="text-gray-500">Total Equity: </span>
                <span className="font-bold text-green-600 dark:text-green-400">
                  {formatCurrency(totalEquity)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Two-column layout for LLC + Timeline */}
        <div className="mb-6 grid gap-6 lg:grid-cols-2">
          {/* ════════════════════════════════════════════════════════
              SECTION 2 — LLC Unwrapping
          ════════════════════════════════════════════════════════ */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-indigo-600" />
                LLC Unwrapping
              </CardTitle>
              <CardDescription>
                Ownership chain from beneficial owner to property
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative space-y-0">
                {llcChain.map((node, idx) => (
                  <div key={idx} className="relative flex gap-4">
                    {/* Vertical connector line */}
                    <div className="flex flex-col items-center">
                      <div
                        className={cn(
                          "flex h-10 w-10 items-center justify-center rounded-full border-2",
                          idx === 0
                            ? "border-blue-500 bg-blue-50 text-blue-600 dark:border-blue-400 dark:bg-blue-950 dark:text-blue-400"
                            : idx === llcChain.length - 1
                              ? "border-green-500 bg-green-50 text-green-600 dark:border-green-400 dark:bg-green-950 dark:text-green-400"
                              : "border-gray-300 bg-gray-50 text-gray-500 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-400"
                        )}
                      >
                        {entityIcon(node.entityType)}
                      </div>
                      {idx < llcChain.length - 1 && (
                        <div className="h-8 w-px bg-gray-300 dark:bg-gray-700" />
                      )}
                    </div>

                    {/* Node content */}
                    <div className="pb-8">
                      <p className="font-semibold text-gray-900 dark:text-gray-100">
                        {node.entityName}
                      </p>
                      <div className="mt-0.5 flex flex-wrap items-center gap-2">
                        <EntityBadge type={node.entityType} size="sm" />
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {node.role}
                        </span>
                      </div>
                      <div className="mt-1 flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400">
                        <Globe className="h-3 w-3" />
                        {node.registrySource}
                        <ExternalLink className="h-3 w-3" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Final node: Property */}
              {properties.length > 0 && (
                <div className="mt-2 flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="h-8 w-px bg-gray-300 dark:bg-gray-700" />
                    <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-amber-500 bg-amber-50 text-amber-600 dark:border-amber-400 dark:bg-amber-950 dark:text-amber-400">
                      <Home className="h-4 w-4" />
                    </div>
                  </div>
                  <div className="pt-8">
                    <p className="font-semibold text-gray-900 dark:text-gray-100">
                      {properties.length} Properties
                    </p>
                    <p className="text-xs text-gray-500">
                      Total Value: {formatCurrency(totalPortfolioValue)}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* ════════════════════════════════════════════════════════
              SECTION 3 — Signal Timeline
          ════════════════════════════════════════════════════════ */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-orange-600" />
                Signal Timeline
              </CardTitle>
              <CardDescription>
                {allSignals.length} signals detected across portfolio
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="max-h-[420px] space-y-0 overflow-y-auto pr-2">
                {allSignals.map((item, idx) => (
                  <div
                    key={idx}
                    className="relative flex gap-3 pb-4"
                  >
                    {/* Timeline connector */}
                    <div className="flex flex-col items-center">
                      <div
                        className={cn(
                          "mt-1 h-3 w-3 rounded-full",
                          severityColor(item.signal.severity)
                        )}
                      />
                      {idx < allSignals.length - 1 && (
                        <div className="h-full w-px bg-gray-200 dark:bg-gray-700" />
                      )}
                    </div>

                    {/* Signal content */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {item.signal.label}
                        </p>
                        <Badge variant="outline" className="shrink-0 text-[10px]">
                          {item.signal.severity}
                        </Badge>
                      </div>
                      <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                        {item.propertyAddress}
                      </p>
                      <div className="mt-1 flex items-center gap-3 text-[11px] text-gray-400">
                        <span>{item.signal.source}</span>
                        <span>&middot;</span>
                        <span>{formatDate(item.signal.detectedAt)}</span>
                      </div>
                    </div>
                  </div>
                ))}
                {allSignals.length === 0 && (
                  <p className="py-8 text-center text-sm text-gray-400">
                    No signals detected yet
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ════════════════════════════════════════════════════════════
            SECTION 4 — Outreach History
        ════════════════════════════════════════════════════════════ */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Send className="h-5 w-5 text-purple-600" />
                  Outreach History
                </CardTitle>
                <CardDescription>
                  {outreachHistory.length} contact attempts on record
                </CardDescription>
              </div>
              {competitorContacts > 0 && (
                <div className="flex items-center gap-2 rounded-lg bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-700 dark:bg-amber-900/20 dark:text-amber-400">
                  <AlertTriangle className="h-3.5 w-3.5" />
                  {competitorContacts} other broker{competitorContacts > 1 ? "s" : ""} have contacted
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {outreachHistory.length > 0 ? (
              <div className="space-y-0">
                {outreachHistory.map((entry, idx) => (
                  <div
                    key={idx}
                    className="relative flex gap-4 pb-5"
                  >
                    {/* Timeline connector */}
                    <div className="flex flex-col items-center">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                        {outreachIcon(entry.type)}
                      </div>
                      {idx < outreachHistory.length - 1 && (
                        <div className="h-full w-px bg-gray-200 dark:bg-gray-700" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="min-w-0 flex-1 pt-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium capitalize text-gray-900 dark:text-gray-100">
                          {entry.type}
                        </span>
                        {sentimentBadge(entry.sentiment)}
                      </div>
                      <p className="mt-0.5 text-sm text-gray-600 dark:text-gray-400">
                        {entry.outcome}
                      </p>
                      <div className="mt-1 flex items-center gap-1 text-xs text-gray-400">
                        <Clock className="h-3 w-3" />
                        {formatDate(entry.date)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center">
                <Send className="mx-auto h-8 w-8 text-gray-300 dark:text-gray-600" />
                <p className="mt-2 text-sm text-gray-500">
                  No outreach attempts yet
                </p>
                <Button size="sm" className="mt-3">
                  Start Outreach
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* ════════════════════════════════════════════════════════════
            SECTION 5 — AI Listing Pitch
        ════════════════════════════════════════════════════════════ */}
        <Card className="mb-6 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-violet-50 to-indigo-50 dark:from-violet-950/30 dark:to-indigo-950/30">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-violet-600" />
                  AI Listing Pitch
                </CardTitle>
                <CardDescription>
                  Personalized pitch generated for {owner.name}
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <LanguageToggle value={pitchLang} onChange={setPitchLang} />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {/* Pitch Style Tabs */}
            <Tabs
              defaultValue="market-expert"
              value={pitchStyle}
              onValueChange={setPitchStyle}
            >
              <div className="border-b border-gray-200 px-6 pt-4 dark:border-gray-800">
                <TabsList>
                  <TabsTrigger value="market-expert">Market Expert</TabsTrigger>
                  <TabsTrigger value="data-driven">Data-Driven</TabsTrigger>
                  <TabsTrigger value="relationship-first">
                    Relationship First
                  </TabsTrigger>
                </TabsList>
              </div>

              {/* All styles share the same layout */}
              {["market-expert", "data-driven", "relationship-first"].map(
                (style) => (
                  <TabsContent key={style} value={style} className="p-6">
                    <div className="space-y-6">
                      {/* Headline */}
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                          {pitch.headline}
                        </h3>
                      </div>

                      {/* Value Proposition */}
                      <div>
                        <h4 className="mb-2 text-sm font-semibold text-gray-500 dark:text-gray-400">
                          {pitchLang === "en"
                            ? "Value Proposition"
                            : "Propuesta de Valor"}
                        </h4>
                        <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                          {pitch.valueProposition}
                        </p>
                      </div>

                      {/* Market Analysis */}
                      <div>
                        <h4 className="mb-2 text-sm font-semibold text-gray-500 dark:text-gray-400">
                          {pitchLang === "en"
                            ? "Market Analysis"
                            : "Analisis de Mercado"}
                        </h4>
                        <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                          {pitch.marketAnalysis}
                        </p>
                      </div>

                      {/* Comparable Sales */}
                      <div>
                        <h4 className="mb-2 text-sm font-semibold text-gray-500 dark:text-gray-400">
                          {pitchLang === "en"
                            ? "Comparable Sales"
                            : "Ventas Comparables"}
                        </h4>
                        <div className="grid gap-3 sm:grid-cols-3">
                          {pitch.comparables.map((comp, i) => (
                            <div
                              key={i}
                              className="rounded-lg border border-gray-200 p-3 dark:border-gray-700"
                            >
                              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                {comp.address}
                              </p>
                              <p className="mt-1 text-lg font-bold text-green-600 dark:text-green-400">
                                {formatCurrency(comp.soldPrice)}
                              </p>
                              <p className="text-xs text-gray-500">
                                {pitchLang === "en" ? "Sold" : "Vendido"}{" "}
                                {formatDate(comp.soldDate)}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Recommendation row */}
                      <div className="grid gap-4 rounded-xl bg-gray-50 p-4 sm:grid-cols-2 dark:bg-gray-900">
                        <div>
                          <p className="text-xs text-gray-500">
                            {pitchLang === "en"
                              ? "Suggested List Price"
                              : "Precio de Lista Sugerido"}
                          </p>
                          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                            {formatCurrency(pitch.suggestedListPrice)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">
                            {pitchLang === "en"
                              ? "Projected Days on Market"
                              : "Dias Proyectados en el Mercado"}
                          </p>
                          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                            {pitch.projectedDOM}{" "}
                            <span className="text-sm font-normal text-gray-500">
                              {pitchLang === "en" ? "days" : "dias"}
                            </span>
                          </p>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex gap-3">
                        <Button className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700">
                          <Wand2 className="h-4 w-4" />
                          {pitchLang === "en"
                            ? "Generate New Pitch"
                            : "Generar Nuevo Pitch"}
                        </Button>
                        <Button variant="outline">
                          <Download className="h-4 w-4" />
                          {pitchLang === "en"
                            ? "Export as PDF"
                            : "Exportar como PDF"}
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                )
              )}
            </Tabs>
          </CardContent>
        </Card>

        {/* ════════════════════════════════════════════════════════════
            SECTION 6 — Market Context
        ════════════════════════════════════════════════════════════ */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-emerald-600" />
              Market Context
            </CardTitle>
            <CardDescription>
              Neighborhood statistics and recent comparable sales
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Stats grid */}
            <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  Median Home Value
                </p>
                <p className="mt-1 text-xl font-bold text-gray-900 dark:text-gray-100">
                  {formatCurrency(marketContext.medianHomeValue)}
                </p>
              </div>
              <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  Price Change YoY
                </p>
                <p className="mt-1 flex items-center gap-1 text-xl font-bold text-green-600 dark:text-green-400">
                  <TrendingUp className="h-4 w-4" />+{marketContext.priceChangeYoY}%
                </p>
              </div>
              <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  Avg Days on Market
                </p>
                <p className="mt-1 text-xl font-bold text-gray-900 dark:text-gray-100">
                  {marketContext.avgDOM} days
                </p>
              </div>
              <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  Inventory Level
                </p>
                <p className="mt-1 text-xl font-bold text-orange-600 dark:text-orange-400">
                  {marketContext.inventoryLevel}
                </p>
              </div>
            </div>

            {/* Zone badges */}
            {(marketContext.isAct60Zone || marketContext.isConfoturZone) && (
              <div className="mb-4 flex gap-2">
                {marketContext.isAct60Zone && (
                  <Badge className="bg-emerald-600 text-white">
                    Act 60 Zone
                  </Badge>
                )}
                {marketContext.isConfoturZone && (
                  <Badge className="bg-sky-600 text-white">
                    CONFOTUR Zone
                  </Badge>
                )}
              </div>
            )}

            {/* Comparable sales */}
            <div>
              <h4 className="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
                Recent Comparable Sales
              </h4>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  { address: "2340 Coral Way", price: 510000, date: "2026-04-12", sqft: 1850, pricePerSqft: 276 },
                  { address: "891 Bayview Dr", price: 475000, date: "2026-03-28", sqft: 1680, pricePerSqft: 283 },
                  { address: "1567 Palm Ave", price: 530000, date: "2026-04-22", sqft: 2100, pricePerSqft: 252 },
                  { address: "4020 Ocean Blvd", price: 498000, date: "2026-03-15", sqft: 1920, pricePerSqft: 259 },
                ].map((sale, i) => (
                  <div
                    key={i}
                    className="rounded-lg border border-gray-200 p-3 transition-colors hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600"
                  >
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {sale.address}
                    </p>
                    <p className="mt-1 text-lg font-bold text-gray-900 dark:text-gray-100">
                      {formatCurrency(sale.price)}
                    </p>
                    <div className="mt-1 flex items-center justify-between text-xs text-gray-500">
                      <span>{sale.sqft} sqft</span>
                      <span>${sale.pricePerSqft}/sqft</span>
                    </div>
                    <p className="mt-1 text-xs text-gray-400">
                      Sold {formatDate(sale.date)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
