import { Link } from 'react-router-dom'
import type { Product } from '../types'
import ProductTag from './ProductTag'

export default function ProductCard({ product }: { product: Product }) {
  const onSale = product.salePrice !== undefined

  return (
    <Link to={`/product/${product.id}`} className="group block">
      <div className="relative aspect-[3/4] overflow-hidden rounded-[6px] bg-hero">
        <ProductTag tag={product.tag} />
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
