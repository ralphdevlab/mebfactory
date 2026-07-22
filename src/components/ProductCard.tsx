import { Link } from 'react-router-dom'
import type { Product } from '../types'
import ProductTag from './ProductTag'

export default function ProductCard({ product }: { product: Product }) {
  const onSale = product.salePrice !== undefined

  return (
    <Link to={`/product/${product.id}`} className="group block">
      <div className="relative aspect-[3/4] overflow-hidden bg-hero">
        <ProductTag tag={product.tag} />
      </div>
      <div className="mt-3">
        <p className="label text-muted">{product.category}</p>
        <p className="mt-1 text-sm font-normal text-ink">{product.name}</p>
        <div className="mt-1 flex items-center gap-2">
          {onSale && <span className="text-sm font-normal text-muted line-through">${product.price}</span>}
          <span className={`text-sm font-medium ${onSale ? 'text-sand' : 'text-ink'}`}>
            ${product.salePrice ?? product.price}
          </span>
        </div>
      </div>
    </Link>
  )
}
