import { pgTable, uuid, integer, timestamp, index } from 'drizzle-orm/pg-core'
import { grantProvider } from './enums'
import { users } from './users'

export const accessGrants = pgTable(
  'access_grants',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    provider: grantProvider('provider').notNull(),
    monthlyTokenLimit: integer('monthly_token_limit').notNull().default(100_000),
    tokensUsedThisMonth: integer('tokens_used_this_month').notNull().default(0),
    grantedBy: uuid('granted_by')
      .notNull()
      .references(() => users.id, { onDelete: 'restrict' }),
    grantedAt: timestamp('granted_at', { withTimezone: true }).notNull().defaultNow(),
    expiresAt: timestamp('expires_at', { withTimezone: true }),
    revokedAt: timestamp('revoked_at', { withTimezone: true }),
  },
  (t) => ({
    userIdx: index('access_grants_user_idx').on(t.userId),
  }),
)
