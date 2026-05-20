import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Logo, Button } from '@inkprint/ui'
import { requireSession } from '@/server/auth/require'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await requireSession()
  if (user.onboardingStep !== 'complete') {
    redirect('/onboarding')
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-sand bg-parchment">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/app" aria-label="Inkprint dashboard">
            <Logo className="h-7" />
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-body-sm text-slate hidden sm:inline">{user.email}</span>
            <form action="/api/auth/logout" method="post">
              <Button type="submit" variant="secondary" size="sm">
                Log out
              </Button>
            </form>
          </div>
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  )
}
