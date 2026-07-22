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
        <div className="mx-auto flex min-h-[320px] max-w-[1440px] flex-col items-start justify-center px-6 py-12 sm:min-h-0 sm:justify-start sm:py-28">
          <p className="label text-muted">Summer 2026 — New Drop</p>
          <h1 className="mt-4 max-w-xl text-3xl font-medium leading-tight sm:text-5xl">
            <span className="text-ink">Minimal cuts.</span>
            <br />
            <span className="text-muted">Street roots.</span>
          </h1>
          <Link to="/shop" className="mt-8">
            <Button variant="primary" className="px-10">
              Shop Now
            </Button>
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-6 py-20">
        <div className="flex items-end justify-between">
          <h2 className="label text-muted">New Arrivals</h2>
          <Link to="/shop" className="label text-muted hover:text-ink">
            View All
          </Link>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-2 sm:gap-x-6 sm:gap-y-10 md:grid-cols-4">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-6 pb-20">
        <h2 className="label text-muted">Shop by Category</h2>
        <div className="mt-8 flex gap-2 overflow-x-auto scrollbar-hide sm:grid sm:grid-cols-3 sm:gap-6 sm:overflow-visible">
          {categories.map((category) => (
            <div key={category.id} className="h-40 w-[200px] shrink-0 sm:h-auto sm:w-auto">
              <CategoryCard category={category} />
            </div>
          ))}
        </div>
      </section>

      <TrustStrip />
    </div>
  )
}
