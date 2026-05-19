import { getTwilioClient, getTwilioPhone } from './client'

export interface SMSResult {
  success: boolean
  sid?: string
  error?: string
}

export async function sendSMS(to: string, body: string): Promise<SMSResult> {
  const client = getTwilioClient()

  if (!client) {
    // Mock mode
    return { success: true, sid: `MOCK_SMS_${Date.now()}` }
  }

  try {
    const message = await client.messages.create({
      to,
      from: getTwilioPhone(),
      body,
    })
    return { success: true, sid: message.sid }
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : 'Failed to send SMS'
    return { success: false, error: message }
  }
}

export async function sendBulkSMS(
  recipients: Array<{ to: string; body: string }>
): Promise<SMSResult[]> {
  const results: SMSResult[] = []

  // Rate limit: process in batches of 10 per second
  for (let i = 0; i < recipients.length; i += 10) {
    const batch = recipients.slice(i, i + 10)
    const batchResults = await Promise.all(
      batch.map((r) => sendSMS(r.to, r.body))
    )
    results.push(...batchResults)

    // Wait 1 second between batches (skip delay on last batch)
    if (i + 10 < recipients.length) {
      await new Promise((resolve) => setTimeout(resolve, 1000))
    }
  }

  return results
}
