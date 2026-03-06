import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { isAuthed } from '@/lib/auth'

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAuthed())) return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 })
  const { id } = await params
  try {
    const body = await req.json().catch(() => ({}))
    const status = body.status === 'DELIVERED' ? 'DELIVERED' : body.status
    if (!status) return NextResponse.json({ ok: false, error: 'status_required' }, { status: 400 })

    await prisma.order.update({
      where: { id },
      data: { status },
    })
    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('PATCH /api/orders/[id] error:', e)
    return NextResponse.json({ ok: false, error: 'update_failed' }, { status: 500 })
  }
}
