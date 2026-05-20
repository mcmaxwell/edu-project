import { NextResponse, type NextRequest } from 'next/server'
import { requireSession } from '@/server/auth/require'
import { testKeyForUser } from '@/server/keys'

export const runtime = 'nodejs'

export async function POST(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const user = await requireSession()
  const { id } = await ctx.params
  const result = await testKeyForUser(user.id, id)
  const url = new URL('/settings/keys', req.nextUrl.origin)
  if (result.ok) {
    url.searchParams.set('tested', '1')
  } else {
    url.searchParams.set('error', result.reason)
  }
  return NextResponse.redirect(url, 303)
}
