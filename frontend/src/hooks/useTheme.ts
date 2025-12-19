import { useThemeProvider } from '@/context/ThemeContext'

export const useTheme = () => {
  const { currentTheme, resolvedTheme, changeCurrentTheme, toggleTheme } = useThemeProvider()

  return {
    theme: currentTheme,
    resolvedTheme: resolvedTheme || currentTheme,
    setTheme: changeCurrentTheme,
    toggleTheme,
  }
}

export default useTheme
