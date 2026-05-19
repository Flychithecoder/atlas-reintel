"use client"

import Link from "next/link"
import {
  Brain,
  MessageSquareText,
  Phone,
  SearchSlash,
  Puzzle,
  FileText,
  Database,
  Zap,
  Send,
  Star,
  Check,
  ArrowRight,
  TrendingUp,
  MapPin,
  BarChart3,
  Shield,
  Users,
  Building2,
  Globe,
  Activity,
} from "lucide-react"

/* ------------------------------------------------------------------ */
/*  HERO                                                               */
/* ------------------------------------------------------------------ */

function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-white">
      {/* Dot grid background */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "radial-gradient(circle, #2563EB 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 pb-20 pt-16 sm:px-6 sm:pb-28 sm:pt-24 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left copy */}
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-sm font-medium text-blue-700">
              <Activity className="h-3.5 w-3.5" />
              Now in public beta
            </div>

            <h1 className="text-4xl font-extrabold leading-[1.1] tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
              Find Every Off-Market Deal{" "}
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Before Your Competition
              </span>
            </h1>

            <p className="mt-6 max-w-lg text-lg leading-8 text-gray-600">
              ATLAS combines 50+ data signals, AI-powered scoring, and
              intelligent outreach to surface the most motivated sellers in
              residential and commercial real estate across the US, Puerto Rico,
              and Dominican Republic.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 transition-all hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-600/30"
              >
                Start Free Trial
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="#demo"
                className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-6 py-3.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
              >
                Watch Demo
              </a>
            </div>

            {/* Social proof */}
            <div className="mt-10 flex items-center gap-3">
              <div className="flex -space-x-2">
                {[
                  "bg-blue-500",
                  "bg-indigo-500",
                  "bg-violet-500",
                  "bg-purple-500",
                  "bg-fuchsia-500",
                ].map((bg, i) => (
                  <div
                    key={i}
                    className={`flex h-8 w-8 items-center justify-center rounded-full border-2 border-white text-xs font-bold text-white ${bg}`}
                  >
                    {String.fromCharCode(65 + i)}
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-500">
                Trusted by{" "}
                <span className="font-semibold text-gray-900">2,800+</span>{" "}
                agents, investors, and brokerages across the US, Puerto Rico, and Dominican Republic
              </p>
            </div>
          </div>

          {/* Right: Dashboard mockup */}
          <div className="relative">
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl shadow-blue-900/10">
              {/* Title bar */}
              <div className="flex items-center gap-2 border-b border-gray-100 bg-gray-50 px-4 py-2.5">
                <div className="h-3 w-3 rounded-full bg-red-400" />
                <div className="h-3 w-3 rounded-full bg-yellow-400" />
                <div className="h-3 w-3 rounded-full bg-green-400" />
                <span className="ml-3 text-xs text-gray-400">
                  app.atlas.ai/dashboard
                </span>
              </div>

              <div className="p-4">
                {/* Stats row */}
                <div className="mb-4 grid grid-cols-3 gap-3">
                  {[
                    {
                      label: "Active Leads",
                      value: "1,284",
                      change: "+12%",
                      icon: Users,
                    },
                    {
                      label: "Avg Score",
                      value: "73.4",
                      change: "+5.2",
                      icon: TrendingUp,
                    },
                    {
                      label: "Deals Closed",
                      value: "38",
                      change: "+8",
                      icon: Building2,
                    },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className="rounded-xl border border-gray-100 bg-gray-50/50 p-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-medium text-gray-400 uppercase">
                          {stat.label}
                        </span>
                        <stat.icon className="h-3.5 w-3.5 text-blue-500" />
                      </div>
                      <div className="mt-1 flex items-baseline gap-1.5">
                        <span className="text-lg font-bold text-gray-900">
                          {stat.value}
                        </span>
                        <span className="text-[10px] font-medium text-emerald-600">
                          {stat.change}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Lead cards */}
                <div className="space-y-2">
                  {[
                    {
                      name: "432 Elm St, Atlanta GA",
                      type: "Probate + Tax Delinquent",
                      score: 94,
                      equity: "78%",
                    },
                    {
                      name: "1801 Peachtree NW #4",
                      type: "Code Violation + Vacancy",
                      score: 87,
                      equity: "92%",
                    },
                    {
                      name: "5612 Roswell Rd",
                      type: "Divorce + Pre-foreclosure",
                      score: 82,
                      equity: "65%",
                    },
                  ].map((lead) => (
                    <div
                      key={lead.name}
                      className="flex items-center justify-between rounded-lg border border-gray-100 px-3 py-2.5 transition-colors hover:bg-blue-50/50"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold text-white ${
                            lead.score >= 90
                              ? "bg-emerald-500"
                              : lead.score >= 85
                              ? "bg-blue-500"
                              : "bg-indigo-500"
                          }`}
                        >
                          {lead.score}
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-gray-900">
                            {lead.name}
                          </p>
                          <p className="text-[10px] text-gray-400">
                            {lead.type}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-medium text-gray-500">
                          Equity
                        </p>
                        <p className="text-xs font-bold text-emerald-600">
                          {lead.equity}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Map placeholder */}
                <div className="mt-3 flex h-28 items-center justify-center rounded-xl border border-gray-100 bg-gradient-to-br from-blue-50 to-indigo-50">
                  <div className="flex items-center gap-2 text-sm text-blue-400">
                    <MapPin className="h-4 w-4" />
                    <span className="font-medium">Territory heat map</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating badge */}
            <div className="absolute -bottom-4 -left-4 rounded-xl border border-gray-100 bg-white px-4 py-2.5 shadow-lg">
              <div className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100">
                  <Zap className="h-3.5 w-3.5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-[10px] font-medium text-gray-400">
                    AI Score Updated
                  </p>
                  <p className="text-xs font-bold text-gray-900">
                    94 &mdash; High Intent
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  DATA SOURCES / LOGOS                                                */
/* ------------------------------------------------------------------ */

function DataSourcesBar() {
  const sources = [
    "ATTOM Data",
    "CoreLogic",
    "BuildZoom",
    "SEC EDGAR",
    "County Records",
    "Census ACS",
    "USPS Vacancy",
  ]

  return (
    <section id="data-sources" className="border-y border-gray-100 bg-gray-50/50 py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-center text-xs font-semibold uppercase tracking-widest text-gray-400">
          Powered by data from
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
          {sources.map((name) => (
            <div
              key={name}
              className="flex items-center gap-2 text-sm font-semibold text-gray-300"
            >
              <Database className="h-4 w-4" />
              {name}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  MARKETS                                                            */
/* ------------------------------------------------------------------ */

const markets = [
  {
    flag: "\u{1F1FA}\u{1F1F8}",
    name: "United States",
    headline: "50 states, 26M+ properties, full MLS coverage",
    description:
      "County records, ATTOM, CoreLogic, SEC EDGAR, and dozens more sources powering every asset class from single-family to industrial.",
    badge: "Active",
    badgeColor: "bg-emerald-100 text-emerald-700",
  },
  {
    flag: "\u{1F1F5}\u{1F1F7}",
    name: "Puerto Rico",
    headline: "CRIM property registry, Caribbean MLS, bilingual outreach",
    description:
      "Full CRIM integration, Caribbean MLS data, and AI outreach in English and Spanish for residential and commercial opportunities.",
    badge: "Active",
    badgeColor: "bg-emerald-100 text-emerald-700",
  },
  {
    flag: "\u{1F1E9}\u{1F1F4}",
    name: "Dominican Republic",
    headline: "Registro de Títulos, Catastro Nacional, Spanish-language AI",
    description:
      "Land registry and national cadastre data with fully Spanish-language AI scoring, outreach, and document parsing.",
    badge: "Coming Soon",
    badgeColor: "bg-amber-100 text-amber-700",
  },
]

function MarketsSection() {
  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">
            Markets
          </p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Three markets. One platform.
          </h2>
          <p className="mt-4 text-lg text-gray-500">
            Localized data pipelines, bilingual AI, and full regulatory
            compliance in every market we serve.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {markets.map((m) => (
            <div
              key={m.name}
              className="group relative rounded-2xl border border-gray-100 bg-white p-8 shadow-sm transition-all hover:border-blue-100 hover:shadow-lg hover:shadow-blue-900/5"
            >
              <div className="mb-4 flex items-center justify-between">
                <span className="text-4xl">{m.flag}</span>
                <span
                  className={`rounded-full px-3 py-0.5 text-xs font-semibold ${m.badgeColor}`}
                >
                  {m.badge}
                </span>
              </div>
              <h3 className="text-lg font-bold text-gray-900">{m.name}</h3>
              <p className="mt-1 text-sm font-medium text-blue-600">
                {m.headline}
              </p>
              <p className="mt-3 text-sm leading-6 text-gray-500">
                {m.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  FEATURES GRID                                                      */
/* ------------------------------------------------------------------ */

const features = [
  {
    icon: Brain,
    title: "AI Lead Scoring",
    description:
      "Multi-signal ensemble scoring across 50+ data points. Know exactly who's likely to sell and why.",
    color: "from-blue-500 to-blue-600",
  },
  {
    icon: MessageSquareText,
    title: "Conversational Search",
    description:
      'Ask in plain English: "Show me distressed multifamily in Atlanta owned by out-of-state LLCs with >70% equity"',
    color: "from-indigo-500 to-indigo-600",
  },
  {
    icon: Phone,
    title: "Voice AI Outreach",
    description:
      "AI-powered cold calls with TCPA compliance, sentiment analysis, and automatic meeting booking.",
    color: "from-violet-500 to-violet-600",
  },
  {
    icon: SearchSlash,
    title: "Off-Market Intelligence",
    description:
      "Fuse probate, divorce, code violations, tax delinquency, SEC filings, and satellite data.",
    color: "from-purple-500 to-purple-600",
  },
  {
    icon: Puzzle,
    title: "Browser Extension",
    description:
      "Overlay ATLAS intelligence on Zillow, LoopNet, CoStar, and LinkedIn with one click.",
    color: "from-sky-500 to-sky-600",
  },
  {
    icon: FileText,
    title: "Deal Document Parser",
    description:
      "Upload OMs, rent rolls, and lease abstracts. Get structured data and AI analysis in seconds.",
    color: "from-emerald-500 to-emerald-600",
  },
  {
    icon: Globe,
    title: "Multi-Market Intelligence",
    description:
      "Source deals across the US, Puerto Rico, and Dominican Republic with localized data pipelines and bilingual AI outreach.",
    color: "from-teal-500 to-teal-600",
  },
]

function FeaturesSection() {
  return (
    <section id="features" className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">
            Platform Features
          </p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Everything you need to find and close deals
          </h2>
          <p className="mt-4 text-lg text-gray-500">
            One platform. Every signal. Every asset class. From lead discovery to
            closing.
          </p>
        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="group relative rounded-2xl border border-gray-100 bg-white p-8 shadow-sm transition-all hover:border-blue-100 hover:shadow-lg hover:shadow-blue-900/5"
            >
              <div
                className={`mb-5 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${f.color} shadow-sm`}
              >
                <f.icon className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">{f.title}</h3>
              <p className="mt-2 text-sm leading-6 text-gray-500">
                {f.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  HOW IT WORKS                                                       */
/* ------------------------------------------------------------------ */

const steps = [
  {
    step: "01",
    icon: Database,
    title: "Connect Your Data",
    description:
      "Sync your CRM, upload lists, or let our pipelines find leads automatically from 50+ public and proprietary sources.",
  },
  {
    step: "02",
    icon: Brain,
    title: "AI Scores & Prioritizes",
    description:
      "Claude AI analyzes 50+ signals to rank your best opportunities. Ensemble scoring adapts to your market and deal criteria.",
  },
  {
    step: "03",
    icon: Send,
    title: "Reach Out & Close",
    description:
      "Multi-channel outreach with AI-generated personalized messaging. Voice AI, email sequences, and direct mail, all TCPA-compliant.",
  },
]

function HowItWorksSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-blue-950 to-indigo-950 py-24">
      {/* Grid overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-400">
            How It Works
          </p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            From raw data to closed deals in three steps
          </h2>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {steps.map((s) => (
            <div key={s.step} className="relative text-center">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm">
                <s.icon className="h-7 w-7 text-blue-400" />
              </div>
              <p className="text-xs font-bold uppercase tracking-widest text-blue-400/60">
                Step {s.step}
              </p>
              <h3 className="mt-2 text-xl font-bold text-white">{s.title}</h3>
              <p className="mt-3 text-sm leading-6 text-blue-100/60">
                {s.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  PRICING                                                            */
/* ------------------------------------------------------------------ */

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Explore the platform and extension",
    features: [
      "25 lead enrichments / month",
      "Browser extension",
      "5 document parses",
      "Community support",
    ],
    cta: "Current Plan",
    ctaStyle:
      "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 cursor-default",
    highlight: false,
  },
  {
    name: "Starter",
    price: "$79",
    period: "/mo",
    description: "For solo agents and investors",
    features: [
      "250 enrichments / month",
      "1 territory",
      "50 outreach sends",
      "AI lead scoring",
      "Email sequences",
      "CRM sync",
    ],
    cta: "Get Started",
    ctaStyle:
      "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50",
    highlight: false,
  },
  {
    name: "Pro",
    price: "$299",
    period: "/mo",
    description: "For serious investors and teams",
    features: [
      "Unlimited territories",
      "All AI agents",
      "200 voice AI minutes",
      "5,000 outreach sends",
      "Conversational search",
      "Priority support",
      "API access",
    ],
    cta: "Get Started",
    ctaStyle:
      "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-600/25",
    highlight: true,
  },
  {
    name: "Pro CRE",
    price: "$499",
    period: "/mo",
    description: "Full CRE intelligence suite",
    features: [
      "Everything in Pro",
      "CRE alt-data signals",
      "SEC EDGAR filings",
      "Satellite change detection",
      "Unlimited lease abstraction",
      "Dedicated CSM",
      "Custom integrations",
    ],
    cta: "Get Started",
    ctaStyle:
      "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50",
    highlight: false,
  },
]

function PricingSection() {
  return (
    <section id="pricing" className="bg-gray-50 py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">
            Simple Pricing
          </p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Plans that scale with your business
          </h2>
          <p className="mt-4 text-lg text-gray-500">
            Start free. Upgrade when you need more signals, more outreach, and
            more territories.
          </p>
          <p className="mt-3 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-sm font-medium text-blue-700">
            <Globe className="h-3.5 w-3.5" />
            All plans include US, PR &amp; DR market access
          </p>
        </div>

        <div className="mt-16 grid gap-6 lg:grid-cols-4">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl bg-white p-8 shadow-sm transition-all hover:shadow-lg ${
                plan.highlight
                  ? "ring-2 ring-blue-600 shadow-lg shadow-blue-600/10"
                  : "border border-gray-200"
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-blue-600 px-4 py-0.5 text-xs font-semibold text-white">
                  Most Popular
                </div>
              )}

              <h3 className="text-lg font-bold text-gray-900">{plan.name}</h3>
              <p className="mt-1 text-sm text-gray-500">{plan.description}</p>

              <div className="mt-5 flex items-baseline">
                <span className="text-4xl font-extrabold text-gray-900">
                  {plan.price}
                </span>
                <span className="ml-1 text-sm text-gray-400">
                  {plan.period}
                </span>
              </div>

              <ul className="mt-6 space-y-3">
                {plan.features.map((feat) => (
                  <li
                    key={feat}
                    className="flex items-start gap-2 text-sm text-gray-600"
                  >
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
                    {feat}
                  </li>
                ))}
              </ul>

              <Link
                href="/signup"
                className={`mt-8 block w-full rounded-xl px-4 py-3 text-center text-sm font-semibold transition-all ${plan.ctaStyle}`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        {/* Enterprise callout */}
        <div className="mt-12 rounded-2xl border border-blue-100 bg-blue-50/50 p-8 text-center">
          <h3 className="text-lg font-bold text-gray-900">Enterprise</h3>
          <p className="mt-2 text-sm text-gray-600">
            Need custom data feeds, white-label, or 100+ seats? Let&apos;s
            build your plan.
          </p>
          <a
            href="#"
            className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700"
          >
            Contact Sales
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  TESTIMONIALS                                                       */
/* ------------------------------------------------------------------ */

const testimonials = [
  {
    quote:
      "ATLAS replaced three separate tools I was paying over $600/month for. The AI scoring alone paid for itself in my first week - I closed two off-market deals that nobody else even knew about.",
    name: "Marcus Thompson",
    role: "Residential Investor, Atlanta GA",
    avatar: "MT",
    color: "bg-blue-500",
  },
  {
    quote:
      "The CRE intelligence is unreal. We ran a search for distressed multifamily with out-of-state ownership and ATLAS surfaced 40 leads our analysts hadn't found in months of manual research.",
    name: "Jennifer Liu",
    role: "CRE Broker, CBRE",
    avatar: "JL",
    color: "bg-indigo-500",
  },
  {
    quote:
      "We rolled ATLAS out to our 45-agent team and saw a 3x increase in off-market listings within 90 days. The voice AI handles our cold outreach so agents can focus on relationships.",
    name: "David Ramirez",
    role: "Team Lead, Keller Williams",
    avatar: "DR",
    color: "bg-violet-500",
  },
]

function TestimonialsSection() {
  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">
            Testimonials
          </p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Trusted by top-producing teams
          </h2>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm transition-all hover:shadow-lg"
            >
              <div className="mb-4 flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>
              <p className="text-sm leading-6 text-gray-600">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="mt-6 flex items-center gap-3">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white ${t.color}`}
                >
                  {t.avatar}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    {t.name}
                  </p>
                  <p className="text-xs text-gray-400">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  STATS BAR                                                          */
/* ------------------------------------------------------------------ */

function StatsBar() {
  const stats = [
    { value: "50+", label: "Data Signals" },
    { value: "26M+", label: "Properties Across 3 Markets" },
    { value: "98.7%", label: "Uptime SLA" },
    { value: "<200ms", label: "Avg Response" },
  ]

  return (
    <section className="bg-gradient-to-r from-blue-600 to-indigo-600 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-3xl font-extrabold text-white sm:text-4xl">
                {s.value}
              </p>
              <p className="mt-1 text-sm font-medium text-blue-100/70">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  API SECTION                                                        */
/* ------------------------------------------------------------------ */

function APISection() {
  return (
    <section id="api" className="bg-gray-50 py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">
              Developer API
            </p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Build on ATLAS intelligence
            </h2>
            <p className="mt-4 text-lg leading-8 text-gray-500">
              RESTful API and webhooks for real-time lead events. Integrate
              ATLAS scoring, enrichment, and outreach into any CRM, workflow, or
              custom application.
            </p>
            <ul className="mt-6 space-y-3">
              {[
                "RESTful JSON API with OpenAPI spec",
                "Webhook events for lead score changes",
                "Batch enrichment endpoints",
                "OAuth 2.0 and API key auth",
                "Rate limits up to 1,000 req/min on Pro",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-2 text-sm text-gray-600"
                >
                  <Check className="h-4 w-4 text-blue-600" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Code mockup */}
          <div className="overflow-hidden rounded-2xl border border-gray-800 bg-gray-900 shadow-2xl">
            <div className="flex items-center gap-2 border-b border-gray-800 px-4 py-2.5">
              <div className="h-3 w-3 rounded-full bg-red-500/60" />
              <div className="h-3 w-3 rounded-full bg-yellow-500/60" />
              <div className="h-3 w-3 rounded-full bg-green-500/60" />
              <span className="ml-3 text-xs text-gray-500">
                enrichment.ts
              </span>
            </div>
            <pre className="overflow-x-auto p-5 text-[13px] leading-6">
              <code>
                <span className="text-purple-400">const</span>{" "}
                <span className="text-blue-300">response</span>{" "}
                <span className="text-gray-400">=</span>{" "}
                <span className="text-purple-400">await</span>{" "}
                <span className="text-blue-300">atlas</span>
                <span className="text-gray-400">.</span>
                <span className="text-yellow-300">leads</span>
                <span className="text-gray-400">.</span>
                <span className="text-green-300">enrich</span>
                <span className="text-gray-400">{"({"}</span>
                {"\n"}
                {"  "}
                <span className="text-blue-300">address</span>
                <span className="text-gray-400">:</span>{" "}
                <span className="text-amber-300">
                  &quot;432 Elm St, Atlanta&quot;
                </span>
                <span className="text-gray-400">,</span>
                {"\n"}
                {"  "}
                <span className="text-blue-300">signals</span>
                <span className="text-gray-400">: [</span>
                {"\n"}
                {"    "}
                <span className="text-amber-300">&quot;probate&quot;</span>
                <span className="text-gray-400">,</span>{" "}
                <span className="text-amber-300">&quot;tax_delinquent&quot;</span>
                <span className="text-gray-400">,</span>
                {"\n"}
                {"    "}
                <span className="text-amber-300">&quot;code_violations&quot;</span>
                <span className="text-gray-400">,</span>{" "}
                <span className="text-amber-300">&quot;equity&quot;</span>
                {"\n"}
                {"  "}
                <span className="text-gray-400">],</span>
                {"\n"}
                {"  "}
                <span className="text-blue-300">score</span>
                <span className="text-gray-400">:</span>{" "}
                <span className="text-orange-300">true</span>
                {"\n"}
                <span className="text-gray-400">{"});"}</span>
                {"\n\n"}
                <span className="text-gray-500">
                  {"// => { score: 94, signals: [...], owner: {...} }"}
                </span>
              </code>
            </pre>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  FINAL CTA                                                          */
/* ------------------------------------------------------------------ */

function FinalCTA() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-blue-950 to-indigo-950 py-24">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "radial-gradient(circle, #fff 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
        <Globe className="mx-auto mb-6 h-12 w-12 text-blue-400/40" />
        <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
          Stop Paying CoStar Prices for Last Year&apos;s Data
        </h2>
        <p className="mt-6 text-lg leading-8 text-blue-100/60">
          Start your free trial. No credit card required. See your first leads
          in 60 seconds.
        </p>
        <div className="mt-10">
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-blue-600/25 transition-all hover:bg-blue-500 hover:shadow-xl hover:shadow-blue-500/30"
          >
            Start Free Trial
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
        <p className="mt-4 text-sm text-blue-200/40">
          Free plan available &middot; No credit card required &middot; Cancel
          anytime
        </p>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  PAGE EXPORT                                                        */
/* ------------------------------------------------------------------ */

export default function MarketingPage() {
  return (
    <>
      <HeroSection />
      <DataSourcesBar />
      <MarketsSection />
      <FeaturesSection />
      <StatsBar />
      <HowItWorksSection />
      <PricingSection />
      <TestimonialsSection />
      <APISection />
      <FinalCTA />
    </>
  )
}
