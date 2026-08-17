import { Link, NavLink } from 'react-router-dom'
import SearchBar from './SearchBar'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

const NAV_LINKS = [
  { label: 'Shop All', to: '/shop' },
  { label: 'New Arrivals', to: '/shop?new=true' },
  { label: 'Men', to: '/shop?category=men' },
  { label: 'Women', to: '/shop?category=women' },
  { label: 'Collections', to: '/shop' },
  { label: 'Sale', to: '/shop?sale=true' },
]

export default function Navbar() {
  const { itemCount } = useCart()
  const { user, loading, logout } = useAuth()

  return (
    <header className="relative border-b border-border bg-surface">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between px-4 py-3 md:px-6">
        <Link to="/" className="text-sm font-medium tracking-[0.18em] text-ink">
          MEBFACTORY
        </Link>

        <nav className="hidden shrink-0 items-center gap-5 md:flex">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.label}
              to={link.to}
              className="whitespace-nowrap text-[10px] font-medium uppercase tracking-[0.14em] text-ink transition-colors hover:text-muted"
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-4">
          {!loading && (
            <div className="hidden items-center gap-2 md:flex">
              {user ? (
                <>
                  <Link
                    to="/account"
                    className="whitespace-nowrap text-[10px] font-medium uppercase tracking-[0.14em] text-ink hover:text-muted"
                  >
                    Hi, {user.firstName ?? user.email}
                  </Link>
                  <button
                    type="button"
                    onClick={logout}
                    className="text-[10px] font-medium uppercase tracking-[0.14em] text-muted hover:text-ink"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="text-[10px] font-medium uppercase tracking-[0.14em] text-ink hover:text-muted"
                >
                  Login
                </Link>
              )}
            </div>
          )}
          <SearchBar />
          <Link to={user ? '/account?tab=wishlist' : '/login'} aria-label="Wishlist" className="text-ink">
            <HeartIcon />
          </Link>
          <Link to={user ? '/account' : '/login'} aria-label="Account" className="text-ink">
            <UserIcon />
          </Link>
          <Link to="/cart" aria-label="Cart" className="relative text-ink">
            <BagIcon />
            {itemCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center bg-charcoal text-[10px] font-medium text-surface">
                {itemCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  )
}

function HeartIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  )
}

function UserIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c1.5-4.5 5-6.5 8-6.5s6.5 2 8 6.5" strokeLinecap="round" />
    </svg>
  )
}

function BagIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M6 7h12l1 14H5L6 7z" />
      <path d="M9 7a3 3 0 0 1 6 0" />
    </svg>
  )
}
