import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import SearchBar from './SearchBar'
import MobileDrawer from './MobileDrawer'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { PRIMARY_LINKS } from '../data/nav'
import { AccountIcon, BagIcon, HeartIcon, MenuIcon, SearchIcon } from './icons'

export default function Navbar() {
  const { itemCount } = useCart()
  const { user } = useAuth()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-[#E8C4B8] bg-white">
      {/* Desktop */}
      <div className="mx-auto hidden h-[60px] max-w-[1440px] items-center px-6 md:flex">
        <Link to="/" className="shrink-0 text-[18px] font-bold tracking-[0.14em] text-[#8B5E52]">
          MEBFACTORY
        </Link>

        <nav className="mx-auto flex items-center gap-8">
          {PRIMARY_LINKS.map((link) => (
            <NavLink
              key={link.label}
              to={link.to}
              className="text-[13px] font-medium uppercase tracking-[0.08em] text-ink transition-colors hover:text-[#C4847A]"
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-5">
          <button
            type="button"
            aria-label="Search"
            onClick={() => setSearchOpen((v) => !v)}
            className="text-ink"
          >
            <SearchIcon size={19} />
          </button>
          <Link to={user ? '/account?tab=wishlist' : '/login'} aria-label="Wishlist" className="text-ink">
            <HeartIcon size={19} />
          </Link>
          <Link to={user ? '/account' : '/login'} aria-label="Account" className="text-ink">
            <AccountIcon size={19} />
          </Link>
          <Link to="/cart" aria-label="Cart" className="relative text-ink">
            <BagIcon size={19} />
            {itemCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center bg-ink text-[10px] font-medium text-white">
                {itemCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Mobile */}
      <div className="flex h-[52px] items-center justify-between px-4 md:hidden">
        <button
          type="button"
          aria-label="Open menu"
          onClick={() => setDrawerOpen(true)}
          className="flex h-11 w-11 items-center justify-center text-ink"
        >
          <MenuIcon size={22} />
        </button>
        <Link to="/" className="text-[16px] font-bold tracking-[0.14em] text-[#8B5E52]">
          MEBFACTORY
        </Link>
        <Link
          to="/cart"
          aria-label="Cart"
          className="relative flex h-11 w-11 items-center justify-center text-ink"
        >
          <BagIcon size={21} />
          {itemCount > 0 && (
            <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center bg-ink text-[10px] font-medium text-white">
              {itemCount}
            </span>
          )}
        </Link>
      </div>

      {searchOpen && <SearchBar onClose={() => setSearchOpen(false)} />}

      <MobileDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onOpenSearch={() => {
          setDrawerOpen(false)
          setSearchOpen(true)
        }}
      />
    </header>
  )
}
