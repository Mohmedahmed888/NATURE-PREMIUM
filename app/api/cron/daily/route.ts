import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  // مثال بسيط: احصائيات يومية (تقدر تبعتها ايميل للادمن)
  const [products, orders] = await Promise.all([
    prisma.product.count({ where: { active: true } }),
    prisma.order.count(),
  ])

  return NextResponse.json({ ok: true, products, orders, ranAt: new Date().toISOString() })
}
