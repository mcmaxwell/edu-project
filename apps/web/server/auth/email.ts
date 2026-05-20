import 'server-only'
import { Resend } from 'resend'

const FROM = 'Inkprint <no-reply@inkprint.com>'

function getClient(): Resend | null {
  const key = process.env.RESEND_API_KEY
  if (!key) return null
  return new Resend(key)
}

export async function sendVerificationEmail(opts: {
  to: string
  verifyUrl: string
}): Promise<void> {
  // In non-production, always log the URL — Resend won't deliver to .invalid addresses
  // and we want the link visible for local testing.
  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line no-console
    console.log(`[email:DEV] verify ${opts.to} → ${opts.verifyUrl}`)
  }
  const r = getClient()
  if (!r) return
  await r.emails.send({
    from: FROM,
    to: opts.to,
    subject: 'Verify your Inkprint email',
    text: [
      'Welcome to Inkprint.',
      '',
      'Confirm your email by visiting:',
      opts.verifyUrl,
      '',
      'This link expires in 24 hours.',
      'If you did not sign up, ignore this message.',
    ].join('\n'),
  })
}
