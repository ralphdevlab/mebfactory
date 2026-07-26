const ITEMS = [
  { title: 'Free shipping over $75', icon: TruckIcon },
  { title: 'Easy 30-day returns', icon: ReturnIcon },
  { title: 'Safe & secure checkout', icon: LockIcon },
]

export default function TrustStrip() {
  return (
    <div className="rounded-[6px] border-y border-border bg-surface">
      <div className="mx-auto grid max-w-[1440px] grid-cols-1 divide-y-[0.5px] divide-border md:grid-cols-3 md:divide-x-[0.5px] md:divide-y-0">
        {ITEMS.map((item) => (
          <div key={item.title} className="flex items-center justify-center gap-2 py-3 md:py-4">
            <item.icon />
            <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-ink">{item.title}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function TruckIcon() {
  return (
    <svg
      className="h-4 w-4 shrink-0"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M1 3h13v13H1z" />
      <path d="M14 8h4l3 3v5h-7V8z" />
      <circle cx="5.5" cy="18.5" r="1.5" />
      <circle cx="17.5" cy="18.5" r="1.5" />
    </svg>
  )
}

function ReturnIcon() {
  return (
    <svg
      className="h-4 w-4 shrink-0"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M3 12a9 9 0 1 0 3-6.7" />
      <path d="M3 3v5h5" />
    </svg>
  )
}

function LockIcon() {
  return (
    <svg
      className="h-4 w-4 shrink-0"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <rect x="4" y="11" width="16" height="10" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </svg>
  )
}
