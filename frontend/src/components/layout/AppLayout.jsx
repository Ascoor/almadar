import React, { useState, useEffect, useRef, useCallback } from 'react';
import AppHeader from './AppHeader';
import AppSidebar from './AppSidebar';
import { Home, Settings, FileText } from 'lucide-react';

const navLinks = [
  {
    label: 'Main',
    items: [
      { title: 'الرئيسية', icon: Home, href: '#' },
      { title: 'المستندات', icon: FileText, href: '#' }
    ]
  },
  {
    label: 'Management',
    items: [
      { title: 'الإعدادات', icon: Settings, href: '#' }
    ]
  }
];

export default function AppLayout({ children }) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMini, setIsMini] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const mainRef = useRef(null);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px) and (max-width: 1279px)');
    const handler = e => setIsMini(e.matches);
    handler(mq);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const toggleMobile = () => setIsMobileOpen(o => !o);

  const closeMobile = useCallback(() => {
    setIsMobileOpen(false);
    setTimeout(() => mainRef.current?.focus(), 0);
  }, []);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    const root = document.documentElement;
    root.classList.toggle('dark', next);
    root.setAttribute('data-theme', next ? 'dark' : 'light');
    localStorage.setItem('theme', next ? 'dark' : 'light');
  };

  useEffect(() => {
    if (!isMobileOpen) return;
    const sidebar = document.getElementById('app-sidebar');
    const focusables = sidebar?.querySelectorAll('a, button');
    const first = focusables?.[0];
    const last = focusables?.[focusables.length - 1];
    first?.focus();

    const trap = e => {
      if (e.key === 'Escape') {
        closeMobile();
      } else if (e.key === 'Tab' && focusables.length) {
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', trap);
    return () => document.removeEventListener('keydown', trap);
  }, [isMobileOpen, closeMobile]);

  return (
    <div className="min-h-screen bg-background text-foreground" dir="rtl">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:start-3 rounded-md bg-accent px-4 py-2 text-accent-foreground"
      >
        تخطى إلى المحتوى
      </a>
      <div className={`${isMini ? 'md:grid md:grid-cols-[80px_1fr]' : 'md:grid md:grid-cols-[280px_1fr]'} min-h-screen`}>
        <AppSidebar
          isMobileOpen={isMobileOpen}
          isMini={isMini}
          onClose={closeMobile}
          links={navLinks}
        />
        <div className="flex flex-col min-h-screen">
          <AppHeader
            isDark={isDark}
            onToggleTheme={toggleTheme}
            onToggleMobile={toggleMobile}
            isMobileOpen={isMobileOpen}
            onThemeInit={setIsDark}
          />
          <main
            id="main"
            tabIndex={-1}
            ref={mainRef}
            className="flex-1 p-4 md:p-6 focus:outline-none"
          >
            {children}
          </main>
        </div>
      </div>
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          onClick={closeMobile}
          aria-hidden="true"
        />
      )}
    </div>
  );
}
