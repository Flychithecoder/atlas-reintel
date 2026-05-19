import { NextResponse } from 'next/server'
import { isTwilioConfigured } from '@/lib/twilio/client'
import { listCallRecordings } from '@/lib/twilio/voice'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const leadId = searchParams.get('leadId')

    if (!leadId) {
      return NextResponse.json(
        { success: false, error: 'leadId query parameter is required' },
        { status: 400 }
      )
    }

    // Mock mode — return sample recordings
    if (!isTwilioConfigured()) {
      const now = new Date()
      return NextResponse.json({
        success: true,
        data: [
          {
            sid: `MOCK_REC_${Date.now()}_1`,
            callSid: `MOCK_CALL_${Date.now()}_1`,
            duration: '127',
            dateCreated: new Date(
              now.getTime() - 2 * 24 * 60 * 60 * 1000
            ).toISOString(),
            mediaUrl: '#',
            leadId,
          },
          {
            sid: `MOCK_REC_${Date.now()}_2`,
            callSid: `MOCK_CALL_${Date.now()}_2`,
            duration: '45',
            dateCreated: new Date(
              now.getTime() - 5 * 24 * 60 * 60 * 1000
            ).toISOString(),
            mediaUrl: '#',
            leadId,
          },
        ],
        mock: true,
      })
    }

    // In a real setup we'd query the voice_calls table for callSids
    // associated with this leadId, then fetch recordings for each.
    // For now we support a ?callSid param as a fallback.
    const callSid = searchParams.get('callSid')

    if (!callSid) {
      // Without a call SID we can't look up Twilio recordings directly.
      // In production, query the DB: SELECT call_sid FROM voice_calls WHERE lead_id = ?
      return NextResponse.json({
        success: true,
        data: [],
        message:
          'No callSid provided. In production, recordings are looked up via the voice_calls table.',
      })
    }

    const recordings = await listCallRecordings(callSid)

    return NextResponse.json({
      success: true,
      data: recordings.map((r) => ({
        ...r,
        leadId,
      })),
    })
  } catch {
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
