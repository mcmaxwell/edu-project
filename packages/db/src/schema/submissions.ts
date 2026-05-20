import {
  pgTable,
  uuid,
  text,
  timestamp,
  integer,
  jsonb,
  numeric,
  index,
} from 'drizzle-orm/pg-core'
import { confidence, verdict } from './enums'
import { students } from './classes'
import { apiKeys } from './api-keys'

export const submissions = pgTable(
  'submissions',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    studentId: uuid('student_id')
      .notNull()
      .references(() => students.id, { onDelete: 'cascade' }),
    title: text('title').notNull(),
    finalText: text('final_text').notNull(),
    language: text('language').notNull().default('en'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    studentIdx: index('submissions_student_idx').on(t.studentId),
    createdIdx: index('submissions_created_idx').on(t.createdAt),
  }),
)

export const processTraces = pgTable(
  'process_traces',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    submissionId: uuid('submission_id')
      .notNull()
      .references(() => submissions.id, { onDelete: 'cascade' }),
    durationMs: integer('duration_ms').notNull(),
    eventCount: integer('event_count').notNull(),
    pasteEventCount: integer('paste_event_count').notNull().default(0),
    largestPasteChars: integer('largest_paste_chars').notNull().default(0),
    eventsBlobUrl: text('events_blob_url'),
    summaryJson: jsonb('summary_json').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    submissionIdx: index('process_traces_submission_idx').on(t.submissionId),
  }),
)

export const analyses = pgTable(
  'analyses',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    submissionId: uuid('submission_id')
      .notNull()
      .references(() => submissions.id, { onDelete: 'cascade' }),
    apiKeyId: uuid('api_key_id').references(() => apiKeys.id, { onDelete: 'set null' }),
    promptVersion: text('prompt_version').notNull(),
    score: numeric('score', { precision: 5, scale: 2 }),
    confidence: confidence('confidence').notNull(),
    verdict: verdict('verdict').notNull(),
    evidenceJson: jsonb('evidence_json').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    submissionIdx: index('analyses_submission_idx').on(t.submissionId),
  }),
)
