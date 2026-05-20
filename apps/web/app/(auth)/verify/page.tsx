import Link from 'next/link'
import { Button } from '@inkprint/ui'

export const metadata = { title: 'Email verification' }

const COPY: Record<string, { title: string; body: string; cta: { href: string; label: string } }> =
  {
    ok: {
      title: 'Email verified.',
      body: 'Your account is active. Welcome to Inkprint.',
      cta: { href: '/app', label: 'Open dashboard' },
    },
    invalid: {
      title: 'This link is no longer valid.',
      body: 'The verification link may have expired or already been used. Sign in and request a new one.',
      cta: { href: '/login', label: 'Go to log in' },
    },
    missing: {
      title: 'No verification token.',
      body: 'Open the link from your verification email.',
      cta: { href: '/', label: 'Back to home' },
    },
  }

export default async function VerifyPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>
}) {
  const { status } = await searchParams
  const c = COPY[status ?? 'missing'] ?? COPY.missing!

  return (
    <div className="w-full max-w-md text-center">
      <h1 className="text-h2 font-display text-ink mb-3">{c.title}</h1>
      <p className="text-body text-slate mb-8">{c.body}</p>
      <Link href={c.cta.href}>
        <Button size="lg">{c.cta.label}</Button>
      </Link>
    </div>
  )
}
