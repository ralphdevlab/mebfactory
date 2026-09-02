import { useState } from 'react'

const STORAGE_KEY = 'wip-banner-dismissed'

export default function WIPBanner() {
  const [dismissed, setDismissed] = useState(() => {
    try {
      return sessionStorage.getItem(STORAGE_KEY) === '1'
    } catch {
      return false
    }
  })

  if (dismissed) return null

  const dismiss = () => {
    try {
      sessionStorage.setItem(STORAGE_KEY, '1')
    } catch {
      // sessionStorage unavailable (private mode etc.) — still hide for this render
    }
    setDismissed(true)
  }

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-[999] flex items-center justify-between gap-3 bg-[#2C2825] px-6 py-[10px]"
    >
      <div className="flex min-w-0 items-center gap-2">
        <span className="h-2 w-2 shrink-0 animate-pulse rounded-full bg-[#D4A8A0]" />
        <span className="truncate text-[10px] uppercase tracking-[0.12em] text-white/80 sm:text-[11px]">
          Work in Progress — Actively updated based on client feedback · Agile build
        </span>
      </div>
      <button
        type="button"
        onClick={dismiss}
        className="shrink-0 text-[10px] uppercase tracking-[0.12em] text-white/50 transition-opacity hover:text-white hover:opacity-100"
      >
        Dismiss
      </button>
    </div>
  )
}
