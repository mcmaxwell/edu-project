import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button, Input, Card } from '@inkprint/ui'
import { requireSession } from '@/server/auth/require'

export const metadata = { title: 'Welcome' }

const STEPS = ['role', 'api_key', 'class'] as const

function StepIndicator({ current }: { current: (typeof STEPS)[number] | 'complete' }) {
  return (
    <ol className="flex items-center gap-2 mb-10">
      {STEPS.map((s, i) => {
        const active = s === current
        const done = STEPS.indexOf(current as (typeof STEPS)[number]) > i || current === 'complete'
        return (
          <li
            key={s}
            className={`h-1.5 flex-1 rounded-full ${
              active ? 'bg-ink' : done ? 'bg-ink-300' : 'bg-sand'
            }`}
          />
        )
      })}
    </ol>
  )
}

export default async function OnboardingPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const user = await requireSession()
  if (user.onboardingStep === 'complete') {
    redirect('/app')
  }
  const { error } = await searchParams

  return (
    <main className="max-w-xl mx-auto px-6 py-16">
      <p className="text-eyebrow font-sans font-semibold uppercase text-slate mb-3">
        Welcome to Inkprint
      </p>
      <StepIndicator current={user.onboardingStep} />

      {error ? (
        <p className="mb-6 rounded-sm border border-coral bg-coral-200/40 px-4 py-3 text-body-sm text-ink">
          {error}
        </p>
      ) : null}

      {user.onboardingStep === 'role' ? <RoleStep /> : null}
      {user.onboardingStep === 'api_key' ? <KeyStep /> : null}
      {user.onboardingStep === 'class' ? <ClassStep /> : null}
    </main>
  )
}

function RoleStep() {
  return (
    <>
      <h1 className="text-h2 font-display text-ink mb-3">What brings you here?</h1>
      <p className="text-body text-slate mb-8">
        We&apos;ll tailor the rest of setup to your context. You can change this later.
      </p>
      <form action="/api/onboarding/role" method="post" className="space-y-3">
        <button
          type="submit"
          name="intent"
          value="teacher"
          className="w-full text-left p-5 rounded-md border border-sand bg-paper hover:border-ink transition-colors"
        >
          <p className="text-h4 font-sans font-semibold text-ink mb-1">I&apos;m a teacher</p>
          <p className="text-body-sm text-slate">
            I want to evaluate student work for my own classes.
          </p>
        </button>
        <button
          type="submit"
          name="intent"
          value="institution"
          className="w-full text-left p-5 rounded-md border border-sand bg-paper hover:border-ink transition-colors"
        >
          <p className="text-h4 font-sans font-semibold text-ink mb-1">
            I&apos;m evaluating for an institution
          </p>
          <p className="text-body-sm text-slate">
            I&apos;m piloting Inkprint for a school, district, or department.
          </p>
        </button>
      </form>
    </>
  )
}

function KeyStep() {
  return (
    <>
      <h1 className="text-h2 font-display text-ink mb-3">
        Bring your own LLM key — or skip for now.
      </h1>
      <p className="text-body text-slate mb-6">
        Inkprint runs analyses through OpenAI, Anthropic, or Gemini. You can plug in your own API
        key (recommended for unlimited use), or skip and request pooled-key access from an admin.
      </p>
      <Card className="mb-6">
        <p className="text-body-sm text-slate">
          The full add-key flow lands with the BYOK release (Step 9). For now, choose <em>skip</em>{' '}
          and we&apos;ll get you to the dashboard.
        </p>
      </Card>
      <div className="flex items-center gap-3">
        <form action="/api/onboarding/skip-key" method="post">
          <Button type="submit" size="lg">
            Skip for now
          </Button>
        </form>
        <Link href="/settings/keys">
          <Button variant="secondary" size="lg" disabled>
            Add a key (Step 9)
          </Button>
        </Link>
      </div>
    </>
  )
}

function ClassStep() {
  return (
    <>
      <h1 className="text-h2 font-display text-ink mb-3">Create your first class.</h1>
      <p className="text-body text-slate mb-8">
        A class is a roster of students whose work you&apos;ll analyze. You can rename or add more
        anytime.
      </p>
      <form action="/api/onboarding/class" method="post" className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-body-sm font-semibold text-ink mb-1.5">
            Class name
          </label>
          <Input
            id="name"
            name="name"
            required
            maxLength={120}
            placeholder="e.g. AP English 11 · Period 3"
            autoFocus
          />
        </div>
        <Button type="submit" size="lg" className="w-full">
          Create class & finish
        </Button>
      </form>
    </>
  )
}
