import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext({
  currentTheme: 'light',
  changeCurrentTheme: () => {},
});

export default function ThemeProvider({ children }) {
  const persistedTheme = localStorage.getItem('theme');
  const [theme, setTheme] = useState(persistedTheme || 'light'); // Default to 'light' theme

  const changeCurrentTheme = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme); // Persist theme change to localStorage
  };

  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.classList.remove('dark');  // Remove dark class for light theme
      document.documentElement.style.colorScheme = 'light';  // Set color scheme to light
    } else {
      document.documentElement.classList.add('dark');  // Add dark class for dark theme
      document.documentElement.style.colorScheme = 'dark';  // Set color scheme to dark
    }
  }, [theme]); // Trigger effect when theme changes

  return (
    <ThemeContext.Provider value={{ currentTheme: theme, changeCurrentTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useThemeProvider = () => useContext(ThemeContext);
