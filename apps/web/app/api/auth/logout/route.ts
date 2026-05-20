import { NextResponse, type NextRequest } from 'next/server'
import { destroySession } from '@/server/auth/session'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  await destroySession()
  return NextResponse.redirect(new URL('/', req.nextUrl.origin), 303)
}
