import { getOpenRouterClient, getModel, isAIConfigured } from '@/lib/ai/openrouter'
import {
  buildOwnerAnalysisPrompt,
  calculateMockMotivationScore,
  type OwnerAnalysisParams,
} from '@/lib/ai/prompts/owner-analysis'

export async function POST(request: Request) {
  let params: OwnerAnalysisParams

  try {
    params = await request.json()
  } catch {
    return Response.json({ error: 'Invalid request body' }, { status: 400 })
  }

  if (!params.owner || !params.properties) {
    return Response.json(
      { error: 'owner and properties are required' },
      { status: 400 }
    )
  }

  if (!isAIConfigured()) {
    return Response.json({
      analysis: calculateMockMotivationScore(params),
      source: 'mock',
    })
  }

  try {
    const messages = buildOwnerAnalysisPrompt(params)

    const completion = await getOpenRouterClient().chat.completions.create({
      model: getModel('analyze'),
      messages,
      max_tokens: 1500,
      temperature: 0.3, // Low temperature for consistent analytical output
    })

    const raw = completion.choices[0]?.message?.content || ''

    let analysis: unknown
    try {
      const jsonMatch = raw.match(/```(?:json)?\s*([\s\S]*?)```/) || [null, raw]
      analysis = JSON.parse(jsonMatch[1]!.trim())
    } catch {
      // Fall back to mock scoring if JSON parsing fails
      analysis = calculateMockMotivationScore(params)
    }

    return Response.json({
      analysis,
      source: 'ai',
      model: getModel('analyze'),
      usage: completion.usage,
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'AI request failed'
    return Response.json({
      analysis: calculateMockMotivationScore(params),
      source: 'mock',
      error: message,
    })
  }
}
