import { useEffect, useRef, useState } from 'react'
import ProductCard from './ProductCard'
import EmptyState from './EmptyState'
import { SearchIcon } from './icons'
import { fetchProducts } from '../lib/products'
import type { Product } from '../types'

// Inline navbar search: an always-visible text field flanked by hairline
// dividers, with a full-bleed results panel that drops below the navbar as
// soon as the shopper types. The fetch/debounce/results behaviour is
// unchanged from the previous popover version.
export default function SearchBar() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const open = query.trim().length > 0

  function close() {
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
    <div ref={containerRef} className="flex h-full items-center">
      <span className="h-6 w-px bg-border" />
      <div className="flex items-center gap-2 px-3">
        <SearchIcon size={16} className="shrink-0 text-ink" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="SEARCH HERE"
          className="w-40 bg-transparent text-[12px] uppercase tracking-[0.06em] text-ink placeholder:text-muted focus:outline-none xl:w-52"
        />
      </div>
      <span className="h-6 w-px bg-border" />

      {open && (
        <div className="absolute inset-x-0 top-full z-40 max-h-[70vh] overflow-y-auto border-b border-border bg-white shadow-sm">
          <div className="mx-auto max-w-[1440px] px-4 py-6 md:px-6">
            {loading && <p className="text-sm font-normal text-muted">Searching...</p>}

            {!loading && searched && results.length === 0 && (
              <EmptyState
                icon={<SearchIcon />}
                title={`No results for "${query}"`}
                actionLabel="Clear Search"
                onAction={close}
              />
            )}

            {!loading && results.length > 0 && (
              <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-4 md:grid-cols-6">
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
