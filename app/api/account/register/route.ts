import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword, setUserSession } from '@/lib/user-auth'
import { rateLimitAuth } from '@/lib/rate-limit'

export async function POST(req: Request) {
  const rl = rateLimitAuth(req)
  if (!rl.ok) return NextResponse.redirect(new URL('/account?err=rate', req.url))
  try {
    const formData = await req.formData()
    const name = String(formData.get('name') || '').trim()
    const email = String(formData.get('email') || '').trim().toLowerCase()
    const password = String(formData.get('password') || '')

    if (!name || name.length < 2) {
      return NextResponse.redirect(new URL('/account?err=name', req.url))
    }
    if (!email) {
      return NextResponse.redirect(new URL('/account?err=email', req.url))
    }
    if (!password || password.length < 6) {
      return NextResponse.redirect(new URL('/account?err=password', req.url))
    }

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.redirect(new URL('/account?err=exists', req.url))
    }

    const passwordHash = await hashPassword(password)
    const user = await prisma.user.create({
      data: { email, name, passwordHash },
    })

    await setUserSession(user.id)
    return NextResponse.redirect(new URL('/account', req.url))
  } catch {
    return NextResponse.redirect(new URL('/account?err=1', req.url))
  }
}
