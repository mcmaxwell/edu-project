import postgres from 'postgres'
import { drizzle } from 'drizzle-orm/postgres-js'
import * as schema from './schema'

let cached: ReturnType<typeof drizzle> | null = null

export function getDb(url?: string) {
  if (cached) return cached
  const connectionString = url ?? process.env.DATABASE_URL
  if (!connectionString) {
    throw new Error('DATABASE_URL is not set')
  }
  const sql = postgres(connectionString, { prepare: false })
  cached = drizzle(sql, { schema })
  return cached
}

export { schema }
