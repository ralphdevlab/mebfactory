import { cat } from './nav'

// Config for the homepage's horizontal-scroll category pills (directly below
// the hero). Each pill is either an image circle (the regular taxonomy,
// linking into /shop?category= / ?new= / ?sale= via the shared `cat()`
// helper) or a solid color circle (the college capsule collections, linking
// into /shop?collection=<tag>).
export interface CategoryPill {
  label: string
  image?: string
  color?: string
  to: string
}

export const CATEGORY_PILLS: CategoryPill[] = [
  { label: 'NEW IN', image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=200&q=80', to: cat('NEW IN').to },
  { label: 'WOMAN', image: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=200&q=80', to: cat('WOMAN').to },
  { label: 'MAN', image: 'https://images.unsplash.com/photo-1488161628813-04466f872be2?w=200&q=80', to: cat('MAN').to },
  { label: 'TOPS', image: 'https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=200&q=80', to: cat('TOPS').to },
  { label: 'BOTTOMS', image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=200&q=80', to: cat('BOTTOMS').to },
  { label: 'OUTERWEAR', image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=200&q=80', to: cat('OUTERWEAR').to },
  { label: 'SALE', image: 'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=200&q=80', to: cat('SALE').to },
  // College capsule collections — solid school-color circles, no logos/branding.
  { label: 'UF', color: '#FA4616', to: '/shop?collection=uf' },
  { label: 'FSU', color: '#782F40', to: '/shop?collection=fsu' },
  { label: 'UCF', color: '#000000', to: '/shop?collection=ucf' },
  { label: 'USF', color: '#006747', to: '/shop?collection=usf' },
  { label: 'FAU', color: '#002857', to: '/shop?collection=fau' },
  { label: 'MIAMI', color: '#F47321', to: '/shop?collection=miami' },
  { label: 'HOWARD', color: '#003DA5', to: '/shop?collection=howard' },
  { label: 'FAMU', color: '#F58426', to: '/shop?collection=famu' },
  { label: 'BCU', color: '#862633', to: '/shop?collection=bcu' },
  { label: 'SPELMAN', color: '#00205B', to: '/shop?collection=spelman' },
]

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
