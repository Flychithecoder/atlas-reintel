import type { ChatCompletionMessageParam } from 'openai/resources/chat/completions'

export interface OwnerAnalysisParams {
  owner: {
    name: string
    entityType: string
    portfolioSize: number
    totalEquity: number
    ownershipTenure: number
    outOfState: boolean
    beneficialOwner?: string
  }
  properties: {
    address: string
    propertyType: string
    estimatedValue: number
    equity: number
    occupancyStatus: string
    signals: { label: string; severity: string; type: string }[]
  }[]
  outreachHistory?: {
    type: string
    date: string
    outcome: string
    sentiment?: string
  }[]
  competitorContacts?: number
}

export interface OwnerAnalysisResult {
  motivationScore: number
  motivationLevel: 'very-high' | 'high' | 'moderate' | 'low' | 'very-low'
  primaryMotivation: string
  factors: {
    factor: string
    impact: 'positive' | 'negative' | 'neutral'
    weight: number
    explanation: string
  }[]
  recommendation: string
  bestApproach: string
  urgency: 'act-now' | 'near-term' | 'nurture' | 'monitor'
  talkingPoints: string[]
}

export function buildOwnerAnalysisPrompt(params: OwnerAnalysisParams): ChatCompletionMessageParam[] {
  const systemPrompt = `You are an owner motivation analyst for a real estate intelligence platform. Your job is to analyze a property owner's likelihood and motivation to sell based on their profile, property portfolio, detected signals, and outreach history.

Score the owner's motivation from 0 to 100:
- 80-100: Very High — multiple strong sell signals, likely to list within 30 days
- 60-79: High — clear motivation indicators, likely to list within 90 days
- 40-59: Moderate — some signals present but no urgency
- 20-39: Low — minimal indicators, long-term hold likely
- 0-19: Very Low — recent purchase, no signals, strong hold indicators

Output format — return valid JSON matching this structure:
{
  "motivationScore": <0-100>,
  "motivationLevel": "very-high" | "high" | "moderate" | "low" | "very-low",
  "primaryMotivation": "One sentence describing the primary driver",
  "factors": [
    {
      "factor": "Factor name",
      "impact": "positive" | "negative" | "neutral",
      "weight": <1-10>,
      "explanation": "Brief explanation"
    }
  ],
  "recommendation": "2-3 sentences on recommended action",
  "bestApproach": "Suggested outreach approach (e.g., data-driven, empathetic, urgency-based)",
  "urgency": "act-now" | "near-term" | "nurture" | "monitor",
  "talkingPoints": ["Point 1", "Point 2", "Point 3"]
}

Analysis guidelines:
- Distress signals (lis pendens, tax delinquency, code violations) are the strongest sell indicators.
- Life events (probate, divorce, death) often force sales regardless of market conditions.
- Financial signals (mortgage default, balloon payment due) create urgency.
- Long ownership tenure (10+ years) with high equity suggests possible sell motivation from capital gains realization.
- Out-of-state owners with distress signals are higher motivation than local owners.
- LLC/Corp/Trust entities may have different motivations than individuals — consider portfolio optimization.
- Previous negative outreach outcomes reduce the score; previous positive responses increase it.
- Competitor contact count matters — if 3+ others have contacted, the window may be closing.
- Factor in the overall signal count and severity across all properties, not just one.`

  const userContent = buildUserMessage(params)

  return [
    { role: 'system' as const, content: systemPrompt },
    { role: 'user' as const, content: userContent },
  ]
}

function buildUserMessage(params: OwnerAnalysisParams): string {
  const { owner, properties, outreachHistory, competitorContacts } = params

  const lines: string[] = [
    `Analyze this owner's motivation to sell:`,
    ``,
    `Owner Profile:`,
    `- Name: ${owner.name}`,
    `- Entity Type: ${owner.entityType}`,
    `- Portfolio Size: ${owner.portfolioSize} properties`,
    `- Total Equity: $${owner.totalEquity.toLocaleString()}`,
    `- Ownership Tenure: ${owner.ownershipTenure} years`,
    `- Out of State: ${owner.outOfState ? 'Yes' : 'No'}`,
  ]

  if (owner.beneficialOwner) {
    lines.push(`- Beneficial Owner (unwrapped LLC): ${owner.beneficialOwner}`)
  }

  lines.push(``, `Properties (${properties.length}):`)

  for (const prop of properties) {
    lines.push(``)
    lines.push(`  ${prop.address}`)
    lines.push(`  - Type: ${prop.propertyType}`)
    lines.push(`  - Value: $${prop.estimatedValue.toLocaleString()}`)
    lines.push(`  - Equity: $${prop.equity.toLocaleString()}`)
    lines.push(`  - Occupancy: ${prop.occupancyStatus}`)

    if (prop.signals.length > 0) {
      lines.push(`  - Signals:`)
      for (const signal of prop.signals) {
        lines.push(`    * [${signal.severity.toUpperCase()}] ${signal.label} (${signal.type})`)
      }
    } else {
      lines.push(`  - Signals: None detected`)
    }
  }

  if (outreachHistory && outreachHistory.length > 0) {
    lines.push(``, `Outreach History:`)
    for (const entry of outreachHistory) {
      const sentiment = entry.sentiment ? ` [${entry.sentiment}]` : ''
      lines.push(`- ${entry.date}: ${entry.type} — ${entry.outcome}${sentiment}`)
    }
  } else {
    lines.push(``, `Outreach History: No prior contact`)
  }

  if (competitorContacts !== undefined) {
    lines.push(``, `Competitor Contacts: ${competitorContacts} other agents have reached out`)
  }

  return lines.join('\n')
}

/** Fallback scoring when AI is not configured. */
export function calculateMockMotivationScore(params: OwnerAnalysisParams): OwnerAnalysisResult {
  let score = 30 // base score

  const allSignals = params.properties.flatMap(p => p.signals)
  const highSeverity = allSignals.filter(s => s.severity === 'high').length
  const medSeverity = allSignals.filter(s => s.severity === 'medium').length

  score += highSeverity * 12
  score += medSeverity * 5

  if (params.owner.outOfState) score += 8
  if (params.owner.ownershipTenure > 10) score += 6
  if (params.owner.ownershipTenure > 20) score += 4
  if (params.owner.portfolioSize > 3) score += 5

  const distressSignals = allSignals.filter(s => s.type === 'distress')
  if (distressSignals.length > 0) score += 10
  const lifeEventSignals = allSignals.filter(s => s.type === 'life-event')
  if (lifeEventSignals.length > 0) score += 8

  if (params.outreachHistory) {
    const positive = params.outreachHistory.filter(h => h.sentiment === 'positive')
    const negative = params.outreachHistory.filter(h => h.sentiment === 'negative')
    score += positive.length * 5
    score -= negative.length * 8
  }

  if (params.competitorContacts && params.competitorContacts >= 3) {
    score += 5 // window closing, act fast
  }

  score = Math.max(0, Math.min(100, score))

  const motivationLevel =
    score >= 80 ? 'very-high' :
    score >= 60 ? 'high' :
    score >= 40 ? 'moderate' :
    score >= 20 ? 'low' : 'very-low'

  const urgency =
    score >= 75 ? 'act-now' :
    score >= 55 ? 'near-term' :
    score >= 35 ? 'nurture' : 'monitor'

  const factors: OwnerAnalysisResult['factors'] = []

  if (highSeverity > 0) {
    factors.push({ factor: 'High-severity signals', impact: 'positive', weight: 9, explanation: `${highSeverity} high-severity signal(s) detected across portfolio` })
  }
  if (params.owner.outOfState) {
    factors.push({ factor: 'Out-of-state owner', impact: 'positive', weight: 6, explanation: 'Remote ownership increases management burden and sell likelihood' })
  }
  if (params.owner.ownershipTenure > 10) {
    factors.push({ factor: 'Long tenure', impact: 'positive', weight: 5, explanation: `${params.owner.ownershipTenure} years of ownership — significant equity buildup` })
  }
  if (distressSignals.length > 0) {
    factors.push({ factor: 'Distress signals', impact: 'positive', weight: 8, explanation: `Active distress indicators: ${distressSignals.map(s => s.label).join(', ')}` })
  }
  if (allSignals.length === 0) {
    factors.push({ factor: 'No signals', impact: 'negative', weight: 7, explanation: 'No pre-market signals detected — likely stable hold' })
  }

  return {
    motivationScore: score,
    motivationLevel,
    primaryMotivation: highSeverity > 0
      ? 'Active distress signals suggest urgency to sell'
      : allSignals.length > 0
        ? 'Multiple signals indicate potential readiness'
        : 'No strong sell indicators at this time',
    factors,
    recommendation: score >= 60
      ? `High-priority lead. Initiate outreach within 48 hours. The combination of ${allSignals.length} active signals and ${params.owner.ownershipTenure}-year tenure creates a strong listing opportunity.`
      : `Monitor this lead. Set alerts for new signals and revisit in 30 days.`,
    bestApproach: distressSignals.length > 0 ? 'empathetic' : params.owner.entityType !== 'Individual' ? 'data-driven' : 'relationship-first',
    urgency,
    talkingPoints: [
      `${params.owner.ownershipTenure}+ years of equity growth — potential for strong net proceeds`,
      allSignals.length > 0 ? `${allSignals.length} market signal(s) suggest favorable timing` : 'Market conditions remain favorable for sellers',
      `Portfolio of ${params.owner.portfolioSize} properties — consider optimization strategy`,
    ],
  }
}
