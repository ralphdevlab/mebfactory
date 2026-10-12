import { Link } from 'react-router-dom'
import { CATEGORY_PILLS } from '../data/homeSections'

// Horizontal-scroll row of circular category shortcuts, sitting directly
// below the hero. `active` (a pill label) draws a 2px ring around the
// matching circle - unused on the homepage today, but kept so this can be
// reused wherever a "currently selected" pill makes sense.
export default function CategoryPills({ active }: { active?: string }) {
  return (
    <div className="scrollbar-hide flex gap-5 overflow-x-auto bg-white px-4 py-3">
      {CATEGORY_PILLS.map((pill) => {
        const isActive = active?.toUpperCase() === pill.label
        return (
          <Link
            key={pill.label}
            to={pill.to}
            className="flex shrink-0 flex-col items-center gap-2"
          >
            <span
              className={`h-16 w-16 shrink-0 overflow-hidden rounded-full ${
                isActive ? 'border-2 border-ink' : ''
              }`}
            >
              {pill.image ? (
                <img
                  src={pill.image}
                  alt=""
                  loading="lazy"
                  className="h-full w-full rounded-full object-cover"
                />
              ) : (
                <span
                  className="block h-full w-full rounded-full"
                  style={{ backgroundColor: pill.color }}
                />
              )}
            </span>
            <span className="text-center text-[10px] uppercase tracking-[0.1em] text-ink">
              {pill.label}
            </span>
          </Link>
        )
      })}
    </div>
  )
}
