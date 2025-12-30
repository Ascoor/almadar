import React, { useEffect, useState, lazy, Suspense } from 'react';
import { useLocation } from 'react-router-dom';
import ResponsiveLayout from '@/components/ResponsiveLayout';
import { useIsMobile } from '@/hooks/use-mobile';

const Header = lazy(() => import('@/components/layout/DashboardHeader'));
const AppSidebar = lazy(() => import('@/components/layout/AppSidebar'));

export default function AppLayout({ children, user }) {
  const location = useLocation();
  const isMobile = useIsMobile();

  // tabletUp = >= 768
  const [isTabletUp, setIsTabletUp] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth >= 768 : true,
  );

  useEffect(() => {
    const onResize = () => setIsTabletUp(window.innerWidth >= 768);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const [sidebarOpen, setSidebarOpen] = useState(false);

  // ✅ على تغيير الصفحة: اقفل dropdown في الموبايل
  useEffect(() => {
    if (isMobile) setSidebarOpen(false);
  }, [location.pathname, isMobile]);

  // ✅ عند الدخول للتابلتUp: خليها collapsed افتراضياً
  useEffect(() => {
    if (isTabletUp) setSidebarOpen(false);
  }, [isTabletUp]);

  const toggleSidebar = () => setSidebarOpen((p) => !p);

  // offsets فقط للتابلتUp لأن الموبايل مفيهوش sidebar جانبي
  const desktopSidebarWidth = 256;
  const collapsedWidth = 64;
  const sidebarOffset = isTabletUp
    ? `${sidebarOpen ? desktopSidebarWidth : collapsedWidth}px`
    : '0px';

  const mainStyles = {
    paddingTop: '80px',
    marginInlineStart: sidebarOffset,
    minHeight: '100vh',
    paddingBottom: '32px',
  };

  return (
    <ResponsiveLayout className="min-h-screen w-full min-w-0 flex flex-col sm:flex-row relative overflow-x-hidden">
      <Suspense fallback={null}>
        <AppSidebar
          isOpen={sidebarOpen}
          onToggle={toggleSidebar}
          onLinkClick={() => setSidebarOpen(false)}
          mode={isMobile ? 'mobile-dropdown' : 'desktop-sidebar'}
        />
      </Suspense>

      <div className="flex-1 flex flex-col min-w-0 w-full">
        <Suspense fallback={null}>
          <Header
            user={user}
            isOpen={sidebarOpen}
            sidebarOffset={sidebarOffset}
            onToggleSidebar={toggleSidebar}
          />
        </Suspense>

        <main className="flex-1 bg-bg min-w-0 w-full pb-8" style={mainStyles}>
          <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 lg:space-y-8">
            {children}
          </div>
        </main>
      </div>
    </ResponsiveLayout>
  );
}
