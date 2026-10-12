import { api } from './api'
import type { Product } from '../types'

// Shape returned by the Express/Prisma backend (backend/prisma/schema.prisma),
// which differs from the frontend's existing `Product` type (single `image`,
// a single `tag`) that the rest of the app (ProductCard, Cart, etc.) already
// renders against.
export interface ApiProduct {
  id: string
  name: string
  description: string | null
  price: number
  salePrice: number | null
  category: string
  // Lowercase collection slug (e.g. "uf", "fsu") for the college capsule
  // collections; null for the regular catalog.
  collection: string | null
  sizes: string[]
  images: string[]
  isNew: boolean
  inStock: boolean
}

export function mapApiProduct(p: ApiProduct): Product {
  return {
    id: p.id,
    name: p.name,
    category: p.category,
    collection: p.collection ?? undefined,
    price: p.price,
    salePrice: p.salePrice ?? undefined,
    images: p.images,
    // The frontend only supports a single badge per product; a product is
    // only ever tagged "new" OR "sale" (not both), so isNew takes priority
    // since that's a merchandising choice (highlighting new arrivals) rather
    // than a pricing state.
    tag: p.isNew ? 'new' : p.salePrice != null ? 'sale' : null,
    sizes: p.sizes,
    description: p.description ?? '',
  }
}

export async function fetchProducts(params?: {
  category?: string
  collection?: string
  isNew?: boolean
  search?: string
}): Promise<Product[]> {
  const query = new URLSearchParams()
  if (params?.category) query.set('category', params.category)
  if (params?.collection) query.set('collection', params.collection)
  if (params?.isNew) query.set('new', 'true')
  if (params?.search) query.set('search', params.search)
  const qs = query.toString()
  const apiProducts = await api.get<ApiProduct[]>(`/api/products${qs ? `?${qs}` : ''}`)
  return apiProducts.map(mapApiProduct)
}

export async function fetchProduct(id: string): Promise<Product> {
  const apiProduct = await api.get<ApiProduct>(`/api/products/${id}`)
  return mapApiProduct(apiProduct)
}
