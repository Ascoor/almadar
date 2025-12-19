import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const ThemeContext = createContext({
  currentTheme: 'light',
  changeCurrentTheme: () => {},
})

const getPreferredTheme = () => {
  if (typeof window === 'undefined') return 'light'
  const stored = localStorage.getItem('theme')
  if (stored === 'light' || stored === 'dark' || stored === 'system') return stored
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export default function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(getPreferredTheme)

  const resolvedTheme = useMemo(() => {
    if (theme === 'system') {
      if (typeof window === 'undefined') return 'light'
      return window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'
    }
    return theme
  }, [theme])

  useEffect(() => {
    const root = document.documentElement
    if (resolvedTheme === 'light') {
      root.classList.remove('dark')
      root.style.colorScheme = 'light'
    } else {
      root.classList.add('dark')
      root.style.colorScheme = 'dark'
    }
    localStorage.setItem('theme', theme)
  }, [theme, resolvedTheme])

  const changeCurrentTheme = (newTheme) => {
    setTheme(newTheme)
  }

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }

  return (
    <ThemeContext.Provider
      value={{ currentTheme: theme, resolvedTheme, changeCurrentTheme, toggleTheme }}
    >
      {children}
    </ThemeContext.Provider>
  )
}

export const useThemeProvider = () => useContext(ThemeContext)
