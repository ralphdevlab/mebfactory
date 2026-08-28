import { useEffect, useState } from 'react'

const SLIDES = [
  {
    image: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=1920&q=80',
    label: 'MEBFACTORY WOMAN',
    headline: 'NEW IN',
  },
  {
    image: 'https://images.unsplash.com/photo-1488161628813-04466f872be2?w=1920&q=80',
    label: 'MEBFACTORY MAN',
    headline: 'NEW IN',
  },
  {
    image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1920&q=80',
    label: 'NEW COLLECTION',
    headline: 'SUMMER 2026',
  },
]

export default function HeroSlider() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % SLIDES.length), 5000)
    return () => clearInterval(id)
  }, [])

  const slide = SLIDES[index]

  return (
    <section className="relative h-[calc(100vh-56px)] w-full overflow-hidden">
      <img src={slide.image} alt="" className="h-full w-full object-cover" />

      <span className="pointer-events-none absolute bottom-24 right-8 text-[9px] font-normal text-white opacity-60">
        PLACEHOLDER — WILL BE REPLACED
      </span>

      <div className="absolute bottom-0 right-0 p-8 text-right text-white">
        <p className="text-[11px] uppercase tracking-[0.16em]">{slide.label}</p>
        <p className="mt-1 text-[40px] font-bold uppercase leading-none">{slide.headline}</p>
      </div>

      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-1.5">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => setIndex(i)}
            className={`h-1.5 bg-white transition-all ${i === index ? 'w-[18px] opacity-100' : 'w-1.5 opacity-60'}`}
          />
        ))}
      </div>
    </section>
  )
}
