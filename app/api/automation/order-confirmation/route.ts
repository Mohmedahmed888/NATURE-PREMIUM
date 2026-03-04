import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendEmail } from '@/lib/email'
import { formatEGP } from '@/lib/money'
import { z } from 'zod'

const Input = z.object({ orderId: z.string().min(5) })

export async function POST(req: Request) {
  const body = await req.json().catch(() => null)
  const parsed = Input.safeParse(body)
  if (!parsed.success) return NextResponse.json({ ok: false }, { status: 400 })

  const order = await prisma.order.findUnique({
    where: { id: parsed.data.orderId },
    include: { items: { include: { product: true } } },
  })

  if (!order) return NextResponse.json({ ok: false, error: 'not_found' }, { status: 404 })

  const lines = order.items
    .map((i) => `${i.product.name} x${i.qty} — ${formatEGP(i.priceCents * i.qty)}`)
    .join('\n')

  const text = [
    `شكراً يا ${order.name} — تم استلام طلبك من NATURE PREMIUM ✅`,
    '',
    'تفاصيل الطلب:',
    lines,
    '',
    `الإجمالي: ${formatEGP(order.totalCents)}`,
    '',
    'هنكلمك قريب للتأكيد والشحن.',
  ].join('\n')

  await sendEmail({
    to: order.email,
    subject: 'NATURE PREMIUM — Order Confirmation',
    text,
  })

  return NextResponse.json({ ok: true })
}
