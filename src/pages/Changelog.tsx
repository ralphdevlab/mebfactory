interface Sprint {
  name: string
  status: 'IN PROGRESS' | 'COMPLETE'
  date: string
  items: string[]
}

const SPRINTS: Sprint[] = [
  {
    name: 'Sprint 4',
    status: 'IN PROGRESS',
    date: 'September 2026',
    items: [
      'Admin panel image uploads',
      'Seasonal theme system',
      'Bershka-inspired layout redesign',
    ],
  },
  {
    name: 'Sprint 3',
    status: 'COMPLETE',
    date: 'August 2026',
    items: [
      'Stripe payments',
      'Order confirmation emails',
      'Search',
      'Size guide',
      'Empty states',
      'Loading skeletons',
    ],
  },
  {
    name: 'Sprint 2',
    status: 'COMPLETE',
    date: 'July 2026',
    items: [
      'Backend API',
      'PostgreSQL database',
      'JWT auth',
      'Persistent cart and wishlist',
      'Order management',
    ],
  },
  {
    name: 'Sprint 1',
    status: 'COMPLETE',
    date: 'June 2026',
    items: [
      'React + Vite + Tailwind scaffold',
      'Homepage, shop, product detail, cart',
      'Deployed to Vercel',
    ],
  },
]

function StatusBadge({ status }: { status: Sprint['status'] }) {
  const inProgress = status === 'IN PROGRESS'
  return (
    <span
      className={`rounded-none px-2 py-[3px] text-[9px] uppercase tracking-[0.12em] ${
        inProgress ? 'bg-[#D4A8A0] text-[#2C2825]' : 'bg-[#2C2825] text-white'
      }`}
    >
      {status}
    </span>
  )
}

export default function Changelog() {
  return (
    <div className="mx-auto max-w-[760px] px-6 py-12">
      <h1 className="text-[28px] font-bold uppercase tracking-[0.04em] text-ink">Build Log</h1>
      <p className="mt-3 text-sm font-normal leading-relaxed text-muted">
        Actively built using agile methodology based on client feedback
      </p>

      <div className="mt-12 flex flex-col">
        {SPRINTS.map((sprint, i) => (
          <div
            key={sprint.name}
            className={`py-8 ${i > 0 ? 'border-t border-border' : ''}`}
          >
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-[13px] font-bold uppercase tracking-[0.12em] text-ink">
                {sprint.name}
              </h2>
              <StatusBadge status={sprint.status} />
              <span className="text-[11px] uppercase tracking-[0.1em] text-muted">
                {sprint.date}
              </span>
            </div>
            <ul className="mt-4 flex flex-col gap-2">
              {sprint.items.map((item) => (
                <li
                  key={item}
                  className="text-[13px] font-normal leading-relaxed text-muted before:mr-3 before:text-[#D4A8A0] before:content-['—']"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}
