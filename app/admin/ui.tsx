'use client'

import { useEffect, useState } from 'react'
import { Button, Input, Textarea } from '@/components/ui'
import { ImageUploadInput } from '@/components/ImageUploadInput'
import { MultiImageUpload } from '@/components/MultiImageUpload'
import { formatEGP } from '@/lib/money'

type Product = {
  id: string
  slug: string
  name: string
  description: string
  priceCents: number
  imageUrl: string
  imageUrls?: string | null
  active: boolean
  stock: number
  views: number
  viewsPercent: number
  ordersCount: number
}

type EditFormState = Omit<Partial<Product>, 'imageUrls'> & { imageUrls?: string[] }

type Order = {
  id: string
  email: string
  name: string
  phone?: string | null
  address: string
  city: string
  country: string
  totalCents: number
  paymentMethod?: string
  discountCents?: number
  couponCode?: string | null
  status: string
  createdAt: string
  items: { id: string; qty: number; priceCents: number; product: { name: string } }[]
}

export default function AdminClient() {
  const [products, setProducts] = useState<Product[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<EditFormState>({})
  const [newImageUrl, setNewImageUrl] = useState('')
  const [newImageUrls, setNewImageUrls] = useState<string[]>([])

  async function safeJson(res: Response): Promise<{ ok?: boolean; error?: unknown }> {
    const text = await res.text()
    try {
      return text ? JSON.parse(text) : {}
    } catch {
      throw new Error(res.status === 500 ? 'Server error. Check the database.' : 'Invalid response')
    }
  }

  async function markOrderDelivered(id: string) {
    setBusy(true)
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ status: 'DELIVERED' }),
      })
      const data = await safeJson(res)
      if (!data.ok) throw new Error('Failed to update')
      setMsg('Order marked as delivered ✓')
      await refresh()
    } catch (e: any) {
      setMsg(e?.message || 'Error')
    } finally {
      setBusy(false)
    }
  }

  async function refresh() {
    const [resP, resO] = await Promise.all([
      fetch('/api/admin/products'),
      fetch('/api/orders'),
    ])
    const p = await safeJson(resP) as { products?: Product[] }
    const o = await safeJson(resO) as { orders?: Order[] }
    setProducts(p.products ?? [])
    setOrders(o.orders ?? [])
  }

  useEffect(() => {
    refresh().catch(() => null)
  }, [])

  async function addProduct(formData: FormData) {
    setMsg(null)
    setBusy(true)
    try {
      const imageUrl = newImageUrl || String(formData.get('imageUrl') || '')
      if (!imageUrl) throw new Error('Add an image or link')
      const payload = {
        slug: String(formData.get('slug') || ''),
        name: String(formData.get('name') || ''),
        description: String(formData.get('description') || ''),
        priceCents: Math.round(Number(formData.get('price') || 0) * 100),
        imageUrl,
        imageUrls: newImageUrls,
        active: true,
        stock: Math.max(0, Number(formData.get('stock') ?? 999)),
      }
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await safeJson(res)
      if (!data.ok) {
        const err = data.error as { fieldErrors?: Record<string, string[]> } | string | undefined
        const errMsg = typeof err === 'string' ? err : err && typeof err === 'object' && err.fieldErrors ? Object.values(err.fieldErrors).flat().filter(Boolean).join('; ') : 'Failed to add product'
        throw new Error(errMsg || 'Failed to add product')
      }
      setMsg('Product added ✓')
      setNewImageUrl('')
      setNewImageUrls([])
      await refresh()
    } catch (e: any) {
      setMsg(e?.message || 'Error')
    } finally {
      setBusy(false)
    }
  }

  async function updateProduct(id: string) {
    setBusy(true)
    try {
      const p = products.find((x) => x.id === id)!
      const mainImg = (editForm.imageUrl !== undefined && editForm.imageUrl?.trim()) ? editForm.imageUrl : p.imageUrl
      const payload: Record<string, unknown> = {
        name: editForm.name ?? p.name,
        slug: editForm.slug ?? p.slug,
        description: editForm.description ?? p.description,
        imageUrl: mainImg,
        priceCents: editForm.priceCents ?? p.priceCents,
        active: editForm.active ?? p.active,
        stock: editForm.stock ?? p.stock,
      }
      if (editForm.imageUrls !== undefined) payload.imageUrls = editForm.imageUrls

      const res = await fetch(`/api/products/${id}`, {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await safeJson(res)
      if (!data.ok) {
        const err = data.error as { fieldErrors?: Record<string, string[]> } | string | undefined
        const errMsg = typeof err === 'string' ? err : err && typeof err === 'object' && err.fieldErrors ? Object.values(err.fieldErrors).flat().filter(Boolean).join('; ') : 'Failed to update'
        throw new Error(errMsg || 'Failed to update')
      }
      setMsg('Updated ✓')
      setEditingId(null)
      setEditForm({})
      await refresh()
    } catch (e: any) {
      setMsg(e?.message || 'Error')
    } finally {
      setBusy(false)
    }
  }

  async function deleteProduct(id: string, name: string) {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return
    setBusy(true)
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' })
      const data = await safeJson(res)
      if (!data.ok) throw new Error('Delete failed')
      setMsg('Deleted ✓')
      await refresh()
    } catch (e: any) {
      setMsg(e?.message || 'Error')
    } finally {
      setBusy(false)
    }
  }

  const totalViews = products.reduce((s, p) => s + (p.views || 0), 0)
  const totalSales = orders.reduce((s, o) => s + o.totalCents, 0)
  const pendingOrders = orders.filter((o) => o.status !== 'DELIVERED')
  const deliveredOrders = orders.filter((o) => o.status === 'DELIVERED')
  const deliveredSales = deliveredOrders.reduce((s, o) => s + o.totalCents, 0)

  return (
    <div className="mt-8 space-y-8">
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-brand-50 rounded-2xl p-4 border border-brand-100">
          <p className="text-sm text-brand-600 font-medium">Products</p>
          <p className="text-2xl font-bold text-slate-800">{products.length}</p>
        </div>
        <div className="bg-amber-50 rounded-2xl p-4 border border-amber-100">
          <p className="text-sm text-amber-600 font-medium">To-Do Orders</p>
          <p className="text-2xl font-bold text-slate-800">{pendingOrders.length}</p>
        </div>
        <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100">
          <p className="text-sm text-emerald-600 font-medium">Delivered</p>
          <p className="text-2xl font-bold text-slate-800">{deliveredOrders.length}</p>
        </div>
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
          <p className="text-sm text-slate-600 font-medium">Total Sales</p>
          <p className="text-2xl font-bold text-slate-800">{formatEGP(totalSales)}</p>
        </div>
        <div className="bg-violet-50 rounded-2xl p-4 border border-violet-100">
          <p className="text-sm text-violet-600 font-medium">Views</p>
          <p className="text-2xl font-bold text-slate-800">{totalViews}</p>
        </div>
      </div>

    <div className="grid lg:grid-cols-2 gap-6">
      <section className="bg-stone-50 rounded-3xl p-6 border border-stone-100">
        <h2 className="text-xl font-bold text-slate-800">Add Product</h2>
        <form
          className="mt-4 space-y-3"
          onSubmit={(e) => {
            e.preventDefault()
            addProduct(new FormData(e.currentTarget))
            e.currentTarget.reset()
            setNewImageUrl('')
            setNewImageUrls([])
          }}
        >
          <Input name="name" placeholder="Product name" required />
          <Input name="slug" placeholder="slug e.g. lavender-soap" required />
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Main Image</label>
            <ImageUploadInput
              value={newImageUrl}
              onChange={setNewImageUrl}
              placeholder="Image URL or upload"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Extra Images</label>
            <MultiImageUpload value={newImageUrls} onChange={setNewImageUrls} placeholder="Add another image" />
          </div>
          <Input name="price" placeholder="Price in EGP (e.g. 199)" type="number" step="0.01" required />
          <Input name="stock" placeholder="Stock (e.g. 50)" type="number" min={0} defaultValue={999} />
          <Textarea name="description" placeholder="Product description" required rows={3} />
          <Button disabled={busy} className="w-full">{busy ? '...' : 'Add'}</Button>
          {msg && <div className="text-sm text-slate-600">{msg}</div>}
        </form>
      </section>

      <section className="bg-stone-50 rounded-3xl p-6 border border-stone-100">
        <h2 className="text-xl font-bold text-slate-800">Products & Analytics</h2>
        <div className="mt-2 text-sm text-slate-500 mb-4">Total views: {totalViews}</div>
        <div className="mt-4 space-y-3 max-h-[500px] overflow-auto pr-1">
          {products.map((p) => (
            <div key={p.id} className="bg-white border border-stone-100 rounded-2xl p-3">
              {editingId === p.id ? (
                <div className="space-y-2">
                  <Input
                    value={editForm.name ?? p.name}
                    onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))}
                    placeholder="Name"
                  />
                  <Input
                    value={editForm.slug ?? p.slug}
                    onChange={(e) => setEditForm((f) => ({ ...f, slug: e.target.value }))}
                    placeholder="slug"
                  />
                  <div>
                    <label className="text-xs text-slate-500">Main Image</label>
                    <ImageUploadInput
                      value={'imageUrl' in editForm ? (editForm.imageUrl ?? '') : p.imageUrl}
                      onChange={(url) => setEditForm((f) => ({ ...f, imageUrl: url }))}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-500">Extra Images</label>
                    <MultiImageUpload
                      value={'imageUrls' in editForm
                        ? (Array.isArray(editForm.imageUrls) ? editForm.imageUrls : [])
                        : (typeof p.imageUrls === 'string' ? (() => { try { return JSON.parse(p.imageUrls) } catch { return [] } })() : [])}
                      onChange={(urls) => setEditForm((f) => ({ ...f, imageUrls: urls }))}
                    />
                  </div>
                  <Input
                    type="number"
                    step="0.01"
                    value={editForm.priceCents !== undefined ? editForm.priceCents / 100 : p.priceCents / 100}
                    onChange={(e) => setEditForm((f) => ({ ...f, priceCents: Math.round(parseFloat(e.target.value || '0') * 100) }))}
                    placeholder="Price"
                  />
                  <Input
                    type="number"
                    min={0}
                    value={editForm.stock ?? p.stock ?? 0}
                    onChange={(e) => setEditForm((f) => ({ ...f, stock: Math.max(0, parseInt(e.target.value || '0', 10)) }))}
                    placeholder="Stock"
                  />
                  <Textarea
                    value={editForm.description ?? p.description}
                    onChange={(e) => setEditForm((f) => ({ ...f, description: e.target.value }))}
                    placeholder="Description"
                    rows={3}
                  />
                  <div className="flex gap-2">
                    <Button onClick={() => updateProduct(p.id)} disabled={busy}>Save</Button>
                    <button
                      type="button"
                      onClick={() => { setEditingId(null); setEditForm({}) }}
                      className="text-sm text-slate-500 hover:text-slate-700"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.imageUrl} alt={p.name} className="h-12 w-12 rounded-xl object-cover shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-slate-800">{p.name}</div>
                    <div className="text-xs text-slate-500">/{p.slug}</div>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-xs">
                      <span className="text-brand-600">👁 {p.views || 0} views</span>
                      <span className="text-slate-500">{p.viewsPercent || 0}% of views</span>
                      <span className="text-slate-500">📦 {p.ordersCount || 0} orders</span>
                      <span className={(p.stock ?? 999) <= 5 ? 'text-amber-600 font-medium' : 'text-slate-500'}>📦 Stock: {p.stock ?? 0}</span>
                    </div>
                  </div>
                  <div className="text-sm font-semibold text-brand-600 shrink-0">{formatEGP(p.priceCents)}</div>
                  <div className="flex gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
  let extra: string[] = []
  try { if (typeof p.imageUrls === 'string') extra = JSON.parse(p.imageUrls) }
  catch { /* ignore */ }
  setEditingId(p.id)
  setEditForm({ name: p.name, slug: p.slug, description: p.description, imageUrl: p.imageUrl, imageUrls: extra, priceCents: p.priceCents, active: p.active, stock: p.stock ?? 0 })
}}
                      className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                      title="Edit"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteProduct(p.id, p.name)}
                      disabled={busy}
                      className="p-2 rounded-lg text-red-500 hover:bg-red-50"
                      title="Delete"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
          {products.length === 0 && <div className="text-slate-600">No products.</div>}
        </div>
      </section>

      <section className="bg-stone-50 rounded-3xl p-6 lg:col-span-2 border border-stone-100">
        <h2 className="text-xl font-bold text-slate-800">Orders TO-DO ({pendingOrders.length})</h2>
        <p className="text-sm text-slate-500 mt-1">Mark as delivered when shipped</p>
        <div className="mt-4 space-y-4 max-h-[400px] overflow-auto">
          {pendingOrders.map((o) => (
            <div key={o.id} className="bg-white border border-amber-200 rounded-2xl p-4">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2">
                <div>
                  <div className="font-semibold">{o.name} — {o.email}</div>
                  <div className="text-xs text-slate-500">{new Date(o.createdAt).toLocaleString('en-GB')}</div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-sm font-semibold text-brand-600">{formatEGP(o.totalCents)}</span>
                  <button
                    type="button"
                    onClick={() => markOrderDelivered(o.id)}
                    disabled={busy}
                    className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium disabled:opacity-50"
                  >
                    ✓ Delivered
                  </button>
                </div>
              </div>
              <div className="mt-3 text-sm text-slate-600">
                {o.items.map((i) => (
                  <div key={i.id} className="flex justify-between">
                    <span>{i.product.name} x{i.qty}</span>
                    <span>{formatEGP(i.priceCents * i.qty)}</span>
                  </div>
                ))}
              </div>
              <div className="mt-3 text-xs text-slate-500">
                {o.address} — {o.city} — {o.country}
                {o.phone && ` — ${o.phone}`}
              </div>
              {(o.paymentMethod || o.couponCode) && (
                <div className="mt-2 text-xs text-slate-500">
                  {o.paymentMethod === 'CASH' && '💵 Cash'}
                  {o.paymentMethod === 'CARD' && '💳 Card'}
                  {o.couponCode && ` • Code: ${o.couponCode}`}
                </div>
              )}
            </div>
          ))}
          {pendingOrders.length === 0 && <div className="text-slate-500 py-8 text-center">All orders delivered ✓</div>}
        </div>

        {deliveredOrders.length > 0 && (
          <>
            <h3 className="text-lg font-bold text-slate-800 mt-8 mb-3">Delivered ({deliveredOrders.length}) — {formatEGP(deliveredSales)}</h3>
            <div className="space-y-2 max-h-[200px] overflow-auto">
              {deliveredOrders.slice(0, 10).map((o) => (
                <div key={o.id} className="flex items-center justify-between bg-emerald-50/50 border border-emerald-100 rounded-xl px-4 py-2">
                  <span className="text-emerald-600 font-medium">✓</span>
                  <span className="text-sm truncate flex-1 mx-2">{o.name} — {formatEGP(o.totalCents)}</span>
                  <span className="text-xs text-slate-500">{new Date(o.createdAt).toLocaleDateString('en-GB')}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </section>
    </div>
    </div>
  )
}
