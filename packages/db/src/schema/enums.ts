import { pgEnum } from 'drizzle-orm/pg-core'

export const userRole = pgEnum('user_role', ['teacher', 'admin', 'superadmin', 'student'])
export const userStatus = pgEnum('user_status', ['pending', 'active', 'suspended'])
export const plan = pgEnum('plan', ['free', 'pro', 'institution'])
export const dataRegion = pgEnum('data_region', ['us', 'eu'])
export const provider = pgEnum('provider', ['openai', 'anthropic', 'gemini', 'azure_openai'])
export const grantProvider = pgEnum('grant_provider', ['openai', 'anthropic', 'gemini'])
export const confidence = pgEnum('confidence', ['low', 'medium', 'high', 'inconclusive'])
export const verdict = pgEnum('verdict', [
  'aligned',
  'partial_concern',
  'high_concern',
  'inconclusive',
])
