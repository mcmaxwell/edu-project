import { NextResponse, type NextRequest } from 'next/server'
import { requireSession } from '@/server/auth/require'
import { setStep } from '@/server/onboarding'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  const user = await requireSession()
  await setStep(user.id, 'class')
  return NextResponse.redirect(new URL('/onboarding', req.nextUrl.origin), 303)
}
