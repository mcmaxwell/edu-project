/**
 * Smoke test: verifies the schema is applied and RLS isolates teachers.
 * - Owner connection (DATABASE_URL) seeds test data — bypasses RLS.
 * - App connection (APP_DATABASE_URL) reads — subject to RLS.
 */
import postgres from 'postgres'
import { drizzle } from 'drizzle-orm/postgres-js'
import * as schema from './schema'

async function main() {
  const ownerUrl = process.env.DATABASE_URL
  const appUrl = process.env.APP_DATABASE_URL
  if (!ownerUrl) throw new Error('DATABASE_URL is not set')
  if (!appUrl) throw new Error('APP_DATABASE_URL is not set (run setup-app-role)')

  const owner = postgres(ownerUrl, { max: 1 })
  const ownerDb = drizzle(owner, { schema })

  await owner`delete from users where email in ('alice@test.invalid','bob@test.invalid')`

  const [alice] = await ownerDb
    .insert(schema.users)
    .values({ email: 'alice@test.invalid', passwordHash: 'x', status: 'active' })
    .returning()
  const [bob] = await ownerDb
    .insert(schema.users)
    .values({ email: 'bob@test.invalid', passwordHash: 'x', status: 'active' })
    .returning()
  if (!alice || !bob) throw new Error('user insert failed')

  const [aliceClass] = await ownerDb
    .insert(schema.classes)
    .values({ teacherId: alice.id, name: 'AP Lit · Alice' })
    .returning()
  const [bobClass] = await ownerDb
    .insert(schema.classes)
    .values({ teacherId: bob.id, name: 'AP Lit · Bob' })
    .returning()
  if (!aliceClass || !bobClass) throw new Error('class insert failed')

  // Use the RLS-subject app connection for the isolation tests.
  const app = postgres(appUrl, { max: 1 })

  const aliceRows = await app.begin(async (tx) => {
    await tx`select set_config('app.user_id', ${alice.id}, true)`
    return tx`select id from classes`
  })

  const bobRows = await app.begin(async (tx) => {
    await tx`select set_config('app.user_id', ${bob.id}, true)`
    return tx`select id from classes`
  })

  const anonRows = await app`select id from classes`

  // Negative test: alice tries to insert a class for bob → should fail WITH CHECK.
  let crossWriteRejected = false
  try {
    await app.begin(async (tx) => {
      await tx`select set_config('app.user_id', ${alice.id}, true)`
      await tx`insert into classes (teacher_id, name) values (${bob.id}, 'cross-write')`
    })
  } catch {
    crossWriteRejected = true
  }

  // Cleanup via owner.
  await owner`delete from users where id in (${alice.id}, ${bob.id})`
  await owner.end()
  await app.end()

  const aliceSeesOnlyHers =
    aliceRows.length === 1 && aliceRows[0]?.id === aliceClass.id
  const bobSeesOnlyHis = bobRows.length === 1 && bobRows[0]?.id === bobClass.id
  const anonSeesNothing = anonRows.length === 0

  const ok =
    aliceSeesOnlyHers && bobSeesOnlyHis && anonSeesNothing && crossWriteRejected

  // eslint-disable-next-line no-console
  console.log(
    JSON.stringify(
      {
        aliceSawRows: aliceRows.length,
        bobSawRows: bobRows.length,
        anonSawRows: anonRows.length,
        aliceSeesOnlyHers,
        bobSeesOnlyHis,
        anonSeesNothing,
        crossWriteRejected,
        ok,
      },
      null,
      2,
    ),
  )
  if (!ok) process.exit(1)
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err)
  process.exit(1)
})
