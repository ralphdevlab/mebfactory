import type { Category } from '../types'

const img = (seed: string) =>
  `https://placehold.co/800x600/ECEAE6/2C2C2C?font=montserrat&text=${encodeURIComponent(seed)}`

export const categories: Category[] = [
  { id: 'c-outerwear', label: 'Outerwear', image: img('Outerwear') },
  { id: 'c-knitwear', label: 'Knitwear', image: img('Knitwear') },
  { id: 'c-accessories', label: 'Accessories', image: img('Accessories') },
]
