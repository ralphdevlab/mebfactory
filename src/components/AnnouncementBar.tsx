import { useEffect, useState } from 'react'

const MESSAGES = [
  'FREE SHIPPING ON ORDERS OVER $150',
  'NEW ARRIVALS — SHOP THE LATEST DROP',
  'SIGN UP FOR 10% OFF YOUR FIRST ORDER',
]

export default function AnnouncementBar() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % MESSAGES.length)
    }, 4000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="bg-charcoal text-white">
      <div className="mx-auto flex h-9 max-w-[1440px] items-center justify-center px-4">
        <p className="label tracking-[0.14em]">{MESSAGES[index]}</p>
      </div>
    </div>
  )
}
