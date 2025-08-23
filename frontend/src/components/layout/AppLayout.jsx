import React, { useState, useEffect, lazy, Suspense } from 'react';
import { useLocation } from 'react-router-dom';
import ResponsiveLayout from '@/components/ResponsiveLayout';
import { useMobileTheme } from '@/components/MobileThemeProvider';

const Header = lazy(() => import('@/components/dashboard/Header'));
const AppSidebar = lazy(() => import('./AppSidebar'));

export default function AppLayout({ children, user }) {
  const { isMobile, isStandalone, safeAreaInsets } = useMobileTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (isMobile) setSidebarOpen(false);
  }, [location.pathname, isMobile]);

  const toggleSidebar = () => setSidebarOpen(prev => !prev);

  const mainStyles = {
    paddingTop: isMobile ? (isStandalone ? `${safeAreaInsets.top + 80}px` : '80px') : '112px',
    paddingBottom: isStandalone && isMobile ? `${safeAreaInsets.bottom + 32}px` : '32px',
    marginRight: !isMobile ? (sidebarOpen ? '260px' : '64px') : '0',
    minHeight: isMobile ? 'calc(var(--vh, 1vh) * 100)' : '100vh'
  };

  return (
    <ResponsiveLayout className="min-h-screen flex flex-col sm:flex-row relative">
      <Suspense fallback={<div className="text-center p-4">جاري تحميل القائمة الجانبية...</div>}>
        <AppSidebar
          isOpen={sidebarOpen}
          onToggle={toggleSidebar}
          onLinkClick={() => isMobile && setSidebarOpen(false)}
        />
        {isMobile && sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-10"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </Suspense>
      <div className="flex-1 flex flex-col transition-all duration-300">
        <Suspense fallback={<div className="text-center p-4">جاري تحميل الرأس...</div>}>
          <Header user={user} isOpen={sidebarOpen} onToggleSidebar={toggleSidebar} />
        </Suspense>
        <main
          className={`
            flex-1 px-4 sm:px-6 lg:px-8
            bg-greenic-light/10 dark:bg-greenic-darker/20
            transition-all duration-500
            ${isMobile ? 'mobile-main' : 'desktop-main'}
            ${isStandalone ? 'standalone-main' : ''}
          `}
          style={mainStyles}
        >
          {children}
        </main>
      </div>
    </ResponsiveLayout>
  );
}
