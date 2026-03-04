import { NextResponse } from 'next/server'
import { clearAuthed } from '@/lib/auth'

export async function POST(req: Request) {
  await clearAuthed()
  return NextResponse.redirect(new URL('/admin/login', req.url))
}
