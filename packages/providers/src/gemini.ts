import type { LlmProvider, ValidateResult } from './types'

export const gemini: LlmProvider = {
  id: 'gemini',
  label: 'Google Gemini',
  async validateKey(plaintext: string): Promise<ValidateResult> {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${encodeURIComponent(
        plaintext,
      )}`
      const res = await fetch(url, { signal: AbortSignal.timeout(8000) })
      if (!res.ok) {
        return { ok: false, reason: `Google rejected the key (HTTP ${res.status}).` }
      }
      const body = (await res.json()) as { models?: { name: string }[] }
      const models = (body.models ?? []).map((m) => m.name.replace(/^models\//, '')).slice(0, 20)
      return { ok: true, models }
    } catch (e) {
      return { ok: false, reason: `Could not reach Google: ${(e as Error).message}` }
    }
  },
}
