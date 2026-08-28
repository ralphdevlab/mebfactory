import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import SearchBar from './SearchBar'
import MobileDrawer from './MobileDrawer'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { MAN_MENU, PRIMARY_LINKS, WOMAN_MENU, type MegaMenu } from '../data/nav'

export default function Navbar() {
  const { itemCount } = useCart()
  const { user, loading } = useAuth()
  const [openMenu, setOpenMenu] = useState<'WOMAN' | 'MAN' | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)

  const menuFor = (label: string): MegaMenu | null =>
    label === 'WOMAN' ? WOMAN_MENU : label === 'MAN' ? MAN_MENU : null

  return (
    <header
      className="sticky top-0 z-50 border-b border-border bg-white"
      onMouseLeave={() => setOpenMenu(null)}
    >
      {/* Desktop */}
      <div className="mx-auto hidden h-14 max-w-[1440px] items-center gap-6 px-6 md:flex">
        <Link to="/" className="shrink-0 text-[20px] font-bold tracking-normal text-ink">
          MEBFACTORY
        </Link>

        <nav className="flex h-full items-center gap-6">
          {PRIMARY_LINKS.map((link) => (
            <NavLink
              key={link.label}
              to={link.to}
              onMouseEnter={() => setOpenMenu(menuFor(link.label) ? (link.label as 'WOMAN' | 'MAN') : null)}
              className={({ isActive }) =>
                `flex h-full items-center border-b-2 text-[13px] font-medium uppercase tracking-[0.06em] transition-colors ${
                  isActive ? 'border-ink text-ink' : 'border-transparent text-ink hover:text-muted'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="ml-auto flex h-full items-center">
          <SearchBar />
        </div>

        <div className="flex shrink-0 items-center gap-4">
          {!loading && (
            <Link
              to={user ? '/account' : '/login'}
              className="whitespace-nowrap text-[13px] font-medium uppercase tracking-[0.06em] text-ink hover:text-muted"
            >
              {user ? `Hi, ${user.firstName ?? user.email}` : 'Log in'}
            </Link>
          )}
          <Link to="/cart" aria-label="Cart" className="relative text-ink">
            <BagIcon />
            {itemCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center bg-ink text-[10px] font-medium text-white">
                {itemCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Mobile */}
      <div className="flex h-12 items-center justify-between px-4 md:hidden">
        <button type="button" aria-label="Open menu" onClick={() => setDrawerOpen(true)} className="text-ink">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M3 6h18M3 12h18M3 18h18" />
          </svg>
        </button>
        <Link to="/" className="text-[18px] font-bold text-ink">
          MEBFACTORY
        </Link>
        <Link to="/cart" aria-label="Cart" className="relative text-ink">
          <BagIcon />
          {itemCount > 0 && (
            <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center bg-ink text-[10px] font-medium text-white">
              {itemCount}
            </span>
          )}
        </Link>
      </div>

      {/* Mega dropdown */}
      {openMenu && <MegaDropdown menu={openMenu === 'WOMAN' ? WOMAN_MENU : MAN_MENU} />}

      <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </header>
  )
}

function MegaDropdown({ menu }: { menu: MegaMenu }) {
  return (
    <div className="absolute inset-x-0 top-full hidden border-b border-border bg-white shadow-[0_12px_24px_-12px_rgba(0,0,0,0.15)] md:block">
      <div className="mx-auto grid max-w-[1440px] grid-cols-4 gap-8 px-6 py-8">
        {menu.columns.map((column, i) => (
          <ul key={i} className="flex flex-col gap-3">
            {column.map((item) => (
              <li key={item.label}>
                <Link
                  to={item.to}
                  className="text-[12px] uppercase tracking-[0.1em] text-ink no-underline hover:underline"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        ))}
        <div className="relative">
          <img src={menu.image} alt={menu.caption} className="h-72 w-full object-cover" />
          <p className="mt-2 text-[12px] font-bold uppercase tracking-[0.1em] text-ink">{menu.caption}</p>
        </div>
      </div>
    </div>
  )
}

function BagIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M6 7h12l1 14H5L6 7z" />
      <path d="M9 7a3 3 0 0 1 6 0" />
    </svg>
  )
}
