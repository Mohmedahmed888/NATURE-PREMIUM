import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/user-auth'
import { isAuthed } from '@/lib/auth'

export async function GET() {
  if (await isAuthed()) return NextResponse.json({ ok: false, user: null })
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ ok: true, user: null })
  return NextResponse.json({
    ok: true,
    user: { id: user.id, email: user.email, name: user.name },
  })
}
