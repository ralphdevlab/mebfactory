import { Link } from 'react-router-dom'
import type { Product } from '../types'
import ProductTag from './ProductTag'
import WishlistButton from './WishlistButton'

export default function ProductCard({ product }: { product: Product }) {
  const onSale = product.salePrice !== undefined
  const image = product.images[0]

  return (
    <Link to={`/product/${product.id}`} className="group block">
      <div className="relative aspect-[3/4] overflow-hidden bg-paper p-2">
        {image && <img src={image} alt={product.name} className="h-full w-full object-contain" />}
        <ProductTag tag={product.tag} />
        <WishlistButton
          product={product}
          className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center"
        />
      </div>
      <div className="pb-3 pt-2">
        <p className="text-[11px] font-bold uppercase text-ink">{product.name}</p>
        <div className="mt-1 flex items-center gap-2 text-[12px]">
          {onSale && <span className="font-normal text-muted line-through">${product.price}</span>}
          <span className={onSale ? 'text-sand' : 'text-ink'}>${product.salePrice ?? product.price}</span>
        </div>
      </div>
    </Link>
  )
}
