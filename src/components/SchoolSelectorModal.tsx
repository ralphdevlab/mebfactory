import { useEffect } from 'react'
import { useSchool } from '../context/SchoolContext'
import { SCHOOLS } from '../data/schools'

// Tracks whether the shopper has gone through (or dismissed) the school
// selector at least once - distinct from `mebfactory_school` (the actual
// pick), since "Browse All" skips picking a school but should still stop
// the popup from showing again.
const SEEN_KEY = 'mebfactory_school_selected'

export default function SchoolSelectorModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { setSelectedSchool } = useSchool()

  useEffect(() => {
    if (!open) return
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') dismiss()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  if (!open) return null

  function markSeen() {
    try {
      localStorage.setItem(SEEN_KEY, 'true')
    } catch {
      // localStorage unavailable - popup may reappear next visit, not fatal
    }
  }

  function selectSchool(collection: string) {
    setSelectedSchool(collection)
    markSeen()
    onClose()
  }

  function dismiss() {
    markSeen()
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-[150] flex items-center justify-center bg-black/60 p-4"
      onClick={dismiss}
    >
      <div className="w-full max-w-md bg-white p-6" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-center text-[22px] font-bold uppercase text-ink">What's Your School?</h2>
        <p className="mx-auto mt-2 max-w-[280px] text-center text-[13px] text-muted">
          Show us your pride. We'll show you your collection.
        </p>

        <div className="mt-6 grid grid-cols-2 gap-3">
          {SCHOOLS.map((school) => (
            <button
              key={school.collection}
              type="button"
              onClick={() => selectSchool(school.collection)}
              className="w-full px-4 py-3.5 text-center text-[12px] font-bold uppercase text-white"
              style={{ backgroundColor: school.color }}
            >
              {school.name} {school.emoji}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={dismiss}
          className="mx-auto mt-6 block text-[12px] uppercase tracking-[0.08em] text-muted underline hover:text-ink"
        >
          Browse All
        </button>
      </div>
    </div>
  )
}
