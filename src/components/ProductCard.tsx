import { Link } from 'react-router-dom'
import type { Product } from '../types'
import ProductTag from './ProductTag'
import WishlistButton from './WishlistButton'

export default function ProductCard({ product }: { product: Product }) {
  const onSale = product.salePrice !== undefined
  const image = product.images[0]

  return (
    <Link to={`/product/${product.id}`} className="group block">
      <div className="relative aspect-[3/4] overflow-hidden rounded-[6px] bg-hero">
        {image && <img src={image} alt={product.name} className="h-full w-full object-cover" />}
        <ProductTag tag={product.tag} />
        <WishlistButton
          product={product}
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-surface/80"
        />
      </div>
      <div className="pt-2 pb-3">
        <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-muted">{product.category}</p>
        <p className="mt-1 text-xs font-normal text-ink">{product.name}</p>
        <div className="mt-1 flex items-center gap-2">
          {onSale && <span className="text-xs font-normal text-muted line-through">${product.price}</span>}
          <span className={`text-xs font-medium ${onSale ? 'text-sand' : 'text-ink'}`}>
            ${product.salePrice ?? product.price}
          </span>
        </div>
      </div>
    </Link>
  )
}
