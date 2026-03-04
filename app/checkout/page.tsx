'use client'

import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { useCart } from '@/components/cart'
import { Button, Card, Input } from '@/components/ui'
import { formatEGP } from '@/lib/money'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { OptimizedImage } from '@/components/OptimizedImage'

type Product = { id: string; name: string; priceCents: number; imageUrl?: string }

function shortOrderNumber(id: string) {
  return `#${id.slice(-8).toUpperCase()}`
}

export default function CheckoutPage() {
  const { cart, clear } = useCart()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState<{ orderId: string; orderNumber: string } | null>(null)
  const [err, setErr] = useState<string | null>(null)
  const [couponCode, setCouponCode] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discountCents: number } | null>(null)
  const [couponErr, setCouponErr] = useState<string | null>(null)

  const [prefill, setPrefill] = useState<{ name: string; email: string } | null>(null)

  useEffect(() => {
    fetch('/api/products')
      .then(async (r) => {
        const text = await r.text()
        try { return text ? JSON.parse(text) : {} } catch { return {} }
      })
      .then((d) => setProducts(d.products || []))
      .catch(() => setProducts([]))
  }, [])

  useEffect(() => {
    fetch('/api/account/me')
      .then(async (r) => {
        const text = await r.text()
        try { return text ? JSON.parse(text) : {} } catch { return {} }
      })
      .then((d) => d.ok && d.user && setPrefill({ name: d.user.name, email: d.user.email }))
      .catch(() => null)
  }, [])

  const map = useMemo(() => new Map(products.map((p) => [p.id, p])), [products])
  const items = Object.entries(cart)
    .map(([id, qty]) => ({ p: map.get(id), productId: id, qty }))
    .filter((x) => x.p)

  const subtotalCents = items.reduce((s, it) => s + it.p!.priceCents * it.qty, 0)
  const discountCents = appliedCoupon?.discountCents ?? 0
  const totalCents = Math.max(0, subtotalCents - discountCents)

  async function applyCoupon() {
    if (!couponCode.trim()) return
    setCouponErr(null)
    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ code: couponCode.trim(), totalCents: subtotalCents }),
      })
      const text = await res.text()
      const data = text ? (() => { try { return JSON.parse(text) } catch { return {} } })() : {}
      if (data.ok) {
        setAppliedCoupon({ code: data.code, discountCents: data.discountCents })
      } else {
        if (data.error === 'invalid') setCouponErr('كود غير صحيح')
        else if (data.error === 'expired') setCouponErr('الكود منتهي')
        else if (data.error === 'used_up') setCouponErr('تم استهلاك الكود')
        else if (data.error === 'min_order') setCouponErr(`الحد الأدنى للطلب ${formatEGP(data.minOrderCents)}`)
        else setCouponErr('كود غير صالح')
      }
    } catch {
      setCouponErr('حصل خطأ')
    }
  }

  function removeCoupon() {
    setAppliedCoupon(null)
    setCouponCode('')
    setCouponErr(null)
  }

  async function submit(formData: FormData) {
    setErr(null)
    if (items.length === 0) {
      setErr('السلة فاضية.')
      return
    }
    setLoading(true)
    try {
      const payload = {
        email: String(formData.get('email') || ''),
        name: String(formData.get('name') || ''),
        phone: String(formData.get('phone') || '') || undefined,
        address: String(formData.get('address') || ''),
        city: String(formData.get('city') || ''),
        country: String(formData.get('country') || ''),
        paymentMethod: 'CASH',
        couponCode: appliedCoupon ? appliedCoupon.code : undefined,
        items: items.map((i) => ({ productId: i.productId, qty: i.qty })),
      }
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const text = await res.text()
      let data: { ok?: boolean; order?: { id: string }; error?: string; product?: string; available?: number } = {}
      try {
        data = text ? JSON.parse(text) : {}
      } catch {
        throw new Error('فشل الاتصال بالخادم. حاول مرة أخرى.')
      }
      if (!data.ok) {
        if (res.status === 429) throw new Error('محاولات كثيرة. انتظر دقيقة.')
        if (data.error === 'out_of_stock' && data.product && data.available !== undefined) {
          throw new Error(`"${data.product}" نفد من المخزن. المتوفر: ${data.available}`)
        }
        throw new Error(data.error === 'too_many_requests' ? 'محاولات كثيرة. انتظر دقيقة.' : 'فشل إنشاء الطلب')
      }
      const order = data.order
      if (!order?.id) throw new Error('فشل إنشاء الطلب')
      clear()
      setDone({ orderId: order.id, orderNumber: shortOrderNumber(order.id) })
    } catch (e: any) {
      setErr(e?.message || 'حصل خطأ')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full grid grid-rows-[auto_1fr_auto]">
      <Navbar />
      <main id="main-content" className="w-full mx-auto max-w-6xl px-4 sm:px-6 py-8 pb-16">
        <h1 className="text-2xl font-bold text-slate-800 mb-6">إتمام الطلب</h1>

        <div className="flex flex-col lg:flex-row-reverse gap-8 lg:gap-12">
          {/* ملخص الطلب - ثابت على الشاشات الكبيرة مثل أمازون */}
          <aside className="lg:w-[380px] lg:shrink-0">
            <div className="lg:sticky lg:top-24 bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-stone-100 bg-stone-50/50">
                <h2 className="font-bold text-slate-800">ملخص الطلب</h2>
              </div>
              <div className="p-5">
                {items.length === 0 ? (
                  <p className="text-slate-500 text-sm">السلة فاضية. <Link className="text-brand-600 underline" href="/cart">عرض السلة</Link></p>
                ) : (
                  <>
                    <div className="space-y-4 max-h-[240px] overflow-y-auto">
                      {items.map((it) => (
                        <div key={it.productId} className="flex gap-3">
                          <div className="w-16 h-16 rounded-lg bg-stone-100 shrink-0 overflow-hidden relative">
                            {it.p!.imageUrl ? (
                              <OptimizedImage src={it.p!.imageUrl} alt={it.p!.name} fill className="object-cover" sizes="64px" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">صورة</div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-800 truncate">{it.p!.name}</p>
                            <p className="text-xs text-slate-500">الكمية: {it.qty}</p>
                            <p className="text-sm font-semibold text-brand-600">{formatEGP(it.p!.priceCents * it.qty)}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 pt-4 border-t border-stone-200">
                      <label className="block text-sm font-medium text-slate-700 mb-2">كود الخصم</label>
                      {appliedCoupon ? (
                        <div className="flex items-center justify-between gap-2 bg-emerald-50 rounded-xl px-3 py-2 border border-emerald-100">
                          <span className="text-emerald-700 font-medium text-sm">{appliedCoupon.code}</span>
                          <span className="text-emerald-600 font-semibold">-{formatEGP(appliedCoupon.discountCents)}</span>
                          <button type="button" onClick={removeCoupon} className="text-red-500 text-xs hover:underline">إزالة</button>
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <Input
                            value={couponCode}
                            onChange={(e) => { setCouponCode(e.target.value); setCouponErr(null) }}
                            placeholder="أدخل كود الخصم"
                            className="flex-1 text-sm"
                          />
                          <Button type="button" onClick={applyCoupon} disabled={!couponCode.trim()} className="shrink-0">تطبيق</Button>
                        </div>
                      )}
                      {couponErr && <p className="text-red-500 text-xs mt-1">{couponErr}</p>}
                    </div>

                    <div className="mt-4 pt-4 border-t border-stone-200 space-y-2">
                      <div className="flex justify-between text-sm text-slate-600">
                        <span>المجموع الفرعي</span>
                        <span className={discountCents > 0 ? 'line-through text-slate-400' : ''}>{formatEGP(subtotalCents)}</span>
                      </div>
                      {discountCents > 0 && (
                        <div className="flex justify-between text-sm text-emerald-600">
                          <span>الخصم</span>
                          <span>-{formatEGP(discountCents)}</span>
                        </div>
                      )}
                      <div className="flex justify-between font-bold text-slate-800 pt-2">
                        <span>الإجمالي</span>
                        <span className="text-lg text-brand-600">{formatEGP(totalCents)}</span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </aside>

          {/* نموذج التوصيل */}
          <div className="flex-1 min-w-0">
            <Card className="p-6 sm:p-8 rounded-2xl bg-white border border-stone-200 shadow-sm">
              {done ? (
                <div className="text-center py-8">
                  <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4 text-emerald-600 text-2xl">✓</div>
                  <h2 className="text-xl font-bold text-slate-800">تم تأكيد الطلب</h2>
                  <p className="text-slate-600 mt-1">رقم الطلب: <span className="font-mono font-semibold">{done.orderNumber}</span></p>
                  <Link href="/" className="inline-block mt-6 px-6 py-2 rounded-xl bg-brand-600 text-white font-medium hover:bg-brand-500">العودة للتسوق</Link>
                </div>
              ) : (
                <form
                  key={prefill ? 'filled' : 'empty'}
                  className="space-y-4"
                  onSubmit={(e) => {
                    e.preventDefault()
                    submit(new FormData(e.currentTarget))
                  }}
                >
                  <div>
                    <h3 className="font-semibold text-slate-800 mb-3">معلومات التوصيل</h3>
                    <div className="space-y-3">
                      <Input name="name" placeholder="الاسم الكامل" defaultValue={prefill?.name} required />
                      <Input name="email" placeholder="البريد الإلكتروني" type="email" defaultValue={prefill?.email} required />
                      <Input name="phone" placeholder="رقم التليفون" type="tel" />
                      <Input name="address" placeholder="العنوان بالتفصيل" required />
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <Input name="city" placeholder="المدينة" required />
                        <Input name="country" placeholder="الدولة" defaultValue="مصر" required />
                      </div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <p className="text-sm text-slate-500 mb-2">الدفع كاش عند الاستلام</p>
                    {err && <div className="text-red-500 text-sm mb-2">{err}</div>}
                    <Button disabled={loading} className="w-full py-3 text-base">
                      {loading ? 'جاري التأكيد...' : `تأكيد الطلب — ${formatEGP(totalCents)}`}
                    </Button>
                  </div>
                </form>
              )}
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
