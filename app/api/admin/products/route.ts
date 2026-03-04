import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { isAuthed } from '@/lib/auth'

export async function GET() {
  if (!(await isAuthed())) return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 })

  const products = await prisma.product.findMany({
    where: { active: true },
    orderBy: { createdAt: 'desc' },
    include: { _count: { select: { orderItems: true } } },
  })

  const totalViews = products.reduce((s, p) => s + (p.views || 0), 0)

  const withStats = products.map((p) => ({
    ...p,
    ordersCount: p._count.orderItems,
    viewsPercent: totalViews > 0 ? Math.round(((p.views || 0) / totalViews) * 100) : 0,
  }))

  return NextResponse.json({ ok: true, products: withStats })
}
