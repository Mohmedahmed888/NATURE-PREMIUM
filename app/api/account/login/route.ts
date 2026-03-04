import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyPassword, setUserSession } from '@/lib/user-auth'
import { setAuthed } from '@/lib/auth'
import { rateLimitAuth } from '@/lib/rate-limit'

const ADMIN_EMAILS = ['admin@gmail.com', 'admin@gamil.com']

export async function POST(req: Request) {
  const rl = rateLimitAuth(req)
  if (!rl.ok) return NextResponse.redirect(new URL('/account?err=rate', req.url))
  try {
    const formData = await req.formData()
    const email = String(formData.get('email') || '').trim().toLowerCase()
    const password = String(formData.get('password') || '')

    if (!email || !password) {
      return NextResponse.redirect(new URL('/account?err=1', req.url))
    }

    // إذا كان إيميل الأدمن وكلمة المرور صحيحة → تحويل لـ /admin
    if (ADMIN_EMAILS.includes(email) && process.env.ADMIN_PASSWORD) {
      if (password === process.env.ADMIN_PASSWORD) {
        await setAuthed()
        return NextResponse.redirect(new URL('/admin', req.url))
      }
      return NextResponse.redirect(new URL('/account?err=1', req.url))
    }

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      return NextResponse.redirect(new URL('/account?err=1', req.url))
    }

    const valid = await verifyPassword(password, user.passwordHash)
    if (!valid) {
      return NextResponse.redirect(new URL('/account?err=1', req.url))
    }

    await setUserSession(user.id)
    return NextResponse.redirect(new URL('/account', req.url))
  } catch {
    return NextResponse.redirect(new URL('/account?err=1', req.url))
  }
}
