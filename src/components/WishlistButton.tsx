import type { MouseEvent } from 'react'
import { useWishlist } from '../context/WishlistContext'
import type { Product } from '../types'

export default function WishlistButton({ product, className = '' }: { product: Product; className?: string }) {
  const { lines, addToWishlist, removeFromWishlist, isWishlisted } = useWishlist()
  const active = isWishlisted(product.id)

  const handleClick = (e: MouseEvent) => {
    // ProductCard renders this inside a <Link>; stop the click from also
    // triggering navigation to the product page.
    e.preventDefault()
    e.stopPropagation()

    if (active) {
      const line = lines.find((l) => l.productId === product.id)
      if (line) removeFromWishlist(line.id)
      return
    }

    addToWishlist(product)
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={active ? 'Remove from wishlist' : 'Add to wishlist'}
      aria-pressed={active}
      className={className}
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={active ? 'fill-sand stroke-sand' : 'fill-none stroke-muted'}
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    </button>
  )
}
