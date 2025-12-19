import { Moon, SunMedium } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';

export const ThemeToggle = () => {
  const { theme, toggle, setTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={toggle}
        className="flex items-center gap-2 rounded-full bg-card px-3 py-2 text-sm font-medium text-foreground shadow-sm border border-border hover:border-primary transition-colors"
        aria-label="Toggle theme"
      >
        {isDark ? <Moon className="h-4 w-4" /> : <SunMedium className="h-4 w-4" />}
        <span>{isDark ? 'Dark' : 'Light'}</span>
      </button>
      <select
        value={theme}
        onChange={(e) => setTheme(e.target.value)}
        className="hidden sm:block rounded-full border border-border bg-card px-3 py-2 text-sm text-foreground focus:ring-2 focus:ring-ring"
        aria-label="Theme preference"
      >
        <option value="light">Light</option>
        <option value="dark">Dark</option>
        <option value="system">System</option>
      </select>
    </div>
  );
};
