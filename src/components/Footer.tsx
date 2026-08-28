import { Link } from 'react-router-dom'

const FOOTER_COLUMNS = [
  {
    heading: 'HELP',
    links: [
      { label: 'Shipping', to: '/shop' },
      { label: 'Returns', to: '/shop' },
      { label: 'Size Guide', to: '/size-guide' },
      { label: 'Contact', to: '/contact' },
    ],
  },
  {
    heading: 'COMPANY',
    links: [
      { label: 'Our Story', to: '/shop' },
      { label: 'Sustainability', to: '/shop' },
      { label: 'Careers', to: '/shop' },
    ],
  },
  {
    heading: 'FOLLOW US',
    links: [
      { label: 'Instagram', to: '/shop' },
      { label: 'TikTok', to: '/shop' },
      { label: 'Pinterest', to: '/shop' },
    ],
  },
  {
    heading: 'ACCOUNT',
    links: [
      { label: 'My Account', to: '/account' },
      { label: 'Orders', to: '/account' },
      { label: 'Wishlist', to: '/account?tab=wishlist' },
    ],
  },
]

export default function Footer() {
  return (
    <footer className="border-t border-border bg-white">
      <div className="grid grid-cols-2 gap-6 px-6 pb-6 pt-12 md:grid-cols-4">
        {FOOTER_COLUMNS.map((col) => (
          <div key={col.heading}>
            <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.14em] text-[#0A0A0A]">
              {col.heading}
            </p>
            <ul className="flex flex-col gap-3">
              {col.links.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-[12px] uppercase tracking-[0.08em] text-muted hover:text-[#0A0A0A]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-border">
        <div className="flex flex-col gap-2 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[10px] text-muted">© 2026 MEBFACTORY. ALL RIGHTS RESERVED.</p>
          <p className="text-[10px] tracking-[0.1em] text-muted">VISA MASTERCARD AMEX</p>
        </div>
      </div>
    </footer>
  )
}
