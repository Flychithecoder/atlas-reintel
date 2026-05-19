import { generateGreetingTwiml } from '@/lib/twilio/voice'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const name = searchParams.get('name') || 'there'

  const twiml = generateGreetingTwiml(name)

  return new Response(twiml, {
    status: 200,
    headers: { 'Content-Type': 'application/xml' },
  })
}
