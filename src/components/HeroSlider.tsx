import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Placeholder from './Placeholder'

// All 3 slides are women's fashion imagery; each has its own headline + CTA
// (the CTA doubles as the slide's link target).
const SLIDES = [
  {
    image: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=1920&q=80',
    headline: 'NEW COLLECTION',
    cta: "WOMEN'S",
    to: '/shop?category=woman',
  },
  {
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1920&q=80',
    headline: 'FALL 2026',
    cta: 'SHOP NOW',
    to: '/shop',
  },
  {
    image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1920&q=80',
    headline: 'COLLEGIATE STYLE',
    cta: 'EXPLORE',
    to: '/#collections',
  },
]

// Full-bleed hero: compact on mobile (75vh, leaving a hint of the category
// pills below) and taller on desktop (90vh). Slides auto-rotate every 5s on
// a crossfade; the overlaid headline/CTA swap with the slide.
export default function HeroSlider() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % SLIDES.length), 5000)
    return () => clearInterval(id)
  }, [])

  const slide = SLIDES[index]

  return (
    <section className="relative h-[75vh] w-full overflow-hidden md:h-[90vh]">
      {SLIDES.map((s, i) => (
        <img
          key={s.image}
          src={s.image}
          alt=""
          loading={i === 0 ? 'eager' : 'lazy'}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
            i === index ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ))}

      <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-6 text-center text-white">
        <p className="text-[32px] font-bold uppercase leading-none md:text-[48px]">{slide.headline}</p>
        <Link
          to={slide.to}
          className="mt-2 rounded-[4px] bg-black px-8 py-3 text-[11px] uppercase tracking-[0.14em] text-white"
        >
          {slide.cta}
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
