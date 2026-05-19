import type { ChatCompletionMessageParam } from 'openai/resources/chat/completions'

export interface LeadScoringParams {
  leadType: 'seller' | 'buyer' | 'tenant'
  lead: {
    name: string
    status: string
    source: string
    createdAt: string
  }
  property?: {
    address: string
    propertyType: string
    estimatedValue: number
    occupancyStatus: string
  }
  signals?: {
    label: string
    severity: string
    type: string
    detectedAt: string
  }[]
  owner?: {
    entityType: string
    portfolioSize: number
    ownershipTenure: number
    outOfState: boolean
    totalEquity: number
  }
  buyer?: {
    buyerType: string
    budget: { min: number; max: number }
    preApprovalStatus: string
    timeline: string
  }
  tenant?: {
    tenantType: string
    leaseBudget: { min: number; max: number }
    preferredTerm: string
    moveInDate?: string
  }
  outreachHistory?: {
    type: string
    outcome: string
    sentiment?: string
  }[]
}

export interface LeadScoreResult {
  score: number
  label: 'Hot' | 'Warm' | 'Cold'
  confidence: number
  reasoning: string
  topFactors: { factor: string; points: number; direction: 'up' | 'down' }[]
  suggestedAction: string
  priority: 'immediate' | 'this-week' | 'this-month' | 'backlog'
}

export function buildLeadScoringPrompt(params: LeadScoringParams): ChatCompletionMessageParam[] {
  const systemPrompt = `You are a lead scoring engine for a real estate intelligence platform. Score leads from 0 to 100 based on their likelihood to convert to a closed deal.

Score bands:
- 80-100 = Hot: Ready to transact, prioritize immediately
- 50-79 = Warm: Active interest, consistent follow-up needed
- 0-49 = Cold: Low intent, nurture or deprioritize

Scoring model by lead type:

SELLER LEADS — weight these factors:
- Signal severity and count (30%): High-severity distress/financial signals are the strongest indicator
- Ownership profile (20%): Long tenure + high equity + out-of-state = higher score
- Engagement history (20%): Positive response to outreach, meeting booked = major boost
- Market timing (15%): Property in high-demand submarket with low inventory
- Competitive pressure (15%): Number of competitor contacts, urgency indicators

BUYER LEADS — weight these factors:
- Financial readiness (35%): Cash buyer or pre-approved >> pre-qualified >> none
- Timeline urgency (25%): Immediate > 1-3 months > 3-6 months > flexible
- Budget alignment (20%): Budget matches available inventory in target market
- Engagement quality (20%): Active searching, multiple showings, questions asked

TENANT LEADS — weight these factors:
- Business readiness (30%): Company established, employee count, clear space requirements
- Financial qualification (25%): Credit-worthy, budget aligns with market rates
- Urgency (25%): Move-in date within 60 days, lease expiring
- Fit quality (20%): Space requirements match available inventory

Output format — return valid JSON:
{
  "score": <0-100>,
  "label": "Hot" | "Warm" | "Cold",
  "confidence": <0-100>,
  "reasoning": "2-3 sentence explanation of the score",
  "topFactors": [
    { "factor": "Factor name", "points": <+/- number>, "direction": "up" | "down" }
  ],
  "suggestedAction": "Specific next step recommendation",
  "priority": "immediate" | "this-week" | "this-month" | "backlog"
}`

  const userContent = buildUserMessage(params)

  return [
    { role: 'system' as const, content: systemPrompt },
    { role: 'user' as const, content: userContent },
  ]
}

function buildUserMessage(params: LeadScoringParams): string {
  const { leadType, lead, property, signals, owner, buyer, tenant, outreachHistory } = params

  const lines: string[] = [
    `Score this ${leadType} lead:`,
    ``,
    `Lead:`,
    `- Name: ${lead.name}`,
    `- Status: ${lead.status}`,
    `- Source: ${lead.source}`,
    `- Created: ${lead.createdAt}`,
  ]

  if (property) {
    lines.push(
      ``,
      `Property:`,
      `- Address: ${property.address}`,
      `- Type: ${property.propertyType}`,
      `- Value: $${property.estimatedValue.toLocaleString()}`,
      `- Occupancy: ${property.occupancyStatus}`,
    )
  }

  if (owner) {
    lines.push(
      ``,
      `Owner:`,
      `- Entity: ${owner.entityType}`,
      `- Portfolio: ${owner.portfolioSize} properties`,
      `- Tenure: ${owner.ownershipTenure} years`,
      `- Out of State: ${owner.outOfState ? 'Yes' : 'No'}`,
      `- Total Equity: $${owner.totalEquity.toLocaleString()}`,
    )
  }

  if (buyer) {
    lines.push(
      ``,
      `Buyer Profile:`,
      `- Type: ${buyer.buyerType}`,
      `- Budget: $${buyer.budget.min.toLocaleString()} - $${buyer.budget.max.toLocaleString()}`,
      `- Pre-Approval: ${buyer.preApprovalStatus}`,
      `- Timeline: ${buyer.timeline}`,
    )
  }

  if (tenant) {
    lines.push(
      ``,
      `Tenant Profile:`,
      `- Type: ${tenant.tenantType}`,
      `- Budget: $${tenant.leaseBudget.min.toLocaleString()} - $${tenant.leaseBudget.max.toLocaleString()}/mo`,
      `- Preferred Term: ${tenant.preferredTerm}`,
    )
    if (tenant.moveInDate) {
      lines.push(`- Move-in: ${tenant.moveInDate}`)
    }
  }

  if (signals && signals.length > 0) {
    lines.push(``, `Signals (${signals.length}):`)
    for (const s of signals) {
      lines.push(`- [${s.severity.toUpperCase()}] ${s.label} (${s.type}, detected ${s.detectedAt})`)
    }
  }

  if (outreachHistory && outreachHistory.length > 0) {
    lines.push(``, `Outreach History:`)
    for (const h of outreachHistory) {
      const sent = h.sentiment ? ` [${h.sentiment}]` : ''
      lines.push(`- ${h.type}: ${h.outcome}${sent}`)
    }
  }

  return lines.join('\n')
}

/** Fallback scoring when AI is not configured. */
export function calculateMockLeadScore(params: LeadScoringParams): LeadScoreResult {
  let score = 35 // base
  const topFactors: LeadScoreResult['topFactors'] = []

  if (params.leadType === 'seller') {
    const signals = params.signals || []
    const highCount = signals.filter(s => s.severity === 'high').length
    const medCount = signals.filter(s => s.severity === 'medium').length

    if (highCount > 0) {
      const pts = highCount * 15
      score += pts
      topFactors.push({ factor: `${highCount} high-severity signals`, points: pts, direction: 'up' })
    }
    if (medCount > 0) {
      const pts = medCount * 6
      score += pts
      topFactors.push({ factor: `${medCount} medium-severity signals`, points: pts, direction: 'up' })
    }

    if (params.owner?.outOfState) {
      score += 8
      topFactors.push({ factor: 'Out-of-state owner', points: 8, direction: 'up' })
    }
    if (params.owner && params.owner.ownershipTenure > 10) {
      score += 6
      topFactors.push({ factor: 'Long ownership tenure', points: 6, direction: 'up' })
    }

    if (params.lead.status === 'Responded' || params.lead.status === 'Meeting') {
      score += 15
      topFactors.push({ factor: 'Positive engagement', points: 15, direction: 'up' })
    }
  }

  if (params.leadType === 'buyer' && params.buyer) {
    if (params.buyer.preApprovalStatus === 'cash-buyer') {
      score += 25
      topFactors.push({ factor: 'Cash buyer', points: 25, direction: 'up' })
    } else if (params.buyer.preApprovalStatus === 'pre-approved') {
      score += 18
      topFactors.push({ factor: 'Pre-approved', points: 18, direction: 'up' })
    }
    if (params.buyer.timeline === 'immediate') {
      score += 15
      topFactors.push({ factor: 'Immediate timeline', points: 15, direction: 'up' })
    }
  }

  if (params.leadType === 'tenant' && params.tenant) {
    if (params.tenant.moveInDate) {
      const daysOut = Math.max(0, (new Date(params.tenant.moveInDate).getTime() - Date.now()) / 86400000)
      if (daysOut <= 60) {
        score += 15
        topFactors.push({ factor: 'Move-in within 60 days', points: 15, direction: 'up' })
      }
    }
    if (params.tenant.preferredTerm === '5yr' || params.tenant.preferredTerm === '10yr') {
      score += 8
      topFactors.push({ factor: 'Long-term lease intent', points: 8, direction: 'up' })
    }
  }

  // Negative: stale lead
  if (params.lead.status === 'Dead') {
    score -= 30
    topFactors.push({ factor: 'Dead lead status', points: 30, direction: 'down' })
  }

  score = Math.max(0, Math.min(100, score))
  const label: LeadScoreResult['label'] = score >= 80 ? 'Hot' : score >= 50 ? 'Warm' : 'Cold'
  const priority: LeadScoreResult['priority'] =
    score >= 80 ? 'immediate' :
    score >= 60 ? 'this-week' :
    score >= 40 ? 'this-month' : 'backlog'

  return {
    score,
    label,
    confidence: 65,
    reasoning: `Score based on ${(params.signals || []).length} signal(s), ${params.leadType} profile analysis, and lead status. AI scoring unavailable — using heuristic model.`,
    topFactors,
    suggestedAction: score >= 70
      ? 'Initiate direct outreach within 24 hours'
      : score >= 50
        ? 'Add to active follow-up sequence'
        : 'Add to nurture campaign and monitor for new signals',
    priority,
  }
}
