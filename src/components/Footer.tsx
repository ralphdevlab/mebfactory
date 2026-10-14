import { Link } from 'react-router-dom'

const FOOTER_COLUMNS = [
  {
    heading: 'SHOP',
    links: [
      { label: 'New Arrivals', to: '/shop?new=true' },
      { label: 'Woman', to: '/shop?category=woman' },
      { label: 'Man', to: '/shop?category=man' },
      { label: 'Sale', to: '/shop?sale=true' },
    ],
  },
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
    <footer
      className="border-t border-[#E8C4B8]"
      style={{ background: 'linear-gradient(135deg, #FDF3E7 0%, #FAE8D8 100%)' }}
    >
      <div className="px-4 pt-10 md:px-6">
        <Link to="/" className="font-serif text-[18px] font-bold italic tracking-[0.06em] text-[#7A5A10]">
          MEBFACTORY
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-8 px-4 py-8 md:grid-cols-4 md:px-6">
        {FOOTER_COLUMNS.map((col) => (
          <div key={col.heading}>
            <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.14em] text-[#8B5E52]">
              {col.heading}
            </p>
            <ul className="flex flex-col gap-3">
              {col.links.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="block min-h-[20px] text-[12px] uppercase tracking-[0.04em] text-[#6B5544] hover:text-[#8B5E52]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-[#E8C4B8] bg-[#FDF0EC]">
        <div className="flex flex-col gap-2 px-4 py-4 sm:flex-row sm:items-center sm:justify-between md:px-6">
          <p className="text-[10px] text-[#A07060]">© 2026 MEBFACTORY</p>
          <p className="text-[10px] tracking-[0.1em] text-muted">VISA MASTERCARD AMEX</p>
        </div>
      </div>
    </footer>
  )
}
