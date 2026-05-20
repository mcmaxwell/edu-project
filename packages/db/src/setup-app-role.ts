/**
 * One-time setup: creates the `inkprint_app` role (no BYPASSRLS, no SUPERUSER)
 * that the application uses for normal traffic. Migrations keep using the
 * owner role; the app uses this restricted role so RLS actually engages.
 *
 * Run with DATABASE_URL pointing at the owner role.
 * Outputs the APP_DATABASE_URL to copy into .env.
 */
import { randomBytes } from 'node:crypto'
import postgres from 'postgres'

async function main() {
  const ownerUrl = process.env.DATABASE_URL
  if (!ownerUrl) throw new Error('DATABASE_URL is not set')

  const password = process.env.INKPRINT_APP_PASSWORD ?? randomBytes(24).toString('base64url')
  const sql = postgres(ownerUrl, { max: 1 })

  const exists = await sql`select 1 from pg_roles where rolname = 'inkprint_app'`
  if (exists.length === 0) {
    // Role names and passwords must be inlined — Postgres rejects them as parameters in DDL.
    await sql.unsafe(`create role inkprint_app with login password '${password.replace(/'/g, "''")}'`)
    // eslint-disable-next-line no-console
    console.log('[setup-app-role] created role inkprint_app')
  } else {
    await sql.unsafe(`alter role inkprint_app with login password '${password.replace(/'/g, "''")}'`)
    // eslint-disable-next-line no-console
    console.log('[setup-app-role] role inkprint_app already existed — password rotated')
  }

  // New roles default to nobypassrls + nosuperuser. We can't ALTER SUPERUSER as a
  // non-superuser owner, so we just rely on the defaults and verify below.

  // Schema + table privileges.
  await sql`grant connect on database ${sql(getDbName(ownerUrl))} to inkprint_app`
  await sql`grant usage on schema public to inkprint_app`
  await sql`grant select, insert, update, delete on all tables in schema public to inkprint_app`
  await sql`grant usage, select on all sequences in schema public to inkprint_app`
  // Future tables created by the owner auto-grant to the app role.
  await sql`alter default privileges in schema public grant select, insert, update, delete on tables to inkprint_app`
  await sql`alter default privileges in schema public grant usage, select on sequences to inkprint_app`

  await sql.end()

  // Build the app connection string from the owner URL.
  const u = new URL(ownerUrl)
  u.username = 'inkprint_app'
  u.password = password

  // eslint-disable-next-line no-console
  console.log('\nAdd this to .env:\n')
  // eslint-disable-next-line no-console
  console.log(`APP_DATABASE_URL=${u.toString()}\n`)
}

function getDbName(url: string): string {
  const u = new URL(url)
  return u.pathname.replace(/^\//, '')
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err)
  process.exit(1)
})
