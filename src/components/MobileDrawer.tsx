import { useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { WOMAN_SUBCATEGORIES, type NavItem } from '../data/nav'
import { ChevronIcon, CloseIcon, HomeIcon, SearchIcon } from './icons'

// Off-canvas navigation for the mobile navbar's hamburger. Always mounted so
// the slide transition runs both ways; `open` drives the transform and the
// overlay.
export default function MobileDrawer({
  open,
  onClose,
  onOpenSearch,
}: {
  open: boolean
  onClose: () => void
  onOpenSearch: () => void
}) {
  const { user } = useAuth()
  const { itemCount } = useCart()
  const [expanded, setExpanded] = useState<'woman' | null>(null)

  const close = () => {
    setExpanded(null)
    onClose()
  }

  return (
    <>
      <div
        onClick={close}
        className={`fixed inset-0 z-[99] bg-black/50 transition-opacity duration-300 md:hidden ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />

      <div
        className={`fixed left-0 top-0 z-[100] h-screen w-[82vw] max-w-[340px] bg-white transition-transform duration-300 ease-in-out md:hidden ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-[52px] items-center justify-between border-b border-border px-4">
          <span className="text-[16px] font-bold tracking-[0.14em] text-ink">MEBFACTORY</span>
          <button
            type="button"
            onClick={close}
            aria-label="Close menu"
            className="flex h-11 w-11 items-center justify-center text-ink"
          >
            <CloseIcon size={20} />
          </button>
        </div>

        <nav className="flex h-[calc(100vh-52px)] flex-col overflow-y-auto">
          <DrawerLink to="/" onClick={close} icon={<HomeIcon size={16} />}>
            Home
          </DrawerLink>

          <button
            type="button"
            onClick={onOpenSearch}
            className="flex min-h-[44px] items-center gap-3 border-b border-border px-6 py-4 text-left text-[13px] uppercase tracking-[0.08em] text-muted"
          >
            <SearchIcon size={16} />
            Search
          </button>

          <ExpandableRow
            label="WOMAN"
            open={expanded === 'woman'}
            onToggle={() => setExpanded((v) => (v === 'woman' ? null : 'woman'))}
            items={WOMAN_SUBCATEGORIES}
            onNavigate={close}
          />

          <DrawerLink to="/#collections" onClick={close}>Collections</DrawerLink>
          <DrawerLink to="/shop?sale=true" onClick={close}>SALE</DrawerLink>

          <div className="mt-auto border-t border-border">
            <DrawerLink to={user ? '/account' : '/login'} onClick={close} compact>My Account</DrawerLink>
            <DrawerLink to={user ? '/account?tab=wishlist' : '/login'} onClick={close} compact>
              Wishlist
            </DrawerLink>
            <DrawerLink to="/cart" onClick={close} compact>
              Cart{itemCount > 0 ? ` (${itemCount})` : ''}
            </DrawerLink>
          </div>
        </nav>
      </div>
    </>
  )
}

function ExpandableRow({
  label,
  open,
  onToggle,
  items,
  onNavigate,
}: {
  label: string
  open: boolean
  onToggle: () => void
  items: NavItem[]
  onNavigate: () => void
}) {
  return (
    <div className="border-b border-border">
      <button
        type="button"
        onClick={onToggle}
        className="flex min-h-[44px] w-full items-center justify-between px-6 py-4 text-[15px] font-bold uppercase tracking-[0.04em] text-ink"
      >
        {label}
        <ChevronIcon size={16} className={`transition-transform ${open ? 'rotate-90' : ''}`} />
      </button>
      {open && (
        <div className="pb-2">
          {items.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              onClick={onNavigate}
              className="block min-h-[44px] py-2.5 pl-10 pr-6 text-[13px] text-muted"
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

function DrawerLink({
  to,
  onClick,
  children,
  compact = false,
  icon,
}: {
  to: string
  onClick: () => void
  children: ReactNode
  compact?: boolean
  icon?: ReactNode
}) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`flex min-h-[44px] items-center gap-3 border-b border-border px-6 py-4 uppercase text-ink ${
        compact ? 'text-[13px] font-medium tracking-[0.06em]' : 'text-[15px] font-bold tracking-[0.04em]'
      }`}
    >
      {icon}
      {children}
    </Link>
  )
}
