const MESSAGE = 'New arrivals every Friday — free shipping over $75'

export default function AnnouncementBar() {
  return (
    <div className="bg-charcoal text-surface">
      <div className="mx-auto flex max-w-[1440px] items-center justify-center px-4 py-2">
        <p className="text-[10px] font-medium uppercase tracking-[0.14em]">{MESSAGE}</p>
      </div>
    </div>
  )
}
