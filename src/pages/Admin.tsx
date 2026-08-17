import { useEffect, useState, type FormEvent } from 'react'
import { Navigate } from 'react-router-dom'
import Button from '../components/Button'
import FormField from '../components/FormField'
import { api } from '../lib/api'
import { useAuth } from '../context/AuthContext'
import type { ApiProduct } from '../lib/products'
import type { ApiOrder } from '../lib/orders'

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL']
const ORDER_STATUSES = ['pending', 'processing', 'shipped', 'delivered']

// In addition to anyone @mebfactory.com, lets specific accounts in via
// VITE_ADMIN_EMAILS (comma-separated list) or VITE_ADMIN_EMAIL (single
// address) - kept in sync with the backend's ADMIN_EMAILS/ADMIN_EMAIL so a
// non-@mebfactory.com admin isn't redirected away from a page whose API
// calls would otherwise succeed for them.
const EXTRA_ADMIN_EMAILS = (import.meta.env.VITE_ADMIN_EMAILS ?? '')
  .split(',')
  .map((e: string) => e.trim())
  .filter(Boolean)

function isAdminEmail(email: string) {
  return (
    email.endsWith('@mebfactory.com') ||
    EXTRA_ADMIN_EMAILS.includes(email) ||
    email === import.meta.env.VITE_ADMIN_EMAIL
  )
}

type Tab = 'products' | 'orders'

export default function Admin() {
  const { user, loading } = useAuth()
  const [tab, setTab] = useState<Tab>('products')

  const admin = !!user && isAdminEmail(user.email)

  if (!loading && !admin) {
    return <Navigate to="/" replace />
  }

  if (loading || !admin) {
    return (
      <div className="mx-auto max-w-[1440px] px-6 py-20 text-center">
        <p className="text-sm font-normal text-muted">Loading...</p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-[1440px] px-6 py-12">
      <h1 className="border-b border-border pb-6 text-2xl font-medium text-ink">Admin</h1>

      <div className="mt-8 flex gap-6 border-b border-border">
        {(['products', 'orders'] as Tab[]).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`label -mb-px border-b-2 pb-3 capitalize ${
              tab === t ? 'border-ink text-ink' : 'border-transparent text-muted hover:text-ink'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="mt-8">{tab === 'products' ? <AdminProducts /> : <AdminOrders />}</div>
    </div>
  )
}

function AdminProducts() {
  const [products, setProducts] = useState<ApiProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<ApiProduct | 'new' | null>(null)

  const load = () => {
    setLoading(true)
    api
      .get<ApiProduct[]>('/api/admin/products')
      .then(setProducts)
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this product? This cannot be undone.')) return
    await api.delete(`/api/admin/products/${id}`)
    load()
  }

  if (editing) {
    return (
      <AdminProductForm
        product={editing === 'new' ? null : editing}
        onCancel={() => setEditing(null)}
        onSaved={() => {
          setEditing(null)
          load()
        }}
      />
    )
  }

  return (
    <div>
      <div className="flex justify-end">
        <Button variant="primary" onClick={() => setEditing('new')}>
          Add Product
        </Button>
      </div>

      {loading ? (
        <p className="mt-8 text-sm font-normal text-muted">Loading products...</p>
      ) : products.length === 0 ? (
        <p className="mt-8 text-sm font-normal text-muted">No products yet.</p>
      ) : (
        <div className="mt-6 flex flex-col divide-y divide-border">
          {products.map((p) => (
            <div key={p.id} className="flex items-center justify-between gap-4 py-4">
              <div>
                <p className="text-sm font-medium text-ink">{p.name}</p>
                <p className="mt-1 text-xs font-normal text-muted">
                  {p.category} · ${p.price}
                  {p.salePrice != null ? ` (sale $${p.salePrice})` : ''}
                </p>
              </div>
              <div className="flex shrink-0 gap-4">
                <button type="button" className="label text-ink hover:text-muted" onClick={() => setEditing(p)}>
                  Edit
                </button>
                <button
                  type="button"
                  className="label text-red-600 hover:text-red-700"
                  onClick={() => handleDelete(p.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function AdminProductForm({
  product,
  onCancel,
  onSaved,
}: {
  product: ApiProduct | null
  onCancel: () => void
  onSaved: () => void
}) {
  const [name, setName] = useState(product?.name ?? '')
  const [description, setDescription] = useState(product?.description ?? '')
  const [price, setPrice] = useState(product ? String(product.price) : '')
  const [salePrice, setSalePrice] = useState(product?.salePrice != null ? String(product.salePrice) : '')
  const [category, setCategory] = useState(product?.category ?? '')
  const [sizes, setSizes] = useState<string[]>(product?.sizes ?? [])
  const [isNew, setIsNew] = useState(product?.isNew ?? false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const toggleSize = (size: string) => {
    setSizes((prev) => (prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setSaving(true)
    try {
      const payload = {
        name,
        description: description || null,
        price: Number(price),
        salePrice: salePrice ? Number(salePrice) : null,
        category,
        sizes,
        isNew,
      }
      if (product) {
        await api.patch(`/api/admin/products/${product.id}`, payload)
      } else {
        await api.post('/api/admin/products', payload)
      }
      onSaved()
    } catch {
      setError('Could not save this product.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex max-w-lg flex-col gap-4">
      <FormField label="Name" value={name} onChange={setName} required />

      <label className="flex flex-col gap-2">
        <span className="label text-ink">Description</span>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="border border-border bg-surface px-4 py-3 text-sm text-ink placeholder:text-muted focus:border-charcoal focus:outline-none"
        />
      </label>

      <div className="flex gap-4">
        <FormField label="Price" type="number" value={price} onChange={setPrice} required />
        <FormField label="Sale Price" type="number" value={salePrice} onChange={setSalePrice} />
      </div>

      <FormField label="Category" value={category} onChange={setCategory} required />

      <div>
        <p className="label text-ink">Sizes</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {SIZES.map((size) => (
            <button
              key={size}
              type="button"
              onClick={() => toggleSize(size)}
              className={`label flex h-9 min-w-9 items-center justify-center border px-3 transition-colors ${
                sizes.includes(size) ? 'border-ink bg-ink text-surface' : 'border-border text-ink hover:border-charcoal'
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={isNew}
          onChange={(e) => setIsNew(e.target.checked)}
          className="h-4 w-4 accent-ink"
        />
        <span className="text-sm font-normal text-ink">Mark as New</span>
      </label>

      {error && <p className="text-sm font-normal text-red-600">{error}</p>}

      <div className="mt-2 flex gap-4">
        <Button type="submit" variant="primary" disabled={saving}>
          {saving ? 'Saving...' : 'Save'}
        </Button>
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  )
}

interface AdminOrder extends ApiOrder {
  user: { email: string }
}

function AdminOrders() {
  const [orders, setOrders] = useState<AdminOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  useEffect(() => {
    api
      .get<AdminOrder[]>('/api/admin/orders')
      .then(setOrders)
      .finally(() => setLoading(false))
  }, [])

  const updateStatus = async (id: string, status: string) => {
    const updated = await api.patch<AdminOrder>(`/api/admin/orders/${id}`, { status })
    setOrders((prev) => prev.map((o) => (o.id === id ? updated : o)))
  }

  if (loading) {
    return <p className="text-sm font-normal text-muted">Loading orders...</p>
  }

  if (orders.length === 0) {
    return <p className="text-sm font-normal text-muted">No orders yet.</p>
  }

  return (
    <div className="flex flex-col divide-y divide-border">
      {orders.map((order) => {
        // The Stripe webhook sets "paid" once payment succeeds, which sits
        // outside the pending -> processing -> shipped -> delivered
        // fulfillment flow below - surface it as a selectable option too
        // rather than silently showing the wrong value in the dropdown.
        const statusOptions = ORDER_STATUSES.includes(order.status)
          ? ORDER_STATUSES
          : [order.status, ...ORDER_STATUSES]

        return (
          <div key={order.id} className="py-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                className="flex-1 text-left"
                onClick={() => setExpandedId((id) => (id === order.id ? null : order.id))}
              >
                <p className="text-sm font-medium text-ink">{order.user.email}</p>
                <p className="mt-1 text-xs font-normal text-muted">
                  {new Date(order.createdAt).toLocaleDateString()} · ${order.total.toFixed(2)}
                </p>
              </button>

              <select
                value={order.status}
                onChange={(e) => updateStatus(order.id, e.target.value)}
                className="label border border-border bg-surface px-3 py-2 text-ink"
              >
                {statusOptions.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            {expandedId === order.id && (
              <div className="mt-4 flex flex-col gap-3">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4">
                    <div className="h-14 w-12 shrink-0 overflow-hidden bg-hero">
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
                    <p className="text-sm font-normal text-ink">${item.price.toFixed(2)}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
