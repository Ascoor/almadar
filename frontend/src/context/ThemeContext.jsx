import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext({
  currentTheme: 'light',
  changeCurrentTheme: () => {},
});

export default function ThemeProvider({ children }) {
  // Source of truth for theme + <html>.classList/.dataset
  const getInitialTheme = () => {
    if (typeof window === 'undefined') return 'light';
    const persistedTheme = localStorage.getItem('theme');
    if (persistedTheme === 'light' || persistedTheme === 'dark')
      return persistedTheme;
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  };

  const [theme, setTheme] = useState(getInitialTheme);
  const [hasExplicitPreference, setHasExplicitPreference] = useState(
    Boolean(localStorage.getItem('theme')),
  );

  const changeCurrentTheme = (newTheme) => {
    setHasExplicitPreference(true);
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme); // Persist theme change to localStorage
  };

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'light') {
      root.classList.remove('dark');
      root.dataset.theme = 'light';
      root.style.colorScheme = 'light';
    } else {
      root.classList.add('dark');
      root.dataset.theme = 'dark';
      root.style.colorScheme = 'dark';
    }
  }, [theme]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (event) => {
      if (!hasExplicitPreference) {
        setTheme(event.matches ? 'dark' : 'light');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [hasExplicitPreference]);

  return (
    <ThemeContext.Provider value={{ currentTheme: theme, changeCurrentTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useThemeProvider = () => useContext(ThemeContext);
