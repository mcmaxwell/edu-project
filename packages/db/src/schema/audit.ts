import { pgTable, uuid, text, timestamp, jsonb, inet, index } from 'drizzle-orm/pg-core'
import { users } from './users'

export const auditEvents = pgTable(
  'audit_events',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    actorId: uuid('actor_id').references(() => users.id, { onDelete: 'set null' }),
    action: text('action').notNull(),
    targetType: text('target_type').notNull(),
    targetId: uuid('target_id'),
    before: jsonb('before'),
    after: jsonb('after'),
    ip: inet('ip'),
    userAgent: text('user_agent'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    actorIdx: index('audit_events_actor_idx').on(t.actorId),
    targetIdx: index('audit_events_target_idx').on(t.targetType, t.targetId),
    createdIdx: index('audit_events_created_idx').on(t.createdAt),
  }),
)
