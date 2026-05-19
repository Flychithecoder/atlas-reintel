import { getOpenRouterClient, getModel, isAIConfigured } from '@/lib/ai/openrouter'
import { buildAtlasSystemPrompt, type AtlasAIContext } from '@/lib/ai/prompts/atlas-ai'

export async function POST(request: Request) {
  if (!isAIConfigured()) {
    return Response.json({
      message:
        'Atlas AI is not configured. Add OPENROUTER_API_KEY to .env.local to enable AI features.',
    })
  }

  let messages: { role: string; content: string }[]
  let context: AtlasAIContext | undefined

  try {
    const body = await request.json()
    messages = body.messages
    context = body.context
  } catch {
    return Response.json({ error: 'Invalid request body' }, { status: 400 })
  }

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return Response.json({ error: 'messages array is required' }, { status: 400 })
  }

  try {
    const stream = await getOpenRouterClient().chat.completions.create({
      model: getModel('chat'),
      messages: [
        { role: 'system', content: buildAtlasSystemPrompt(context) },
        ...messages.map((m) => ({
          role: m.role as 'user' | 'assistant',
          content: m.content,
        })),
      ],
      stream: true,
      max_tokens: 2000,
    })

    const encoder = new TextEncoder()

    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const text = chunk.choices[0]?.delta?.content || ''
            if (text) {
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text })}\n\n`))
            }
          }
          controller.enqueue(encoder.encode('data: [DONE]\n\n'))
          controller.close()
        } catch (err) {
          const errorMessage =
            err instanceof Error ? err.message : 'Stream interrupted'
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ error: errorMessage })}\n\n`)
          )
          controller.close()
        }
      },
    })

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'AI request failed'
    return Response.json({ error: message }, { status: 500 })
  }
}
