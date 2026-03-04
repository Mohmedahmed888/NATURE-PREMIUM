import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  const body = await req.json().catch(() => null)
  const code = body?.code ? String(body.code).toUpperCase().trim() : ''
  const totalCents = Number(body?.totalCents) || 0

  if (!code) return NextResponse.json({ ok: false, error: 'invalid' })

  const coupon = await prisma.coupon.findUnique({ where: { code } })
  if (!coupon || !coupon.active) {
    return NextResponse.json({ ok: false, error: 'invalid' })
  }
  if (coupon.expiresAt && new Date() > coupon.expiresAt) {
    return NextResponse.json({ ok: false, error: 'expired' })
  }
  if (coupon.maxUses != null && coupon.usedCount >= coupon.maxUses) {
    return NextResponse.json({ ok: false, error: 'used_up' })
  }
  if (totalCents < coupon.minOrderCents) {
    return NextResponse.json({
      ok: false,
      error: 'min_order',
      minOrderCents: coupon.minOrderCents,
    })
  }

  let discountCents = 0
  if (coupon.type === 'PERCENT') {
    discountCents = Math.round((totalCents * coupon.value) / 100)
  } else {
    discountCents = Math.min(coupon.value, totalCents)
  }

  return NextResponse.json({
    ok: true,
    discountCents,
    code: coupon.code,
    type: coupon.type,
    value: coupon.value,
  })
}
