import { useThemeProvider } from '../../utils/ThemeContext';
import { FaSun, FaMoon } from 'react-icons/fa';

export default function ThemeToggle({ size = 'md' }) {
  const { currentTheme, changeCurrentTheme } = useThemeProvider();

  return (
    <button
      onClick={() =>
        changeCurrentTheme(currentTheme === 'light' ? 'dark' : 'light')
      }
      className={`flex items-center justify-center w-12 h-12 rounded-full shadow-lg transition-all duration-300 ${
        currentTheme === 'light'
          ? 'bg-almadar-blue text-white hover:bg-almadar-blue/90'
          : 'bg-almadar-mintray text-yellow-400 hover:bg-almadar-blue'
      }`}
    >
      {currentTheme === 'light' ? (
        <FaSun className="w-6 h-6" />
      ) : (
        <FaMoon className="w-6 h-6" />
      )}
    </button>
  );
}
