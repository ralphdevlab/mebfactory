import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchProducts } from '../lib/products'
import type { Product } from '../types'

// Horizontal scroll-snap rail of products under a bold section header, with
// hover-reveal chevron buttons on desktop.
export default function ProductCarousel({ title }: { title: string }) {
  const [products, setProducts] = useState<Product[]>([])
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchProducts().then(setProducts).catch(() => setProducts([]))
  }, [])

  const scrollBy = (dir: 1 | -1) => {
    scrollRef.current?.scrollBy({ left: dir * scrollRef.current.clientWidth * 0.8, behavior: 'smooth' })
  }

  if (products.length === 0) return null

  return (
    <section className="group/carousel relative bg-white">
      <h2 className="px-6 pb-4 pt-6 text-[24px] font-bold uppercase text-ink">{title}</h2>

      <button
        type="button"
        aria-label="Previous"
        onClick={() => scrollBy(-1)}
        className="absolute left-3 top-1/2 z-10 hidden h-9 w-9 -translate-y-1/2 items-center justify-center border border-border bg-white opacity-0 transition-opacity group-hover/carousel:opacity-100 md:flex"
      >
        <Chevron dir="left" />
      </button>
      <button
        type="button"
        aria-label="Next"
        onClick={() => scrollBy(1)}
        className="absolute right-3 top-1/2 z-10 hidden h-9 w-9 -translate-y-1/2 items-center justify-center border border-border bg-white opacity-0 transition-opacity group-hover/carousel:opacity-100 md:flex"
      >
        <Chevron dir="right" />
      </button>

      <div
        ref={scrollRef}
        className="scrollbar-hide flex snap-x snap-mandatory overflow-x-auto"
      >
        {products.map((product) => {
          const onSale = product.salePrice !== undefined
          return (
            <Link
              key={product.id}
              to={`/product/${product.id}`}
              className="w-[calc(50%-1px)] shrink-0 snap-start md:w-[calc(25%-1px)]"
            >
              <div className="bg-paper">
                <div className="aspect-[3/4] p-4">
                  {product.images[0] && (
                    <img src={product.images[0]} alt={product.name} className="h-full w-full object-contain" />
                  )}
                </div>
              </div>
              <div className="px-2 pb-4 pt-2">
                <p className="text-[11px] font-bold uppercase text-ink">{product.name}</p>
                <div className="mt-1 flex items-center gap-2 text-[12px]">
                  {onSale && <span className="text-muted line-through">${product.price}</span>}
                  <span className={onSale ? 'text-sand' : 'text-ink'}>
                    ${product.salePrice ?? product.price}
                  </span>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}

function Chevron({ dir }: { dir: 'left' | 'right' }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d={dir === 'left' ? 'M15 6l-6 6 6 6' : 'M9 6l6 6-6 6'} />
    </svg>
  )
}
