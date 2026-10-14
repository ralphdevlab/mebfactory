import { Link } from 'react-router-dom'
import Button from '../components/Button'
import EmptyState from '../components/EmptyState'
import ProductImage from '../components/ProductImage'
import { BagIcon } from '../components/icons'
import { useCart } from '../context/CartContext'

export default function Cart() {
  const { lines, removeFromCart, updateQuantity, subtotal } = useCart()

  if (lines.length === 0) {
    return (
      <EmptyState
        icon={<BagIcon />}
        title="Your cart is empty"
        description="Looks like you haven't added anything yet."
        actionLabel="Continue Shopping"
        actionTo="/shop"
      />
    )
  }

  return (
    <div className="pb-24 md:mx-auto md:max-w-[1440px] md:px-6 md:py-12 md:pb-12">
      <h1 className="border-b border-border px-4 py-5 text-[18px] font-bold uppercase text-ink md:px-0 md:pb-6 md:pt-0 md:text-2xl">
        Shopping Cart
      </h1>

      <div className="flex flex-col gap-12 md:mt-10 md:flex-row">
        <div className="flex-1">
          <div className="flex flex-col divide-y divide-border px-4 md:px-0">
            {lines.map((line) => {
              const product = line.product
              const price = product.salePrice ?? product.price

              return (
                <div key={line.id} className="flex gap-4 py-5">
                  <Link to={`/product/${product.id}`} className="h-20 w-20 shrink-0 overflow-hidden bg-hero">
                    <ProductImage
                      src={product.images?.[0]}
                      alt={product.name}
                      className="h-full w-full object-cover"
                    />
                  </Link>

                  <div className="flex flex-1 flex-col justify-between">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <Link to={`/product/${product.id}`} className="block text-sm font-medium uppercase text-ink">
                          {product.name}
                        </Link>
                        <p className="mt-1 text-xs font-normal text-muted">Size: {line.size}</p>
                      </div>
                      <p className="text-sm font-medium text-ink">${price * line.quantity}</p>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center border border-border">
                        <button
                          type="button"
                          onClick={() => updateQuantity(line.id, line.quantity - 1)}
                          className="flex h-9 w-9 items-center justify-center text-ink hover:bg-hero"
                          aria-label="Decrease quantity"
                        >
                          −
                        </button>
                        <span className="w-8 text-center text-sm font-normal text-ink">{line.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(line.id, line.quantity + 1)}
                          className="flex h-9 w-9 items-center justify-center text-ink hover:bg-hero"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeFromCart(line.id)}
                        className="label flex min-h-11 items-center text-muted hover:text-ink"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Order summary - desktop only; mobile uses the sticky bottom bar instead */}
        <div className="hidden w-full shrink-0 border border-border bg-surface p-6 md:block md:w-80">
          <p className="label text-ink">Order Summary</p>
          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm font-normal text-muted">Subtotal</p>
            <p className="text-sm font-medium text-ink">${subtotal}</p>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <p className="text-sm font-normal text-muted">Shipping</p>
            <p className="text-sm font-normal text-muted">Calculated at checkout</p>
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
            <p className="text-sm font-medium text-ink">Total</p>
            <p className="text-sm font-medium text-ink">${subtotal}</p>
          </div>
          <Link to="/checkout" className="mt-6 block">
            <Button variant="primary" className="w-full">
              Proceed to Checkout
            </Button>
          </Link>
        </div>
      </div>

      {/* Sticky checkout bar - mobile only */}
      <div className="fixed inset-x-0 bottom-[44px] z-40 flex items-center gap-4 border-t border-border bg-white px-4 py-3 md:hidden">
        <p className="text-sm font-medium text-ink">
          Subtotal<span className="ml-2 text-base font-bold">${subtotal}</span>
        </p>
        <Link to="/checkout" className="ml-auto flex-1">
          <button
            type="button"
            className="flex h-12 w-full items-center justify-center bg-ink text-[13px] uppercase tracking-[0.1em] text-white"
          >
            Checkout
          </button>
        </Link>
      </div>
    </div>
  )
}
