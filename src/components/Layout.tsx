import { Outlet, useLocation } from 'react-router-dom'
import AnnouncementBar from './AnnouncementBar'
import Navbar from './Navbar'
import Footer from './Footer'
import TrustStrip from './TrustStrip'

// Routes that show the trust strip immediately above the footer.
const TRUST_STRIP_PATHS = [/^\/$/, /^\/shop$/, /^\/product\//, /^\/cart$/]

export default function Layout() {
  const { pathname } = useLocation()
  const showTrustStrip = TRUST_STRIP_PATHS.some((re) => re.test(pathname))

  return (
    <div className="flex min-h-screen flex-col bg-white pb-[44px]">
      <AnnouncementBar />
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      {showTrustStrip && <TrustStrip />}
      <Footer />
    </div>
  )
}
