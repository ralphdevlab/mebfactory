import { useEffect, useRef, useState } from 'react'
import ProductCard from './ProductCard'
import EmptyState from './EmptyState'
import { SearchIcon, CloseIcon } from './icons'
import { fetchProducts } from '../lib/products'
import type { Product } from '../types'

// Search panel shown below the navbar once the search icon is tapped. Only
// mounted while open (Navbar controls that), so it owns no "collapsed" state
// of its own - just the query/results/loading behaviour, unchanged from the
// previous always-visible version.
export default function SearchBar({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        onClose()
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
    <div ref={containerRef} className="absolute inset-x-0 top-full z-40 max-h-[80vh] overflow-y-auto border-b border-border bg-white shadow-sm">
      <div className="flex items-center gap-3 border-b border-border px-4 py-3 md:px-6">
        <SearchIcon size={18} className="shrink-0 text-ink" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="SEARCH HERE"
          className="flex-1 bg-transparent text-[13px] uppercase tracking-[0.06em] text-ink placeholder:text-muted focus:outline-none"
        />
        <button type="button" aria-label="Close search" onClick={onClose} className="shrink-0 text-ink">
          <CloseIcon size={18} />
        </button>
      </div>

      <div className="mx-auto max-w-[1440px] px-4 py-6 md:px-6">
        {loading && <p className="text-sm font-normal text-muted">Searching...</p>}

        {!loading && searched && results.length === 0 && (
          <EmptyState
            icon={<SearchIcon />}
            title={`No results for "${query}"`}
            actionLabel="Clear Search"
            onAction={() => setQuery('')}
          />
        )}

        {!loading && results.length > 0 && (
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-4 md:grid-cols-6">
            {results.slice(0, 12).map((product) => (
              <div key={product.id} onClick={onClose}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
