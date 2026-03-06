'use client'

import { useEffect, useState } from 'react'
import { Button, Input } from '@/components/ui'
import { formatEGP } from '@/lib/money'

type Coupon = {
  id: string
  code: string
  type: string
  value: number
  minOrderCents: number
  maxUses: number | null
  usedCount: number
  expiresAt: string | null
  active: boolean
  createdAt: string
}

export default function AdminCouponsClient() {
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)

  async function refresh() {
    const res = await fetch('/api/coupons')
    const data = await res.json()
    setCoupons(data.coupons || [])
  }

  useEffect(() => {
    refresh()
  }, [])

  async function addCoupon(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setMsg(null)
    setBusy(true)
    const form = e.currentTarget
    const formData = new FormData(form)
    try {
      const type = formData.get('type') as string
      const value = type === 'PERCENT' ? Number(formData.get('value')) : Math.round(Number(formData.get('value')) * 100)
      const expiresRaw = formData.get('expiresAt') as string | null
      const expiresAt = expiresRaw?.trim() && !isNaN(Date.parse(expiresRaw)) ? expiresRaw : null

      const payload = {
        code: String(formData.get('code')).toUpperCase().trim(),
        type,
        value,
        minOrderCents: Math.round(Number(formData.get('minOrder') || 0) * 100),
        maxUses: formData.get('maxUses') ? Number(formData.get('maxUses')) : null,
        expiresAt,
      }
      const res = await fetch('/api/coupons', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!data.ok) {
        if (data.error === 'code_exists') throw new Error('Code already exists')
        throw new Error(data.error || 'Failed')
      }
      setMsg('Coupon created ✓')
      form.reset()
      await refresh()
    } catch (e: any) {
      setMsg(e?.message || 'Error')
    } finally {
      setBusy(false)
    }
  }

  async function toggleActive(id: string, active: boolean) {
    setBusy(true)
    try {
      const res = await fetch(`/api/coupons/${id}`, {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ active }),
      })
      const data = await res.json()
      if (!data.ok) throw new Error('Failed')
      setMsg(active ? 'Coupon enabled ✓' : 'Coupon disabled')
      await refresh()
    } catch (e: any) {
      setMsg(e?.message || 'Error')
    } finally {
      setBusy(false)
    }
  }

  async function deleteCoupon(id: string) {
    if (!confirm('Delete this coupon?')) return
    setBusy(true)
    try {
      const res = await fetch(`/api/coupons/${id}`, { method: 'DELETE' })
      const data = await res.json()
      if (!data.ok) throw new Error('Delete failed')
      setMsg('Deleted ✓')
      await refresh()
    } catch (e: any) {
      setMsg(e?.message || 'Error')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="mt-8 space-y-8">
      <section>
        <h2 className="font-bold text-slate-800 mb-4">Create Coupon</h2>
        <form onSubmit={addCoupon} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Input name="code" placeholder="Code (e.g. SUMMER20)" required />
          <div>
            <select
              name="type"
              className="w-full rounded-xl px-4 py-3 bg-stone-50 border border-stone-200"
              required
            >
              <option value="PERCENT">Percent %</option>
              <option value="FIXED">Fixed amount</option>
            </select>
          </div>
          <Input name="value" type="number" placeholder="Value (10 or 50)" required />
          <Input name="minOrder" type="number" step="0.01" placeholder="Min order (EGP)" defaultValue="0" />
          <Input name="maxUses" type="number" placeholder="Max uses (empty=unlimited)" />
          <input
            name="expiresAt"
            type="date"
            className="w-full rounded-xl px-4 py-3 bg-stone-50 border border-stone-200 text-slate-800"
            aria-label="Expiry date (optional)"
          />
          <div className="sm:col-span-2">
            <Button type="submit" disabled={busy}>{busy ? '...' : 'Create'}</Button>
          </div>
        </form>
        {msg && <p className="mt-2 text-sm text-slate-600">{msg}</p>}
      </section>

      <section>
        <h2 className="font-bold text-slate-800 mb-4">Current Coupons</h2>
        <div className="space-y-2">
          {coupons.map((c) => (
            <div
              key={c.id}
              className="flex items-center justify-between gap-4 bg-stone-50 rounded-xl p-4 border border-stone-100"
            >
              <div>
                <span className="font-mono font-bold text-brand-600">{c.code}</span>
                <span className="mr-2 text-slate-600">
                  — {c.type === 'PERCENT' ? `${c.value}%` : formatEGP(c.value)}
                  {c.minOrderCents > 0 && ` (min ${formatEGP(c.minOrderCents)})`}
                </span>
                <span className="text-xs text-slate-500">
                  Used {c.usedCount}
                  {c.maxUses != null ? ` / ${c.maxUses}` : ''}
                  {c.expiresAt && ` — expires ${new Date(c.expiresAt).toLocaleDateString('en-GB')}`}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => toggleActive(c.id, !c.active)}
                  disabled={busy}
                  className={`text-sm px-3 py-1 rounded-lg ${c.active ? 'bg-amber-100 text-amber-700 hover:bg-amber-200' : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'}`}
                >
                  {c.active ? 'Disable' : 'Enable'}
                </button>
                <button
                  type="button"
                  onClick={() => deleteCoupon(c.id)}
                  disabled={busy}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
          {coupons.length === 0 && <p className="text-slate-500">No coupons</p>}
        </div>
      </section>
    </div>
  )
}
