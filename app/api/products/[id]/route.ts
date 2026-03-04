import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { isAuthed } from '@/lib/auth'
import { z } from 'zod'

const imageUrlSchema = z.string().min(1).refine(
  (s) => s.startsWith('/') || s.startsWith('http') || s.startsWith('uploads'),
  { message: 'رابط أو مسار الصورة غير صالح' }
).transform((s) => {
  const normalized = s.startsWith('uploads') ? `/${s}` : s
  return normalized.replace(/\/+$/, '') // إزالة / الزائدة من النهاية
})

const slugSchema = z.string().min(2).transform((s) =>
  s.trim().toLowerCase().replace(/\s+/g, '-').replace(/-+/g, '-')
)

const imageUrlsSchema = z.union([
  z.array(z.string().min(1)),
  z.string().transform((s) => {
    try { const a = JSON.parse(s); return Array.isArray(a) ? a.filter((x: unknown) => typeof x === 'string') : [] }
    catch { return [] }
  }),
]).optional()

const ProductUpdate = z.object({
  slug: slugSchema.optional(),
  name: z.string().min(2).optional(),
  description: z.string().min(5).optional(),
  priceCents: z.number().int().min(0).optional(),
  imageUrl: imageUrlSchema.optional(),
  imageUrls: imageUrlsSchema,
  active: z.boolean().optional(),
  stock: z.number().int().min(0).optional(),
})

export async function PATCH(
  req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  if (!(await isAuthed())) return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 })

  const { id } = await ctx.params
  const body = await req.json().catch(() => null)
  const parsed = ProductUpdate.safeParse(body)
  if (!parsed.success) return NextResponse.json({ ok: false, error: parsed.error.flatten() }, { status: 400 })

  const { imageUrls, ...rest } = parsed.data
  const data: Record<string, unknown> = { ...rest }
  if (imageUrls !== undefined) data.imageUrls = imageUrls?.length ? JSON.stringify(imageUrls) : null
  const product = await prisma.product.update({
    where: { id },
    data,
  })
  return NextResponse.json({ ok: true, product })
}

export async function DELETE(
  _req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  if (!(await isAuthed())) return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 })

  const { id } = await ctx.params
  try {
    // soft delete: المنتج مربوط بطلبات، نعطّله بدل الحذف الفعلي
    await prisma.product.update({
      where: { id },
      data: { active: false },
    })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: false, error: 'not_found' }, { status: 404 })
  }
}
