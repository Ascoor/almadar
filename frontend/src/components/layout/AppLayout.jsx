import React, { useEffect, useState, lazy, Suspense } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import ResponsiveLayout from '@/components/ResponsiveLayout';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/context/AuthContext';

const Header = lazy(() => import('@/components/layout/Header'));
const Sidebar = lazy(() => import('@/components/layout/Sidebar'));
const MiniSidebar = lazy(() => import('@/components/layout/MiniSidebar'));

const SIDEBAR_WIDTH = 288;
const MINI_SIDEBAR_WIDTH = 80;
const HEADER_HEIGHT = 64;

export default function AppLayout({ children }) {
  const location = useLocation();
  const isMobile = useIsMobile();
  const { user } = useAuth();
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  useEffect(() => {
    if (isMobile) setIsMobileSidebarOpen(false);
  }, [isMobile, location.pathname]);

  const toggleSidebar = () => setIsSidebarExpanded((prev) => !prev);

  const sidebarOffset = isMobile
    ? '0px'
    : `${isSidebarExpanded ? SIDEBAR_WIDTH : MINI_SIDEBAR_WIDTH}px`;

  const mainStyles = {
    paddingTop: `${HEADER_HEIGHT}px`,
    marginInlineStart: sidebarOffset,
    minHeight: '100vh',
    paddingBottom: '32px',
  };

  return (
    <ResponsiveLayout className="min-h-screen w-full min-w-0 flex flex-col relative overflow-x-hidden bg-bg">
      <Suspense fallback={null}>
        {!isMobile && isSidebarExpanded && (
          <Sidebar isOpen variant="desktop" onNavigate={() => {}} />
        )}
        {!isMobile && !isSidebarExpanded && (
          <MiniSidebar onExpand={() => setIsSidebarExpanded(true)} />
        )}
        {isMobile && (
          <Sidebar
            isOpen={isMobileSidebarOpen}
            variant="mobile"
            onClose={() => setIsMobileSidebarOpen(false)}
            onNavigate={() => setIsMobileSidebarOpen(false)}
          />
        )}
      </Suspense>

      <div className="flex-1 flex flex-col min-w-0 w-full">
        <Suspense fallback={null}>
          <Header
            user={user}
            isSidebarExpanded={isSidebarExpanded}
            sidebarOffset={sidebarOffset}
            onToggleSidebar={toggleSidebar}
            onOpenMobile={() => setIsMobileSidebarOpen(true)}
          />
        </Suspense>

        <main className="flex-1 bg-bg min-w-0 w-full pb-8" style={mainStyles}>
          <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 lg:space-y-8">
            {children ?? <Outlet />}
          </div>
        </main>
      </div>
    </ResponsiveLayout>
  );
}
