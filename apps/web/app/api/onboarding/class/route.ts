import { NextResponse, type NextRequest } from 'next/server'
import { z } from 'zod'
import { requireSession } from '@/server/auth/require'
import { createFirstClass } from '@/server/onboarding'

export const runtime = 'nodejs'

const schema = z.object({ name: z.string().trim().min(1).max(120) })

export async function POST(req: NextRequest) {
  const user = await requireSession()
  const form = await req.formData()
  const parsed = schema.safeParse({ name: form.get('name') })
  if (!parsed.success) {
    const url = new URL('/onboarding', req.nextUrl.origin)
    url.searchParams.set('error', 'Please enter a class name (1–120 characters).')
    return NextResponse.redirect(url, 303)
  }
  await createFirstClass(user.id, parsed.data.name)
  return NextResponse.redirect(new URL('/app', req.nextUrl.origin), 303)
}
