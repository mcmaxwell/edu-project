import { Button, Input, Badge, Card } from '@inkprint/ui'
import { requireSession } from '@/server/auth/require'
import { listKeysForUser } from '@/server/keys'

export const metadata = { title: 'API keys' }

const PROVIDERS = [
  { value: 'openai', label: 'OpenAI' },
  { value: 'anthropic', label: 'Anthropic' },
  { value: 'gemini', label: 'Google Gemini' },
] as const

export default async function KeysPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; added?: string; tested?: string }>
}) {
  const user = await requireSession()
  const { error, added, tested } = await searchParams
  const keys = await listKeysForUser(user.id)

  return (
    <section className="max-w-3xl mx-auto px-6 py-12">
      <p className="text-eyebrow font-sans font-semibold uppercase text-slate mb-3">Settings</p>
      <h1 className="text-h1 font-display text-ink mb-3">API keys</h1>
      <p className="text-body-lg text-slate mb-10 max-w-2xl">
        Bring your own LLM key for unlimited analyses, or request pooled-key access from an admin.
        Inkprint encrypts your key with AES-256-GCM and never returns the plaintext.
      </p>

      {error ? (
        <p className="mb-6 rounded-sm border border-coral bg-coral-200/40 px-4 py-3 text-body-sm text-ink">
          {error}
        </p>
      ) : null}
      {added ? (
        <p className="mb-6 rounded-sm border border-moss bg-sand px-4 py-3 text-body-sm text-ink">
          Key added and validated against the provider.
        </p>
      ) : null}
      {tested ? (
        <p className="mb-6 rounded-sm border border-moss bg-sand px-4 py-3 text-body-sm text-ink">
          Key re-validated successfully.
        </p>
      ) : null}

      <h2 className="text-h3 font-display text-ink mb-4">Your keys</h2>
      {keys.length === 0 ? (
        <Card className="mb-10">
          <p className="text-body text-slate">No API keys on file yet.</p>
        </Card>
      ) : (
        <div className="rounded-md border border-sand bg-paper mb-10 divide-y divide-sand">
          {keys.map((k) => (
            <div key={k.id} className="px-5 py-4 flex items-center gap-4">
              <div className="flex-1 min-w-0">
                <p className="text-body font-semibold text-ink truncate">{k.label}</p>
                <p className="text-body-sm text-slate font-mono">
                  {k.provider} · {k.lastFour} · {k.lastUsedAt ? formatRelative(k.lastUsedAt) : 'never used'}
                </p>
              </div>
              <Badge variant={k.status === 'active' ? 'info' : 'neutral'}>{k.status}</Badge>
              {k.status === 'active' ? (
                <>
                  <form action={`/api/keys/${k.id}/test`} method="post">
                    <Button type="submit" variant="secondary" size="sm">
                      Test
                    </Button>
                  </form>
                  <form action={`/api/keys/${k.id}`} method="post">
                    <Button type="submit" variant="tertiary" size="sm">
                      Revoke
                    </Button>
                  </form>
                </>
              ) : null}
            </div>
          ))}
        </div>
      )}

      <h2 className="text-h3 font-display text-ink mb-4">Add a key</h2>
      <form action="/api/keys" method="post" className="rounded-md border border-sand bg-paper p-6 space-y-4">
        <div>
          <label className="block text-body-sm font-semibold text-ink mb-2">Provider</label>
          <div className="flex flex-wrap gap-3">
            {PROVIDERS.map((p, i) => (
              <label
                key={p.value}
                className="flex items-center gap-2 px-3 py-2 rounded-sm border border-sand cursor-pointer has-[:checked]:border-ink has-[:checked]:bg-sand"
              >
                <input
                  type="radio"
                  name="provider"
                  value={p.value}
                  defaultChecked={i === 0}
                  className="accent-ink"
                />
                <span className="text-body-sm text-ink">{p.label}</span>
              </label>
            ))}
          </div>
        </div>
        <div>
          <label htmlFor="label" className="block text-body-sm font-semibold text-ink mb-1.5">
            Label
          </label>
          <Input id="label" name="label" required maxLength={80} placeholder="My personal OpenAI" />
        </div>
        <div>
          <label htmlFor="plaintext" className="block text-body-sm font-semibold text-ink mb-1.5">
            API key
          </label>
          <Input
            id="plaintext"
            name="plaintext"
            type="password"
            required
            autoComplete="off"
            placeholder="sk-..."
          />
          <p className="mt-1.5 text-body-sm text-slate">
            Validated against the provider before we save it. Never returned in plaintext after this.
          </p>
        </div>
        <div className="pt-2">
          <Button type="submit" size="lg">
            Validate & save
          </Button>
        </div>
      </form>
    </section>
  )
}

function formatRelative(d: Date): string {
  const diff = Date.now() - d.getTime()
  const mins = Math.round(diff / 60_000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins} min ago`
  const hours = Math.round(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.round(hours / 24)
  return `${days}d ago`
}
