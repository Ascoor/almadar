import React, { useEffect, useState } from 'react';
import { Moon, SunMedium } from 'lucide-react';
import Button from '@/components/ui/Button';
import HeaderToggle from '@/components/common/HeaderToggle';

export default function Topbar() {
  const [dark, setDark] = useState(
    typeof window !== 'undefined' && localStorage.getItem('theme') === 'dark'
  );

  useEffect(() => {
    const root = document.documentElement;
    if (dark) {
      root.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.removeAttribute('data-theme');
      localStorage.setItem('theme', 'light');
    }
  }, [dark]);

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-bg/70 backdrop-blur">
      <div className="container flex items-center justify-between py-3">
        <div className="flex items-center gap-3">
          {/* Sidebar toggle button */}
          <HeaderToggle />

          <div className="pill">المــدار</div>
          <span className="text-sm text-muted">منصة الإدارة القانونية الذكية</span>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" onClick={() => setDark(!dark)} aria-label="Toggle theme">
            {dark ? <SunMedium className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </Button>
        </div>
      </div>
    </header>
  );
}
