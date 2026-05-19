import { Resend } from 'resend'

let resendClient: Resend | null = null

export function getResendClient(): Resend | null {
  if (!process.env.RESEND_API_KEY) return null
  if (!resendClient) {
    resendClient = new Resend(process.env.RESEND_API_KEY)
  }
  return resendClient
}

export function isResendConfigured(): boolean {
  return !!process.env.RESEND_API_KEY
}

export function getFromEmail(): string {
  return process.env.RESEND_FROM_EMAIL || 'atlas@atlasrealty.com'
}
