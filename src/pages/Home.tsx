import { Link } from 'react-router-dom'
import Button from '../components/Button'
import TrustStrip from '../components/TrustStrip'
import ProductCard from '../components/ProductCard'
import CategoryCard from '../components/CategoryCard'
import { products } from '../data/products'
import { categories } from '../data/categories'

export default function Home() {
  const featured = products.slice(0, 8)

  return (
    <div>
      <section className="bg-hero">
        <div className="mx-auto flex min-h-[260px] max-w-[1440px] flex-col items-start justify-center p-6 sm:min-h-[420px] sm:justify-start sm:px-10 sm:py-12">
          <p className="label text-muted">Summer 2026 — New Drop</p>
          <h1 className="mt-4 max-w-xl text-2xl font-medium leading-tight sm:text-4xl">
            <span className="text-ink">Soft cuts.</span>
            <br />
            <span className="text-sand">Street soul.</span>
          </h1>
          <Link to="/shop" className="mt-8">
            <Button variant="primary" className="px-10">
              Explore the collection
            </Button>
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-6 py-20">
        <div className="flex items-end justify-between">
          <h2 className="text-[10px] font-medium uppercase tracking-[0.18em] text-muted">New Arrivals</h2>
          <Link to="/shop" className="text-[10px] font-medium uppercase tracking-[0.18em] text-muted hover:text-ink">
            See all
          </Link>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-1 md:grid-cols-4">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-6 pb-20">
        <h2 className="text-[10px] font-medium uppercase tracking-[0.18em] text-muted">Shop by Category</h2>
        <div className="mt-8 flex gap-1 overflow-x-auto scrollbar-hide sm:grid sm:grid-cols-3 sm:gap-6 sm:overflow-visible">
          {categories.map((category) => (
            <div key={category.id} className="h-32 w-[160px] shrink-0 sm:h-auto sm:w-auto">
              <CategoryCard category={category} />
            </div>
          ))}
        </div>
      </section>

      <TrustStrip />
    </div>
  )
}
