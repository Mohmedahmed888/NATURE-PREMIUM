import { cookies } from 'next/headers'
import bcrypt from 'bcryptjs'
import { prisma } from './prisma'

const COOKIE_NAME = 'np_user'
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30 // 30 days

export async function getCurrentUser() {
  const sessionId = (await cookies()).get(COOKIE_NAME)?.value
  if (!sessionId) return null

  const user = await prisma.user.findFirst({
    where: { id: sessionId },
    select: { id: true, email: true, name: true },
  })
  return user
}

export async function setUserSession(userId: string) {
  ;(await cookies()).set(COOKIE_NAME, userId, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: COOKIE_MAX_AGE,
  })
}

export async function clearUserSession() {
  ;(await cookies()).set(COOKIE_NAME, '', { path: '/', maxAge: 0 })
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10)
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash)
}
