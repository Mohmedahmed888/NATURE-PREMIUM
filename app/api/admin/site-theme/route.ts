import { NextResponse } from 'next/server'
import { isAuthed } from '@/lib/auth'
import { getSiteTheme, setSiteTheme } from '@/lib/site-theme'

export async function PATCH(req: Request) {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }
  try {
    const body = await req.json()
    const theme = body.theme === 'dark' ? 'dark' : 'light'
    await setSiteTheme(theme)
    return NextResponse.json({ ok: true, theme })
  } catch (e) {
    return NextResponse.json({ error: 'failed' }, { status: 500 })
  }
}

export async function GET() {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }
  const theme = await getSiteTheme()
  return NextResponse.json({ theme })
}
