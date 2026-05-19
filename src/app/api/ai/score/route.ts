import { getOpenRouterClient, getModel, isAIConfigured } from '@/lib/ai/openrouter'
import {
  buildLeadScoringPrompt,
  calculateMockLeadScore,
  type LeadScoringParams,
} from '@/lib/ai/prompts/lead-scoring'

export async function POST(request: Request) {
  let params: LeadScoringParams

  try {
    params = await request.json()
  } catch {
    return Response.json({ error: 'Invalid request body' }, { status: 400 })
  }

  if (!params.lead || !params.leadType) {
    return Response.json(
      { error: 'lead and leadType are required' },
      { status: 400 }
    )
  }

  if (!isAIConfigured()) {
    return Response.json({
      score: calculateMockLeadScore(params),
      source: 'mock',
    })
  }

  try {
    const messages = buildLeadScoringPrompt(params)

    const completion = await getOpenRouterClient().chat.completions.create({
      model: getModel('score'),
      messages,
      max_tokens: 1000,
      temperature: 0.2, // Very low temperature for consistent scoring
    })

    const raw = completion.choices[0]?.message?.content || ''

    let scoreResult: unknown
    try {
      const jsonMatch = raw.match(/```(?:json)?\s*([\s\S]*?)```/) || [null, raw]
      scoreResult = JSON.parse(jsonMatch[1]!.trim())
    } catch {
      scoreResult = calculateMockLeadScore(params)
    }

    return Response.json({
      score: scoreResult,
      source: 'ai',
      model: getModel('score'),
      usage: completion.usage,
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'AI request failed'
    return Response.json({
      score: calculateMockLeadScore(params),
      source: 'mock',
      error: message,
    })
  }
}
