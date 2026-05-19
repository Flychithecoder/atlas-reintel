import { NextResponse } from 'next/server'

/**
 * Twilio voice webhook — receives call status updates.
 *
 * Twilio sends form-encoded data with fields like:
 *   CallSid, CallStatus, CallDuration, From, To, etc.
 *
 * In a production setup this would update a voice_calls record in the
 * database. For now it logs the event and returns a 200 so Twilio knows
 * we received it.
 */
export async function POST(request: Request) {
  try {
    const contentType = request.headers.get('content-type') || ''

    let params: Record<string, string> = {}

    if (contentType.includes('application/x-www-form-urlencoded')) {
      const formData = await request.formData()
      for (const [key, value] of formData.entries()) {
        params[key] = String(value)
      }
    } else {
      params = (await request.json()) as Record<string, string>
    }

    const {
      CallSid: callSid,
      CallStatus: callStatus,
      CallDuration: callDuration,
      From: from,
      To: to,
      RecordingUrl: recordingUrl,
      RecordingSid: recordingSid,
    } = params

    console.log(
      `[VOICE WEBHOOK] SID: ${callSid} | Status: ${callStatus} | Duration: ${callDuration ?? 'N/A'} | From: ${from} | To: ${to}`
    )

    // TODO: Update voice_calls table in Supabase when DB schema is wired up
    // e.g.:
    // await supabase.from('voice_calls').update({
    //   status: mapTwilioStatus(callStatus),
    //   duration: parseInt(callDuration || '0', 10),
    //   recording_url: recordingUrl,
    //   recording_sid: recordingSid,
    // }).eq('call_sid', callSid)

    // If the call was just answered, return TwiML to continue the conversation
    if (callStatus === 'in-progress') {
      return new Response(
        `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="Polly.Joanna">Thank you for taking our call. One of our team members will be with you shortly.</Say>
  <Pause length="2" />
</Response>`,
        {
          status: 200,
          headers: { 'Content-Type': 'application/xml' },
        }
      )
    }

    // For all other statuses just acknowledge
    return NextResponse.json({
      success: true,
      data: {
        callSid,
        callStatus,
        callDuration: callDuration ? parseInt(callDuration, 10) : undefined,
        recordingUrl: recordingUrl || undefined,
        recordingSid: recordingSid || undefined,
      },
    })
  } catch {
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
