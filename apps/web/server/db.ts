import 'server-only'
import postgres from 'postgres'
import { drizzle } from 'drizzle-orm/postgres-js'
import { sql as drizzleSql } from 'drizzle-orm'
import * as schema from '@inkprint/db'

const appUrl = process.env.APP_DATABASE_URL
if (!appUrl) throw new Error('APP_DATABASE_URL is not set')

const sql = postgres(appUrl, { prepare: false })
export const db = drizzle(sql, { schema })
export { schema, sql }

/**
 * Run a transaction with `app.user_id` scoped to the given user. RLS policies
 * derive ownership from this setting, so every write to teacher-scoped tables
 * (classes, students, submissions, …) must go through here.
 */
export async function withUserScope<T>(
  userId: string,
  fn: (tx: Parameters<Parameters<typeof db.transaction>[0]>[0]) => Promise<T>,
): Promise<T> {
  return db.transaction(async (tx) => {
    await tx.execute(drizzleSql`select set_config('app.user_id', ${userId}, true)`)
    return fn(tx)
  })
}
