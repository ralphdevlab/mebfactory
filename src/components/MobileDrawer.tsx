import { useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  MAN_SUBCATEGORIES,
  WOMAN_SUBCATEGORIES,
  type NavItem,
} from '../data/nav'

// Off-canvas navigation for the mobile navbar's hamburger. Always mounted so
// the slide transition runs both ways; `open` drives the transform and the
// overlay.
export default function MobileDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { user } = useAuth()
  const [expanded, setExpanded] = useState<'woman' | 'man' | null>(null)

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
        className={`fixed left-0 top-0 z-[100] h-screen w-[80vw] max-w-[320px] bg-white transition-transform duration-300 ease-in-out md:hidden ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <Link to="/" onClick={close} className="text-[18px] font-bold text-ink">
            MEBFACTORY
          </Link>
          <button type="button" onClick={close} aria-label="Close menu" className="text-ink">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        <nav className="h-[calc(100vh-57px)] overflow-y-auto">
          <ExpandableRow
            label="WOMAN"
            open={expanded === 'woman'}
            onToggle={() => setExpanded((v) => (v === 'woman' ? null : 'woman'))}
            items={WOMAN_SUBCATEGORIES}
            onNavigate={close}
          />
          <ExpandableRow
            label="MAN"
            open={expanded === 'man'}
            onToggle={() => setExpanded((v) => (v === 'man' ? null : 'man'))}
            items={MAN_SUBCATEGORIES}
            onNavigate={close}
          />

          <DrawerLink to="/shop?new=true" onClick={close}>NEW IN</DrawerLink>
          <DrawerLink to="/shop?sale=true" onClick={close}>SALE</DrawerLink>

          <div className="my-2 border-t border-border" />

          <DrawerLink to={user ? '/account' : '/login'} onClick={close}>My Account</DrawerLink>
          <DrawerLink to={user ? '/account?tab=wishlist' : '/login'} onClick={close}>Wishlist</DrawerLink>
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
    <div className="border-b border-[#F5F4F2]">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between px-6 py-4 text-[14px] font-medium uppercase text-ink"
      >
        {label}
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className={`transition-transform ${open ? 'rotate-90' : ''}`}
        >
          <path d="M9 6l6 6-6 6" />
        </svg>
      </button>
      {open && (
        <div className="pb-2">
          {items.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              onClick={onNavigate}
              className="block py-2.5 pl-10 pr-6 text-[13px] text-muted"
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

function DrawerLink({ to, onClick, children }: { to: string; onClick: () => void; children: ReactNode }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="block border-b border-[#F5F4F2] px-6 py-4 text-[14px] font-medium uppercase text-ink"
    >
      {children}
    </Link>
  )
}
