import { CATEGORY_PILLS } from '../data/homeSections'
import { useSchool } from '../context/SchoolContext'

// Horizontal-scroll row of the college-collection color-circle shortcuts,
// sitting directly below the hero. Clicking a pill sets selectedSchool in
// SchoolContext (which also persists to localStorage), filtering the
// homepage's own New Arrivals/All Products sections in place rather than
// navigating away - so the active pill has to be driven from the same
// context, not a separate `active` prop that could fall out of sync.
export default function CategoryPills() {
  const { selectedSchool, setSelectedSchool } = useSchool()

  return (
    <div className="scrollbar-hide flex gap-5 overflow-x-auto bg-white px-4 py-3">
      {CATEGORY_PILLS.map((pill) => {
        const isActive = selectedSchool === pill.collection
        return (
          <button
            key={pill.collection}
            type="button"
            onClick={() => setSelectedSchool(pill.collection)}
            className="flex shrink-0 flex-col items-center gap-2"
          >
            <span
              className={`h-16 w-16 shrink-0 overflow-hidden rounded-full ${
                isActive ? 'border-2 border-ink' : ''
              }`}
            >
              <span
                className="block h-full w-full rounded-full"
                style={{ backgroundColor: pill.color }}
              />
            </span>
            <span className="text-center text-[10px] uppercase tracking-[0.1em] text-ink">
              {pill.label}
            </span>
          </button>
        )
      })}
    </div>
  )
}
