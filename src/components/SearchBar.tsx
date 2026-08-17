import { useEffect, useRef, useState } from 'react'
import ProductCard from './ProductCard'
import EmptyState from './EmptyState'
import { SearchIcon } from './icons'
import { fetchProducts } from '../lib/products'
import type { Product } from '../types'

export default function SearchBar() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  function close() {
    setOpen(false)
    setQuery('')
    setResults([])
    setSearched(false)
  }

  useEffect(() => {
    if (!open) return

    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        close()
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') close()
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open])

  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      setSearched(false)
      setLoading(false)
      return
    }

    setLoading(true)
    const timeout = setTimeout(() => {
      fetchProducts({ search: query })
        .then((products) => {
          setResults(products)
          setSearched(true)
        })
        .finally(() => setLoading(false))
    }, 300)

    return () => clearTimeout(timeout)
  }, [query])

  return (
    <div ref={containerRef}>
      <button type="button" aria-label="Search" className="text-ink" onClick={() => setOpen((v) => !v)}>
        <SearchIcon size={18} />
      </button>

      {open && (
        <div className="absolute inset-x-0 top-full z-40 max-h-[70vh] overflow-y-auto border-b border-border bg-surface shadow-sm">
          <div className="mx-auto max-w-[1440px] px-4 py-4 md:px-6">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
              placeholder="Search products..."
              className="w-full border border-border bg-surface px-4 py-3 text-sm text-ink placeholder:text-muted focus:border-charcoal focus:outline-none"
            />

            {loading && <p className="mt-4 text-sm font-normal text-muted">Searching...</p>}

            {!loading && searched && results.length === 0 && (
              <EmptyState
                icon={<SearchIcon />}
                title={`No results for "${query}"`}
                actionLabel="Clear Search"
                onAction={() => setQuery('')}
              />
            )}

            {!loading && results.length > 0 && (
              <div className="mt-6 grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-4 md:grid-cols-6">
                {results.slice(0, 12).map((product) => (
                  <div key={product.id} onClick={close}>
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
