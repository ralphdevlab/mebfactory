import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import type { CartLine } from '../types'
import { getProductById } from '../data/products'

interface CartContextValue {
  lines: CartLine[]
  addLine: (productId: string, size: string, quantity?: number) => void
  removeLine: (productId: string, size: string) => void
  updateQuantity: (productId: string, size: string, quantity: number) => void
  itemCount: number
  subtotal: number
}

const CartContext = createContext<CartContextValue | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([])

  const addLine = (productId: string, size: string, quantity = 1) => {
    setLines((prev) => {
      const existing = prev.find((l) => l.productId === productId && l.size === size)
      if (existing) {
        return prev.map((l) =>
          l.productId === productId && l.size === size
            ? { ...l, quantity: l.quantity + quantity }
            : l,
        )
      }
      return [...prev, { productId, size, quantity }]
    })
  }

  const removeLine = (productId: string, size: string) => {
    setLines((prev) => prev.filter((l) => !(l.productId === productId && l.size === size)))
  }

  const updateQuantity = (productId: string, size: string, quantity: number) => {
    if (quantity <= 0) {
      removeLine(productId, size)
      return
    }
    setLines((prev) =>
      prev.map((l) => (l.productId === productId && l.size === size ? { ...l, quantity } : l)),
    )
  }

  const itemCount = useMemo(() => lines.reduce((sum, l) => sum + l.quantity, 0), [lines])

  const subtotal = useMemo(
    () =>
      lines.reduce((sum, l) => {
        const product = getProductById(l.productId)
        if (!product) return sum
        const price = product.salePrice ?? product.price
        return sum + price * l.quantity
      }, 0),
    [lines],
  )

  const value: CartContextValue = { lines, addLine, removeLine, updateQuantity, itemCount, subtotal }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within a CartProvider')
  return ctx
}
