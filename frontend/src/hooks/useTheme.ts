import { useThemeProvider } from '@/context/ThemeContext';

export const useTheme = () => {
  const { currentTheme, changeCurrentTheme } = useThemeProvider();

  const toggle = () =>
    changeCurrentTheme(currentTheme === 'dark' ? 'light' : 'dark');

  return {
    theme: currentTheme,
    setTheme: changeCurrentTheme,
    toggle,
  };
};
