import { NextResponse } from 'next/server'
import { isTwilioConfigured } from '@/lib/twilio/client'
import { isResendConfigured, getResendClient, getFromEmail } from '@/lib/resend/client'
import { sendSMS } from '@/lib/twilio/sms'
import { resolveTemplate, type TemplateName } from '@/lib/resend/templates'

interface BulkRecipient {
  to: string
  params?: Record<string, unknown>
}

interface BulkRequestBody {
  type: 'email' | 'sms'
  recipients: BulkRecipient[]
  template?: TemplateName
  /** Only used for SMS when no template is involved */
  body?: string
  language?: 'en' | 'es'
}

interface BulkResultItem {
  to: string
  success: boolean
  id?: string
  error?: string
}

export async function POST(request: Request) {
  try {
    const reqBody = (await request.json()) as BulkRequestBody
    const { type, recipients, template, body: smsBody, language = 'en' } = reqBody

    if (!type || !['email', 'sms'].includes(type)) {
      return NextResponse.json(
        { success: false, error: 'type must be "email" or "sms"' },
        { status: 400 }
      )
    }

    if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
      return NextResponse.json(
        { success: false, error: 'recipients array is required and must not be empty' },
        { status: 400 }
      )
    }

    // Cap at a reasonable maximum per request
    const MAX_RECIPIENTS = 1000
    if (recipients.length > MAX_RECIPIENTS) {
      return NextResponse.json(
        {
          success: false,
          error: `Maximum ${MAX_RECIPIENTS} recipients per request`,
        },
        { status: 400 }
      )
    }

    // -----------------------------------------------------------------------
    // EMAIL bulk
    // -----------------------------------------------------------------------
    if (type === 'email') {
      if (!template) {
        return NextResponse.json(
          { success: false, error: 'template is required for email outreach' },
          { status: 400 }
        )
      }

      // Mock mode
      if (!isResendConfigured()) {
        const results: BulkResultItem[] = recipients.map((r) => ({
          to: r.to,
          success: true,
          id: `MOCK_EMAIL_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        }))
        console.log(
          `[MOCK BULK EMAIL] Template: ${template} | Count: ${recipients.length}`
        )
        return NextResponse.json({
          success: true,
          data: {
            total: recipients.length,
            sent: recipients.length,
            failed: 0,
            results,
            mock: true,
          },
        })
      }

      const resend = getResendClient()!
      const results: BulkResultItem[] = []

      // Rate limit: batches of 100 per second
      const BATCH_SIZE = 100
      for (let i = 0; i < recipients.length; i += BATCH_SIZE) {
        const batch = recipients.slice(i, i + BATCH_SIZE)

        const batchResults = await Promise.all(
          batch.map(async (r): Promise<BulkResultItem> => {
            const resolved = resolveTemplate(
              template,
              r.params || {},
              language
            )
            if (!resolved) {
              return { to: r.to, success: false, error: 'Template resolution failed' }
            }

            try {
              const emailOptions = {
                from: getFromEmail(),
                to: r.to,
                subject: resolved.subject,
                ...(resolved.html ? { html: resolved.html } : {}),
                ...(resolved.text ? { text: resolved.text } : {}),
              } as Parameters<typeof resend.emails.send>[0]

              const res = await resend.emails.send(emailOptions)

              if (res.error) {
                return { to: r.to, success: false, error: res.error.message }
              }

              return { to: r.to, success: true, id: res.data?.id }
            } catch (err: unknown) {
              const message =
                err instanceof Error ? err.message : 'Send failed'
              return { to: r.to, success: false, error: message }
            }
          })
        )

        results.push(...batchResults)

        // Delay between batches (skip on last)
        if (i + BATCH_SIZE < recipients.length) {
          await new Promise((resolve) => setTimeout(resolve, 1000))
        }
      }

      const sent = results.filter((r) => r.success).length
      const failed = results.filter((r) => !r.success).length

      return NextResponse.json({
        success: true,
        data: { total: recipients.length, sent, failed, results },
      })
    }

    // -----------------------------------------------------------------------
    // SMS bulk
    // -----------------------------------------------------------------------
    if (type === 'sms') {
      if (!smsBody && !template) {
        return NextResponse.json(
          {
            success: false,
            error:
              'Either body or template is required for SMS outreach',
          },
          { status: 400 }
        )
      }

      // Mock mode
      if (!isTwilioConfigured()) {
        const results: BulkResultItem[] = recipients.map((r) => ({
          to: r.to,
          success: true,
          id: `MOCK_SMS_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        }))
        console.log(
          `[MOCK BULK SMS] Count: ${recipients.length}`
        )
        return NextResponse.json({
          success: true,
          data: {
            total: recipients.length,
            sent: recipients.length,
            failed: 0,
            results,
            mock: true,
          },
        })
      }

      const results: BulkResultItem[] = []

      // Rate limit: batches of 10 per second for SMS
      const SMS_BATCH_SIZE = 10
      for (let i = 0; i < recipients.length; i += SMS_BATCH_SIZE) {
        const batch = recipients.slice(i, i + SMS_BATCH_SIZE)

        const batchResults = await Promise.all(
          batch.map(async (r): Promise<BulkResultItem> => {
            // If a template is specified, resolve it for the SMS text content
            let messageBody = smsBody || ''
            if (template) {
              const resolved = resolveTemplate(
                template,
                r.params || {},
                language
              )
              if (resolved) {
                messageBody = resolved.text
              }
            }

            const res = await sendSMS(r.to, messageBody)
            if (!res.success) {
              return { to: r.to, success: false, error: res.error }
            }
            return { to: r.to, success: true, id: res.sid }
          })
        )

        results.push(...batchResults)

        if (i + SMS_BATCH_SIZE < recipients.length) {
          await new Promise((resolve) => setTimeout(resolve, 1000))
        }
      }

      const sent = results.filter((r) => r.success).length
      const failed = results.filter((r) => !r.success).length

      return NextResponse.json({
        success: true,
        data: { total: recipients.length, sent, failed, results },
      })
    }

    return NextResponse.json(
      { success: false, error: 'Invalid type' },
      { status: 400 }
    )
  } catch {
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
