import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Placeholder from './Placeholder'

const SLIDES = [
  'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=1920&q=80',
  'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1920&q=80',
  'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1920&q=80',
]

// Full-bleed hero: compact on mobile (75vh, leaving a hint of the category
// pills below) and taller on desktop (90vh). Slides auto-rotate every 5s on
// a crossfade; the overlaid label/headline/CTA stay fixed across slides.
export default function HeroSlider() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % SLIDES.length), 5000)
    return () => clearInterval(id)
  }, [])

  return (
    <section className="relative h-[75vh] w-full overflow-hidden md:h-[90vh]">
      {SLIDES.map((src, i) => (
        <img
          key={src}
          src={src}
          alt=""
          loading={i === 0 ? 'eager' : 'lazy'}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
            i === index ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ))}

      <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-6 text-center text-white">
        <p className="text-[11px] uppercase tracking-[0.16em]">NEW COLLECTION</p>
        <p className="text-[32px] font-bold uppercase leading-none md:text-[48px]">FALL 2026</p>
        <Link
          to="/shop"
          className="mt-2 bg-black px-8 py-3 text-[11px] uppercase tracking-[0.14em] text-white"
        >
          SHOP NOW
        </Link>
      </div>

      {SLIDES.length > 1 && (
        <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-1.5">
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
      )}

      <Placeholder />
    </section>
  )
}
