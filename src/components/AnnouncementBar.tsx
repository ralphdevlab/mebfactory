import { useSiteTheme } from '../context/ThemeContext'

const DEFAULT_MESSAGE = 'New arrivals every Friday — free shipping over $75'

export default function AnnouncementBar() {
  const { theme } = useSiteTheme()

  return (
    <div className="bg-charcoal text-surface">
      <div className="mx-auto flex max-w-[1440px] items-center justify-center px-4 py-2">
        <p className="text-[10px] font-medium uppercase tracking-[0.14em]">
          {theme?.announcementText || DEFAULT_MESSAGE}
        </p>
      </div>
    </div>
  )
}
