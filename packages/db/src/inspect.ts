import postgres from 'postgres'

const sql = postgres(process.env.DATABASE_URL!, { max: 1 })

const role = await sql`select rolname, rolbypassrls, rolsuper from pg_roles where rolname = current_user`
// eslint-disable-next-line no-console
console.log('current_user role:', [...role])

// Try inserting a class with no app.user_id set — RLS should reject if neondb_owner is subject.
try {
  // make a throwaway teacher
  const [u] =
    await sql`insert into users (email, password_hash) values ('rls-probe@test.invalid', 'x') returning id`
  // eslint-disable-next-line no-console
  console.log('inserted user:', u)
  try {
    const [c] =
      await sql`insert into classes (teacher_id, name) values (${u!.id}, 'probe') returning id`
    // eslint-disable-next-line no-console
    console.log('INSERT classes WITHOUT app.user_id SUCCEEDED:', c, '→ RLS not enforcing for this role')
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log('INSERT classes WITHOUT app.user_id REJECTED ✓:', (e as Error).message)
  }
  await sql`delete from users where id = ${u!.id}`
} catch (e) {
  // eslint-disable-next-line no-console
  console.error('probe failed:', e)
}

await sql.end()
