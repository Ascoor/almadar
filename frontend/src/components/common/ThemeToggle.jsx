import { MoonStar, SunMedium } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTheme } from '@/hooks/useTheme'

export default function ThemeToggle({ label }) {
  const { theme, toggleTheme, resolvedTheme } = useTheme()
  const isDark = (resolvedTheme || theme) === 'dark'

  return (
    <Button
      type="button"
      size="icon"
      variant="ghost"
      aria-label={label || (isDark ? 'Switch to light' : 'Switch to dark')}
      className="rounded-full border border-border/60 bg-card text-foreground hover:bg-muted"
      onClick={toggleTheme}
    >
      {isDark ? <SunMedium className="h-5 w-5" /> : <MoonStar className="h-5 w-5" />}
    </Button>
  )
}
