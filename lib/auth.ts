import { cookies } from 'next/headers'

const COOKIE_NAME = 'np_admin'

export async function isAuthed() {
  const store = await cookies()
  return store.get(COOKIE_NAME)?.value === '1'
}

export async function setAuthed() {
  const store = await cookies()
  store.set(COOKIE_NAME, '1', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  })
}

export async function clearAuthed() {
  const store = await cookies()
  store.set(COOKIE_NAME, '', { path: '/', maxAge: 0 })
}
