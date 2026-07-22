import { Link } from 'react-router-dom'
import type { Category } from '../types'

export default function CategoryCard({
  category,
  className = '',
}: {
  category: Category
  className?: string
}) {
  return (
    <Link
      to={`/shop?category=${encodeURIComponent(category.label)}`}
      className={`group block h-full w-full ${className}`}
    >
      <div className="relative aspect-[4/3] h-full w-full overflow-hidden bg-hero">
        <p className="label absolute bottom-3 left-3 text-ink">{category.label}</p>
      </div>
    </Link>
  )
}
