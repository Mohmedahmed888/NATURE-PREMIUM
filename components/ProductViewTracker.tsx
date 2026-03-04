'use client'

import { useEffect } from 'react'

export function ProductViewTracker({ productId }: { productId: string }) {
  useEffect(() => {
    fetch(`/api/products/${productId}/view`, { method: 'POST' }).catch(() => null)
  }, [productId])
  return null
}
