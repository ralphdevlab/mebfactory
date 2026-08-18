import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { api } from '../lib/api'

export interface ActiveTheme {
  id: string
  name: string
  primaryBg: string
  accentColor: string
  heroText: string
  heroBanner: string | null
  announcementText: string
}

interface ThemeContextValue {
  theme: ActiveTheme | null
  loading: boolean
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<ActiveTheme | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api
      .get<ActiveTheme | null>('/api/themes/active')
      .then(setTheme)
      .catch(() => setTheme(null))
      .finally(() => setLoading(false))
  }, [])

  // Applied as inline styles on :root, which take priority over the
  // @theme-defined defaults in index.css without needing to touch that file
  // per activation.
  useEffect(() => {
    if (!theme) return
    document.documentElement.style.setProperty('--color-bg', theme.primaryBg)
    document.documentElement.style.setProperty('--color-accent', theme.accentColor)
  }, [theme])

  const value: ThemeContextValue = { theme, loading }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

// Named for the site's seasonal/promotional theme specifically (not a
// light/dark UI mode) to avoid ambiguity if one of those gets added later.
export function useSiteTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useSiteTheme must be used within a ThemeProvider')
  return ctx
}
