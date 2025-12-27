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

  const isDashboardRoute =
    location.pathname === '/' || location.pathname.startsWith('/dashboard');
  const desktopSidebarWidth = 256;
  const collapsedPeekWidth = 64;

  const isOverlayMode = isMobile || isTablet;
  const headerOffset = !isOverlayMode
    ? `${sidebarOpen ? desktopSidebarWidth : collapsedPeekWidth}px`
    : '0px';
  const sidebarOffset = !isOverlayMode
    ? `${sidebarOpen ? desktopSidebarWidth : collapsedPeekWidth}px`
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
        <div
          className={`fixed inset-0 bg-foreground/50 z-10 transition-opacity duration-250 ${
            sidebarOpen && (isMobile || isTablet)
              ? 'opacity-100'
              : 'opacity-0 pointer-events-none'
          }`}
          onClick={() => setSidebarOpen(false)}
          aria-hidden={!sidebarOpen}
        />
      </Suspense>
      <div className="flex-1 flex flex-col min-w-0 w-full">
        <Suspense fallback={null}>
          <Header
            user={user}
            isOpen={sidebarOpen}
            sidebarOffset={headerOffset}
            onToggleSidebar={toggleSidebar}
          />
        </Suspense>
        <main
          className={`
            flex-1 bg-bg
            transition-[margin] duration-250 ${sidebarOpen ? 'ease-out' : 'ease-in'}
            ${isMobile ? 'mobile-main' : 'desktop-main'}
            ${isStandalone ? 'standalone-main' : ''}
            min-w-0 w-full
            pb-8
          `}
          style={mainStyles}
        >
          <div
            className={`w-full ${
              isDashboardRoute ? 'max-w-[1400px]' : 'max-w-6xl'
            } mx-auto px-4 sm:px-6 lg:px-8 space-y-6 lg:space-y-8`}
          >
            {children}
          </div>
        </main>
      </div>
    </ResponsiveLayout>
  );
}
