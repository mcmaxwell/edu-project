import { defineConfig } from 'drizzle-kit'

const url = process.env.DATABASE_URL
if (!url) {
  // eslint-disable-next-line no-console
  console.warn('[drizzle] DATABASE_URL not set — generate works, push/migrate will fail.')
}

export default defineConfig({
  schema: './src/schema/index.ts',
  out: './migrations',
  dialect: 'postgresql',
  dbCredentials: { url: url ?? 'postgres://placeholder' },
  strict: true,
  verbose: true,
})
