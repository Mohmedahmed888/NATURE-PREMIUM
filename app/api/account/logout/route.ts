import { NextResponse } from 'next/server'
import { clearUserSession } from '@/lib/user-auth'

export async function POST(req: Request) {
  await clearUserSession()
  return NextResponse.redirect(new URL('/account', req.url))
}
