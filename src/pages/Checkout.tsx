import { useEffect, useState, type FormEvent } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js'
import Button from '../components/Button'
import EmptyState from '../components/EmptyState'
import { BagIcon } from '../components/icons'
import { api } from '../lib/api'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import type { ApiOrder } from '../lib/orders'

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)

interface CreateIntentResponse {
  clientSecret: string
  total: number
}

export default function Checkout() {
  const { user, loading: authLoading } = useAuth()
  const { subtotal } = useCart()

  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [cartEmpty, setCartEmpty] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) return
    let cancelled = false

    async function startCheckout() {
      try {
        // Confirm the cart actually has items - synced straight from the
        // backend, not the CartContext snapshot - before attempting to
        // create a payment intent. Without this, a Stripe/server failure
        // and a genuinely empty cart both looked identical to the user.
        const cartItems = await api.get<unknown[]>('/api/cart')
        if (cancelled) return

        if (cartItems.length === 0) {
          setCartEmpty(true)
          return
        }

        const data = await api.post<CreateIntentResponse>('/api/checkout/create-intent', {})
        if (cancelled) return
        setClientSecret(data.clientSecret)
      } catch {
        if (!cancelled) {
          setError('Could not start checkout. Please try again in a moment.')
        }
      }
    }

    startCheckout()
    return () => {
      cancelled = true
    }
  }, [user])

  // Wait for the initial "is there a valid token" check, same as Account,
  // so a logged-in user doesn't get bounced to /login on a hard refresh.
  if (!authLoading && !user) {
    return <Navigate to="/login" replace />
  }

  if (cartEmpty) {
    return (
      <EmptyState
        icon={<BagIcon />}
        title="Your cart is empty"
        description="Add something to your cart before checking out."
        actionLabel="Continue Shopping"
        actionTo="/shop"
      />
    )
  }

  return (
    <div className="mx-auto max-w-lg px-6 py-12">
      <h1 className="border-b border-border pb-6 text-2xl font-medium text-ink">Checkout</h1>

      <div className="mt-8 flex items-center justify-between border-b border-border pb-6">
        <p className="text-sm font-normal text-muted">Total</p>
        <p className="text-lg font-medium text-ink">${subtotal.toFixed(2)}</p>
      </div>

      {error && <p className="mt-6 text-sm font-normal text-red-600">{error}</p>}

      {clientSecret && (
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <CheckoutForm />
        </Elements>
      )}

      {!clientSecret && !error && (
        <p className="mt-8 text-sm font-normal text-muted">Loading payment form...</p>
      )}
    </div>
  )
}

function CheckoutForm() {
  const stripe = useStripe()
  const elements = useElements()
  const navigate = useNavigate()

  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!stripe || !elements) return

    setSubmitting(true)
    setError(null)

    const { error: confirmError, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: 'if_required',
    })

    if (confirmError) {
      setError(confirmError.message ?? 'Payment failed. Please try again.')
      setSubmitting(false)
      return
    }

    if (paymentIntent && (paymentIntent.status === 'succeeded' || paymentIntent.status === 'processing')) {
      try {
        // The cart isn't cleared here - it's only cleared once the Stripe
        // webhook confirms the payment, so a page close/crash right after
        // this call still leaves the cart intact to retry from.
        const order = await api.post<ApiOrder>('/api/orders', {
          paymentIntentId: paymentIntent.id,
        })
        navigate('/order-confirmation', { state: { order } })
      } catch {
        setError('Payment succeeded, but we could not save your order. Please contact support.')
        setSubmitting(false)
      }
      return
    }

    setError('Payment did not complete. Please try again.')
    setSubmitting(false)
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-6">
      <PaymentElement />

      {error && <p className="text-sm font-normal text-red-600">{error}</p>}

      <Button type="submit" variant="primary" disabled={!stripe || submitting}>
        {submitting ? 'Processing...' : 'Pay Now'}
      </Button>
    </form>
  )
}
