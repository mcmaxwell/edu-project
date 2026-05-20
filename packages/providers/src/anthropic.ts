import type { LlmProvider, ValidateResult } from './types'

export const anthropic: LlmProvider = {
  id: 'anthropic',
  label: 'Anthropic',
  async validateKey(plaintext: string): Promise<ValidateResult> {
    try {
      const res = await fetch('https://api.anthropic.com/v1/models', {
        headers: {
          'x-api-key': plaintext,
          'anthropic-version': '2023-06-01',
        },
        signal: AbortSignal.timeout(8000),
      })
      if (!res.ok) {
        return { ok: false, reason: `Anthropic rejected the key (HTTP ${res.status}).` }
      }
      const body = (await res.json()) as { data?: { id: string }[] }
      const models = (body.data ?? []).map((m) => m.id).slice(0, 20)
      return { ok: true, models }
    } catch (e) {
      return { ok: false, reason: `Could not reach Anthropic: ${(e as Error).message}` }
    }
  },
}
