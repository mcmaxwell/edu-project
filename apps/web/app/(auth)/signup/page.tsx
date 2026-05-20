import Link from 'next/link'
import { Button, Input } from '@inkprint/ui'

export const metadata = { title: 'Create your account' }

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const { error } = await searchParams

  return (
    <div className="w-full max-w-md">
      <h1 className="text-h2 font-display text-ink mb-3">Create your account.</h1>
      <p className="text-body text-slate mb-8">
        Free pilot. No credit card. You can bring your own API key or use the pooled tier once an
        admin grants access.
      </p>

      {error ? (
        <p className="mb-6 rounded-sm border border-coral bg-coral-200/40 px-4 py-3 text-body-sm text-ink">
          {error}
        </p>
      ) : null}

      <form action="/api/auth/signup" method="post" className="space-y-4">
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
            minLength={12}
            autoComplete="new-password"
          />
          <p className="mt-1.5 text-body-sm text-slate">At least 12 characters.</p>
        </div>
        <Button type="submit" className="w-full" size="lg">
          Create account
        </Button>
      </form>

      <p className="mt-8 text-body-sm text-slate">
        Already have an account?{' '}
        <Link href="/login" className="text-ink font-semibold hover:underline">
          Log in
        </Link>
        .
      </p>
    </div>
  )
}
