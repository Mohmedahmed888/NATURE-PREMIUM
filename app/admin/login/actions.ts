'use server'

import { redirect } from 'next/navigation'
import { setAuthed } from '@/lib/auth'

const ADMIN_EMAIL = 'admin@gmail.com'

export async function adminLoginAction(formData: FormData) {
  const email = String(formData.get('email') || '').trim().toLowerCase()
  const pass = String(formData.get('password') || '')
  if (!process.env.ADMIN_PASSWORD) {
    throw new Error('ADMIN_PASSWORD is not set')
  }
  if (email !== ADMIN_EMAIL || pass !== process.env.ADMIN_PASSWORD) {
    redirect('/admin/login?err=1')
  }
  await setAuthed()
  redirect('/admin')
}
