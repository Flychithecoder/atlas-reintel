import { NextResponse } from 'next/server'
import { getResendClient, isResendConfigured, getFromEmail } from '@/lib/resend/client'
import { resolveTemplate, type TemplateName } from '@/lib/resend/templates'

interface EmailRequestBody {
  to: string
  subject?: string
  template?: TemplateName
  params?: Record<string, unknown>
  language?: 'en' | 'es'
  html?: string
  text?: string
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as EmailRequestBody
    const { to, template, params, language = 'en' } = body

    if (!to) {
      return NextResponse.json(
        { success: false, error: 'Recipient email (to) is required' },
        { status: 400 }
      )
    }

    // Resolve the template if one was specified
    let subject = body.subject || ''
    let html = body.html || ''
    let text = body.text || ''

    if (template) {
      const resolved = resolveTemplate(template, params || {}, language)
      if (!resolved) {
        return NextResponse.json(
          { success: false, error: `Unknown template: ${template}` },
          { status: 400 }
        )
      }
      subject = resolved.subject
      html = resolved.html
      text = resolved.text
    }

    if (!subject || (!html && !text)) {
      return NextResponse.json(
        {
          success: false,
          error:
            'Either provide a template name with params, or subject + html/text',
        },
        { status: 400 }
      )
    }

    // Mock mode
    if (!isResendConfigured()) {
      const mockId = `MOCK_EMAIL_${Date.now()}`
      console.log(
        `[MOCK EMAIL] To: ${to} | Subject: ${subject} | Template: ${template || 'custom'} | ID: ${mockId}`
      )
      return NextResponse.json({
        success: true,
        data: { id: mockId, to, subject, mock: true },
      })
    }

    const resend = getResendClient()!

    const emailOptions = {
      from: getFromEmail(),
      to,
      subject,
      ...(html ? { html } : {}),
      ...(text ? { text } : {}),
    } as Parameters<typeof resend.emails.send>[0]

    const result = await resend.emails.send(emailOptions)

    if (result.error) {
      return NextResponse.json(
        { success: false, error: result.error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: { id: result.data?.id, to, subject },
    })
  } catch {
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
