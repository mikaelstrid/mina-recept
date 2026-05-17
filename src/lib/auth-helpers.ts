import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'

export async function getRequiredSession() {
  const session = await auth()
  if (!session?.user) redirect('/auth/login')
  return session
}

export async function getOptionalSession() {
  return auth()
}

export async function requireAdmin() {
  const session = await getRequiredSession()
  if (!session.user.isAdmin) redirect('/')
  return session
}
