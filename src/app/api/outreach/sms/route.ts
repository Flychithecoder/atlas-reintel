import { NextResponse } from 'next/server'
import { isTwilioConfigured } from '@/lib/twilio/client'
import { sendSMS } from '@/lib/twilio/sms'

interface SMSRequestBody {
  to: string
  body: string
}

export async function POST(request: Request) {
  try {
    const reqBody = (await request.json()) as SMSRequestBody
    const { to, body } = reqBody

    if (!to) {
      return NextResponse.json(
        { success: false, error: 'Phone number (to) is required' },
        { status: 400 }
      )
    }

    if (!body) {
      return NextResponse.json(
        { success: false, error: 'Message body is required' },
        { status: 400 }
      )
    }

    // Mock mode
    if (!isTwilioConfigured()) {
      const mockSid = `MOCK_SMS_${Date.now()}`
      console.log(`[MOCK SMS] To: ${to} | Body: ${body} | SID: ${mockSid}`)
      return NextResponse.json({
        success: true,
        data: { sid: mockSid, to, mock: true },
      })
    }

    const result = await sendSMS(to, body)

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: { sid: result.sid, to },
    })
  } catch {
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
