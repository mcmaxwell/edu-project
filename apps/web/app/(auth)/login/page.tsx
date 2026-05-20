import Link from 'next/link'
import { Button, Input } from '@inkprint/ui'

export const metadata = { title: 'Log in' }

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; next?: string }>
}) {
  const { error } = await searchParams

  return (
    <div className="w-full max-w-md">
      <h1 className="text-h2 font-display text-ink mb-3">Welcome back.</h1>
      <p className="text-body text-slate mb-8">Log in to continue with your work.</p>

      {error ? (
        <p className="mb-6 rounded-sm border border-coral bg-coral-200/40 px-4 py-3 text-body-sm text-ink">
          {error}
        </p>
      ) : null}

      <form action="/api/auth/login" method="post" className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-body-sm font-semibold text-ink mb-1.5">
            Email
          </label>
          <Input id="email" name="email" type="email" required autoComplete="email" />
        </div>
        <div>
          <label htmlFor="password" className="block text-body-sm font-semibold text-ink mb-1.5">
            Password
          </label>
          <Input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
          />
        </div>
        <Button type="submit" className="w-full" size="lg">
          Log in
        </Button>
      </form>

      <p className="mt-8 text-body-sm text-slate">
        No account yet?{' '}
        <Link href="/signup" className="text-ink font-semibold hover:underline">
          Create one
        </Link>
        .
      </p>
    </div>
  )
}
