import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import HeroSlider from '../components/HeroSlider'
import CategoryPills from '../components/CategoryPills'
import ProductCard from '../components/ProductCard'
import ProductCardSkeleton from '../components/ProductCardSkeleton'
import ProductCarousel from '../components/ProductCarousel'
import SchoolSelectorModal from '../components/SchoolSelectorModal'
import { fetchProducts } from '../lib/products'
import { useSchool } from '../context/SchoolContext'
import { schoolName } from '../data/schools'
import type { Product } from '../types'

const SCHOOL_MODAL_SEEN_KEY = 'mebfactory_school_selected'

export default function Home() {
  const location = useLocation()
  const collectionsRef = useRef<HTMLDivElement>(null)
  const { selectedSchool } = useSchool()

  // Shows automatically on first visit (no "seen" flag yet) and whenever
  // "Change school" is clicked.
  const [modalOpen, setModalOpen] = useState(() => {
    try {
      return localStorage.getItem(SCHOOL_MODAL_SEEN_KEY) !== 'true'
    } catch {
      return false
    }
  })

  const [newArrivals, setNewArrivals] = useState<Product[]>([])
  const [newArrivalsLoading, setNewArrivalsLoading] = useState(true)
  const [allProducts, setAllProducts] = useState<Product[]>([])
  const [allProductsLoading, setAllProductsLoading] = useState(true)

  // Re-fetches whenever the selected school changes (picking one in the
  // modal, or clearing it), so both sections filter live without a reload.
  useEffect(() => {
    setNewArrivalsLoading(true)
    fetchProducts(selectedSchool ? { collection: selectedSchool, isNew: true } : { isNew: true })
      .then((products) => setNewArrivals(products.slice(0, 8)))
      .finally(() => setNewArrivalsLoading(false))

    setAllProductsLoading(true)
    fetchProducts(selectedSchool ? { collection: selectedSchool } : undefined)
      .then((products) => setAllProducts(products.slice(0, 8)))
      .finally(() => setAllProductsLoading(false))
  }, [selectedSchool])

  // The navbar/drawer's COLLECTIONS link points at /#collections - scroll to
  // the pills row whenever that hash is the current location (on mount from
  // another page, or a same-page click while already on "/").
  useEffect(() => {
    if (location.hash === '#collections') {
      collectionsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [location.hash])

  const school = selectedSchool ? schoolName(selectedSchool) : undefined

  return (
    <div className="bg-transparent">
      <SchoolSelectorModal open={modalOpen} onClose={() => setModalOpen(false)} />

      {/* 1. Hero */}
      <HeroSlider />

      {/* 2. Category pills */}
      <div id="collections" ref={collectionsRef}>
        <CategoryPills />
      </div>

      {/* 3. New arrivals */}
      <ProductSection
        title={school ? `${school} — NEW ARRIVALS` : 'NEW ARRIVALS'}
        viewAllTo={selectedSchool ? `/shop?collection=${selectedSchool}&new=true` : '/shop?new=true'}
        products={newArrivals}
        loading={newArrivalsLoading}
        onChangeSchool={() => setModalOpen(true)}
      />

      {/* 4. All products */}
      <ProductSection
        title="ALL PRODUCTS"
        viewAllTo={selectedSchool ? `/shop?collection=${selectedSchool}` : '/shop'}
        products={allProducts}
        loading={allProductsLoading}
      />

      {/* 5. It may interest you */}
      <ProductCarousel title="IT MAY INTEREST YOU" />
    </div>
  )
}

// "Section header + 2/4-col product grid" layout for New Arrivals and All
// Products. Shows 6 cards on mobile / 8 on desktop (the last two fetched
// products are hidden below the md breakpoint) and a skeleton grid while
// loading. `onChangeSchool`, when given, renders a "Change school" link next
// to the title that reopens the selector modal.
function ProductSection({
  title,
  viewAllTo,
  products,
  loading,
  onChangeSchool,
}: {
  title: string
  viewAllTo: string
  products: Product[]
  loading: boolean
  onChangeSchool?: () => void
}) {
  return (
    <section className="pt-8">
      <div className="flex items-baseline justify-between px-4 pb-4 md:px-6">
        <div className="flex items-baseline gap-3">
          <h2 className="text-[14px] font-bold uppercase text-[#8B5E52]">{title}</h2>
          {onChangeSchool && (
            <button
              type="button"
              onClick={onChangeSchool}
              className="text-[10px] uppercase tracking-[0.06em] text-[#C4847A] underline hover:opacity-70"
            >
              Change school
            </button>
          )}
        </div>
        <Link to={viewAllTo} className="text-[11px] uppercase tracking-[0.06em] text-[#C4847A] hover:opacity-70">
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
