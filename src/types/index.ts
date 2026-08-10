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
  // The backend's CartItem.id when this line is synced to a logged-in
  // user's cart, or a locally-generated id (crypto.randomUUID()) for a
  // guest line that only exists in memory/localStorage.
  id: string
  productId: string
  size: string
  quantity: number
  // Carried on the line itself (rather than looked up from a separate
  // product list) so cart/wishlist rendering works the same way whether
  // the line came from the backend (which nests `product` on cart items)
  // or was added locally as a guest.
  product: Product
}

export interface WishlistLine {
  id: string
  productId: string
  product: Product
}

export interface Category {
  id: string
  label: string
  image: string
}

export interface User {
  id: string
  email: string
  firstName: string | null
  lastName: string | null
}
