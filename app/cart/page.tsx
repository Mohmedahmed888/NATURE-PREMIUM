'use client'

import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { useCart } from '@/components/cart'
import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { Button, Input } from '@/components/ui'
import { OptimizedImage } from '@/components/OptimizedImage'
import { formatEGP } from '@/lib/money'

type Product = {
  id: string
  name: string
  priceCents: number
  imageUrl: string
}

export default function CartPage() {
  const { cart, setQty, remove, totalItems } = useCart()
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    fetch('/api/products')
      .then((r) => r.json())
      .then((d) => setProducts(d.products || []))
      .catch(() => setProducts([]))
  }, [])

  const map = useMemo(() => new Map(products.map((p) => [p.id, p])), [products])

  const rows = Object.entries(cart)
    .map(([id, qty]) => ({ p: map.get(id), id, qty }))
    .filter((x) => x.p)

  const totalCents = rows.reduce((sum, r) => sum + (r.p!.priceCents * r.qty), 0)

  return (
    <div className="min-h-screen w-full min-w-0 max-w-full overflow-x-clip grid grid-rows-[auto_1fr_auto]">
      <Navbar />
      <main id="main-content" className="w-full mx-auto max-w-5xl px-4 pb-16">
        <div className="bg-white rounded-3xl p-4 sm:p-6 md:p-8 mt-6 shadow-lg border border-stone-100">
          <h1 className="text-3xl font-extrabold text-slate-800">Cart</h1>
          <p className="text-slate-600 mt-2">Items: {totalItems}</p>

          {rows.length === 0 ? (
            <div className="mt-8 text-slate-600">
              Your cart is empty. <Link className="underline" href="/">Back to products</Link>
            </div>
          ) : (
            <div className="mt-8 space-y-4">
              {rows.map(({ p, qty, id }) => (
                <div key={id} className="flex flex-col sm:flex-row gap-3 sm:gap-4 sm:items-center glass rounded-3xl p-4">
                  <div className="flex gap-4 items-center flex-1 min-w-0">
                    <div className="h-16 w-16 rounded-2xl overflow-hidden relative shrink-0">
                      <OptimizedImage src={p!.imageUrl} alt={p!.name} fill className="object-cover" sizes="64px" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold truncate">{p!.name}</div>
                      <div className="text-sm text-slate-600">{formatEGP(p!.priceCents)}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
                    <div className="w-24">
                      <Input
                        type="number"
                        min={1}
                        value={qty}
                        onChange={(e) => setQty(id, Number(e.target.value || 1))}
                      />
                    </div>
                    <div className="text-sm font-semibold text-brand-600 sm:w-24">
                      {formatEGP(p!.priceCents * qty)}
                    </div>
                    <button
                      className="text-sm px-4 py-2.5 min-h-[44px] rounded-xl bg-red-50 hover:bg-red-100 active:bg-red-200 text-red-600 border border-red-100 transition-colors"
                      onClick={() => remove(id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}

              <div className="flex items-center justify-between pt-4">
                <div className="text-xl font-bold text-slate-800">Total: <span className="text-brand-600">{formatEGP(totalCents)}</span></div>
                <Link href="/checkout">
                  <Button>Proceed to Checkout</Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
