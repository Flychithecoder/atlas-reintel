import type { ChatCompletionMessageParam } from 'openai/resources/chat/completions'

export interface ListingPitchParams {
  property: {
    address: string
    propertyType: string
    sqft: number
    yearBuilt: number
    bedrooms?: number
    bathrooms?: number
    estimatedValue: number
    zoning?: string
    occupancyStatus: string
  }
  owner: {
    name: string
    entityType: string
    portfolioSize: number
    ownershipTenure: number
    outOfState: boolean
  }
  comps?: {
    address: string
    soldPrice: number
    soldDate: string
    sqft: number
    similarity: number
  }[]
  marketContext?: {
    medianPrice: number
    avgDOM: number
    absorptionRate: number
    inventoryMonths: number
    yoyAppreciation: number
  }
  language: 'en' | 'es'
  style: 'market-expert' | 'data-driven' | 'relationship-first'
  market: 'FL' | 'PR' | 'DR'
}

const STYLE_INSTRUCTIONS: Record<ListingPitchParams['style'], string> = {
  'market-expert': `Position the agent as a market authority with deep local knowledge. Lead with market momentum and urgency. Emphasize timing, competitive buyer demand, and the agent's track record in this specific submarket. Tone: confident, authoritative, slightly urgent.`,
  'data-driven': `Lead with hard numbers and analytics. Reference specific comparable sales, price-per-square-foot trends, days-on-market statistics, and absorption rates. Use percentages and dollar figures throughout. Tone: analytical, precise, evidence-based.`,
  'relationship-first': `Emphasize trust, personalized service, and understanding the owner's goals. Acknowledge the emotional significance of the property. Focus on the agent's commitment to the owner's timeline and comfort level. Tone: warm, empathetic, professional.`,
}

const MARKET_CONTEXT_NOTES: Record<ListingPitchParams['market'], string> = {
  FL: `Florida market notes: Reference homestead exemption implications if owner-occupied. Mention international buyer demand (LatAm, Canadian, European). Note insurance market challenges as a selling point for timing. Consider documentary stamp tax and title insurance costs in net proceeds.`,
  PR: `Puerto Rico market notes: Reference Act 60 (Ley 60) buyer pool — qualified investors receive tax exemptions that make PR properties attractive. Mention CRIM property tax rates. Note the growing remote-worker relocation trend. If commercial, mention Opportunity Zone designations.`,
  DR: `Dominican Republic market notes: Reference CONFOTUR tax exemptions if the property qualifies (15-year property tax and transfer tax waiver). Mention the 3% transfer tax for non-CONFOTUR properties. Note peso/dollar dynamics and dual-currency pricing. Reference Ley 158-01 tourism incentive zones if applicable.`,
}

export function buildListingPitchPrompt(params: ListingPitchParams): ChatCompletionMessageParam[] {
  const { property, owner, comps, marketContext, language, style, market } = params

  const langInstruction = language === 'es'
    ? 'Write the entire pitch in Spanish. Use natural, professional Latin American Spanish appropriate for the market.'
    : 'Write the pitch in English.'

  const systemPrompt = `You are a listing pitch generator for real estate agents. Your job is to create a compelling, personalized pitch that an agent can use to win a listing appointment with a property owner.

${STYLE_INSTRUCTIONS[style]}

${MARKET_CONTEXT_NOTES[market]}

${langInstruction}

Output format — return valid JSON with this exact structure:
{
  "headline": "A compelling one-line opener addressing the owner by name",
  "valueProposition": "2-3 sentences on why now is the right time and why this agent is the right choice",
  "marketAnalysis": "2-3 sentences with market data supporting the recommendation",
  "suggestedListPrice": <number>,
  "projectedDOM": <number>,
  "callToAction": "A specific next-step suggestion (meeting, call, property walk-through)"
}

Rules:
- Address the owner by name in the headline.
- The suggested list price should be realistic based on the comps and estimated value provided. Typically 2-6% above current estimated value in a seller's market.
- Projected days on market should reflect the local market conditions.
- Do NOT use generic phrases like "in today's market" without backing them with specific data.
- Keep each section concise — this is a pitch, not a report.`

  const userContent = buildUserMessage(params)

  return [
    { role: 'system' as const, content: systemPrompt },
    { role: 'user' as const, content: userContent },
  ]
}

function buildUserMessage(params: ListingPitchParams): string {
  const { property, owner, comps, marketContext, market } = params

  const lines: string[] = [
    `Generate a listing pitch for this property:`,
    ``,
    `Property:`,
    `- Address: ${property.address}`,
    `- Type: ${property.propertyType}`,
    `- Size: ${property.sqft.toLocaleString()} sqft`,
    `- Year Built: ${property.yearBuilt}`,
  ]

  if (property.bedrooms !== undefined) {
    lines.push(`- Bedrooms: ${property.bedrooms}`)
  }
  if (property.bathrooms !== undefined) {
    lines.push(`- Bathrooms: ${property.bathrooms}`)
  }

  lines.push(
    `- Estimated Value: $${property.estimatedValue.toLocaleString()}`,
    `- Occupancy: ${property.occupancyStatus}`,
  )

  if (property.zoning) {
    lines.push(`- Zoning: ${property.zoning}`)
  }

  lines.push(
    ``,
    `Owner:`,
    `- Name: ${owner.name}`,
    `- Entity Type: ${owner.entityType}`,
    `- Portfolio Size: ${owner.portfolioSize} properties`,
    `- Ownership Tenure: ${owner.ownershipTenure} years`,
    `- Out of State: ${owner.outOfState ? 'Yes' : 'No'}`,
    ``,
    `Market: ${market}`,
  )

  if (comps && comps.length > 0) {
    lines.push(``, `Comparable Sales:`)
    for (const comp of comps) {
      lines.push(`- ${comp.address}: $${comp.soldPrice.toLocaleString()} (${comp.soldDate}, ${comp.sqft.toLocaleString()} sqft, ${comp.similarity}% match)`)
    }
  }

  if (marketContext) {
    lines.push(
      ``,
      `Market Data:`,
      `- Median Price: $${marketContext.medianPrice.toLocaleString()}`,
      `- Avg Days on Market: ${marketContext.avgDOM}`,
      `- Absorption Rate: ${marketContext.absorptionRate} months`,
      `- Inventory: ${marketContext.inventoryMonths} months of supply`,
      `- YoY Appreciation: ${marketContext.yoyAppreciation}%`,
    )
  }

  return lines.join('\n')
}
