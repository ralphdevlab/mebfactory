import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Button from '../components/Button'
import { fetchProduct } from '../lib/products'
import { useCart } from '../context/CartContext'
import type { Product } from '../types'

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { addToCart } = useCart()

  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)

  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [added, setAdded] = useState(false)

  useEffect(() => {
    if (!id) {
      setLoading(false)
      return
    }
    setLoading(true)
    fetchProduct(id)
      .then(setProduct)
      .catch(() => setProduct(null))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <div className="mx-auto max-w-[1440px] px-6 py-20 text-center">
        <p className="text-sm font-normal text-muted">Loading...</p>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-[1440px] px-6 py-20 text-center">
        <p className="text-sm font-normal text-muted">Product not found.</p>
        <Link to="/shop" className="label mt-4 inline-block text-ink underline">
          Back to Shop
        </Link>
      </div>
    )
  }

  const onSale = product.salePrice !== undefined

  const handleAddToCart = () => {
    if (!selectedSize) return
    addToCart(product, selectedSize)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div className="mx-auto max-w-[1440px] px-6 py-12">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="label text-muted hover:text-ink"
      >
        ← Back
      </button>

      <div className="mt-6 grid grid-cols-1 gap-12 lg:grid-cols-2">
        <div className="relative aspect-[3/4] w-full overflow-hidden bg-hero">
          <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
        </div>

        <div className="max-w-md">
          <p className="label text-muted">{product.category}</p>
          <h1 className="mt-2 text-2xl font-medium text-ink">{product.name}</h1>

          <div className="mt-4 flex items-center gap-3">
            {onSale && (
              <span className="text-base font-normal text-muted line-through">${product.price}</span>
            )}
            <span className={`text-lg font-medium ${onSale ? 'text-sand' : 'text-ink'}`}>
              ${product.salePrice ?? product.price}
            </span>
          </div>

          <p className="mt-6 text-sm font-normal leading-relaxed text-muted">{product.description}</p>

          <div className="mt-8">
            <p className="label text-ink">Select Size</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setSelectedSize(size)}
                  className={`label flex h-11 min-w-11 items-center justify-center border px-3 transition-colors ${
                    selectedSize === size
                      ? 'border-ink bg-ink text-surface'
                      : 'border-border text-ink hover:border-charcoal'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <Button
            variant="primary"
            className="mt-8 w-full"
            disabled={!selectedSize}
            onClick={handleAddToCart}
          >
            {added ? 'Added to Cart' : 'Add to Cart'}
          </Button>

          {!selectedSize && (
            <p className="mt-2 text-center text-xs font-normal text-muted">Please select a size</p>
          )}
        </div>
      </div>
    </div>
  )
}
