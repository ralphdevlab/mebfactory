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
      <div className="mx-auto max-w-[1440px] px-6 py-16">
        <div className="flex flex-col justify-between gap-12 md:flex-row">
          <div>
            <p className="text-lg font-medium tracking-[0.22em] text-ink">MEBFACTORY</p>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
            {FOOTER_COLUMNS.map((col) => (
              <div key={col.heading}>
                <p className="label text-ink">{col.heading}</p>
                <ul className="mt-4 flex flex-col gap-3">
                  {col.links.map((link) => (
                    <li key={link}>
                      <a href="#" className="text-sm font-normal text-muted hover:text-ink">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-border pt-8 sm:flex-row sm:items-center">
          <p className="label text-muted">© 2026 MEBFACTORY. ALL RIGHTS RESERVED.</p>
          <div className="flex gap-6">
            <a href="#" className="label text-muted hover:text-ink">
              Privacy
            </a>
            <a href="#" className="label text-muted hover:text-ink">
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
