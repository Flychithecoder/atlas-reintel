"use client"

import { useState } from "react"
import { cn, formatCurrency } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LanguageToggle } from "@/components/shared/language-toggle"
import {
  Sparkles,
  Download,
  Mail,
  BarChart3,
  Heart,
  TrendingUp,
} from "lucide-react"

type PitchStyle = "market-expert" | "data-driven" | "relationship-first"
type Language = "en" | "es"
type Market = "FL" | "PR" | "DR"

interface ListingPitchProps {
  propertyAddress: string
  propertyValue: number
  propertyType: string
  ownerName: string
  market: Market
  className?: string
}

const styleConfig: {
  key: PitchStyle
  label: string
  icon: typeof BarChart3
}[] = [
  { key: "market-expert", label: "Market Expert", icon: TrendingUp },
  { key: "data-driven", label: "Data-Driven", icon: BarChart3 },
  { key: "relationship-first", label: "Relationship First", icon: Heart },
]

function generateComps(
  propertyValue: number,
  market: Market
) {
  const variance = [0.92, 1.05, 0.97]
  const addresses: Record<Market, string[]> = {
    FL: [
      "1420 NW 3rd Ave, Miami",
      "785 Brickell Key Dr, Miami",
      "330 Ocean Dr, Fort Lauderdale",
    ],
    PR: [
      "Calle Luna 45, San Juan",
      "Ave. Ashford 1200, Condado",
      "Calle Fortaleza 310, Viejo San Juan",
    ],
    DR: [
      "Av. Abraham Lincoln 502, Santo Domingo",
      "Calle El Conde 78, Zona Colonial",
      "Av. Winston Churchill 1040, Piantini",
    ],
  }
  const dates = ["Mar 2026", "Jan 2026", "Nov 2025"]
  const similarities = [94, 87, 82]

  return addresses[market].map((addr, i) => ({
    address: addr,
    soldPrice: Math.round(propertyValue * variance[i]),
    soldDate: dates[i],
    similarity: similarities[i],
  }))
}

function generatePitch(
  props: ListingPitchProps,
  style: PitchStyle,
  lang: Language
) {
  const { propertyAddress, propertyValue, propertyType, ownerName, market } =
    props
  const suggestedPrice = Math.round(propertyValue * 1.04)
  const daysOnMarket = market === "FL" ? 28 : market === "PR" ? 35 : 42
  const comps = generateComps(propertyValue, market)

  const marketLabels: Record<Market, Record<Language, string>> = {
    FL: { en: "South Florida", es: "Sur de Florida" },
    PR: { en: "Puerto Rico", es: "Puerto Rico" },
    DR: { en: "Dominican Republic", es: "Republica Dominicana" },
  }
  const marketLabel = marketLabels[market][lang]

  if (lang === "es") {
    const headlines: Record<PitchStyle, string> = {
      "market-expert": `${ownerName}, su propiedad en ${propertyAddress} esta en un momento ideal de mercado`,
      "data-driven": `Analisis de valor: ${propertyAddress} supera el promedio del mercado`,
      "relationship-first": `${ownerName}, me encantaria ayudarle a maximizar el valor de su propiedad`,
    }
    const valueProp: Record<PitchStyle, string> = {
      "market-expert": `Como especialista del mercado de ${marketLabel}, he identificado que propiedades como la suya de tipo ${propertyType} estan experimentando una demanda excepcional. El inventario actual esta en minimos historicos, lo que posiciona su propiedad para obtener un precio premium.`,
      "data-driven": `Basado en nuestro analisis de ${comps.length} ventas comparables y tendencias del mercado de ${marketLabel}, su ${propertyType} tiene un potencial de apreciacion significativo. Los datos muestran un aumento del 8.3% interanual en propiedades similares.`,
      "relationship-first": `${ownerName}, entiendo que vender una propiedad es una decision importante. Mi compromiso es guiarle en cada paso del proceso, asegurando que obtenga el maximo valor por su ${propertyType} en ${marketLabel}. Su tranquilidad es mi prioridad.`,
    }
    const marketAnalysis: Record<PitchStyle, string> = {
      "market-expert": `El mercado de ${marketLabel} muestra fuerte actividad con compradores internacionales compitiendo por propiedades de calidad. El tiempo promedio en mercado para ${propertyType} es de ${daysOnMarket} dias, con tendencia a la baja. Es el momento de capitalizar.`,
      "data-driven": `Indicadores clave del mercado de ${marketLabel}: absorcion a 2.1 meses (mercado de vendedores), precio medio por pie cuadrado un 12% superior al ano anterior, y ${propertyType} liderando en velocidad de venta con ${daysOnMarket} dias promedio en mercado.`,
      "relationship-first": `He trabajado con propietarios en ${marketLabel} durante anos y el mercado actual ofrece una oportunidad unica. Los compradores serios estan buscando exactamente propiedades como la suya, y me asegurare de conectarle con los mas calificados.`,
    }

    return {
      headline: headlines[style],
      valueProp: valueProp[style],
      marketAnalysis: marketAnalysis[style],
      comps,
      suggestedPrice,
      daysOnMarket,
    }
  }

  const headlines: Record<PitchStyle, string> = {
    "market-expert": `${ownerName}, your property at ${propertyAddress} is perfectly positioned in today's market`,
    "data-driven": `Value Analysis: ${propertyAddress} outperforms market averages`,
    "relationship-first": `${ownerName}, I'd love to help you maximize your property's potential`,
  }
  const valueProp: Record<PitchStyle, string> = {
    "market-expert": `As a ${marketLabel} market specialist, I've identified that ${propertyType} properties like yours are experiencing exceptional demand. Current inventory is at historic lows, positioning your property to command a premium price from motivated buyers.`,
    "data-driven": `Based on our analysis of ${comps.length} comparable sales and ${marketLabel} market trends, your ${propertyType} has significant appreciation potential. Data shows an 8.3% year-over-year increase in similar properties, with buyer demand outpacing supply 3-to-1.`,
    "relationship-first": `${ownerName}, I understand that selling a property is a major decision. My commitment is to guide you through every step, ensuring you get maximum value for your ${propertyType} in ${marketLabel}. Your peace of mind is my priority.`,
  }
  const marketAnalysis: Record<PitchStyle, string> = {
    "market-expert": `The ${marketLabel} market shows strong activity with international buyers competing for quality properties. Average days on market for ${propertyType} is ${daysOnMarket} days, trending downward. Now is the time to capitalize.`,
    "data-driven": `Key ${marketLabel} market indicators: absorption rate at 2.1 months (seller's market), median price per square foot up 12% year-over-year, and ${propertyType} leading in sale velocity at ${daysOnMarket} average days on market.`,
    "relationship-first": `I've worked with property owners in ${marketLabel} for years, and the current market presents a unique window. Serious buyers are actively searching for properties exactly like yours, and I'll make sure you're connected with the most qualified ones.`,
  }

  return {
    headline: headlines[style],
    valueProp: valueProp[style],
    marketAnalysis: marketAnalysis[style],
    comps,
    suggestedPrice,
    daysOnMarket,
  }
}

export function ListingPitch({
  propertyAddress,
  propertyValue,
  propertyType,
  ownerName,
  market,
  className,
}: ListingPitchProps) {
  const [style, setStyle] = useState<PitchStyle>("market-expert")
  const [lang, setLang] = useState<Language>("en")

  const pitch = generatePitch(
    { propertyAddress, propertyValue, propertyType, ownerName, market },
    style,
    lang
  )

  const labels = {
    en: {
      title: "AI Listing Pitch",
      generate: "Generate New",
      valuePropLabel: "Value Proposition",
      marketLabel: "Market Analysis",
      compsLabel: "Comparable Sales",
      suggestedLabel: "Suggested List Price",
      daysLabel: "Projected Days on Market",
      exportPdf: "Export as PDF",
      sendEmail: "Send via Email",
      address: "Address",
      sold: "Sold",
      date: "Date",
      match: "Match",
      days: "days",
    },
    es: {
      title: "Pitch de Listado AI",
      generate: "Generar Nuevo",
      valuePropLabel: "Propuesta de Valor",
      marketLabel: "Analisis de Mercado",
      compsLabel: "Ventas Comparables",
      suggestedLabel: "Precio Sugerido de Listado",
      daysLabel: "Dias Proyectados en Mercado",
      exportPdf: "Exportar como PDF",
      sendEmail: "Enviar por Email",
      address: "Direccion",
      sold: "Vendido",
      date: "Fecha",
      match: "Similar",
      days: "dias",
    },
  }

  const t = labels[lang]

  return (
    <Card className={cn("overflow-hidden", className)}>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 dark:border-gray-800">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {t.title}
          </h3>
        </div>
        <Button variant="outline" size="sm">
          {t.generate}
        </Button>
      </div>

      <CardContent className="space-y-5 p-6">
        {/* Style selector + Language toggle */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex items-center gap-1 rounded-lg bg-gray-100 p-1 dark:bg-gray-800">
            {styleConfig.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                type="button"
                onClick={() => setStyle(key)}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                  style === key
                    ? "bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-gray-100"
                    : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                {label}
              </button>
            ))}
          </div>
          <LanguageToggle value={lang} onChange={setLang} />
        </div>

        {/* Generated Content */}
        <div className="space-y-5 rounded-xl border border-gray-200 bg-gray-50/50 p-5 dark:border-gray-800 dark:bg-gray-900/50">
          {/* Headline */}
          <h4 className="text-xl font-bold leading-snug text-gray-900 dark:text-gray-50">
            {pitch.headline}
          </h4>

          {/* Value Proposition */}
          <div className="space-y-1.5">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              {t.valuePropLabel}
            </p>
            <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
              {pitch.valueProp}
            </p>
          </div>

          {/* Market Analysis */}
          <div className="space-y-1.5">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              {t.marketLabel}
            </p>
            <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
              {pitch.marketAnalysis}
            </p>
          </div>

          {/* Comparable Sales */}
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              {t.compsLabel}
            </p>
            <div className="space-y-2">
              {pitch.comps.map((comp, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-2.5 dark:border-gray-700 dark:bg-gray-800"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-gray-900 dark:text-gray-100">
                      {comp.address}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {t.sold}: {formatCurrency(comp.soldPrice)} &middot;{" "}
                      {t.date}: {comp.soldDate}
                    </p>
                  </div>
                  <Badge
                    variant={comp.similarity >= 90 ? "success" : "secondary"}
                    className="ml-3 shrink-0"
                  >
                    {comp.similarity}% {t.match}
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          {/* Suggested Price + Days on Market */}
          <div className="flex flex-wrap items-end justify-between gap-4 rounded-lg bg-blue-50 px-5 py-4 dark:bg-blue-950/30">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                {t.suggestedLabel}
              </p>
              <p className="text-3xl font-bold text-blue-700 dark:text-blue-300">
                {formatCurrency(pitch.suggestedPrice)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                {t.daysLabel}
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {pitch.daysOnMarket}{" "}
                <span className="text-base font-normal text-gray-500">
                  {t.days}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            {t.exportPdf}
          </Button>
          <Button className="gap-2">
            <Mail className="h-4 w-4" />
            {t.sendEmail}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
