import { NextResponse, type NextRequest } from 'next/server'
import { z } from 'zod'
import { requireSession } from '@/server/auth/require'
import { setIntent } from '@/server/onboarding'

export const runtime = 'nodejs'

const schema = z.object({ intent: z.enum(['teacher', 'institution']) })

export async function POST(req: NextRequest) {
  const user = await requireSession()
  const form = await req.formData()
  const parsed = schema.safeParse({ intent: form.get('intent') })
  if (!parsed.success) {
    return NextResponse.redirect(new URL('/onboarding', req.nextUrl.origin), 303)
  }
  await setIntent(user.id, parsed.data.intent)
  return NextResponse.redirect(new URL('/onboarding', req.nextUrl.origin), 303)
}
