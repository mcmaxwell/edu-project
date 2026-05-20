import { NextResponse, type NextRequest } from 'next/server'
import { eq } from 'drizzle-orm'
import { db, schema } from '@/server/db'
import { verifyPassword } from '@/server/auth/password'
import { createSession, setSessionCookie } from '@/server/auth/session'
import { loginSchema } from '@/lib/validation'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  const form = await req.formData()
  const parsed = loginSchema.safeParse({
    email: form.get('email'),
    password: form.get('password'),
  })
  if (!parsed.success) {
    return redirectWithError(req, '/login', 'Invalid email or password.')
  }
  const { email, password } = parsed.data

  const rows = await db
    .select({
      id: schema.users.id,
      passwordHash: schema.users.passwordHash,
      status: schema.users.status,
    })
    .from(schema.users)
    .where(eq(schema.users.email, email))
    .limit(1)

  const user = rows[0]
  if (!user) {
    return redirectWithError(req, '/login', 'Invalid email or password.')
  }
  if (user.status === 'suspended') {
    return redirectWithError(req, '/login', 'This account is suspended.')
  }

  const ok = await verifyPassword(user.passwordHash, password)
  if (!ok) {
    return redirectWithError(req, '/login', 'Invalid email or password.')
  }

  const { token, expiresAt } = await createSession(user.id)
  await setSessionCookie(token, expiresAt)

  return NextResponse.redirect(new URL('/app', req.nextUrl.origin), 303)
}

function redirectWithError(req: NextRequest, path: string, message: string) {
  const url = new URL(path, req.nextUrl.origin)
  url.searchParams.set('error', message)
  return NextResponse.redirect(url, 303)
}
