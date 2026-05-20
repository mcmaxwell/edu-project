import 'server-only'
import { and, desc, eq } from 'drizzle-orm'
import { schema, withUserScope } from './db'
import { getUsableKey } from './keys'
import { analyzeWithOpenAI } from './llm'

const PROMPT_VERSION = 'submission.text.v1'
const QUICK_STUDENT_NAME = 'Quick analysis'

/**
 * Run an ad-hoc analysis on pasted/uploaded text. Auto-creates a "Quick analysis"
 * student in the user's first class so the submission/analysis chain has the
 * rows it needs. Full roster management lands later.
 */
export async function analyzeAdHoc(opts: {
  userId: string
  text: string
  title?: string
  studentName?: string
}): Promise<
  { ok: true; analysisId: string; submissionId: string }
  | { ok: false; reason: string }
> {
  const key = await getUsableKey(opts.userId, 'openai')
  if (!key) {
    return {
      ok: false,
      reason:
        'No OpenAI key on file. Add one in Settings → API keys (or wait for pooled-key access).',
    }
  }

  const result = await analyzeWithOpenAI({
    apiKey: key.plaintext,
    submissionText: opts.text,
    studentName: opts.studentName,
  })
  if (!result.ok) return { ok: false, reason: result.reason }

  // Find or create the user's "Quick analysis" target. All teacher-scoped
  // reads/writes go through withUserScope so RLS lets them through.
  let ids: { analysisId: string; submissionId: string }
  try {
    ids = await withUserScope(opts.userId, async (tx) => {
    const ownClasses = await tx
      .select({ id: schema.classes.id })
      .from(schema.classes)
      .orderBy(desc(schema.classes.createdAt))
      .limit(1)
    const classId = ownClasses[0]?.id
    if (!classId) {
      throw new Error('No class on file. Finish onboarding first.')
    }

    const existing = await tx
      .select({ id: schema.students.id })
      .from(schema.students)
      .where(
        and(
          eq(schema.students.classId, classId),
          eq(schema.students.displayName, opts.studentName?.trim() || QUICK_STUDENT_NAME),
        ),
      )
      .limit(1)
    let studentId = existing[0]?.id
    if (!studentId) {
      const [created] = await tx
        .insert(schema.students)
        .values({
          classId,
          displayName: opts.studentName?.trim() || QUICK_STUDENT_NAME,
        })
        .returning({ id: schema.students.id })
      if (!created) throw new Error('Could not create student')
      studentId = created.id
    }

    const [submission] = await tx
      .insert(schema.submissions)
      .values({
        studentId,
        title: opts.title?.trim() || 'Untitled submission',
        finalText: opts.text,
      })
      .returning({ id: schema.submissions.id })
    if (!submission) throw new Error('Could not create submission')

    const [analysis] = await tx
      .insert(schema.analyses)
      .values({
        submissionId: submission.id,
        promptVersion: PROMPT_VERSION,
        confidence:
          result.analysis.overall_confidence === 'inconclusive'
            ? 'inconclusive'
            : result.analysis.overall_confidence,
        verdict: result.analysis.verdict,
        evidenceJson: result.analysis,
      })
      .returning({ id: schema.analyses.id })
    if (!analysis) throw new Error('Could not create analysis')

      return { analysisId: analysis.id, submissionId: submission.id }
    })
  } catch (e) {
    return { ok: false, reason: (e as Error).message }
  }

  return { ok: true, ...ids }
}

export async function getAnalysisForUser(userId: string, analysisId: string) {
  const rows = await withUserScope(userId, async (tx) => {
    return tx
      .select({
        id: schema.analyses.id,
        verdict: schema.analyses.verdict,
        confidence: schema.analyses.confidence,
        evidenceJson: schema.analyses.evidenceJson,
        createdAt: schema.analyses.createdAt,
        title: schema.submissions.title,
        finalText: schema.submissions.finalText,
        studentName: schema.students.displayName,
      })
      .from(schema.analyses)
      .innerJoin(schema.submissions, eq(schema.submissions.id, schema.analyses.submissionId))
      .innerJoin(schema.students, eq(schema.students.id, schema.submissions.studentId))
      .where(eq(schema.analyses.id, analysisId))
      .limit(1)
  })
  return rows[0] ?? null
}
