import { getTwilioClient, getTwilioPhone } from './client'

export interface CallResult {
  success: boolean
  callSid?: string
  error?: string
}

export interface RecordingInfo {
  sid: string
  callSid: string
  duration: string
  dateCreated: Date
  uri: string
  mediaUrl: string
}

export async function initiateCall(
  to: string,
  leadName: string
): Promise<CallResult> {
  const client = getTwilioClient()

  if (!client) {
    // Mock mode — return a fake SID so the rest of the app can function
    return { success: true, callSid: `MOCK_CALL_${Date.now()}` }
  }

  try {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

    const call = await client.calls.create({
      to,
      from: getTwilioPhone(),
      url: `${appUrl}/api/voice/twiml?name=${encodeURIComponent(leadName)}`,
      statusCallback: `${appUrl}/api/voice/webhook`,
      statusCallbackEvent: ['initiated', 'ringing', 'answered', 'completed'],
      record: true,
    })

    return { success: true, callSid: call.sid }
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : 'Failed to initiate call'
    return { success: false, error: message }
  }
}

export async function getCallRecording(
  callSid: string
): Promise<RecordingInfo | null> {
  const client = getTwilioClient()
  if (!client) return null

  try {
    const recordings = await client.recordings.list({ callSid, limit: 1 })
    const rec = recordings[0]
    if (!rec) return null

    return {
      sid: rec.sid,
      callSid: rec.callSid,
      duration: rec.duration,
      dateCreated: rec.dateCreated,
      uri: rec.uri,
      mediaUrl: `https://api.twilio.com/2010-04-01/Accounts/${process.env.TWILIO_ACCOUNT_SID}/Recordings/${rec.sid}.mp3`,
    }
  } catch {
    return null
  }
}

export async function listCallRecordings(
  callSid: string
): Promise<RecordingInfo[]> {
  const client = getTwilioClient()
  if (!client) return []

  try {
    const recordings = await client.recordings.list({ callSid, limit: 20 })

    return recordings.map((rec) => ({
      sid: rec.sid,
      callSid: rec.callSid,
      duration: rec.duration,
      dateCreated: rec.dateCreated,
      uri: rec.uri,
      mediaUrl: `https://api.twilio.com/2010-04-01/Accounts/${process.env.TWILIO_ACCOUNT_SID}/Recordings/${rec.sid}.mp3`,
    }))
  } catch {
    return []
  }
}

export function generateGreetingTwiml(leadName: string): string {
  const escapedName = leadName
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

  return `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="Polly.Joanna">Hi, this is Atlas Real Estate Intelligence calling for ${escapedName}. We noticed some interesting activity in your property's market area and wanted to share some insights. Would you have a moment to discuss?</Say>
  <Gather input="speech" timeout="5" action="/api/voice/gather">
    <Say voice="Polly.Joanna">Press any key or say yes to continue.</Say>
  </Gather>
  <Say voice="Polly.Joanna">We didn't receive a response. We'll try reaching you again later. Have a great day!</Say>
</Response>`
}
