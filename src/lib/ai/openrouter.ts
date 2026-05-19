import OpenAI from 'openai'

let _client: OpenAI | null = null

export function getOpenRouterClient(): OpenAI {
  if (!_client) {
    _client = new OpenAI({
      baseURL: 'https://openrouter.ai/api/v1',
      apiKey: process.env.OPENROUTER_API_KEY || 'dummy',
      defaultHeaders: {
        'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:5000',
        'X-Title': 'ATLAS Real Estate Intelligence',
      },
    })
  }
  return _client
}

export type AITask = 'chat' | 'pitch' | 'analyze' | 'score' | 'summarize' | 'outreach'

const MODEL_MAP: Record<AITask, string> = {
  chat: 'anthropic/claude-sonnet-4-20250514',
  pitch: 'anthropic/claude-sonnet-4-20250514',
  analyze: 'google/gemini-2.5-flash',
  score: 'google/gemini-2.5-flash',
  summarize: 'google/gemini-2.5-flash',
  outreach: 'google/gemini-2.5-flash',
}

export function getModel(task: AITask): string {
  return MODEL_MAP[task]
}

export function isAIConfigured(): boolean {
  return !!process.env.OPENROUTER_API_KEY
}

