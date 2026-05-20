import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Badge, Button, Card, FlagPill, Highlight } from '@inkprint/ui'
import type { SubmissionAnalysis } from '@inkprint/prompts'
import { requireSession } from '@/server/auth/require'
import { getAnalysisForUser } from '@/server/analyze'

export const metadata = { title: 'Evidence' }

const VERDICT_LABEL: Record<SubmissionAnalysis['verdict'], string> = {
  aligned: 'Aligned with the student’s context',
  partial_concern: 'Partial concern — review the highlighted passages',
  high_concern: 'High concern — review with the student',
  inconclusive: 'Inconclusive',
}

function badgeVariant(verdict: SubmissionAnalysis['verdict']) {
  if (verdict === 'aligned') return 'info' as const
  if (verdict === 'inconclusive') return 'inconclusive' as const
  return 'flagged' as const
}

export default async function AnalysisResultPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const user = await requireSession()
  const { id } = await params
  const row = await getAnalysisForUser(user.id, id)
  if (!row) notFound()

  const analysis = row.evidenceJson as SubmissionAnalysis

  return (
    <section className="max-w-4xl mx-auto px-6 py-12">
      <Link href="/app/analyze" className="text-body-sm text-slate hover:text-ink">
        ← New analysis
      </Link>

      <div className="mt-4 mb-8">
        <p className="text-eyebrow font-sans font-semibold uppercase text-slate mb-2">
          {row.studentName} · {row.createdAt.toLocaleString()}
        </p>
        <h1 className="text-h1 font-display text-ink mb-4">{row.title}</h1>
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant={badgeVariant(analysis.verdict)}>{VERDICT_LABEL[analysis.verdict]}</Badge>
          <Badge>Confidence: {analysis.overall_confidence}</Badge>
          <Badge variant="info">Language: {analysis.language}</Badge>
        </div>
      </div>

      <h2 className="text-h3 font-display text-ink mb-3">
        Submission
        {analysis.flagged_passages.length > 0 ? (
          <span className="ml-3 text-body-sm font-sans text-slate">
            {analysis.flagged_passages.length} passage
            {analysis.flagged_passages.length === 1 ? '' : 's'} flagged for review
          </span>
        ) : null}
      </h2>
      <Card className="mb-10">
        <p className="text-body text-ink leading-relaxed whitespace-pre-wrap">
          {renderWithHighlights(row.finalText, analysis.flagged_passages)}
        </p>
      </Card>

      {analysis.flagged_passages.length > 0 ? (
        <>
          <h2 className="text-h3 font-display text-ink mb-3">Flagged passages</h2>
          <div className="space-y-4 mb-10">
            {analysis.flagged_passages.map((p, i) => (
              <Card key={i}>
                <div className="flex items-center justify-between mb-3">
                  <FlagPill>Passage {i + 1}</FlagPill>
                  <Badge>{p.confidence} confidence</Badge>
                </div>
                <blockquote className="text-body text-ink border-l-2 border-coral pl-4 my-3 italic">
                  “{p.quote}”
                </blockquote>
                <p className="text-body text-slate mb-3">{p.note}</p>
                <p className="text-eyebrow font-sans font-semibold uppercase text-slate mb-2">
                  Indicators
                </p>
                <ul className="list-disc list-inside text-body-sm text-slate space-y-1">
                  {p.indicators.map((ind, j) => (
                    <li key={j}>{ind}</li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </>
      ) : (
        <Card className="mb-10">
          <p className="text-body text-slate">
            No passages flagged. Inkprint did not find patterns consistent with AI-generated text
            in this submission.
          </p>
        </Card>
      )}

      {analysis.conversation_questions.length > 0 ? (
        <>
          <h2 className="text-h3 font-display text-ink mb-3">Suggested conversation questions</h2>
          <Card className="mb-10">
            <ol className="list-decimal list-inside text-body text-ink space-y-2">
              {analysis.conversation_questions.map((q, i) => (
                <li key={i}>{q}</li>
              ))}
            </ol>
          </Card>
        </>
      ) : null}

      {analysis.caveats.length > 0 ? (
        <>
          <h2 className="text-h3 font-display text-ink mb-3">Caveats</h2>
          <Card className="mb-10">
            <ul className="list-disc list-inside text-body-sm text-slate space-y-2">
              {analysis.caveats.map((c, i) => (
                <li key={i}>{c}</li>
              ))}
            </ul>
          </Card>
        </>
      ) : null}

      <div className="flex items-center gap-3">
        <Link href="/app/analyze">
          <Button>Analyze another</Button>
        </Link>
        <Link href="/app">
          <Button variant="secondary">Back to dashboard</Button>
        </Link>
      </div>
    </section>
  )
}

/**
 * Render the submission, wrapping each quoted-flagged span in <Highlight>. We
 * match substrings — fragile across whitespace differences, so we do a single
 * fuzzy-tolerant pass.
 */
function renderWithHighlights(
  text: string,
  passages: SubmissionAnalysis['flagged_passages'],
): React.ReactNode {
  if (passages.length === 0) return text

  // Collect non-overlapping match ranges, longest quotes first.
  const ranges: { start: number; end: number }[] = []
  const sorted = [...passages].sort((a, b) => b.quote.length - a.quote.length)
  for (const p of sorted) {
    const needle = normalize(p.quote)
    const idx = normalize(text).indexOf(needle)
    if (idx < 0) continue
    const range = { start: idx, end: idx + needle.length }
    const overlaps = ranges.some(
      (r) => !(range.end <= r.start || range.start >= r.end),
    )
    if (!overlaps) ranges.push(range)
  }
  ranges.sort((a, b) => a.start - b.start)

  if (ranges.length === 0) return text

  const out: React.ReactNode[] = []
  let cursor = 0
  ranges.forEach((r, i) => {
    if (cursor < r.start) out.push(text.slice(cursor, r.start))
    out.push(<Highlight key={i}>{text.slice(r.start, r.end)}</Highlight>)
    cursor = r.end
  })
  if (cursor < text.length) out.push(text.slice(cursor))
  return out
}

function normalize(s: string): string {
  return s.replace(/[“”"]/g, '"').replace(/[‘’']/g, "'")
}
