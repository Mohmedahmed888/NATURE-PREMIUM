import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { isAuthed } from '@/lib/auth'
import { z } from 'zod'

export async function GET() {
  const products = await prisma.product.findMany({
    where: { active: true },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json({ ok: true, products })
}

const imageUrlSchema = z.string().min(1).refine(
  (s) => s.startsWith('/') || s.startsWith('http://') || s.startsWith('https://'),
  { message: 'رابط أو مسار الصورة غير صالح' }
)

const slugSchema = z.string().min(2).transform((s) =>
  s.trim().toLowerCase().replace(/\s+/g, '-').replace(/-+/g, '-') // مسافات → شرطات، إزالة الشرطات المكررة
)

const imageUrlsSchema = z.union([
  z.array(z.string().min(1)),
  z.string().transform((s) => {
    try { const a = JSON.parse(s); return Array.isArray(a) ? a.filter((x: unknown) => typeof x === 'string') : [] }
    catch { return [] }
  }),
]).optional().default([])

const ProductInput = z.object({
  slug: slugSchema,
  name: z.string().min(2),
  description: z.string().min(5),
  priceCents: z.number().int().min(0),
  imageUrl: imageUrlSchema,
  imageUrls: imageUrlsSchema,
  active: z.boolean().optional(),
  stock: z.number().int().min(0).optional(),
})

export async function POST(req: Request) {
  try {
    if (!(await isAuthed())) return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 })
    const body = await req.json().catch(() => null)
    const parsed = ProductInput.safeParse(body)
    if (!parsed.success) return NextResponse.json({ ok: false, error: parsed.error.flatten() }, { status: 400 })

    const { imageUrls, ...rest } = parsed.data
    const p = await prisma.product.create({
      data: {
        ...rest,
        imageUrls: imageUrls?.length ? JSON.stringify(imageUrls) : null,
        active: parsed.data.active ?? true,
        stock: parsed.data.stock ?? 999,
      },
    })
    return NextResponse.json({ ok: true, product: p })
  } catch (e) {
    console.error('POST /api/products error:', e)
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : 'خطأ في الخادم' },
      { status: 500 }
    )
  }
}
