import type { ChatCompletionMessageParam } from 'openai/resources/chat/completions'

export interface OutreachTemplateParams {
  leadType: 'seller' | 'buyer' | 'tenant'
  scenario: 'initial-contact' | 'follow-up' | 'after-signal' | 're-engagement' | 'appointment-request' | 'post-meeting'
  channel: 'email' | 'sms'
  market: 'FL' | 'PR' | 'DR'
  language: 'en' | 'es'
  tone: 'professional' | 'casual' | 'urgent'
  context?: {
    ownerName?: string
    propertyAddress?: string
    signalType?: string
    agentName?: string
    agentCompany?: string
  }
}

export interface OutreachTemplate {
  subject?: string // email only
  body: string
  followUpDelay: string
  notes: string
}

export interface OutreachTemplateResult {
  templates: OutreachTemplate[]
  sequenceStrategy: string
}

export function buildOutreachTemplatePrompt(params: OutreachTemplateParams): ChatCompletionMessageParam[] {
  const { leadType, scenario, channel, market, language, tone, context } = params

  const langInstruction = language === 'es'
    ? 'Write all templates in professional Latin American Spanish.'
    : 'Write all templates in English.'

  const channelGuidelines = channel === 'sms'
    ? `SMS guidelines:
- Maximum 160 characters per message (strict limit).
- No subject line needed.
- Include a clear CTA (call, reply, link).
- Be conversational but professional.
- Do NOT include long URLs — use a short placeholder like [link].`
    : `Email guidelines:
- Include a subject line for each template.
- Keep body under 150 words — busy professionals scan, they don't read essays.
- Use short paragraphs (2-3 sentences max).
- Include one clear call-to-action per email.
- Personalize with the owner/buyer/tenant name and property address when available.`

  const marketNotes: Record<string, string> = {
    FL: 'Florida market: Reference local market conditions. Sellers respond to international buyer demand and low inventory messaging.',
    PR: 'Puerto Rico market: Many property owners are bilingual. Reference Act 60 buyer pool as a demand driver. Be culturally sensitive to the local market dynamics.',
    DR: 'Dominican Republic market: Reference CONFOTUR benefits if applicable. Many transactions involve diaspora buyers from the US/Spain. Peso/dollar dynamics affect pricing conversations.',
  }

  const systemPrompt = `You are an outreach template generator for real estate professionals. Generate ${channel === 'sms' ? '3' : '2'} templates for the given scenario.

Scenario: ${scenario}
Lead type: ${leadType}
Channel: ${channel}
Tone: ${tone}

${channelGuidelines}

${marketNotes[market]}

${langInstruction}

Template rules:
- NEVER use generic openings like "I hope this email finds you well" or "I'm reaching out because."
- Lead with value or relevance in the first sentence.
- Reference specific details (address, signal type, market condition) when context is provided.
- Each template should have a different angle or approach.
- For "after-signal" scenarios, be tactful — distress signals (foreclosure, divorce, probate) require empathy, not sales pressure.
- Include placeholder tokens in brackets for personalization: [owner_name], [property_address], [agent_name], [agent_company], [agent_phone].

Output format — return valid JSON:
{
  "templates": [
    {
      ${channel === 'email' ? '"subject": "Email subject line",' : ''}
      "body": "Template body text",
      "followUpDelay": "Suggested delay before next touch (e.g., '3 days', '1 week')",
      "notes": "Brief note on when/why to use this variant"
    }
  ],
  "sequenceStrategy": "1-2 sentences on the recommended multi-touch sequence for this scenario"
}`

  let userContent = `Generate ${channel} outreach templates for a ${leadType} lead.`
  userContent += `\nScenario: ${scenario}`
  userContent += `\nMarket: ${market}`

  if (context) {
    if (context.ownerName) userContent += `\nOwner/Lead name: ${context.ownerName}`
    if (context.propertyAddress) userContent += `\nProperty: ${context.propertyAddress}`
    if (context.signalType) userContent += `\nTriggering signal: ${context.signalType}`
    if (context.agentName) userContent += `\nAgent name: ${context.agentName}`
    if (context.agentCompany) userContent += `\nAgent company: ${context.agentCompany}`
  }

  return [
    { role: 'system' as const, content: systemPrompt },
    { role: 'user' as const, content: userContent },
  ]
}
