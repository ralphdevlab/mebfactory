import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import ProductCardSkeleton from '../components/ProductCardSkeleton'
import { fetchProducts } from '../lib/products'
import type { Product } from '../types'

type Chip = 'ALL' | 'NEW IN' | 'SALE' | 'WOMAN' | 'MAN' | 'TOPS' | 'BOTTOMS' | 'OUTERWEAR'
const CHIPS: Chip[] = ['ALL', 'NEW IN', 'SALE', 'WOMAN', 'MAN', 'TOPS', 'BOTTOMS', 'OUTERWEAR']

type Sort = 'new' | 'price-asc' | 'price-desc'
const SORTS: { value: Sort; label: string }[] = [
  { value: 'new', label: 'New in' },
  { value: 'price-asc', label: 'Price ↑' },
  { value: 'price-desc', label: 'Price ↓' },
]

export default function Shop() {
  const [searchParams] = useSearchParams()
  const urlCategory = searchParams.get('category')?.toLowerCase() ?? ''
  const urlCollection = searchParams.get('collection')?.toLowerCase() ?? ''
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
          : urlCategory === 'tops'
            ? 'TOPS'
            : urlCategory === 'bottoms'
              ? 'BOTTOMS'
              : urlCategory === 'outerwear'
                ? 'OUTERWEAR'
                : 'ALL'

  // A `?category=` that isn't one of the chips above (e.g. from the mega
  // menu) still filters the list even though it has no dedicated chip.
  const extraCategory =
    urlCategory && !['woman', 'man', 'tops', 'bottoms', 'outerwear'].includes(urlCategory) ? urlCategory : ''

  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [chip, setChip] = useState<Chip>(initialChip)
  const [sort, setSort] = useState<Sort>('new')

  // The backend's GET /api/products only understands a single `category`,
  // `collection` and `new` query param, so — exactly as before — only the
  // initial URL params are sent to the API and everything after is filtered
  // client-side. Runs once on mount.
  useEffect(() => {
    setLoading(true)
    const params =
      urlCategory || urlCollection || urlNew
        ? {
            ...(urlCategory ? { category: urlCategory } : {}),
            ...(urlCollection ? { collection: urlCollection } : {}),
            ...(urlNew ? { isNew: true } : {}),
          }
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
      if (chip === 'TOPS') return p.category.toLowerCase().includes('top')
      if (chip === 'BOTTOMS') return p.category.toLowerCase().includes('bottom')
      if (chip === 'OUTERWEAR') return p.category.toLowerCase().includes('outerwear')
      return true
    })
    const price = (p: Product) => p.salePrice ?? p.price
    if (sort === 'price-asc') list = [...list].sort((a, b) => price(a) - price(b))
    if (sort === 'price-desc') list = [...list].sort((a, b) => price(b) - price(a))
    return list
  }, [products, chip, sort, extraCategory])

  return (
    <div className="bg-white">
      <div className="sticky top-[52px] z-30 border-b border-border bg-white md:top-[60px]">
        <div className="flex items-center justify-between gap-3 px-4 py-3 md:px-6">
          <div className="scrollbar-hide flex flex-1 gap-2 overflow-x-auto">
            {CHIPS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setChip(c)}
                className={`shrink-0 whitespace-nowrap border px-3.5 py-2 text-[11px] uppercase tracking-[0.08em] transition-colors ${
                  chip === c
                    ? 'border-ink bg-ink text-white'
                    : 'border-border bg-white text-ink hover:border-ink'
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as Sort)}
            className="shrink-0 border border-border bg-white px-2 py-2 text-[12px] text-ink focus:outline-none"
          >
            {SORTS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
        <p className="px-4 pb-3 text-[12px] text-muted md:px-6">
          {loading ? '…' : `${filtered.length} products`}
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 gap-px bg-border md:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <p className="py-20 text-center text-sm text-muted">No products match the selected filters.</p>
      ) : (
        <div className="grid grid-cols-2 gap-px bg-border md:grid-cols-4">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}
