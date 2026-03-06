'use client'

import { Button } from './ui'
import { useCart } from './cart'
import { useToast } from './Toast'

export function ProductAddButton({ productId, productName, stock = 999 }: { productId: string; productName?: string; stock?: number }) {
  const { add } = useCart()
  const { toast } = useToast()
  const outOfStock = stock <= 0

  const handleAdd = () => {
    if (outOfStock) return
    add(productId)
    toast(productName ? `Added "${productName}" to cart` : 'Added to cart')
  }

  return (
    <div>
      {!outOfStock && <p className="text-sm text-slate-500 mb-2">In stock: {stock}</p>}
      <Button onClick={handleAdd} disabled={outOfStock} className="w-full">
        {outOfStock ? 'Out of stock' : 'Add to Cart'}
      </Button>
    </div>
  )
}
