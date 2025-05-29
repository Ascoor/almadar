import { useThemeProvider } from '../../utils/ThemeContext';
import { SunMedium , MoonStar  } from 'lucide-react';
import IconButton from './iconButton';

export default function ThemeToggle() {
  const { currentTheme, changeCurrentTheme } = useThemeProvider();

  return (
 <IconButton
  onClick={() => changeCurrentTheme(currentTheme === 'light' ? 'dark' : 'light')}
>
  {currentTheme === 'light' ? (
    <SunMedium className="w-5 h-5" />
  ) : (
    <MoonStar className="w-5 h-5" />
  )}
</IconButton>

  );
}
