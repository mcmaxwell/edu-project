import 'server-only'
import { createHash, randomBytes } from 'node:crypto'
import { cookies } from 'next/headers'
import { eq, lt } from 'drizzle-orm'
import { db, schema } from '../db'

const SESSION_COOKIE = 'inkprint_session'
const SESSION_TTL_DAYS = 14

export type Session = {
  userId: string
  expiresAt: Date
}

export type SessionUser = {
  id: string
  email: string
  role: 'teacher' | 'admin' | 'superadmin' | 'student'
  status: 'pending' | 'active' | 'suspended'
  onboardingStep: 'role' | 'api_key' | 'class' | 'complete'
  emailVerifiedAt: Date | null
}

function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex')
}

export function generateSessionToken(): string {
  return randomBytes(32).toString('base64url')
}

export async function createSession(userId: string): Promise<{ token: string; expiresAt: Date }> {
  const token = generateSessionToken()
  const tokenHash = hashToken(token)
  const expiresAt = new Date(Date.now() + SESSION_TTL_DAYS * 24 * 60 * 60 * 1000)

  await db.insert(schema.sessions).values({ tokenHash, userId, expiresAt })
  return { token, expiresAt }
}

export async function setSessionCookie(token: string, expiresAt: Date) {
  const jar = await cookies()
  jar.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    expires: expiresAt,
  })
}

export async function clearSessionCookie() {
  const jar = await cookies()
  jar.delete(SESSION_COOKIE)
}

export async function getSessionUser(): Promise<SessionUser | null> {
  const jar = await cookies()
  const token = jar.get(SESSION_COOKIE)?.value
  if (!token) return null

  const tokenHash = hashToken(token)
  const rows = await db
    .select({
      userId: schema.sessions.userId,
      expiresAt: schema.sessions.expiresAt,
      email: schema.users.email,
      role: schema.users.role,
      status: schema.users.status,
      onboardingStep: schema.users.onboardingStep,
      emailVerifiedAt: schema.users.emailVerifiedAt,
    })
    .from(schema.sessions)
    .innerJoin(schema.users, eq(schema.users.id, schema.sessions.userId))
    .where(eq(schema.sessions.tokenHash, tokenHash))
    .limit(1)

  const row = rows[0]
  if (!row) return null
  if (row.expiresAt.getTime() < Date.now()) {
    await db.delete(schema.sessions).where(eq(schema.sessions.tokenHash, tokenHash))
    return null
  }

  return {
    id: row.userId,
    email: row.email,
    role: row.role,
    status: row.status,
    onboardingStep: row.onboardingStep,
    emailVerifiedAt: row.emailVerifiedAt,
  }
}

export async function destroySession() {
  const jar = await cookies()
  const token = jar.get(SESSION_COOKIE)?.value
  if (token) {
    await db.delete(schema.sessions).where(eq(schema.sessions.tokenHash, hashToken(token)))
  }
  await clearSessionCookie()
}

export async function purgeExpiredSessions() {
  await db.delete(schema.sessions).where(lt(schema.sessions.expiresAt, new Date()))
}
