import { Fragment, useEffect, useState, type FormEvent, type ReactNode } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import Button from '../components/Button'
import FormField from '../components/FormField'
import Modal from '../components/Modal'
import { api } from '../lib/api'
import { useAuth } from '../context/AuthContext'
import type { ApiProduct } from '../lib/products'
import type { ApiOrder } from '../lib/orders'

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL']
const ORDER_STATUSES = ['pending', 'processing', 'shipped', 'delivered']

const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-gray-200 text-gray-700',
  paid: 'bg-green-100 text-green-700',
  processing: 'bg-amber-100 text-amber-700',
  shipped: 'bg-blue-100 text-blue-700',
  delivered: 'bg-teal-100 text-teal-700',
}

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

type Tab = 'dashboard' | 'products' | 'orders' | 'customers'

const NAV_ITEMS: { id: Tab; label: string; icon: (props: { className?: string }) => ReactNode }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: DashboardIcon },
  { id: 'products', label: 'Products', icon: ProductsIcon },
  { id: 'orders', label: 'Orders', icon: OrdersIcon },
  { id: 'customers', label: 'Customers', icon: CustomersIcon },
]

export default function Admin() {
  const { user, loading, logout } = useAuth()
  const navigate = useNavigate()
  const [tab, setTab] = useState<Tab>('dashboard')

  const admin = !!user && isAdminEmail(user.email)

  if (!loading && !admin) {
    return <Navigate to="/" replace />
  }

  if (loading || !admin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F5F4F2]">
        <p className="text-sm text-[#8A8A8A]">Loading...</p>
      </div>
    )
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div className="flex min-h-screen bg-[#F5F4F2]">
      <aside className="flex w-60 shrink-0 flex-col bg-[#1A1A1A] px-4 py-6 text-white">
        <div className="flex items-center gap-2 px-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-white text-sm font-bold text-[#1A1A1A]">
            MF
          </div>
          <span className="text-sm font-medium tracking-wide">Admin</span>
        </div>

        <nav className="mt-10 flex flex-1 flex-col gap-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setTab(item.id)}
                className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-colors ${
                  tab === item.id ? 'bg-white/10 text-white' : 'text-white/60 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </button>
            )
          })}
        </nav>

        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm text-white/60 transition-colors hover:bg-white/5 hover:text-white"
        >
          <LogoutIcon className="h-4 w-4" />
          Logout
        </button>
      </aside>

      <main className="flex-1 overflow-x-auto p-8">
        {tab === 'dashboard' && <DashboardTab />}
        {tab === 'products' && <ProductsTab />}
        {tab === 'orders' && <OrdersTab />}
        {tab === 'customers' && <CustomersTab />}
      </main>
    </div>
  )
}

interface Stats {
  totalOrders: number
  totalRevenue: number
  totalProducts: number
  totalUsers: number
}

function DashboardTab() {
  const [stats, setStats] = useState<Stats | null>(null)

  useEffect(() => {
    api.get<Stats>('/api/admin/stats').then(setStats)
  }, [])

  const cards = [
    { label: 'Total Orders', value: stats?.totalOrders },
    { label: 'Total Revenue', value: stats ? `$${stats.totalRevenue.toFixed(2)}` : undefined },
    { label: 'Total Products', value: stats?.totalProducts },
    { label: 'Total Users', value: stats?.totalUsers },
  ]

  return (
    <div>
      <h1 className="text-2xl font-semibold text-[#1A1A1A]">Dashboard</h1>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <div key={card.label} className="rounded-lg bg-white p-6 shadow-sm">
            <p className="text-3xl font-semibold text-[#1A1A1A]">{card.value ?? '—'}</p>
            <p className="mt-1 text-sm text-[#8A8A8A]">{card.label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function ProductsTab() {
  const [products, setProducts] = useState<ApiProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [modalProduct, setModalProduct] = useState<ApiProduct | 'new' | null>(null)

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

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-[#1A1A1A]">Products</h1>
        <Button variant="primary" onClick={() => setModalProduct('new')}>
          Add Product
        </Button>
      </div>

      <div className="mt-6 overflow-x-auto rounded-lg bg-white shadow-sm">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-gray-100 text-xs uppercase tracking-wide text-[#8A8A8A]">
              <th className="px-6 py-3 font-medium">Name</th>
              <th className="px-6 py-3 font-medium">Category</th>
              <th className="px-6 py-3 font-medium">Price</th>
              <th className="px-6 py-3 font-medium">Stock</th>
              <th className="px-6 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-[#8A8A8A]">
                  Loading products...
                </td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-[#8A8A8A]">
                  No products yet.
                </td>
              </tr>
            ) : (
              products.map((p) => (
                <tr key={p.id} className="border-b border-gray-100 last:border-0">
                  <td className="px-6 py-4 font-medium text-[#1A1A1A]">{p.name}</td>
                  <td className="px-6 py-4 text-[#8A8A8A]">{p.category}</td>
                  <td className="px-6 py-4 text-[#1A1A1A]">
                    ${p.price}
                    {p.salePrice != null ? ` (sale $${p.salePrice})` : ''}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                        p.inStock ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-700'
                      }`}
                    >
                      {p.inStock ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      type="button"
                      className="mr-4 text-[#1A1A1A] hover:underline"
                      onClick={() => setModalProduct(p)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="text-red-600 hover:underline"
                      onClick={() => handleDelete(p.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Modal open={modalProduct !== null} onClose={() => setModalProduct(null)}>
        {modalProduct && (
          <AdminProductForm
            product={modalProduct === 'new' ? null : modalProduct}
            onCancel={() => setModalProduct(null)}
            onSaved={() => {
              setModalProduct(null)
              load()
            }}
          />
        )}
      </Modal>
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
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold text-[#1A1A1A]">{product ? 'Edit Product' : 'Add Product'}</h2>

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

function StatusBadge({ status }: { status: string }) {
  const style = STATUS_STYLES[status] ?? 'bg-gray-200 text-gray-700'
  return <span className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${style}`}>{status}</span>
}

function OrdersTab() {
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

  return (
    <div>
      <h1 className="text-2xl font-semibold text-[#1A1A1A]">Orders</h1>

      <div className="mt-6 overflow-x-auto rounded-lg bg-white shadow-sm">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead>
            <tr className="border-b border-gray-100 text-xs uppercase tracking-wide text-[#8A8A8A]">
              <th className="px-6 py-3 font-medium">Order ID</th>
              <th className="px-6 py-3 font-medium">Customer</th>
              <th className="px-6 py-3 font-medium">Date</th>
              <th className="px-6 py-3 font-medium">Total</th>
              <th className="px-6 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-[#8A8A8A]">
                  Loading orders...
                </td>
              </tr>
            ) : orders.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-[#8A8A8A]">
                  No orders yet.
                </td>
              </tr>
            ) : (
              orders.map((order) => {
                const statusOptions = ORDER_STATUSES.includes(order.status)
                  ? ORDER_STATUSES
                  : [order.status, ...ORDER_STATUSES]
                const expanded = expandedId === order.id

                return (
                  <Fragment key={order.id}>
                    <tr
                      onClick={() => setExpandedId(expanded ? null : order.id)}
                      className="cursor-pointer border-b border-gray-100 last:border-0 hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 font-mono text-xs text-[#1A1A1A]">{order.id.slice(0, 10)}...</td>
                      <td className="px-6 py-4 text-[#1A1A1A]">{order.user.email}</td>
                      <td className="px-6 py-4 text-[#8A8A8A]">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-[#1A1A1A]">${order.total.toFixed(2)}</td>
                      <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center gap-2">
                          <StatusBadge status={order.status} />
                          <select
                            value={order.status}
                            onChange={(e) => updateStatus(order.id, e.target.value)}
                            className="rounded-md border border-gray-200 bg-white px-2 py-1 text-xs text-[#1A1A1A]"
                          >
                            {statusOptions.map((s) => (
                              <option key={s} value={s}>
                                {s}
                              </option>
                            ))}
                          </select>
                        </div>
                      </td>
                    </tr>
                    {expanded && (
                      <tr className="border-b border-gray-100 bg-gray-50">
                        <td colSpan={5} className="px-6 py-4">
                          <div className="flex flex-col gap-3">
                            {order.items.map((item) => (
                              <div key={item.id} className="flex items-center gap-4">
                                <div className="h-14 w-12 shrink-0 overflow-hidden rounded bg-gray-200">
                                  <img
                                    src={item.product.images[0] ?? ''}
                                    alt={item.product.name}
                                    className="h-full w-full object-cover"
                                  />
                                </div>
                                <div className="flex-1">
                                  <p className="text-sm text-[#1A1A1A]">{item.product.name}</p>
                                  <p className="mt-1 text-xs text-[#8A8A8A]">
                                    Size: {item.size} · Qty: {item.quantity}
                                  </p>
                                </div>
                                <p className="text-sm text-[#1A1A1A]">${item.price.toFixed(2)}</p>
                              </div>
                            ))}
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

interface Customer {
  id: string
  email: string
  firstName: string | null
  lastName: string | null
  createdAt: string
  _count: { orders: number }
}

function CustomersTab() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api
      .get<Customer[]>('/api/admin/customers')
      .then(setCustomers)
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      <h1 className="text-2xl font-semibold text-[#1A1A1A]">Customers</h1>

      <div className="mt-6 overflow-x-auto rounded-lg bg-white shadow-sm">
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead>
            <tr className="border-b border-gray-100 text-xs uppercase tracking-wide text-[#8A8A8A]">
              <th className="px-6 py-3 font-medium">Name</th>
              <th className="px-6 py-3 font-medium">Email</th>
              <th className="px-6 py-3 font-medium">Joined</th>
              <th className="px-6 py-3 font-medium">Orders</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-[#8A8A8A]">
                  Loading customers...
                </td>
              </tr>
            ) : customers.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-[#8A8A8A]">
                  No customers yet.
                </td>
              </tr>
            ) : (
              customers.map((c) => (
                <tr key={c.id} className="border-b border-gray-100 last:border-0">
                  <td className="px-6 py-4 text-[#1A1A1A]">
                    {c.firstName || c.lastName ? `${c.firstName ?? ''} ${c.lastName ?? ''}`.trim() : '—'}
                  </td>
                  <td className="px-6 py-4 text-[#8A8A8A]">{c.email}</td>
                  <td className="px-6 py-4 text-[#8A8A8A]">{new Date(c.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-[#1A1A1A]">{c._count.orders}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function DashboardIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="3" width="8" height="8" rx="1" />
      <rect x="13" y="3" width="8" height="5" rx="1" />
      <rect x="13" y="12" width="8" height="9" rx="1" />
      <rect x="3" y="15" width="8" height="6" rx="1" />
    </svg>
  )
}

function ProductsIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M21 8l-9-5-9 5 9 5 9-5z" />
      <path d="M3 8v8l9 5 9-5V8" />
      <path d="M12 13v8" />
    </svg>
  )
}

function OrdersIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M6 3h12v18l-3-2-3 2-3-2-3 2V3z" />
      <path d="M9 8h6M9 12h6" />
    </svg>
  )
}

function CustomersIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="9" cy="8" r="3" />
      <path d="M2 20c0-3.5 3-6 7-6s7 2.5 7 6" />
      <circle cx="17" cy="8" r="2.5" />
      <path d="M17 14c2.8 0 5 2.2 5 6" />
    </svg>
  )
}

function LogoutIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <path d="M16 17l5-5-5-5" />
      <path d="M21 12H9" />
    </svg>
  )
}
