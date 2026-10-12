import { cat } from './nav'

// Config for the homepage's horizontal-scroll category pills (directly below
// the hero). `to` is derived from the shared `cat()` helper so these land on
// the same /shop?category= / ?new= / ?sale= query scheme as the rest of the
// nav.
export interface CategoryPill {
  label: string
  image: string
}

export const CATEGORY_PILLS: CategoryPill[] = [
  { label: 'NEW IN', image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=200&q=80' },
  { label: 'WOMAN', image: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=200&q=80' },
  { label: 'MAN', image: 'https://images.unsplash.com/photo-1488161628813-04466f872be2?w=200&q=80' },
  { label: 'TOPS', image: 'https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=200&q=80' },
  { label: 'BOTTOMS', image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=200&q=80' },
  { label: 'OUTERWEAR', image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=200&q=80' },
  { label: 'SALE', image: 'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=200&q=80' },
]

export const pillLink = (label: string) => cat(label).to

// "Shop by category" 2x2 image grid.
export interface CategoryTile {
  label: string
  image: string
}

export const CATEGORY_TILES: CategoryTile[] = [
  { label: 'WOMAN', image: 'https://images.unsplash.com/photo-1581044777550-4cfa60707c03?w=800&q=80' },
  { label: 'MAN', image: 'https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?w=800&q=80' },
  { label: 'NEW IN', image: 'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=800&q=80' },
  { label: 'SALE', image: 'https://images.unsplash.com/photo-1514866747592-c2d279258a78?w=800&q=80' },
]

export const tileLink = (label: string) => cat(label).to

// Full-bleed editorial banner.
export const EDITORIAL_BANNER = {
  image: 'https://images.unsplash.com/photo-1475178626620-a4d074967452?w=1920&q=80',
  headline: 'JEANS BY FIT',
  cta: 'SHOP NOW',
  to: cat('jeans').to,
}
