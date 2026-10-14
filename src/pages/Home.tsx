import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import HeroSlider from '../components/HeroSlider'
import CategoryPills from '../components/CategoryPills'
import ProductCard from '../components/ProductCard'
import ProductCardSkeleton from '../components/ProductCardSkeleton'
import ProductCarousel from '../components/ProductCarousel'
import { fetchProducts } from '../lib/products'
import type { Product } from '../types'

export default function Home() {
  const location = useLocation()
  const collectionsRef = useRef<HTMLDivElement>(null)

  const [newArrivals, setNewArrivals] = useState<Product[]>([])
  const [newArrivalsLoading, setNewArrivalsLoading] = useState(true)

  useEffect(() => {
    fetchProducts({ isNew: true })
      .then((products) => setNewArrivals(products.slice(0, 8)))
      .finally(() => setNewArrivalsLoading(false))
  }, [])

  // The navbar/drawer's COLLECTIONS link points at /#collections - scroll to
  // the pills row whenever that hash is the current location (on mount from
  // another page, or a same-page click while already on "/").
  useEffect(() => {
    if (location.hash === '#collections') {
      collectionsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [location.hash])

  return (
    <div className="bg-white">
      {/* 1. Hero */}
      <HeroSlider />

      {/* 2. Category pills */}
      <div id="collections" ref={collectionsRef}>
        <CategoryPills />
      </div>

      {/* 3. New arrivals */}
      <ProductSection
        title="NEW ARRIVALS"
        viewAllTo="/shop?new=true"
        products={newArrivals}
        loading={newArrivalsLoading}
      />

      {/* 4. It may interest you */}
      <ProductCarousel title="IT MAY INTEREST YOU" />
    </div>
  )
}

// "Section header + 2/4-col product grid" layout for New Arrivals. Shows 6
// cards on mobile / 8 on desktop (the last two fetched products are hidden
// below the md breakpoint) and a skeleton grid while loading.
function ProductSection({
  title,
  viewAllTo,
  products,
  loading,
}: {
  title: string
  viewAllTo: string
  products: Product[]
  loading: boolean
}) {
  return (
    <section className="pt-8">
      <div className="flex items-baseline justify-between px-4 pb-4 md:px-6">
        <h2 className="text-[14px] font-bold uppercase text-ink">{title}</h2>
        <Link to={viewAllTo} className="text-[11px] uppercase tracking-[0.06em] text-ink hover:text-muted">
          VIEW ALL →
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 gap-px bg-border md:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className={i >= 6 ? 'hidden md:block' : ''}>
              <ProductCardSkeleton />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-px bg-border md:grid-cols-4">
          {products.map((product, i) => (
            <div key={product.id} className={i >= 6 ? 'hidden md:block' : ''}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
