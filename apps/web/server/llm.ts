import 'server-only'
import {
  SYSTEM_PREAMBLE,
  SUBMISSION_ANALYSIS_SCHEMA,
  buildSubmissionUserMessage,
  type SubmissionAnalysis,
} from '@inkprint/prompts'

/**
 * Run the submission.text.v1 analysis against OpenAI with the user's key.
 * Other providers land in later steps.
 */
export async function analyzeWithOpenAI(opts: {
  apiKey: string
  submissionText: string
  studentName?: string
}): Promise<{ ok: true; analysis: SubmissionAnalysis } | { ok: false; reason: string }> {
  const body = {
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: SYSTEM_PREAMBLE },
      {
        role: 'user',
        content: buildSubmissionUserMessage({
          submissionText: opts.submissionText,
          studentName: opts.studentName,
        }),
      },
    ],
    response_format: {
      type: 'json_schema',
      json_schema: SUBMISSION_ANALYSIS_SCHEMA,
    },
    temperature: 0.2,
  }

  let res: Response
  try {
    res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${opts.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(60_000),
    })
  } catch (e) {
    return { ok: false, reason: `OpenAI request failed: ${(e as Error).message}` }
  }

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    return {
      ok: false,
      reason: `OpenAI returned HTTP ${res.status}${text ? `: ${text.slice(0, 200)}` : ''}`,
    }
  }

  type ChatCompletion = {
    choices?: { message?: { content?: string } }[]
  }
  const data = (await res.json()) as ChatCompletion
  const content = data.choices?.[0]?.message?.content
  if (!content) {
    return { ok: false, reason: 'OpenAI returned no content.' }
  }

  try {
    const analysis = JSON.parse(content) as SubmissionAnalysis
    return { ok: true, analysis }
  } catch (e) {
    return { ok: false, reason: `Could not parse model output: ${(e as Error).message}` }
  }
}
