import React, { useState, useEffect, lazy, Suspense } from 'react';
import { useLocation } from 'react-router-dom';
import ResponsiveLayout from '@/components/ResponsiveLayout';
import { useMobileTheme } from '@/components/MobileThemeProvider';
import { useLanguage } from '@/context/LanguageContext';

const Header = lazy(() => import('@/components/layout/DashboardHeader'));
const AppSidebar = lazy(() => import('./AppSidebar'));

export default function AppLayout({ children, user }) {
  const { isMobile, isStandalone, safeAreaInsets } = useMobileTheme();
  useLanguage();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isTablet, setIsTablet] = useState(
    typeof window !== 'undefined' &&
      window.innerWidth >= 768 &&
      window.innerWidth < 1024,
  );
  const location = useLocation();

  useEffect(() => {
    if (isMobile) setSidebarOpen(false);
  }, [location.pathname, isMobile]);

  useEffect(() => {
    const handleResize = () => {
      setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  const sidebarOffset = !isMobile
    ? isTablet
      ? sidebarOpen
        ? '0'
        : '64px'
      : sidebarOpen
        ? '260px'
        : '64px'
    : '0';
  const mainStyles = {
    paddingTop: isMobile
      ? isStandalone
        ? `${safeAreaInsets.top + 80}px`
        : '80px'
      : '112px',
    paddingBottom:
      isStandalone && isMobile ? `${safeAreaInsets.bottom + 32}px` : '32px',
    marginInlineStart: sidebarOffset,
    minHeight: isMobile ? 'calc(var(--vh, 1vh) * 100)' : '100vh',
  };

  return (
    <ResponsiveLayout className="min-h-screen w-full min-w-0 flex flex-col sm:flex-row relative overflow-x-hidden">
      <Suspense fallback={null}>
        <AppSidebar
          isOpen={sidebarOpen}
          onToggle={toggleSidebar}
          onLinkClick={() => (isMobile || isTablet) && setSidebarOpen(false)}
        />
        {(isMobile || isTablet) && sidebarOpen && (
          <div
            className="fixed inset-0 bg-foreground/50 z-10"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </Suspense>
      <div className="flex-1 flex flex-col transition-[width,transform] duration-300 min-w-0 w-full">
        <Suspense fallback={null}>
          <Header
            user={user}
            isOpen={sidebarOpen}
            onToggleSidebar={toggleSidebar}
          />
        </Suspense>
        <main
          className={`
            flex-1 px-4 sm:px-6 lg:px-8
            bg-bg
            transition-[width,transform] duration-500
            ${isMobile ? 'mobile-main' : 'desktop-main'}
            ${isStandalone ? 'standalone-main' : ''}
            min-w-0 w-full
          `}
          style={mainStyles}
        >
          {children}
        </main>
      </div>
    </ResponsiveLayout>
  );
}
