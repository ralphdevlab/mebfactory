import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

const STORAGE_KEY = 'mebfactory_school'

interface SchoolContextValue {
  selectedSchool: string
  setSelectedSchool: (school: string) => void
}

const SchoolContext = createContext<SchoolContextValue | undefined>(undefined)

export function SchoolProvider({ children }: { children: ReactNode }) {
  const [selectedSchool, setSelectedSchoolState] = useState('')

  useEffect(() => {
    try {
      setSelectedSchoolState(localStorage.getItem(STORAGE_KEY) ?? '')
    } catch {
      // localStorage unavailable (private mode etc.) - stay unset
    }
  }, [])

  const setSelectedSchool = (school: string) => {
    setSelectedSchoolState(school)
    try {
      if (school) localStorage.setItem(STORAGE_KEY, school)
      else localStorage.removeItem(STORAGE_KEY)
    } catch {
      // localStorage unavailable - selection still works for this session
    }
  }

  const value: SchoolContextValue = { selectedSchool, setSelectedSchool }

  return <SchoolContext.Provider value={value}>{children}</SchoolContext.Provider>
}

export function useSchool() {
  const ctx = useContext(SchoolContext)
  if (!ctx) throw new Error('useSchool must be used within a SchoolProvider')
  return ctx
}
