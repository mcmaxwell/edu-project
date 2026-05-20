import 'server-only'
import { and, desc, eq, isNull } from 'drizzle-orm'
import { getProvider, type ProviderId } from '@inkprint/providers'
import { db, schema } from './db'
import { encrypt, decrypt, fingerprint, lastFour } from './crypto'

export type StoredKeySummary = {
  id: string
  provider: ProviderId
  label: string
  lastFour: string
  lastUsedAt: Date | null
  createdAt: Date
  status: 'active' | 'revoked'
}

export async function listKeysForUser(userId: string): Promise<StoredKeySummary[]> {
  const rows = await db
    .select()
    .from(schema.apiKeys)
    .where(eq(schema.apiKeys.userId, userId))
    .orderBy(desc(schema.apiKeys.createdAt))
  return rows.map((r) => ({
    id: r.id,
    provider: r.provider,
    label: r.label,
    lastFour: r.lastFour,
    lastUsedAt: r.lastUsedAt,
    createdAt: r.createdAt,
    status: r.revokedAt ? 'revoked' : 'active',
  }))
}

export async function addKeyForUser(input: {
  userId: string
  provider: ProviderId
  label: string
  plaintext: string
}): Promise<{ ok: true; id: string } | { ok: false; reason: string }> {
  const provider = getProvider(input.provider)
  const validation = await provider.validateKey(input.plaintext)
  if (!validation.ok) {
    return { ok: false, reason: validation.reason }
  }

  // Duplicate detection: never store the same key twice for one user.
  const hash = fingerprint(input.plaintext)
  const dup = await db
    .select({ id: schema.apiKeys.id })
    .from(schema.apiKeys)
    .where(
      and(
        eq(schema.apiKeys.userId, input.userId),
        eq(schema.apiKeys.keyHash, hash),
        isNull(schema.apiKeys.revokedAt),
      ),
    )
    .limit(1)
  if (dup[0]) {
    return { ok: false, reason: 'You already have this key on file.' }
  }

  const { ciphertext, iv, authTag } = encrypt(input.plaintext)
  const [row] = await db
    .insert(schema.apiKeys)
    .values({
      userId: input.userId,
      provider: input.provider,
      label: input.label,
      ciphertext,
      iv,
      authTag,
      keyHash: hash,
      lastFour: lastFour(input.plaintext),
    })
    .returning({ id: schema.apiKeys.id })

  if (!row) return { ok: false, reason: 'Could not save the key.' }
  return { ok: true, id: row.id }
}

export async function revokeKeyForUser(userId: string, keyId: string): Promise<boolean> {
  const r = await db
    .update(schema.apiKeys)
    .set({ revokedAt: new Date() })
    .where(and(eq(schema.apiKeys.id, keyId), eq(schema.apiKeys.userId, userId)))
    .returning({ id: schema.apiKeys.id })
  return Boolean(r[0])
}

export async function testKeyForUser(
  userId: string,
  keyId: string,
): Promise<{ ok: true; models: string[] } | { ok: false; reason: string }> {
  const rows = await db
    .select()
    .from(schema.apiKeys)
    .where(
      and(
        eq(schema.apiKeys.id, keyId),
        eq(schema.apiKeys.userId, userId),
        isNull(schema.apiKeys.revokedAt),
      ),
    )
    .limit(1)
  const row = rows[0]
  if (!row) return { ok: false, reason: 'Key not found.' }

  const plaintext = decrypt({
    ciphertext: Buffer.from(row.ciphertext),
    iv: Buffer.from(row.iv),
    authTag: Buffer.from(row.authTag),
  })
  const result = await getProvider(row.provider).validateKey(plaintext)
  if (result.ok) {
    await db
      .update(schema.apiKeys)
      .set({ lastUsedAt: new Date() })
      .where(eq(schema.apiKeys.id, keyId))
  }
  return result
}
