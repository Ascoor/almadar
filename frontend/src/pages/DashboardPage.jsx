import React, { useState, useEffect, useContext, lazy, Suspense } from 'react';
import { useLocation } from "react-router-dom";
   
import AuthSpinner  from '@/components/common/Spinners/AuthSpinner';
import { AuthContext } from '@/components/auth/AuthContext';
import { AnimatePresence } from 'framer-motion'; 
import { MobileThemeProvider, useMobileTheme } from '@/components/MobileThemeProvider';
import ResponsiveLayout from '@/components/ResponsiveLayout';
import { NotificationProvider } from '@/components/Notifications/NotificationContext';
import { AppWithQuery } from '@/hooks/dataHooks';

const Header = lazy(() => import('@/components/dashboard/Header'));
const Sidebar = lazy(() => import('@/components/dashboard/Sidebar'));
const AuthRoutes = lazy(() => import('@/components/layout/AuthRoutes'));
const ForcePasswordChangeModal = lazy(() => import('@/components/auth/ForcePasswordChangeModal'));

const DashboardContent = () => {
  const { user } = useContext(AuthContext);
  const { isMobile, isStandalone, safeAreaInsets } = useMobileTheme();

  const [forcePasswordModal, setForcePasswordModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation(); 

  useEffect(() => {
    if (user && user.password_changed === 0) setForcePasswordModal(true);
  }, [user]);

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
     <Sidebar
        isOpen={sidebarOpen}
        onToggle={toggleSidebar}
        onLinkClick={() => isMobile && setSidebarOpen(false)}
        userPermissions={user.permissions.map(p => p.name)}
      />

      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-10" 
          onClick={() => setSidebarOpen(false)} 
        />
      )}
      </Suspense>
      <div className="flex-1 flex flex-col transition-all duration-300">
        <Suspense fallback={<AuthSpinner />}>
          <Header user={user?.id} isOpen={sidebarOpen} onToggleSidebar={toggleSidebar} />
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
      <Suspense fallback={<AuthSpinner/>}>
            <AuthRoutes />
          </Suspense>
        </main>
      </div>

      <AnimatePresence>
        {forcePasswordModal && (
          <Suspense fallback={<div className="text-center mt-16 p-4"><AuthSpinner />تحميل نافذة تغيير كلمة المرور...</div>}>
            <ForcePasswordChangeModal onClose={() => setForcePasswordModal(false)} />
          </Suspense>
       )}
      </AnimatePresence>
    </ResponsiveLayout>
  );
};

const AuthWrapper = () => (
  <MobileThemeProvider>
    <AppWithQuery>
      <NotificationProvider>
        <DashboardContent />
      </NotificationProvider>
    </AppWithQuery>
  </MobileThemeProvider>
);

export default AuthWrapper;
