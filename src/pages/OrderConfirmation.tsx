import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import Button from '../components/Button'
import { api } from '../lib/api'
import { useAuth } from '../context/AuthContext'
import type { ApiOrder } from '../lib/orders'

export default function OrderConfirmation() {
  const location = useLocation()
  const { user, loading: authLoading } = useAuth()
  const stateOrder = (location.state as { order?: ApiOrder } | null)?.order

  const [order, setOrder] = useState<ApiOrder | null>(stateOrder ?? null)
  const [loading, setLoading] = useState(!stateOrder)

  // Direct navigation or a page refresh loses router state, so fall back to
  // the account's most recent order rather than showing a dead end.
  useEffect(() => {
    if (stateOrder || !user) return
    api
      .get<ApiOrder[]>('/api/orders')
      .then((orders) => setOrder(orders[0] ?? null))
      .finally(() => setLoading(false))
  }, [stateOrder, user])

  if (loading || authLoading) {
    return (
      <div className="mx-auto max-w-lg px-6 py-20 text-center">
        <p className="text-sm font-normal text-muted">Loading...</p>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="mx-auto max-w-lg px-6 py-20 text-center">
        <h1 className="text-2xl font-medium text-ink">No order found</h1>
        <Link to="/shop" className="mt-8 inline-block">
          <Button variant="primary" className="px-10">
            Back to Shop
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-lg px-6 py-20 text-center">
      <h1 className="text-2xl font-medium text-ink">Thank you for your order</h1>
      <p className="mt-2 text-sm font-normal text-muted">Order #{order.id}</p>

      <div className="mt-10 flex flex-col divide-y divide-border border-y border-border text-left">
        {order.items.map((item) => (
          <div key={item.id} className="flex items-center gap-4 py-4">
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
            <p className="text-sm font-normal text-ink">${(item.price * item.quantity).toFixed(2)}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between">
        <p className="text-sm font-medium text-ink">Total</p>
        <p className="text-sm font-medium text-ink">${order.total.toFixed(2)}</p>
      </div>

      <Link to="/shop" className="mt-10 inline-block">
        <Button variant="primary" className="px-10">
          Continue Shopping
        </Button>
      </Link>
    </div>
  )
}
