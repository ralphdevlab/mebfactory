import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import ProductCardSkeleton from '../components/ProductCardSkeleton'
import { fetchProducts } from '../lib/products'
import type { Product } from '../types'

type Chip = 'ALL' | 'NEW IN' | 'SALE' | 'WOMAN' | 'MAN'
const CHIPS: Chip[] = ['ALL', 'NEW IN', 'SALE', 'WOMAN', 'MAN']

type Sort = 'new' | 'price-asc' | 'price-desc'
const SORTS: { value: Sort; label: string }[] = [
  { value: 'new', label: 'New in' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
]

export default function Shop() {
  const [searchParams] = useSearchParams()
  const urlCategory = searchParams.get('category')?.toLowerCase() ?? ''
  const urlNew = searchParams.get('new') === 'true'
  const urlSale = searchParams.get('sale') === 'true'

  const initialChip: Chip = urlNew
    ? 'NEW IN'
    : urlSale
      ? 'SALE'
      : urlCategory === 'woman'
        ? 'WOMAN'
        : urlCategory === 'man'
          ? 'MAN'
          : 'ALL'

  // A `?category=` that isn't woman/man (e.g. from the mega menu) still
  // filters the list even though it has no dedicated chip.
  const extraCategory = urlCategory && !['woman', 'man'].includes(urlCategory) ? urlCategory : ''

  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [chip, setChip] = useState<Chip>(initialChip)
  const [sort, setSort] = useState<Sort>('new')

  // The backend's GET /api/products only understands a single `category` (and
  // `new`) query param, so — exactly as before — only the initial URL params
  // are sent to the API and everything after is filtered client-side. Runs
  // once on mount.
  useEffect(() => {
    setLoading(true)
    const params =
      urlCategory || urlNew
        ? { ...(urlCategory ? { category: urlCategory } : {}), ...(urlNew ? { isNew: true } : {}) }
        : undefined
    fetchProducts(params)
      .then(setProducts)
      .finally(() => setLoading(false))
  }, [])

  const filtered = useMemo(() => {
    let list = products.filter((p) => {
      if (extraCategory && !p.category.toLowerCase().includes(extraCategory)) return false
      if (chip === 'NEW IN') return p.tag === 'new'
      if (chip === 'SALE') return p.tag === 'sale'
      if (chip === 'WOMAN') return p.category.toLowerCase().includes('woman')
      if (chip === 'MAN') return p.category.toLowerCase().includes('man')
      return true
    })
    const price = (p: Product) => p.salePrice ?? p.price
    if (sort === 'price-asc') list = [...list].sort((a, b) => price(a) - price(b))
    if (sort === 'price-desc') list = [...list].sort((a, b) => price(b) - price(a))
    return list
  }, [products, chip, sort, extraCategory])

  const heading =
    chip === 'WOMAN'
      ? 'WOMAN'
      : chip === 'MAN'
        ? 'MAN'
        : extraCategory
          ? extraCategory.toUpperCase()
          : 'ALL PRODUCTS'

  return (
    <div className="bg-white">
      <div className="flex items-baseline justify-between p-6">
        <h1 className="text-[28px] font-bold uppercase text-[#0A0A0A]">{heading}</h1>
        <p className="text-[13px] text-muted">{loading ? '…' : `${filtered.length} products`}</p>
      </div>

      <div className="sticky top-14 z-30 flex flex-wrap items-center justify-between gap-3 border-b border-border bg-white px-6 py-3">
        <div className="flex flex-wrap gap-2">
          {CHIPS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setChip(c)}
              className={`border px-3.5 py-1.5 text-[11px] uppercase tracking-[0.1em] transition-colors ${
                chip === c
                  ? 'border-[#0A0A0A] bg-[#0A0A0A] text-white'
                  : 'border-border bg-white text-ink hover:border-[#0A0A0A]'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as Sort)}
          className="border border-border bg-white px-3 py-1.5 text-[12px] text-ink focus:outline-none"
        >
          {SORTS.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 gap-px bg-border md:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-white p-2">
              <ProductCardSkeleton />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <p className="py-20 text-center text-sm text-muted">No products match the selected filters.</p>
      ) : (
        <div className="grid grid-cols-2 gap-px bg-border md:grid-cols-4">
          {filtered.map((product) => (
            <div key={product.id} className="bg-white">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
