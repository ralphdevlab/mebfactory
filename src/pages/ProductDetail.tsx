import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import WishlistButton from '../components/WishlistButton'
import ProductCarousel from '../components/ProductCarousel'
import ProductImage from '../components/ProductImage'
import { ChevronIcon } from '../components/icons'
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
  const [activeImage, setActiveImage] = useState(0)
  const [descriptionOpen, setDescriptionOpen] = useState(false)
  const galleryRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!id) {
      setLoading(false)
      return
    }
    setLoading(true)
    setActiveImage(0)
    setDescriptionOpen(false)
    fetchProduct(id)
      .then(setProduct)
      .catch(() => setProduct(null))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <div className="mx-auto max-w-[1440px] px-4 py-20 text-center md:px-6">
        <p className="text-sm font-normal text-muted">Loading...</p>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-[1440px] px-4 py-20 text-center md:px-6">
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

  const goToImage = (index: number) => {
    setActiveImage(index)
    galleryRef.current?.children[index]?.scrollIntoView({ behavior: 'smooth', inline: 'start' })
  }

  const handleGalleryScroll = () => {
    const el = galleryRef.current
    if (!el) return
    setActiveImage(Math.round(el.scrollLeft / el.clientWidth))
  }

  return (
    <div className="md:mx-auto md:max-w-[1440px] md:px-6 md:py-12">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="label hidden text-muted hover:text-ink md:inline-block"
      >
        ← Back
      </button>

      <div className="mt-0 grid grid-cols-1 gap-0 md:mt-6 md:grid-cols-2 md:gap-12">
        <div>
          {/* Swipeable full-width gallery on mobile; same strip works on desktop too */}
          <div
            ref={galleryRef}
            onScroll={handleGalleryScroll}
            className="scrollbar-hide relative flex aspect-[3/4] w-full snap-x snap-mandatory overflow-x-auto bg-hero md:overflow-hidden"
          >
            {product.images.length > 0 ? (
              product.images.map((image, index) => (
                <ProductImage
                  key={image}
                  src={image}
                  alt={product.name}
                  loading={index === 0 ? 'eager' : 'lazy'}
                  className={`h-full w-full shrink-0 snap-start object-contain ${
                    index === activeImage ? '' : 'md:hidden'
                  }`}
                />
              ))
            ) : (
              <ProductImage src={undefined} alt={product.name} className="h-full w-full object-contain" />
            )}
          </div>

          {product.images.length > 1 && (
            <>
              {/* Dot indicators - mobile only */}
              <div className="mt-3 flex justify-center gap-1.5 md:hidden">
                {product.images.map((image, index) => (
                  <button
                    key={image}
                    type="button"
                    aria-label={`Go to image ${index + 1}`}
                    onClick={() => goToImage(index)}
                    className={`h-1.5 rounded-full transition-all ${
                      index === activeImage ? 'w-4 bg-ink' : 'w-1.5 bg-border'
                    }`}
                  />
                ))}
              </div>

              {/* Thumbnail strip - desktop only */}
              <div className="mt-3 hidden gap-3 md:flex">
                {product.images.map((image, index) => (
                  <button
                    key={image}
                    type="button"
                    onClick={() => setActiveImage(index)}
                    aria-label={`Show image ${index + 1}`}
                    aria-pressed={index === activeImage}
                    className={`relative h-20 w-16 shrink-0 overflow-hidden bg-hero transition-opacity ${
                      index === activeImage ? 'opacity-100 ring-1 ring-charcoal' : 'opacity-60 hover:opacity-100'
                    }`}
                  >
                    <ProductImage src={image} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="px-4 py-6 md:max-w-md md:px-0 md:py-0">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="label text-muted">{product.category}</p>
              <h1 className="mt-1 text-[20px] font-bold uppercase text-ink">{product.name}</h1>
            </div>
            <WishlistButton product={product} className="flex h-11 w-11 shrink-0 items-center justify-center" />
          </div>

          <div className="mt-3 flex items-center gap-3">
            {onSale && (
              <span className="text-base font-normal text-muted line-through">${product.price}</span>
            )}
            <span className={`text-lg font-medium ${onSale ? 'text-[#C4847A]' : 'text-ink'}`}>
              ${product.salePrice ?? product.price}
            </span>
          </div>

          <div className="mt-6">
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

          <button
            type="button"
            disabled={!selectedSize}
            onClick={handleAddToCart}
            className="mt-6 flex h-[52px] w-full items-center justify-center bg-ink text-[14px] uppercase tracking-[0.1em] text-white transition-colors disabled:cursor-not-allowed disabled:opacity-40"
          >
            {added ? 'Added to Cart' : 'Add to Cart'}
          </button>

          {!selectedSize && (
            <p className="mt-2 text-center text-xs font-normal text-muted">Please select a size</p>
          )}

          <div className="mt-6 border-t border-border pt-4">
            <button
              type="button"
              onClick={() => setDescriptionOpen((v) => !v)}
              className="flex min-h-11 w-full items-center justify-between text-left text-[13px] font-medium uppercase tracking-[0.04em] text-ink"
            >
              Description
              <ChevronIcon size={16} className={`transition-transform ${descriptionOpen ? 'rotate-90' : ''}`} />
            </button>
            {descriptionOpen && (
              <p className="mt-2 pb-2 text-sm font-normal leading-relaxed text-muted">{product.description}</p>
            )}
          </div>
        </div>
      </div>

      <div className="mt-4 border-t border-border md:mt-12">
        <ProductCarousel title="You may also like" />
      </div>
    </div>
  )
}
