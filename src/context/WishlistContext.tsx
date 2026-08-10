import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { api } from '../lib/api'
import { mapApiProduct, type ApiProduct } from '../lib/products'
import { useAuth } from './AuthContext'
import type { WishlistLine, Product } from '../types'

interface ApiWishlistItem {
  id: string
  productId: string
  product: ApiProduct
}

function mapApiWishlistItem(item: ApiWishlistItem): WishlistLine {
  return { id: item.id, productId: item.productId, product: mapApiProduct(item.product) }
}

interface WishlistContextValue {
  lines: WishlistLine[]
  addToWishlist: (product: Product) => Promise<void>
  removeFromWishlist: (id: string) => Promise<void>
  isWishlisted: (productId: string) => boolean
}

const WishlistContext = createContext<WishlistContextValue | undefined>(undefined)

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [lines, setLines] = useState<WishlistLine[]>([])

  useEffect(() => {
    if (!user) {
      setLines([])
      return
    }
    api.get<ApiWishlistItem[]>('/api/wishlist').then((items) => {
      setLines(items.map(mapApiWishlistItem))
    })
  }, [user])

  const addToWishlist = async (product: Product) => {
    if (user) {
      const item = await api.post<ApiWishlistItem>('/api/wishlist', { productId: product.id })
      setLines((prev) => [...prev, mapApiWishlistItem(item)])
      return
    }

    setLines((prev) => {
      if (prev.some((l) => l.productId === product.id)) return prev
      return [...prev, { id: crypto.randomUUID(), productId: product.id, product }]
    })
  }

  const removeFromWishlist = async (id: string) => {
    if (user) {
      await api.delete(`/api/wishlist/${id}`)
    }
    setLines((prev) => prev.filter((l) => l.id !== id))
  }

  const isWishlisted = (productId: string) => lines.some((l) => l.productId === productId)

  const value: WishlistContextValue = { lines, addToWishlist, removeFromWishlist, isWishlisted }

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
}

export function useWishlist() {
  const ctx = useContext(WishlistContext)
  if (!ctx) throw new Error('useWishlist must be used within a WishlistProvider')
  return ctx
}
