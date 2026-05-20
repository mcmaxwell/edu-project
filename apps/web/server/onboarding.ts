import 'server-only'
import { eq } from 'drizzle-orm'
import { db, schema, withUserScope } from './db'

type Step = 'role' | 'api_key' | 'class' | 'complete'

export async function setStep(userId: string, step: Step) {
  await db.update(schema.users).set({ onboardingStep: step }).where(eq(schema.users.id, userId))
}

export async function setIntent(userId: string, intent: string) {
  await db
    .update(schema.users)
    .set({ onboardingIntent: intent, onboardingStep: 'api_key' })
    .where(eq(schema.users.id, userId))
}

export async function createFirstClass(userId: string, name: string) {
  await withUserScope(userId, async (tx) => {
    await tx.insert(schema.classes).values({ teacherId: userId, name })
  })
  await setStep(userId, 'complete')
}
