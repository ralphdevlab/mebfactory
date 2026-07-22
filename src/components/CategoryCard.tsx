import { Link } from 'react-router-dom'
import type { Category } from '../types'

export default function CategoryCard({ category }: { category: Category }) {
  return (
    <Link to={`/shop?category=${encodeURIComponent(category.label)}`} className="group block">
      <div className="relative aspect-[4/3] overflow-hidden bg-hero">
        <p className="label absolute bottom-3 left-3 text-ink">{category.label}</p>
      </div>
    </Link>
  )
}
