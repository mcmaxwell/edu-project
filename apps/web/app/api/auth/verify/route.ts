import { NextResponse, type NextRequest } from 'next/server'
import { eq } from 'drizzle-orm'
import { db, schema } from '@/server/db'
import { consumeVerificationToken } from '@/server/auth/verification'

export const runtime = 'nodejs'

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token')
  if (!token) {
    return NextResponse.redirect(new URL('/verify?status=missing', req.nextUrl.origin), 303)
  }
  const userId = await consumeVerificationToken(token)
  if (!userId) {
    return NextResponse.redirect(new URL('/verify?status=invalid', req.nextUrl.origin), 303)
  }
  // Activate the user once email is verified.
  await db
    .update(schema.users)
    .set({ status: 'active' })
    .where(eq(schema.users.id, userId))

  return NextResponse.redirect(new URL('/verify?status=ok', req.nextUrl.origin), 303)
}
