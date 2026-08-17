import { useEffect, useState, type FormEvent } from 'react'
import { Link, Navigate, useSearchParams } from 'react-router-dom'
import Button from '../components/Button'
import FormField from '../components/FormField'
import EmptyState from '../components/EmptyState'
import { ReceiptIcon, HeartIcon } from '../components/icons'
import { api } from '../lib/api'
import { useAuth } from '../context/AuthContext'
import { useWishlist } from '../context/WishlistContext'
import type { ApiOrder } from '../lib/orders'

type Tab = 'profile' | 'orders' | 'wishlist'

const TABS: { id: Tab; label: string }[] = [
  { id: 'profile', label: 'Profile' },
  { id: 'orders', label: 'Orders' },
  { id: 'wishlist', label: 'Wishlist' },
]

const TAB_IDS = TABS.map((t) => t.id)

function isTab(value: string | null): value is Tab {
  return TAB_IDS.includes(value as Tab)
}

export default function Account() {
  const { user, loading } = useAuth()
  const [searchParams] = useSearchParams()
  const initialTab = searchParams.get('tab')
  const [tab, setTab] = useState<Tab>(isTab(initialTab) ? initialTab : 'profile')

  // Wait for the initial "is there a valid token" check before deciding to
  // redirect, otherwise a logged-in user gets bounced to /login for a split
  // second on every hard refresh while that check is still in flight.
  if (!loading && !user) {
    return <Navigate to="/login" replace />
  }

  if (loading || !user) {
    return (
      <div className="mx-auto max-w-[1440px] px-6 py-20 text-center">
        <p className="text-sm font-normal text-muted">Loading...</p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-[1440px] px-6 py-12">
      <h1 className="border-b border-border pb-6 text-2xl font-medium text-ink">My Account</h1>

      <div className="mt-10 flex flex-col gap-12 lg:flex-row">
        <aside className="flex shrink-0 gap-2 lg:w-56 lg:flex-col lg:gap-1">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`label px-4 py-3 text-left transition-colors ${
                tab === t.id ? 'bg-ink text-surface' : 'text-ink hover:bg-hero'
              }`}
            >
              {t.label}
            </button>
          ))}
        </aside>

        <div className="flex-1">
          {tab === 'profile' && <ProfileTab />}
          {tab === 'orders' && <OrdersTab />}
          {tab === 'wishlist' && <WishlistTab />}
        </div>
      </div>
    </div>
  )
}

function ProfileTab() {
  const { user, updateProfile } = useAuth()

  const [firstName, setFirstName] = useState(user?.firstName ?? '')
  const [lastName, setLastName] = useState(user?.lastName ?? '')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setSaving(true)
    try {
      await updateProfile(firstName, lastName)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch {
      setError('Could not save your changes.')
    } finally {
      setSaving(false)
    }
  }

  if (!user) return null

  return (
    <div className="max-w-md">
      <p className="label text-muted">Email</p>
      <p className="mt-1 text-sm font-normal text-ink">{user.email}</p>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
        <div className="flex gap-4">
          <FormField label="First Name" value={firstName} onChange={setFirstName} autoComplete="given-name" />
          <FormField label="Last Name" value={lastName} onChange={setLastName} autoComplete="family-name" />
        </div>

        {error && <p className="text-sm font-normal text-red-600">{error}</p>}

        <Button type="submit" variant="primary" className="mt-2 self-start px-10" disabled={saving}>
          {saving ? 'Saving...' : saved ? 'Saved' : 'Save Changes'}
        </Button>
      </form>
    </div>
  )
}

function OrdersTab() {
  const [orders, setOrders] = useState<ApiOrder[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api
      .get<ApiOrder[]>('/api/orders')
      .then(setOrders)
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return <p className="text-sm font-normal text-muted">Loading orders...</p>
  }

  if (orders.length === 0) {
    return (
      <EmptyState
        icon={<ReceiptIcon />}
        title="No orders yet"
        description="Your past orders will show up here."
        actionLabel="Start Shopping"
        actionTo="/shop"
      />
    )
  }

  return (
    <div className="flex flex-col divide-y divide-border">
      {orders.map((order) => (
        <div key={order.id} className="py-6 first:pt-0">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="text-sm font-medium text-ink">
                {new Date(order.createdAt).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
              <p className="label mt-1 text-muted">{order.status}</p>
            </div>
            <p className="text-sm font-medium text-ink">${order.total}</p>
          </div>

          <div className="mt-4 flex flex-col gap-3">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center gap-4">
                <div className="h-16 w-14 shrink-0 overflow-hidden bg-hero">
                  <img
                    src={item.product.images[0] ?? ''}
                    alt={item.product.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-normal text-ink">{item.product.name}</p>
                  <p className="mt-1 text-xs font-normal text-muted">
                    Size: {item.size} · Qty: {item.quantity}
                  </p>
                </div>
                <p className="text-sm font-normal text-ink">${item.price}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

function WishlistTab() {
  const { lines, removeFromWishlist } = useWishlist()

  if (lines.length === 0) {
    return (
      <EmptyState
        icon={<HeartIcon />}
        title="No saved items yet"
        description="Items you save will show up here."
        actionLabel="Browse Collection"
        actionTo="/shop"
      />
    )
  }

  return (
    <div className="flex flex-col divide-y divide-border">
      {lines.map((line) => (
        <div key={line.id} className="flex items-center gap-4 py-6 first:pt-0">
          <Link to={`/product/${line.product.id}`} className="h-20 w-16 shrink-0 overflow-hidden bg-hero">
            <img src={line.product.image} alt={line.product.name} className="h-full w-full object-cover" />
          </Link>
          <div className="flex-1">
            <p className="label text-muted">{line.product.category}</p>
            <Link to={`/product/${line.product.id}`} className="mt-1 block text-sm font-normal text-ink">
              {line.product.name}
            </Link>
            <p className="mt-1 text-sm font-medium text-ink">
              ${line.product.salePrice ?? line.product.price}
            </p>
          </div>
          <button
            type="button"
            onClick={() => removeFromWishlist(line.id)}
            className="label text-muted hover:text-ink"
          >
            Remove
          </button>
        </div>
      ))}
    </div>
  )
}
