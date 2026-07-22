const ITEMS = [
  { title: 'Free Shipping', icon: TruckIcon },
  { title: 'Free Returns', icon: ReturnIcon },
  { title: 'Secure Checkout', icon: LockIcon },
]

export default function TrustStrip() {
  return (
    <div className="border-y border-border bg-surface">
      <div className="mx-auto flex max-w-[1440px] flex-col divide-y divide-border sm:grid sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        {ITEMS.map((item) => (
          <div key={item.title} className="flex items-center justify-center gap-3 px-6 py-4 sm:gap-4 sm:py-10">
            <item.icon />
            <p className="label text-ink">{item.title}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function TruckIcon() {
  return (
    <svg
      className="h-[18px] w-[18px] shrink-0 sm:h-[26px] sm:w-[26px]"
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
      className="h-[18px] w-[18px] shrink-0 sm:h-[26px] sm:w-[26px]"
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
      className="h-[18px] w-[18px] shrink-0 sm:h-[26px] sm:w-[26px]"
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
