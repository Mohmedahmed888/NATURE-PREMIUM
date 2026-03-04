import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { isAuthed } from '@/lib/auth'
import { getCurrentUser } from '@/lib/user-auth'
import { rateLimit } from '@/lib/rate-limit'
import { z } from 'zod'

export async function GET() {
  if (!(await isAuthed())) return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 })
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    include: { items: { include: { product: true } } },
    take: 50,
  })
  return NextResponse.json({ ok: true, orders })
}

const OrderInput = z.object({
  email: z.string().email(),
  name: z.string().min(2),
  phone: z.string().optional(),
  address: z.string().min(5),
  city: z.string().min(2),
  country: z.string().min(2),
  paymentMethod: z.enum(['CASH', 'CARD']).optional(),
  couponCode: z.string().optional(),
  items: z.array(
    z.object({
      productId: z.string().min(5),
      qty: z.number().int().min(1).max(20),
    }),
  ).min(1),
})

export async function POST(req: Request) {
  const rl = rateLimit(req)
  if (!rl.ok) {
    return NextResponse.json(
      { ok: false, error: 'too_many_requests' },
      { status: 429, headers: rl.retryAfter ? { 'Retry-After': String(rl.retryAfter) } : undefined }
    )
  }
  const body = await req.json().catch(() => null)
  const parsed = OrderInput.safeParse(body)
  if (!parsed.success) return NextResponse.json({ ok: false, error: parsed.error.flatten() }, { status: 400 })

  const ids = parsed.data.items.map((i) => i.productId)
  const products = await prisma.product.findMany({ where: { id: { in: ids }, active: true } })
  const map = new Map(products.map((p) => [p.id, p]))

  let totalCents = 0
  for (const it of parsed.data.items) {
    const p = map.get(it.productId)
    if (!p) return NextResponse.json({ ok: false, error: 'invalid_product' }, { status: 400 })
    const stock = (p as { stock?: number }).stock ?? 999
    if (stock < it.qty) {
      return NextResponse.json(
        { ok: false, error: 'out_of_stock', product: p.name, available: stock },
        { status: 400 }
      )
    }
    totalCents += p.priceCents * it.qty
  }

  let discountCents = 0
  let couponCode: string | null = null
  if (parsed.data.couponCode) {
    const coupon = await prisma.coupon.findUnique({
      where: { code: parsed.data.couponCode.toUpperCase().trim() },
    })
    if (coupon && coupon.active && (!coupon.expiresAt || new Date() <= coupon.expiresAt)) {
      if (coupon.maxUses == null || coupon.usedCount < coupon.maxUses) {
        if (totalCents >= coupon.minOrderCents) {
          discountCents = coupon.type === 'PERCENT'
            ? Math.round((totalCents * coupon.value) / 100)
            : Math.min(coupon.value, totalCents)
          couponCode = coupon.code
          await prisma.coupon.update({
            where: { id: coupon.id },
            data: { usedCount: { increment: 1 } },
          })
        }
      }
    }
  }

  const finalTotal = Math.max(0, totalCents - discountCents)
  const paymentMethod = parsed.data.paymentMethod || 'CASH'

  const user = await getCurrentUser()

  const order = await prisma.$transaction(async (tx) => {
    for (const it of parsed.data.items) {
      const prod = map.get(it.productId)!
      await tx.product.update({
        where: { id: prod.id },
        data: { stock: { decrement: it.qty } },
      })
    }
    return tx.order.create({
      data: {
        userId: user?.id ?? null,
        email: parsed.data.email,
        name: parsed.data.name,
        phone: parsed.data.phone || null,
        address: parsed.data.address,
        city: parsed.data.city,
        country: parsed.data.country,
        totalCents: finalTotal,
        paymentMethod,
        discountCents,
        couponCode,
        items: {
          create: parsed.data.items.map((it) => {
            const prod = map.get(it.productId)!
            return { productId: prod.id, qty: it.qty, priceCents: prod.priceCents }
          }),
        },
      },
      include: { items: { include: { product: true } } },
    })
  })

  // Automation hook (email confirmation). Non-blocking.
  const base = process.env.APP_URL || 'http://localhost:3000'
  fetch(`${base}/api/automation/order-confirmation`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ orderId: order.id }),
  }).catch(() => null)

  return NextResponse.json({ ok: true, order })
}
