import 'server-only'
import { redirect } from 'next/navigation'
import { getSessionUser, type SessionUser } from './session'

export async function requireSession(): Promise<SessionUser> {
  const user = await getSessionUser()
  if (!user) redirect('/login')
  return user
}

export async function requireAdmin(): Promise<SessionUser> {
  const user = await requireSession()
  if (user.role !== 'admin' && user.role !== 'superadmin') {
    redirect('/app')
  }
  return user
}
