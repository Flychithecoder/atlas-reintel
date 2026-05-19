import { NextResponse } from 'next/server'
import { isTwilioConfigured } from '@/lib/twilio/client'
import { initiateCall } from '@/lib/twilio/voice'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { phone, leadId, leadName } = body as {
      phone?: string
      leadId?: string
      leadName?: string
    }

    if (!phone) {
      return NextResponse.json(
        { success: false, error: 'Phone number is required' },
        { status: 400 }
      )
    }

    if (!leadName) {
      return NextResponse.json(
        { success: false, error: 'Lead name is required' },
        { status: 400 }
      )
    }

    // Mock mode — return a fake call record
    if (!isTwilioConfigured()) {
      const mockCallSid = `MOCK_CALL_${Date.now()}`
      console.log(
        `[MOCK CALL] To: ${phone} | Lead: ${leadName} (${leadId}) | SID: ${mockCallSid}`
      )
      return NextResponse.json({
        success: true,
        data: {
          callSid: mockCallSid,
          leadId,
          leadName,
          phone,
          status: 'initiated',
          mock: true,
        },
      })
    }

    const result = await initiateCall(phone, leadName)

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        callSid: result.callSid,
        leadId,
        leadName,
        phone,
        status: 'initiated',
      },
    })
  } catch {
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
