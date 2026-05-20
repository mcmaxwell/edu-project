import { NextResponse, type NextRequest } from 'next/server'
import { requireSession } from '@/server/auth/require'
import { revokeKeyForUser } from '@/server/keys'

export const runtime = 'nodejs'

export async function DELETE(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const user = await requireSession()
  const { id } = await ctx.params
  const ok = await revokeKeyForUser(user.id, id)
  return NextResponse.json({ ok })
}

// Form-friendly: POST → revoke + redirect (lets us use a no-JS form button).
export async function POST(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const user = await requireSession()
  const { id } = await ctx.params
  await revokeKeyForUser(user.id, id)
  return NextResponse.redirect(new URL('/settings/keys', req.nextUrl.origin), 303)
}
