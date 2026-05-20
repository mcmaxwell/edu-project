import type { LlmProvider, ProviderId } from './types'
import { openai } from './openai'
import { anthropic } from './anthropic'
import { gemini } from './gemini'

export * from './types'
export { openai, anthropic, gemini }

export const providers: Record<Exclude<ProviderId, 'azure_openai'>, LlmProvider> = {
  openai,
  anthropic,
  gemini,
}

export function getProvider(id: ProviderId): LlmProvider {
  if (id === 'azure_openai') {
    throw new Error('Azure OpenAI is not yet supported (institutional plan, Phase 2).')
  }
  return providers[id]
}
