import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import postgres from 'postgres'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')

async function main() {
  const url = process.env.DATABASE_URL
  if (!url) throw new Error('DATABASE_URL is not set')

  const sql = postgres(url, { max: 1 })
  const rls = readFileSync(resolve(root, 'sql/rls.sql'), 'utf8')
  await sql.unsafe(rls)
  await sql.end()
  // eslint-disable-next-line no-console
  console.log('[apply-rls] policies applied')
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err)
  process.exit(1)
})
