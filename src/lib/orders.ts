import type { ApiProduct } from './products'

export interface ApiOrderItem {
  id: string
  productId: string
  size: string
  quantity: number
  price: number
  product: ApiProduct
}

export interface ApiOrder {
  id: string
  status: string
  total: number
  createdAt: string
  items: ApiOrderItem[]
}
