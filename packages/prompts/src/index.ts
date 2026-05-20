export const SYSTEM_PREAMBLE = `You are Inkprint, an evidence-first analyst that helps teachers evaluate student work in the age of generative AI.

Operating rules:
1. You are NOT a verdict machine. You produce evidence and confidence, not accusations.
2. Never say a passage "is AI" — say it "shows patterns consistent with AI-generated text" and explain why.
3. "Inconclusive" is a valid and often correct output. Use it when signals conflict.
4. Be specific. Quote short spans (no more than 25 words each) when you flag something.
5. Do not invent stylistic features that aren't grounded in the text. Every claim must point at a span you can quote.
6. Output strictly the JSON schema requested. No prose outside the JSON.
7. Language: respond in the same language as the submission.`

export type Confidence = 'low' | 'medium' | 'high'
export type Verdict = 'aligned' | 'partial_concern' | 'high_concern' | 'inconclusive'

export type FlaggedPassage = {
  quote: string
  indicators: string[]
  note: string
  confidence: Confidence
}

export type SubmissionAnalysis = {
  language: string
  verdict: Verdict
  overall_confidence: Confidence | 'inconclusive'
  flagged_passages: FlaggedPassage[]
  caveats: string[]
  conversation_questions: string[]
}

export const SUBMISSION_ANALYSIS_SCHEMA = {
  name: 'SubmissionAnalysis',
  strict: true,
  schema: {
    type: 'object',
    additionalProperties: false,
    properties: {
      language: { type: 'string' },
      verdict: { enum: ['aligned', 'partial_concern', 'high_concern', 'inconclusive'] },
      overall_confidence: { enum: ['low', 'medium', 'high', 'inconclusive'] },
      flagged_passages: {
        type: 'array',
        items: {
          type: 'object',
          additionalProperties: false,
          properties: {
            quote: { type: 'string' },
            indicators: { type: 'array', items: { type: 'string' } },
            note: { type: 'string' },
            confidence: { enum: ['low', 'medium', 'high'] },
          },
          required: ['quote', 'indicators', 'note', 'confidence'],
        },
      },
      caveats: { type: 'array', items: { type: 'string' } },
      conversation_questions: { type: 'array', items: { type: 'string' } },
    },
    required: [
      'language',
      'verdict',
      'overall_confidence',
      'flagged_passages',
      'caveats',
      'conversation_questions',
    ],
  },
} as const

export function buildSubmissionUserMessage(opts: {
  submissionText: string
  studentName?: string
}): string {
  const { submissionText, studentName } = opts
  return [
    studentName ? `STUDENT: ${studentName}` : 'STUDENT: anonymous',
    'BASELINE: none (no prior verified samples on file)',
    'PROCESS_TRACE_SUMMARY: none (no editor capture on this submission)',
    'DECLARED_AI_USE: none',
    '',
    'Tasks:',
    'A. Identify passages with patterns consistent with AI-generated text. Quote each (≤ 25 words), list indicators, and give a per-passage confidence.',
    "B. Produce an overall verdict: 'aligned' | 'partial_concern' | 'high_concern' | 'inconclusive'.",
    'C. List two questions the teacher could ask the student in a follow-up conversation.',
    'D. List caveats — anything the teacher should know about uncertainty.',
    '',
    'Output strictly the SubmissionAnalysis JSON schema.',
    '',
    'SUBMISSION:',
    '<<<BEGIN>>>',
    submissionText,
    '<<<END>>>',
  ].join('\n')
}
