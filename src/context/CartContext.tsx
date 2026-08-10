import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { api } from '../lib/api'
import { mapApiProduct, type ApiProduct } from '../lib/products'
import { useAuth } from './AuthContext'
import type { CartLine, Product } from '../types'

interface ApiCartItem {
  id: string
  productId: string
  size: string
  quantity: number
  product: ApiProduct
}

function mapApiCartItem(item: ApiCartItem): CartLine {
  return {
    id: item.id,
    productId: item.productId,
    size: item.size,
    quantity: item.quantity,
    product: mapApiProduct(item.product),
  }
}

interface CartContextValue {
  lines: CartLine[]
  addToCart: (product: Product, size: string, quantity?: number) => Promise<void>
  removeFromCart: (id: string) => Promise<void>
  updateQuantity: (id: string, quantity: number) => Promise<void>
  clearCart: () => Promise<void>
  itemCount: number
  subtotal: number
}

const CartContext = createContext<CartContextValue | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [lines, setLines] = useState<CartLine[]>([])

  // Re-sync whenever login state changes. Logging in fetches the account's
  // real cart from the backend; logging out resets to an empty cart rather
  // than falling back to whatever guest lines existed before login - merging
  // a guest cart into an account cart on login is a deliberate product
  // decision that wasn't specified, so it's a known follow-up, not something
  // guessed at here.
  useEffect(() => {
    if (!user) {
      setLines([])
      return
    }
    api.get<ApiCartItem[]>('/api/cart').then((items) => {
      setLines(items.map(mapApiCartItem))
    })
  }, [user])

  const addToCart = async (product: Product, size: string, quantity = 1) => {
    if (user) {
      const item = await api.post<ApiCartItem>('/api/cart', { productId: product.id, size, quantity })
      setLines((prev) => [...prev, mapApiCartItem(item)])
      return
    }

    // Guest cart: merge into an existing line for the same product+size
    // instead of adding a duplicate row, matching how the backend cart
    // already behaves for repeated adds.
    setLines((prev) => {
      const existing = prev.find((l) => l.productId === product.id && l.size === size)
      if (existing) {
        return prev.map((l) =>
          l.productId === product.id && l.size === size ? { ...l, quantity: l.quantity + quantity } : l,
        )
      }
      return [...prev, { id: crypto.randomUUID(), productId: product.id, size, quantity, product }]
    })
  }

  const removeFromCart = async (id: string) => {
    if (user) {
      await api.delete(`/api/cart/${id}`)
    }
    setLines((prev) => prev.filter((l) => l.id !== id))
  }

  const updateQuantity = async (id: string, quantity: number) => {
    if (quantity <= 0) {
      await removeFromCart(id)
      return
    }
    if (user) {
      await api.patch(`/api/cart/${id}`, { quantity })
    }
    setLines((prev) => prev.map((l) => (l.id === id ? { ...l, quantity } : l)))
  }

  const clearCart = async () => {
    if (user) {
      await api.delete('/api/cart')
    }
    setLines([])
  }

  const itemCount = useMemo(() => lines.reduce((sum, l) => sum + l.quantity, 0), [lines])

  const subtotal = useMemo(
    () => lines.reduce((sum, l) => sum + (l.product.salePrice ?? l.product.price) * l.quantity, 0),
    [lines],
  )

  const value: CartContextValue = {
    lines,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    itemCount,
    subtotal,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within a CartProvider')
  return ctx
}
