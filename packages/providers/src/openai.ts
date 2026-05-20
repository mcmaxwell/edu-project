import type { LlmProvider, ValidateResult } from './types'

export const openai: LlmProvider = {
  id: 'openai',
  label: 'OpenAI',
  async validateKey(plaintext: string): Promise<ValidateResult> {
    try {
      const res = await fetch('https://api.openai.com/v1/models', {
        headers: { Authorization: `Bearer ${plaintext}` },
        signal: AbortSignal.timeout(8000),
      })
      if (!res.ok) {
        return { ok: false, reason: `OpenAI rejected the key (HTTP ${res.status}).` }
      }
      const body = (await res.json()) as { data?: { id: string }[] }
      const models = (body.data ?? []).map((m) => m.id).slice(0, 20)
      return { ok: true, models }
    } catch (e) {
      return { ok: false, reason: `Could not reach OpenAI: ${(e as Error).message}` }
    }
  },
}
