import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { isAuthed } from '@/lib/auth'

export async function PATCH(
  req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  if (!(await isAuthed())) return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 })
  const { id } = await ctx.params
  try {
    const body = await req.json().catch(() => null)
    const active = body?.active
    if (typeof active !== 'boolean') {
      return NextResponse.json({ ok: false, error: 'invalid' }, { status: 400 })
    }
    const coupon = await prisma.coupon.update({
      where: { id },
      data: { active },
    })
    return NextResponse.json({ ok: true, coupon })
  } catch {
    return NextResponse.json({ ok: false, error: 'not_found' }, { status: 404 })
  }
}

export async function DELETE(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  if (!(await isAuthed())) return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 })

  const { id } = await ctx.params
  try {
    await prisma.coupon.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: false, error: 'not_found' }, { status: 404 })
  }
}
