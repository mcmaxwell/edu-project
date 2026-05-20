export type ProviderId = 'openai' | 'anthropic' | 'gemini' | 'azure_openai'

export type ValidateResult =
  | { ok: true; models: string[] }
  | { ok: false; reason: string }

export interface LlmProvider {
  readonly id: ProviderId
  readonly label: string
  validateKey(plaintext: string): Promise<ValidateResult>
}
