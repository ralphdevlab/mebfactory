import type { ImgHTMLAttributes } from 'react'

// Generic, neutral fashion photo used whenever a product has no image or
// its image URL fails to load, so a shopper never sees a broken-image icon.
export const FALLBACK_PRODUCT_IMAGE = 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&q=80'

interface ProductImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'onError'> {
  src?: string | null
}

export default function ProductImage({
  src,
  alt,
  className = '',
  loading = 'lazy',
  ...rest
}: ProductImageProps) {
  return (
    <img
      {...rest}
      src={src || FALLBACK_PRODUCT_IMAGE}
      alt={alt}
      loading={loading}
      className={className}
      onError={(e) => {
        // Guard against the fallback itself ever failing and looping.
        e.currentTarget.onerror = null
        e.currentTarget.src = FALLBACK_PRODUCT_IMAGE
      }}
    />
  )
}
