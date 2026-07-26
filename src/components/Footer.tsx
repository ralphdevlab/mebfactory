const FOOTER_COLUMNS = [
  {
    heading: 'Shop',
    links: ['New Arrivals', 'Outerwear', 'Knitwear', 'Accessories'],
  },
  {
    heading: 'Help',
    links: ['Shipping', 'Returns', 'Size Guide', 'Contact'],
  },
  {
    heading: 'About',
    links: ['Our Story', 'Sustainability', 'Careers'],
  },
]

export default function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto max-w-[1440px] px-4 py-6 sm:px-6 sm:py-16">
        <div className="flex flex-col justify-between gap-6 sm:gap-12 md:flex-row">
          <div>
            <p className="text-xs font-medium tracking-[0.22em] text-ink sm:text-lg">MEBFACTORY</p>
          </div>

          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 sm:gap-10">
            {FOOTER_COLUMNS.map((col) => (
              <div key={col.heading}>
                <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-ink sm:text-[11px]">
                  {col.heading}
                </p>
                <ul className="mt-2 flex flex-col gap-1.5 sm:mt-4 sm:gap-3">
                  {col.links.map((link) => (
                    <li key={link}>
                      <a href="#" className="text-[10px] font-normal text-muted hover:text-ink sm:text-sm">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 flex flex-col items-start justify-between gap-2 border-t border-border pt-4 sm:mt-16 sm:flex-row sm:items-center sm:gap-4 sm:pt-8">
          <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-muted sm:text-[11px]">
            © 2026 MEBFACTORY. ALL RIGHTS RESERVED.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-[10px] font-medium uppercase tracking-[0.14em] text-muted hover:text-ink sm:text-[11px]">
              Privacy
            </a>
            <a href="#" className="text-[10px] font-medium uppercase tracking-[0.14em] text-muted hover:text-ink sm:text-[11px]">
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
