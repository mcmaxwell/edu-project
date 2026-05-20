import { pgTable, uuid, text, timestamp, index, uniqueIndex } from 'drizzle-orm/pg-core'
import { userRole, userStatus, plan, dataRegion, onboardingStep } from './enums'

export const institutions = pgTable('institutions', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  plan: plan('plan').notNull().default('free'),
  dataRegion: dataRegion('data_region').notNull().default('us'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})

export const users = pgTable(
  'users',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    email: text('email').notNull(),
    passwordHash: text('password_hash').notNull(),
    role: userRole('role').notNull().default('teacher'),
    status: userStatus('status').notNull().default('pending'),
    institutionId: uuid('institution_id').references(() => institutions.id, {
      onDelete: 'set null',
    }),
    onboardingStep: onboardingStep('onboarding_step').notNull().default('role'),
    onboardingIntent: text('onboarding_intent'),
    emailVerifiedAt: timestamp('email_verified_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    emailUnique: uniqueIndex('users_email_unique').on(t.email),
    institutionIdx: index('users_institution_idx').on(t.institutionId),
  }),
)
