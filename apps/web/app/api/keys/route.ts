import { NextResponse, type NextRequest } from 'next/server'
import { z } from 'zod'
import { requireSession } from '@/server/auth/require'
import { addKeyForUser, listKeysForUser } from '@/server/keys'

export const runtime = 'nodejs'

const addSchema = z.object({
  provider: z.enum(['openai', 'anthropic', 'gemini']),
  label: z.string().trim().min(1).max(80),
  plaintext: z.string().trim().min(10).max(1024),
})

export async function GET() {
  const user = await requireSession()
  const keys = await listKeysForUser(user.id)
  return NextResponse.json({ keys })
}

export async function POST(req: NextRequest) {
  const user = await requireSession()
  const form = await req.formData()
  const parsed = addSchema.safeParse({
    provider: form.get('provider'),
    label: form.get('label'),
    plaintext: form.get('plaintext'),
  })
  if (!parsed.success) {
    return redirectWith(req, '/settings/keys', 'Check the form — provider, label, and key are required.')
  }

  const result = await addKeyForUser({ userId: user.id, ...parsed.data })
  if (!result.ok) {
    return redirectWith(req, '/settings/keys', result.reason)
  }
  const url = new URL('/settings/keys', req.nextUrl.origin)
  url.searchParams.set('added', '1')
  return NextResponse.redirect(url, 303)
}

function redirectWith(req: NextRequest, path: string, message: string) {
  const url = new URL(path, req.nextUrl.origin)
  url.searchParams.set('error', message)
  return NextResponse.redirect(url, 303)
}
