import 'server-only'
import postgres from 'postgres'
import { drizzle } from 'drizzle-orm/postgres-js'
import { sql as drizzleSql } from 'drizzle-orm'
import * as schema from '@inkprint/db'

type Sql = ReturnType<typeof postgres>
type Db = ReturnType<typeof drizzle<typeof schema>>

let cachedSql: Sql | null = null
let cachedDb: Db | null = null

function init() {
  if (cachedDb && cachedSql) return { sql: cachedSql, db: cachedDb }
  const url = process.env.APP_DATABASE_URL
  if (!url) throw new Error('APP_DATABASE_URL is not set')
  cachedSql = postgres(url, { prepare: false })
  cachedDb = drizzle(cachedSql, { schema })
  return { sql: cachedSql, db: cachedDb }
}

// Lazy proxies so module load doesn't require env vars (e.g., during build).
export const db = new Proxy({} as Db, {
  get(_t, prop) {
    return Reflect.get(init().db, prop)
  },
}) as Db

export const sql = new Proxy({} as Sql, {
  get(_t, prop) {
    return Reflect.get(init().sql, prop)
  },
  apply(_t, thisArg, args) {
    return Reflect.apply(init().sql as unknown as (...a: unknown[]) => unknown, thisArg, args)
  },
}) as Sql

export { schema }

/**
 * Run a transaction with `app.user_id` scoped to the given user. RLS policies
 * derive ownership from this setting, so every write to teacher-scoped tables
 * (classes, students, submissions, …) must go through here.
 */
export async function withUserScope<T>(
  userId: string,
  fn: (tx: Parameters<Parameters<Db['transaction']>[0]>[0]) => Promise<T>,
): Promise<T> {
  return db.transaction(async (tx) => {
    await tx.execute(drizzleSql`select set_config('app.user_id', ${userId}, true)`)
    return fn(tx)
  })
}
