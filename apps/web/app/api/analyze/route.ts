import { NextResponse, type NextRequest } from 'next/server'
import { z } from 'zod'
import { requireSession } from '@/server/auth/require'
import { analyzeAdHoc } from '@/server/analyze'

export const runtime = 'nodejs'
export const maxDuration = 60

const MAX_CHARS = 12_000
const MAX_FILE_BYTES = 1_000_000

const schema = z.object({
  text: z.string().trim().min(20).max(MAX_CHARS),
  title: z.string().trim().max(200).optional(),
  studentName: z.string().trim().max(120).optional(),
})

export async function POST(req: NextRequest) {
  const user = await requireSession()
  const form = await req.formData()

  let text = (form.get('text') as string | null) ?? ''
  const file = form.get('file') as File | null
  if (file && file.size > 0) {
    if (file.size > MAX_FILE_BYTES) {
      return redirect(req, '/app/analyze', 'File is larger than 1 MB.')
    }
    const lower = file.name.toLowerCase()
    if (!lower.endsWith('.txt') && !lower.endsWith('.md')) {
      return redirect(
        req,
        '/app/analyze',
        'Only .txt and .md files are supported in this release. .docx and .pdf land next.',
      )
    }
    text = await file.text()
  }

  const parsed = schema.safeParse({
    text,
    title: (form.get('title') as string | null) || undefined,
    studentName: (form.get('studentName') as string | null) || undefined,
  })
  if (!parsed.success) {
    const issue = parsed.error.issues[0]
    const reason =
      issue?.path[0] === 'text'
        ? 'Paste or upload at least 20 characters (up to 12k).'
        : (issue?.message ?? 'Invalid input.')
    return redirect(req, '/app/analyze', reason)
  }

  const result = await analyzeAdHoc({ userId: user.id, ...parsed.data })
  if (!result.ok) {
    return redirect(req, '/app/analyze', result.reason)
  }
  return NextResponse.redirect(
    new URL(`/app/analyze/${result.analysisId}`, req.nextUrl.origin),
    303,
  )
}

function redirect(req: NextRequest, path: string, message: string) {
  const url = new URL(path, req.nextUrl.origin)
  url.searchParams.set('error', message)
  return NextResponse.redirect(url, 303)
}
