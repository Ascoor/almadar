import React, { useEffect } from 'react';
import { Menu, Sun, Moon } from 'lucide-react';

export default function AppHeader({ isDark, onToggleTheme, onToggleMobile, isMobileOpen, onThemeInit }) {
  useEffect(() => {
    const stored = localStorage.getItem('theme');
    const prefers = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const dark = stored ? stored === 'dark' : prefers;
    const root = document.documentElement;
    root.classList.toggle('dark', dark);
    root.setAttribute('data-theme', dark ? 'dark' : 'light');
    onThemeInit(dark);
  }, [onThemeInit]);

  return (
    <header className="sticky top-0 z-40 bg-background/80 backdrop-blur border-b border-border">
      <div className="flex flex-wrap items-center gap-3 p-3 md:px-4">
        <button
          onClick={onToggleMobile}
          aria-label="فتح القائمة"
          aria-controls="app-sidebar"
          aria-expanded={isMobileOpen}
          className="p-2 rounded-lg md:hidden hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring transition"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="font-bold text-lg">المدار</div>
        <div className="flex-1" />
        <input type="search" dir="ltr" placeholder="Search" className="hidden sm:block w-full max-w-xs rounded-xl border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
        <button
          onClick={onToggleTheme}
          className="p-2 rounded-lg hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring transition"
          aria-label="Toggle theme"
        >
          {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
      </div>
    </header>
  );
}
