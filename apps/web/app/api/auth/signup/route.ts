import { NextResponse, type NextRequest } from 'next/server'
import { eq } from 'drizzle-orm'
import { db, schema } from '@/server/db'
import { hashPassword, checkHIBP } from '@/server/auth/password'
import { createSession, setSessionCookie } from '@/server/auth/session'
import { createVerificationToken } from '@/server/auth/verification'
import { sendVerificationEmail } from '@/server/auth/email'
import { signupSchema } from '@/lib/validation'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  const form = await req.formData()
  const parsed = signupSchema.safeParse({
    email: form.get('email'),
    password: form.get('password'),
  })
  if (!parsed.success) {
    const issue = parsed.error.issues[0]?.message ?? 'Invalid input.'
    return redirectWithError(req, '/signup', issue)
  }

  const { email, password } = parsed.data

  const breaches = await checkHIBP(password)
  if (breaches > 0) {
    return redirectWithError(
      req,
      '/signup',
      'That password appears in known data breaches. Please choose another.',
    )
  }

  const existing = await db
    .select({ id: schema.users.id })
    .from(schema.users)
    .where(eq(schema.users.email, email))
    .limit(1)
  if (existing.length > 0) {
    return redirectWithError(req, '/signup', 'An account with that email already exists.')
  }

  const passwordHash = await hashPassword(password)
  const [user] = await db
    .insert(schema.users)
    .values({ email, passwordHash, role: 'teacher', status: 'pending' })
    .returning({ id: schema.users.id })

  if (!user) {
    return redirectWithError(req, '/signup', 'Could not create account.')
  }

  const verifyToken = await createVerificationToken(user.id)
  const verifyUrl = new URL(`/api/auth/verify?token=${verifyToken}`, req.nextUrl.origin).toString()
  await sendVerificationEmail({ to: email, verifyUrl })

  const { token, expiresAt } = await createSession(user.id)
  await setSessionCookie(token, expiresAt)

  return NextResponse.redirect(new URL('/app', req.nextUrl.origin), 303)
}

function redirectWithError(req: NextRequest, path: string, message: string) {
  const url = new URL(path, req.nextUrl.origin)
  url.searchParams.set('error', message)
  return NextResponse.redirect(url, 303)
}
