import { Link } from 'react-router-dom'
import type { Product } from '../types'
import ProductImage from './ProductImage'
import ProductTag from './ProductTag'
import WishlistButton from './WishlistButton'

export default function ProductCard({ product }: { product: Product }) {
  const onSale = product.salePrice !== undefined

  return (
    <Link
      to={`/product/${product.id}`}
      className="group block hover:shadow-[0_4px_20px_rgba(139,94,82,0.12)]"
      style={{ transition: 'box-shadow 200ms ease' }}
    >
      <div className="relative aspect-[3/4] overflow-hidden rounded-[8px] bg-paper">
        <ProductImage
          src={product.images?.[0]}
          alt={product.name}
          className="h-full w-full object-cover"
        />
        <ProductTag tag={product.tag} />
        <WishlistButton
          product={product}
          className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center"
        />
      </div>
      <p className="px-2 pb-0.5 pt-2 text-[12px] font-medium uppercase text-ink">{product.name}</p>
      <div className="flex items-center gap-2 px-2 pb-2 text-[12px]">
        {onSale && <span className="font-normal text-muted line-through">${product.price}</span>}
        <span className={onSale ? 'text-[#C4847A]' : 'text-ink'}>${product.salePrice ?? product.price}</span>
      </div>
    </Link>
  )
}
