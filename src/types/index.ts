export type Tag = 'sale' | 'new' | null

export interface Product {
  id: string
  name: string
  category: string
  price: number
  salePrice?: number
  image: string
  tag: Tag
  sizes: string[]
  description: string
}

export interface CartLine {
  productId: string
  size: string
  quantity: number
}

export interface Category {
  id: string
  label: string
  image: string
}
