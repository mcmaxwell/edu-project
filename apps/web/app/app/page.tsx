import Link from 'next/link'
import { Button, Card, CardTitle, CardBody, Badge } from '@inkprint/ui'
import { requireSession } from '@/server/auth/require'

export const metadata = { title: 'Dashboard' }

export default async function DashboardPage() {
  const user = await requireSession()
  const verified = Boolean(user.emailVerifiedAt)
  const active = user.status === 'active'

  return (
    <section className="max-w-5xl mx-auto px-6 py-12">
      <p className="text-eyebrow font-sans font-semibold uppercase text-slate mb-3">Dashboard</p>
      <h1 className="text-h1 font-display text-ink mb-4">
        Welcome to Inkprint.
      </h1>
      <p className="text-body-lg text-slate max-w-2xl mb-10">
        You&apos;re signed in as <span className="font-semibold text-ink">{user.email}</span>.
      </p>

      <div className="grid md:grid-cols-3 gap-5 mb-12">
        <Card>
          <CardTitle>Email</CardTitle>
          <CardBody>
            {verified ? (
              <Badge variant="info">Verified</Badge>
            ) : (
              <>
                <Badge variant="flagged" className="mb-3">
                  Unverified
                </Badge>
                <p>Open the link in the verification email we sent to {user.email}.</p>
              </>
            )}
          </CardBody>
        </Card>
        <Card>
          <CardTitle>Account</CardTitle>
          <CardBody>
            <Badge variant={active ? 'info' : 'flagged'}>{user.status}</Badge>
            <p className="mt-3">
              {active
                ? 'Your account is active.'
                : 'An admin will activate your account before you can run analyses.'}
            </p>
          </CardBody>
        </Card>
        <Card>
          <CardTitle>Role</CardTitle>
          <CardBody>
            <Badge>{user.role}</Badge>
          </CardBody>
        </Card>
      </div>

      <div className="rounded-md border border-sand bg-paper p-8">
        <h2 className="text-h3 font-display text-ink mb-3">
          Analyze your first submission.
        </h2>
        <p className="text-body text-slate mb-6 max-w-2xl">
          Once your email is verified and an access grant or API key is on file, you&apos;ll be able
          to drop in a student submission and see the evidence sheet. That flow lands in Step 10.
        </p>
        <Link href="/showcase">
          <Button variant="secondary">Browse the design system</Button>
        </Link>
      </div>
    </section>
  )
}
