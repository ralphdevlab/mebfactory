import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import HeroSlider from '../components/HeroSlider'
import CategoryPills from '../components/CategoryPills'
import ProductCard from '../components/ProductCard'
import ProductCardSkeleton from '../components/ProductCardSkeleton'
import Placeholder from '../components/Placeholder'
import { fetchProducts } from '../lib/products'
import { EDITORIAL_BANNER } from '../data/homeSections'
import type { Product } from '../types'

export default function Home() {
  const location = useLocation()
  const collectionsRef = useRef<HTMLDivElement>(null)

  const [newArrivals, setNewArrivals] = useState<Product[]>([])
  const [newArrivalsLoading, setNewArrivalsLoading] = useState(true)
  const [allProducts, setAllProducts] = useState<Product[]>([])
  const [allProductsLoading, setAllProductsLoading] = useState(true)

  useEffect(() => {
    fetchProducts({ isNew: true })
      .then((products) => setNewArrivals(products.slice(0, 8)))
      .finally(() => setNewArrivalsLoading(false))

    fetchProducts()
      .then((products) => setAllProducts(products.slice(0, 8)))
      .finally(() => setAllProductsLoading(false))
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

      {/* 4. Editorial banner */}
      <Link
        to={EDITORIAL_BANNER.to}
        className="relative block h-[50vh] w-full overflow-hidden md:h-[65vh]"
      >
        <img
          src={EDITORIAL_BANNER.image}
          alt={EDITORIAL_BANNER.headline}
          loading="lazy"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-center text-white">
          <p className="text-[36px] font-bold uppercase leading-none">{EDITORIAL_BANNER.headline}</p>
          <span className="bg-white px-8 py-3 text-[11px] uppercase tracking-[0.14em] text-black">
            {EDITORIAL_BANNER.cta}
          </span>
        </div>
        <Placeholder />
      </Link>

      {/* 5. All products */}
      <ProductSection
        title="ALL PRODUCTS"
        viewAllTo="/shop"
        products={allProducts}
        loading={allProductsLoading}
      />
    </div>
  )
}

// Shared "section header + 2/4-col product grid" layout for New Arrivals and
// All Products. Shows 6 cards on mobile / 8 on desktop (the last two fetched
// products are hidden below the md breakpoint) and a skeleton grid while
// loading.
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
