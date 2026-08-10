import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { api } from '../lib/api'
import { getToken, setToken, clearToken } from '../lib/auth'
import type { User } from '../types'

interface AuthResponse {
  token: string
  user: User
}

interface AuthContextValue {
  user: User | null
  // True only while the initial "is there a valid token already?" check is
  // in flight, so consumers (e.g. the Navbar) can avoid flashing a
  // logged-out state for a split second before that check resolves.
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, firstName: string, lastName: string) => Promise<void>
  logout: () => void
  updateProfile: (firstName: string, lastName: string) => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // On first mount, if a token is already sitting in localStorage (from a
  // previous visit), ask the backend who it belongs to rather than trusting
  // it blindly - the token could be expired or the user could have been
  // deleted, in which case /me will 401/404 and we clear it.
  useEffect(() => {
    const token = getToken()
    if (!token) {
      setLoading(false)
      return
    }
    api
      .get<User>('/api/auth/me')
      .then(setUser)
      .catch(() => {
        clearToken()
        setUser(null)
      })
      .finally(() => setLoading(false))
  }, [])

  const login = async (email: string, password: string) => {
    const data = await api.post<AuthResponse>('/api/auth/login', { email, password })
    setToken(data.token)
    setUser(data.user)
  }

  const register = async (email: string, password: string, firstName: string, lastName: string) => {
    const data = await api.post<AuthResponse>('/api/auth/register', {
      email,
      password,
      firstName,
      lastName,
    })
    setToken(data.token)
    setUser(data.user)
  }

  const logout = () => {
    clearToken()
    setUser(null)
  }

  const updateProfile = async (firstName: string, lastName: string) => {
    const updated = await api.patch<User>('/api/auth/me', { firstName, lastName })
    setUser(updated)
  }

  const value: AuthContextValue = { user, loading, login, register, logout, updateProfile }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}
