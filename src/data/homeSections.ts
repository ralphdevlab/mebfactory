import { cat } from './nav'

// Config for the homepage's horizontal-scroll category pills (directly below
// the hero). Client feedback (2026-10-14): drop the regular taxonomy pills
// (New In/Woman/Man/Tops/Bottoms/Outerwear/Sale) and show only the college
// capsule collections, each a solid school-color circle (no logos/branding)
// linking into /shop?collection=<tag>.
export interface CategoryPill {
  label: string
  color: string
  to: string
}

export const CATEGORY_PILLS: CategoryPill[] = [
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

// Full-bleed editorial banner.
export const EDITORIAL_BANNER = {
  image: 'https://images.unsplash.com/photo-1475178626620-a4d074967452?w=1920&q=80',
  headline: 'JEANS BY FIT',
  cta: 'SHOP NOW',
  to: cat('jeans').to,
}
