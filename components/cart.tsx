'use client'

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'

type CartState = Record<string, number>

type CartCtx = {
  cart: CartState
  add: (productId: string, qty?: number) => void
  remove: (productId: string) => void
  setQty: (productId: string, qty: number) => void
  clear: () => void
  totalItems: number
}

const Ctx = createContext<CartCtx | null>(null)

const LS_KEY = 'np_cart_v1'

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartState>({})

  useEffect(() => {
    const raw = localStorage.getItem(LS_KEY)
    if (raw) {
      try {
        setCart(JSON.parse(raw))
      } catch {
        // ignore
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem(LS_KEY, JSON.stringify(cart))
  }, [cart])

  const api = useMemo<CartCtx>(() => {
    const add = (productId: string, qty = 1) =>
      setCart((c) => ({ ...c, [productId]: (c[productId] || 0) + qty }))

    const remove = (productId: string) =>
      setCart((c) => {
        const next = { ...c }
        delete next[productId]
        return next
      })

    const setQty = (productId: string, qty: number) =>
      setCart((c) => {
        if (qty <= 0) {
          const next = { ...c }
          delete next[productId]
          return next
        }
        return { ...c, [productId]: qty }
      })

    const clear = () => setCart({})

    const totalItems = Object.values(cart).reduce((a, b) => a + b, 0)

    return { cart, add, remove, setQty, clear, totalItems }
  }, [cart])

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>
}

export function useCart() {
  const v = useContext(Ctx)
  if (!v) throw new Error('useCart must be used within CartProvider')
  return v
}
