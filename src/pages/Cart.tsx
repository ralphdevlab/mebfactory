import { Link } from 'react-router-dom'
import Button from '../components/Button'
import { useCart } from '../context/CartContext'
import { getProductById } from '../data/products'

export default function Cart() {
  const { lines, removeLine, updateQuantity, subtotal } = useCart()

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-[1440px] px-6 py-24 text-center">
        <h1 className="text-2xl font-medium text-ink">Your Cart Is Empty</h1>
        <p className="mt-2 text-sm font-normal text-muted">Looks like you haven't added anything yet.</p>
        <Link to="/shop" className="mt-8 inline-block">
          <Button variant="primary" className="px-10">
            Continue Shopping
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-[1440px] px-6 py-12">
      <h1 className="border-b border-border pb-6 text-2xl font-medium text-ink">Shopping Cart</h1>

      <div className="mt-10 flex flex-col gap-12 lg:flex-row">
        <div className="flex-1">
          <div className="flex flex-col divide-y divide-border">
            {lines.map((line) => {
              const product = getProductById(line.productId)
              if (!product) return null
              const price = product.salePrice ?? product.price

              return (
                <div key={`${line.productId}-${line.size}`} className="flex gap-5 py-6 first:pt-0">
                  <Link to={`/product/${product.id}`} className="h-28 w-24 shrink-0 overflow-hidden bg-hero">
                    <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                  </Link>

                  <div className="flex flex-1 flex-col justify-between">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="label text-muted">{product.category}</p>
                        <Link to={`/product/${product.id}`} className="mt-1 block text-sm font-normal text-ink">
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
                          onClick={() => updateQuantity(line.productId, line.size, line.quantity - 1)}
                          className="flex h-8 w-8 items-center justify-center text-ink hover:bg-hero"
                          aria-label="Decrease quantity"
                        >
                          −
                        </button>
                        <span className="w-8 text-center text-sm font-normal text-ink">{line.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(line.productId, line.size, line.quantity + 1)}
                          className="flex h-8 w-8 items-center justify-center text-ink hover:bg-hero"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeLine(line.productId, line.size)}
                        className="label text-muted hover:text-ink"
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

        <div className="w-full shrink-0 border border-border bg-surface p-6 lg:w-80">
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
          <Button variant="primary" className="mt-6 w-full">
            Checkout
          </Button>
        </div>
      </div>
    </div>
  )
}
