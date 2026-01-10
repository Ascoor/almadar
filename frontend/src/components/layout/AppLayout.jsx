import React, { useEffect, useState, Suspense } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import ResponsiveLayout from '@/components/ResponsiveLayout';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/context/AuthContext';
import { Skeleton } from '@/components/ui/skeleton';
import { LazyMotion, domAnimation } from 'framer-motion';
import Header from '@/components/layout/Header';
import AppSidebar from '@/components/layout/AppSidebar';

const SIDEBAR_WIDTH = 256;
const MINI_SIDEBAR_WIDTH = 72;
const HEADER_HEIGHT = 64;

const DashboardSkeleton = () => (
  <div className="space-y-6 lg:space-y-8">
    <div className="space-y-2">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-4 w-64" />
    </div>
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      <Skeleton className="h-32 rounded-2xl" />
      <Skeleton className="h-32 rounded-2xl" />
      <Skeleton className="h-32 rounded-2xl" />
    </div>
    <Skeleton className="h-64 rounded-2xl" />
  </div>
);

export default function AppLayout() {
  const location = useLocation();
  const isMobile = useIsMobile();
  const { user } = useAuth();
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  useEffect(() => {
    if (isMobile) setIsMobileSidebarOpen(false);
  }, [isMobile, location.pathname]);

  const toggleSidebar = () => setIsSidebarExpanded((prev) => !prev);
  const toggleSidebarState = () => {
    if (isMobile) {
      setIsMobileSidebarOpen((prev) => !prev);
    } else {
      toggleSidebar();
    }
  };

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
    <LazyMotion features={domAnimation}>
      <ResponsiveLayout className="min-h-screen w-full min-w-0 flex flex-col relative overflow-x-hidden bg-bg">
        <AppSidebar
          isOpen={isMobile ? isMobileSidebarOpen : isSidebarExpanded}
          onToggle={toggleSidebarState}
          onLinkClick={() => setIsMobileSidebarOpen(false)}
        />

        <div className="flex-1 flex flex-col min-w-0 w-full">
          <Header
            user={user}
            isSidebarExpanded={isSidebarExpanded}
            sidebarOffset={sidebarOffset}
            onToggleSidebar={toggleSidebar}
            onOpenMobile={() => setIsMobileSidebarOpen(true)}
          />

          <main className="flex-1 bg-bg min-w-0 w-full pb-8" style={mainStyles}>
            <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 lg:space-y-8">
              <Suspense fallback={<DashboardSkeleton />}>
                <Outlet />
              </Suspense>
            </div>
          </main>
        </div>
      </ResponsiveLayout>
    </LazyMotion>
  );
}
