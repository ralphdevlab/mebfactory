import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSchool } from '../context/SchoolContext'
import { SCHOOLS } from '../data/schools'

// Tracks whether the shopper has gone through (or dismissed) the school
// selector at least once - distinct from `mebfactory_school` (the actual
// pick), since "Browse All" skips picking a school but should still stop
// the popup from showing again.
const SEEN_KEY = 'mebfactory_school_selected'

// Click feedback timeline for a school button: 150ms press (scale to 0.95),
// then a 300ms checkmark flash before the pick actually takes effect and
// the modal closes.
const PRESS_MS = 150
const CHECK_MS = 300

interface ClickState {
  collection: string
  phase: 'press' | 'check'
}

export default function SchoolSelectorModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { setSelectedSchool } = useSchool()
  const navigate = useNavigate()
  const [clicked, setClicked] = useState<ClickState | null>(null)

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

  function handleSelect(collection: string) {
    // Ignore taps on other buttons (or repeats) while one is mid-animation.
    if (clicked) return

    setClicked({ collection, phase: 'press' })
    setTimeout(() => {
      setClicked({ collection, phase: 'check' })
      setTimeout(() => {
        setSelectedSchool(collection)
        markSeen()
        onClose()
        setClicked(null)
      }, CHECK_MS)
    }, PRESS_MS)
  }

  function dismiss() {
    if (clicked) return
    markSeen()
    onClose()
  }

  // "Browse All" is an explicit reset: clear the pick (and the "seen"
  // flag, so a fresh visit asks again rather than silently staying
  // unfiltered) and land back on the homepage with no school filter -
  // works the same whether the modal opened on first visit or via
  // "Change school". Deliberately stays on "/" rather than going to
  // /shop.
  function browseAll() {
    if (clicked) return
    setSelectedSchool(null)
    try {
      localStorage.removeItem(SEEN_KEY)
    } catch {
      // localStorage unavailable - not fatal, just won't persist
    }
    onClose()
    navigate('/')
  }

  return (
    <div
      className="fixed inset-0 z-[150] flex items-center justify-center bg-black/60 p-4"
      onClick={dismiss}
    >
      <div
        className="w-full max-w-md bg-white p-6"
        style={{ boxShadow: '0 8px 40px rgba(196, 132, 122, 0.2)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-center text-[22px] font-bold uppercase text-ink">What's Your School?</h2>
        <p className="mx-auto mt-2 max-w-[280px] text-center text-[13px] text-[#A07060]">
          Show us your pride. We'll show you your collection.
        </p>

        <div className="mt-6 grid grid-cols-2 gap-3">
          {SCHOOLS.map((school) => {
            const isThisButton = clicked?.collection === school.collection
            const pressed = isThisButton && clicked.phase === 'press'
            const checked = isThisButton && clicked.phase === 'check'

            return (
              <button
                key={school.collection}
                type="button"
                onClick={() => handleSelect(school.collection)}
                className={`w-full px-4 py-3.5 text-center text-[12px] font-bold uppercase transition-transform duration-150 ease-out ${
                  school.darkText ? 'text-ink' : 'text-white'
                } ${pressed ? 'scale-95' : 'scale-100'}`}
                style={{ backgroundColor: school.color }}
              >
                {checked ? `✓ ${school.name}` : `${school.name} ${school.emoji}`}
              </button>
            )
          })}
        </div>

        <button
          type="button"
          onClick={browseAll}
          className="mx-auto mt-6 block text-[12px] uppercase tracking-[0.08em] text-[#C4847A] underline hover:opacity-70"
        >
          Browse All
        </button>
      </div>
    </div>
  )
}
