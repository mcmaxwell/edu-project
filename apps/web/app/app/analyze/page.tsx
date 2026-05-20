import Link from 'next/link'
import { Button, Input, Textarea, Card } from '@inkprint/ui'
import { requireSession } from '@/server/auth/require'
import { getUsableKey } from '@/server/keys'

export const metadata = { title: 'Analyze a submission' }

export default async function AnalyzePage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const user = await requireSession()
  const { error } = await searchParams
  const key = await getUsableKey(user.id, 'openai')

  return (
    <section className="max-w-3xl mx-auto px-6 py-12">
      <p className="text-eyebrow font-sans font-semibold uppercase text-slate mb-3">
        Analyze a submission
      </p>
      <h1 className="text-h1 font-display text-ink mb-3">
        Paste a draft — see the evidence.
      </h1>
      <p className="text-body-lg text-slate mb-8 max-w-2xl">
        Inkprint flags passages that warrant a closer look, with indicators and a confidence per
        passage. No verdicts — you make the call.
      </p>

      {!key ? (
        <Card className="mb-8 border-coral">
          <p className="text-body font-semibold text-ink mb-2">No OpenAI key on file</p>
          <p className="text-body text-slate mb-4">
            Inkprint runs analyses with your own API key. Add one in Settings to continue.
          </p>
          <Link href="/settings/keys">
            <Button>Add an API key</Button>
          </Link>
        </Card>
      ) : null}

      {error ? (
        <p className="mb-6 rounded-sm border border-coral bg-coral-200/40 px-4 py-3 text-body-sm text-ink">
          {error}
        </p>
      ) : null}

      <form
        action="/api/analyze"
        method="post"
        encType="multipart/form-data"
        className="rounded-md border border-sand bg-paper p-6 space-y-5"
      >
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="title" className="block text-body-sm font-semibold text-ink mb-1.5">
              Assignment title <span className="text-slate font-normal">(optional)</span>
            </label>
            <Input
              id="title"
              name="title"
              maxLength={200}
              placeholder="e.g. Gatsby — Chapter 3 response"
            />
          </div>
          <div>
            <label
              htmlFor="studentName"
              className="block text-body-sm font-semibold text-ink mb-1.5"
            >
              Student name <span className="text-slate font-normal">(optional)</span>
            </label>
            <Input
              id="studentName"
              name="studentName"
              maxLength={120}
              placeholder="Anonymous student"
            />
          </div>
        </div>

        <div>
          <label htmlFor="text" className="block text-body-sm font-semibold text-ink mb-1.5">
            Submission text
          </label>
          <Textarea
            id="text"
            name="text"
            rows={14}
            placeholder="Paste the student&rsquo;s submission here…"
            className="min-h-72"
          />
          <p className="mt-1.5 text-body-sm text-slate">20–12,000 characters.</p>
        </div>

        <div>
          <label htmlFor="file" className="block text-body-sm font-semibold text-ink mb-1.5">
            …or upload a file <span className="text-slate font-normal">(.txt, .md, up to 1 MB)</span>
          </label>
          <input
            id="file"
            name="file"
            type="file"
            accept=".txt,.md,text/plain,text/markdown"
            className="block text-body-sm text-slate file:mr-3 file:rounded-sm file:border file:border-ink file:bg-transparent file:px-4 file:py-2 file:text-body-sm file:font-semibold file:text-ink hover:file:bg-paper"
          />
          <p className="mt-1.5 text-body-sm text-slate">
            .docx and .pdf support lands next.
          </p>
        </div>

        <div className="pt-2 flex items-center gap-3">
          <Button type="submit" size="lg" disabled={!key}>
            Run analysis
          </Button>
          <Link href="/app">
            <Button variant="tertiary" size="lg">
              Back to dashboard
            </Button>
          </Link>
        </div>
      </form>

      <p className="mt-6 text-body-sm text-slate">
        Analysis takes 10–30 seconds. We never train on your submissions.
      </p>
    </section>
  )
}
