// Navigation taxonomy for the redesigned storefront. Labels are what the
// shopper sees; `to` is where the link goes. Category links point at the
// existing /shop route with a `?category=` (or `?new` / `?sale`) query the
// Shop page already understands.
export interface NavItem {
  label: string
  to: string
}

export const cat = (label: string): NavItem => {
  const key = label.toLowerCase()
  if (key === 'new in') return { label, to: '/shop?new=true' }
  if (key === 'sale') return { label, to: '/shop?sale=true' }
  return { label, to: `/shop?category=${encodeURIComponent(key)}` }
}

export interface MegaMenu {
  columns: NavItem[][]
  image: string
  caption: string
}

export const WOMAN_MENU: MegaMenu = {
  columns: [
    ['NEW IN', 'JACKETS', 'TOPS & BODYSUITS', 'PANTS', 'JEANS'].map(cat),
    ['DRESSES', 'SWEATSHIRTS', 'T-SHIRTS', 'SHORTS', 'SKIRTS'].map(cat),
    ['SHOES', 'ACCESSORIES', 'SALE'].map(cat),
  ],
  image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&q=80',
  caption: 'NEW IN',
}

export const MAN_MENU: MegaMenu = {
  columns: [
    ['NEW IN', 'JACKETS', 'T-SHIRTS', 'JEANS', 'PANTS'].map(cat),
    ['SWEATSHIRTS', 'SHORTS', 'SHIRTS', 'SHOES', 'ACCESSORIES'].map(cat),
    ['SALE'].map(cat),
  ],
  image: 'https://images.unsplash.com/photo-1488161628813-04466f872be2?w=400&q=80',
  caption: 'NEW IN',
}

// Flat subcategory list for the mobile drawer's expandable Woman row.
export const WOMAN_SUBCATEGORIES: NavItem[] = [
  'NEW IN', 'JACKETS', 'TOPS', 'PANTS', 'JEANS',
  'DRESSES', 'SHORTS', 'SKIRTS', 'SHOES', 'ACCESSORIES',
].map(cat)

// Desktop nav is now women's-focused and simplified; COLLECTIONS jumps to
// the college-collection pills row on the homepage (id="collections").
export const PRIMARY_LINKS: NavItem[] = [
  { label: 'SHOP', to: '/shop' },
  { label: 'COLLECTIONS', to: '/#collections' },
  { label: 'SALE', to: '/shop?sale=true' },
]
