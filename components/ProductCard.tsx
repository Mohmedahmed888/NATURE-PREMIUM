'use client'

import Link from 'next/link'
import { formatEGP } from '@/lib/money'
import { Button } from './ui'
import { useCart } from './cart'
import { useToast } from './Toast'
import { OptimizedImage } from './OptimizedImage'

export type ProductDTO = {
  id: string
  slug: string
  name: string
  description: string
  priceCents: number
  imageUrl: string
  stock?: number
}

export function ProductCard({ p }: { p: ProductDTO }) {
  const { add } = useCart()
  const { toast } = useToast()
  const stock = p.stock ?? 999
  const outOfStock = stock <= 0

  const handleAdd = () => {
    if (outOfStock) return
    add(p.id)
    toast(`تمت إضافة "${p.name}" للسلة`)
  }
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-lg border border-stone-100 hover:shadow-xl transition-shadow">
      <div className="aspect-[4/3] bg-stone-50 relative overflow-hidden">
        <OptimizedImage src={p.imageUrl} alt={p.name} fill className="object-cover" sizes="(max-width: 640px) 100vw, 33vw" />
      </div>
      <div className="p-6">
        <div className="flex flex-col gap-2">
          <Link
            href={`/product/${p.slug}`}
            className="text-lg font-bold text-slate-800 hover:text-brand-600 transition-colors"
          >
            {p.name}
          </Link>
          <p className="text-sm text-slate-500 line-clamp-2">{p.description}</p>
          <div className="flex items-center justify-between gap-2">
            <span className="text-lg font-semibold text-brand-600">{formatEGP(p.priceCents)}</span>
            {outOfStock ? (
              <span className="text-sm text-amber-600 font-medium">نفد من المخزن</span>
            ) : (
              <span className="text-xs text-slate-500">متوفر: {stock}</span>
            )}
          </div>
        </div>
        <div className="mt-5 flex gap-3">
          <Button
            onClick={handleAdd}
            disabled={outOfStock}
            className="flex-1 min-h-[44px] bg-brand-600 hover:bg-brand-500 text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {outOfStock ? 'نفد' : 'أضف للسلة'}
          </Button>
          <Link
            href={`/product/${p.slug}`}
            className="flex-1 inline-flex items-center justify-center rounded-xl px-4 py-2.5 min-h-[44px] font-semibold transition bg-stone-200 hover:bg-stone-300 active:bg-stone-400 text-slate-800 border border-stone-300"
          >
            عرض
          </Link>
        </div>
      </div>
    </div>
  )
}
