import { Link } from 'react-router-dom'
import HeroSlider from '../components/HeroSlider'
import ProductCarousel from '../components/ProductCarousel'
import Placeholder from '../components/Placeholder'

const CATEGORY_TILES = [
  {
    name: 'JACKETS AND TRENCH',
    image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&q=80',
    to: '/shop?category=jackets',
  },
  {
    name: 'TOPS AND BODYSUITS',
    image: 'https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=600&q=80',
    to: '/shop?category=tops',
  },
  {
    name: 'PANTS',
    image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&q=80',
    to: '/shop?category=pants',
  },
  {
    name: 'SWEATSHIRTS & HOODIES',
    // Spec-provided photo-1556821840-3a63f15732ce 404s on Unsplash; swapped
    // for a working hoodie shot until real art lands.
    image: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600&q=80',
    to: '/shop?category=sweatshirts',
  },
]

const LOOK_TILES = [
  { name: 'STREETWEAR', image: 'https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?w=600&q=80' },
  { name: 'TRENDY', image: 'https://images.unsplash.com/photo-1581044777550-4cfa60707c03?w=600&q=80' },
  { name: 'CASUAL', image: 'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=600&q=80' },
  { name: 'STREETWEAR MEN', image: 'https://images.unsplash.com/photo-1514866747592-c2d279258a78?w=600&q=80' },
]

export default function Home() {
  return (
    <div className="bg-white">
      <HeroSlider />

      {/* Category grid */}
      <div className="grid grid-cols-2 md:grid-cols-4">
        {CATEGORY_TILES.map((tile) => (
          <Link key={tile.name} to={tile.to} className="relative overflow-hidden">
            <img src={tile.image} alt={tile.name} className="aspect-[3/4] w-full object-cover" />
            <span className="absolute bottom-0 left-0 p-4 text-[13px] font-bold uppercase tracking-[0.06em] text-white">
              {tile.name}
            </span>
            <Placeholder />
          </Link>
        ))}
      </div>

      {/* Editorial full-bleed */}
      <Link to="/shop?category=jeans" className="relative block h-[85vh] w-full overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1475178626620-a4d074967452?w=1920&q=80"
          alt="Jeans by fit"
          className="h-full w-full object-cover"
        />
        <span className="absolute bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-[52px] font-bold uppercase text-white">
          JEANS BY FIT
        </span>
        <Placeholder />
      </Link>

      {/* Get the look */}
      <section className="bg-white">
        <div className="bg-[#0A0A0A] p-6">
          <h2 className="text-[32px] font-bold uppercase tracking-[0.04em] text-white">GET THE LOOK</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4">
          {LOOK_TILES.map((tile) => (
            <div key={tile.name} className="relative aspect-square overflow-hidden">
              <img src={tile.image} alt={tile.name} className="h-full w-full object-cover" />
              <span className="absolute bottom-0 left-0 p-4 text-[13px] font-bold uppercase text-white">
                {tile.name}
              </span>
              <Placeholder />
            </div>
          ))}
        </div>
        <div className="flex justify-center bg-[#0A0A0A] py-8">
          <Link
            to="/shop"
            className="border border-white bg-[#0A0A0A] px-8 py-3 text-[12px] uppercase tracking-[0.14em] text-white"
          >
            SEE ALL STYLES
          </Link>
        </div>
      </section>

      <ProductCarousel title="IT MAY INTEREST YOU" />
    </div>
  )
}
