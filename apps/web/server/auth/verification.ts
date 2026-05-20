import 'server-only'
import { createHash, randomBytes } from 'node:crypto'
import { and, eq, gt, isNull } from 'drizzle-orm'
import { db, schema } from '../db'

const VERIFY_TTL_HOURS = 24

function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex')
}

export async function createVerificationToken(userId: string): Promise<string> {
  const token = randomBytes(32).toString('base64url')
  const tokenHash = hashToken(token)
  const expiresAt = new Date(Date.now() + VERIFY_TTL_HOURS * 60 * 60 * 1000)
  await db
    .insert(schema.verificationTokens)
    .values({ userId, tokenHash, type: 'email_verification', expiresAt })
  return token
}

export async function consumeVerificationToken(token: string): Promise<string | null> {
  const tokenHash = hashToken(token)
  const now = new Date()
  const rows = await db
    .select()
    .from(schema.verificationTokens)
    .where(
      and(
        eq(schema.verificationTokens.tokenHash, tokenHash),
        eq(schema.verificationTokens.type, 'email_verification'),
        isNull(schema.verificationTokens.consumedAt),
        gt(schema.verificationTokens.expiresAt, now),
      ),
    )
    .limit(1)

  const row = rows[0]
  if (!row) return null

  await db
    .update(schema.verificationTokens)
    .set({ consumedAt: now })
    .where(eq(schema.verificationTokens.id, row.id))

  await db
    .update(schema.users)
    .set({ emailVerifiedAt: now })
    .where(eq(schema.users.id, row.userId))

  return row.userId
}
