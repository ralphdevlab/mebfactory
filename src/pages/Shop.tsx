import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { useSearchParams } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import { fetchProducts } from '../lib/products'
import type { Product } from '../types'

export default function Shop() {
  const [searchParams] = useSearchParams()
  const initialCategory = searchParams.get('category') ?? ''
  const initialTag = searchParams.get('tag') ?? ''

  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  const [activeCategories, setActiveCategories] = useState<string[]>(
    initialCategory ? [initialCategory] : [],
  )
  const [activeSizes, setActiveSizes] = useState<string[]>([])
  const [saleOnly, setSaleOnly] = useState(initialTag === 'sale')
  const [newOnly, setNewOnly] = useState(initialTag === 'new')

  // Only the initial `?category=` from the URL is sent to the API - the
  // backend's GET /api/products only supports a single `category` (and
  // `new`) query param, not the multi-select category/size/sale filtering
  // this page offers, so everything past that first load is filtered
  // client-side against whatever the API returned, same as it always was.
  // Deliberately runs once on mount, not on every `initialCategory` change:
  // this component already treats every URL param (category, tag) as an
  // initial value only, the same way the size/sale/new filter state below
  // does - re-fetching on later URL changes without also resetting those
  // filter checkboxes would leave the checkboxes and the fetched list out
  // of sync with each other.
  useEffect(() => {
    setLoading(true)
    fetchProducts(initialCategory ? { category: initialCategory } : undefined)
      .then(setProducts)
      .finally(() => setLoading(false))
  }, [])

  const CATEGORIES = useMemo(() => Array.from(new Set(products.map((p) => p.category))).sort(), [products])
  const SIZES = useMemo(() => Array.from(new Set(products.flatMap((p) => p.sizes))).sort(), [products])

  const toggle = (value: string, list: string[], setList: (v: string[]) => void) => {
    setList(list.includes(value) ? list.filter((v) => v !== value) : [...list, value])
  }

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (activeCategories.length && !activeCategories.includes(p.category)) return false
      if (activeSizes.length && !p.sizes.some((s) => activeSizes.includes(s))) return false
      if (saleOnly && p.tag !== 'sale') return false
      if (newOnly && p.tag !== 'new') return false
      return true
    })
  }, [products, activeCategories, activeSizes, saleOnly, newOnly])

  return (
    <div className="mx-auto max-w-[1440px] px-6 py-12">
      <div className="flex items-center justify-between border-b border-border pb-6">
        <h1 className="text-2xl font-medium text-ink">Shop All</h1>
        <p className="label text-muted">{loading ? '...' : `${filtered.length} Items`}</p>
      </div>

      <div className="mt-10 flex flex-col gap-10 lg:flex-row">
        <aside className="w-full shrink-0 lg:w-56">
          <FilterGroup title="Category">
            {CATEGORIES.map((category) => (
              <FilterCheckbox
                key={category}
                label={category}
                checked={activeCategories.includes(category)}
                onChange={() => toggle(category, activeCategories, setActiveCategories)}
              />
            ))}
          </FilterGroup>

          <FilterGroup title="Size">
            {SIZES.map((size) => (
              <FilterCheckbox
                key={size}
                label={size}
                checked={activeSizes.includes(size)}
                onChange={() => toggle(size, activeSizes, setActiveSizes)}
              />
            ))}
          </FilterGroup>

          <FilterGroup title="Discount">
            <FilterCheckbox label="Sale Only" checked={saleOnly} onChange={() => setSaleOnly((v) => !v)} />
            <FilterCheckbox label="New Only" checked={newOnly} onChange={() => setNewOnly((v) => !v)} />
          </FilterGroup>
        </aside>

        <div className="flex-1">
          {loading ? (
            <p className="py-20 text-center text-sm font-normal text-muted">Loading products...</p>
          ) : filtered.length === 0 ? (
            <p className="py-20 text-center text-sm font-normal text-muted">
              No products match the selected filters.
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-3">
              {filtered.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function FilterGroup({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="border-b border-border py-6 first:pt-0">
      <p className="label text-ink">{title}</p>
      <div className="mt-4 flex flex-col gap-3">{children}</div>
    </div>
  )
}

function FilterCheckbox({
  label,
  checked,
  onChange,
}: {
  label: string
  checked: boolean
  onChange: () => void
}) {
  return (
    <label className="flex cursor-pointer items-center gap-3">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 shrink-0 accent-ink"
      />
      <span className="text-sm font-normal text-ink">{label}</span>
    </label>
  )
}
