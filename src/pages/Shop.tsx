import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import ProductCardSkeleton from '../components/ProductCardSkeleton'
import { fetchProducts } from '../lib/products'
import { SCHOOLS } from '../data/schools'
import type { Product } from '../types'

const COLLEGE_SLUGS = SCHOOLS.map((s) => s.collection)
// e.g. 'UF' | 'FSU' | 'UCF' | ... - one chip per college collection.
type CollegeChip = Uppercase<(typeof COLLEGE_SLUGS)[number]>
const COLLEGE_CHIPS = COLLEGE_SLUGS.map((slug) => slug.toUpperCase()) as CollegeChip[]

type Chip = 'ALL' | 'NEW IN' | 'SALE' | 'WOMAN' | 'TOPS' | 'BOTTOMS' | CollegeChip
const CHIPS: Chip[] = ['ALL', 'NEW IN', 'SALE', 'WOMAN', 'TOPS', 'BOTTOMS', ...COLLEGE_CHIPS]

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

  const urlCollegeChip = COLLEGE_SLUGS.includes(urlCollection)
    ? (urlCollection.toUpperCase() as CollegeChip)
    : null

  const initialChip: Chip = urlNew
    ? 'NEW IN'
    : urlSale
      ? 'SALE'
      : urlCategory === 'woman'
        ? 'WOMAN'
        : urlCategory === 'tops'
          ? 'TOPS'
          : urlCategory === 'bottoms'
            ? 'BOTTOMS'
            : urlCollegeChip ?? 'ALL'

  // A `?category=` that isn't one of the chips above (e.g. "man", "jeans"
  // from the mega menu or footer) still filters the list even though it
  // has no dedicated chip.
  const extraCategory = urlCategory && !['woman', 'tops', 'bottoms'].includes(urlCategory) ? urlCategory : ''

  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [chip, setChip] = useState<Chip>(initialChip)
  const [sort, setSort] = useState<Sort>('new')

  // Non-college chips (ALL/NEW IN/SALE/WOMAN/TOPS/BOTTOMS) are filtered
  // client-side below from whatever's in `products`, so one broad fetch on
  // mount covers all of them. College chips are different: the backend can
  // only ever have fetched ONE collection's worth of products into
  // `products` at a time, so switching between college chips (or in from/
  // out to a non-college chip) has to re-fetch - otherwise, e.g. a deep
  // link to ?collection=uf never loads FSU's products, and clicking the
  // FSU chip afterwards silently shows zero results forever.
  const activeCollegeSlug = COLLEGE_SLUGS.find((slug) => slug.toUpperCase() === chip) ?? null

  useEffect(() => {
    setLoading(true)
    // The non-college branch mirrors the original mount-only fetch so a
    // deep link combining `collection` with `category`/`new` (e.g. the
    // homepage's "VIEW ALL" link for a selected school's new arrivals)
    // still works on first load, even though its initial chip is "NEW IN"
    // rather than a college chip.
    const params = activeCollegeSlug
      ? { collection: activeCollegeSlug }
      : urlCategory || urlCollection || urlNew
        ? {
            ...(urlCategory ? { category: urlCategory } : {}),
            ...(urlCollection ? { collection: urlCollection } : {}),
            ...(urlNew ? { isNew: true } : {}),
          }
        : undefined
    fetchProducts(params)
      .then(setProducts)
      .finally(() => setLoading(false))
  }, [activeCollegeSlug])

  const filtered = useMemo(() => {
    let list = products.filter((p) => {
      if (extraCategory && !p.category.toLowerCase().includes(extraCategory)) return false
      if (chip === 'NEW IN') return p.tag === 'new'
      if (chip === 'SALE') return p.tag === 'sale'
      if (chip === 'WOMAN') return p.category.toLowerCase().includes('woman')
      if (chip === 'TOPS') return p.category.toLowerCase().includes('top')
      if (chip === 'BOTTOMS') return p.category.toLowerCase().includes('bottom')
      if ((COLLEGE_CHIPS as string[]).includes(chip)) return p.collection === chip.toLowerCase()
      return true
    })
    const price = (p: Product) => p.salePrice ?? p.price
    if (sort === 'price-asc') list = [...list].sort((a, b) => price(a) - price(b))
    if (sort === 'price-desc') list = [...list].sort((a, b) => price(b) - price(a))
    return list
  }, [products, chip, sort, extraCategory])

  return (
    <div className="bg-transparent">
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
                    ? 'border-[#8B5E52] bg-[#8B5E52] text-white'
                    : 'border-[#E8C4B8] bg-white text-ink hover:border-[#8B5E52]'
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
        <div className="grid grid-cols-2 gap-px bg-[#E8C49A] md:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <p className="py-20 text-center text-sm text-muted">No products match the selected filters.</p>
      ) : (
        <div className="grid grid-cols-2 gap-px bg-[#E8C49A] md:grid-cols-4">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}
