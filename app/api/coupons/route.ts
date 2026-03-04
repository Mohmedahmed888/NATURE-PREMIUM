import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { isAuthed } from '@/lib/auth'
import { z } from 'zod'

export async function GET() {
  if (!(await isAuthed())) return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 })

  const coupons = await prisma.coupon.findMany({ orderBy: { createdAt: 'desc' } })
  return NextResponse.json({ ok: true, coupons })
}

const CouponInput = z.object({
  code: z.string().min(2).max(50),
  type: z.enum(['PERCENT', 'FIXED']),
  value: z.number().int().min(1),
  minOrderCents: z.number().int().min(0).optional(),
  maxUses: z.number().int().min(1).nullable().optional(),
  expiresAt: z.union([z.string(), z.null()]).optional(),
})

export async function POST(req: Request) {
  if (!(await isAuthed())) return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 })

  const body = await req.json().catch(() => null)
  const parsed = CouponInput.safeParse(body)
  if (!parsed.success) return NextResponse.json({ ok: false, error: parsed.error.flatten() }, { status: 400 })

  const code = parsed.data.code.toUpperCase().trim()
  const exists = await prisma.coupon.findUnique({ where: { code } })
  if (exists) return NextResponse.json({ ok: false, error: 'code_exists' }, { status: 400 })

  if (parsed.data.type === 'PERCENT' && parsed.data.value > 100) {
    return NextResponse.json({ ok: false, error: 'invalid_percent' }, { status: 400 })
  }

  const expiresAt = parsed.data.expiresAt && parsed.data.expiresAt.trim()
    ? new Date(parsed.data.expiresAt)
    : null

  const coupon = await prisma.coupon.create({
    data: {
      code,
      type: parsed.data.type,
      value: parsed.data.value,
      minOrderCents: parsed.data.minOrderCents ?? 0,
      maxUses: parsed.data.maxUses ?? null,
      expiresAt,
    },
  })
  return NextResponse.json({ ok: true, coupon })
}
