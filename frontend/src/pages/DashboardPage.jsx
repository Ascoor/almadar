import React, { useState, useEffect, useContext, lazy, Suspense } from 'react';

import AuthSpinner from '@/components/common/Spinners/AuthSpinner';
import { AuthContext } from '@/components/auth/AuthContext';
import { AnimatePresence } from 'framer-motion';
import { MobileThemeProvider } from '@/components/MobileThemeProvider';
import { NotificationProvider } from '@/components/Notifications/NotificationContext';
import { AppWithQuery } from '@/hooks/dataHooks';
<<<<<<< HEAD
import AdminEchoListener from '../components/EchoInitializer/AdminListener';
import AppSidebar from '../components/layout/AppSidebar';
import AppLayout from '../components/layout/AppLayout';
=======
import { LanguageProvider } from '@/context/LanguageContext';
>>>>>>> a14b8fd1b562cdad616b0d565f9e7246cc89b0a2

const AppLayout = lazy(() => import('@/components/layout/AppLayout'));
const AuthRoutes = lazy(() => import('@/components/layout/AuthRoutes'));
const ForcePasswordChangeModal = lazy(() => import('@/components/auth/ForcePasswordChangeModal'));

const DashboardContent = () => {
  const { user } = useContext(AuthContext);

  const [forcePasswordModal, setForcePasswordModal] = useState(false);

  useEffect(() => {
    if (user && user.password_changed === 0) setForcePasswordModal(true);
  }, [user]);
  return (
<<<<<<< HEAD
    <ResponsiveLayout className="min-h-screen flex flex-col sm:flex-row relative">
       <Suspense fallback={<div className="text-center p-4">جاري تحميل القائمة الجانبية...</div>}>
     <AppSidebar
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
               <AppLayout
        isOpen={sidebarOpen}
        onToggle={toggleSidebar}
        onLinkClick={() => isMobile && setSidebarOpen(false)}
        userPermissions={user.permissions.map(p => p.name)}
      />
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

=======
    <AppLayout user={user}>
      <Suspense fallback={<AuthSpinner />}>
        <AuthRoutes />
      </Suspense>
>>>>>>> a14b8fd1b562cdad616b0d565f9e7246cc89b0a2
      <AnimatePresence>
        {forcePasswordModal && (
          <Suspense fallback={<div className="text-center mt-16 p-4"><AuthSpinner />تحميل نافذة تغيير كلمة المرور...</div>}>
            <ForcePasswordChangeModal onClose={() => setForcePasswordModal(false)} />
          </Suspense>
        )}
      </AnimatePresence>
    </AppLayout>
  );
};

const AuthWrapper = () => (
  <MobileThemeProvider>
<<<<<<< HEAD
    <AppWithQuery>
      <NotificationProvider>
        <AdminEchoListener/>
        <DashboardContent />
      </NotificationProvider>
    </AppWithQuery>
=======
    <LanguageProvider>
      <AppWithQuery>
        <NotificationProvider>
          <DashboardContent />
        </NotificationProvider>
      </AppWithQuery>
    </LanguageProvider>
>>>>>>> a14b8fd1b562cdad616b0d565f9e7246cc89b0a2
  </MobileThemeProvider>
);

export default AuthWrapper;
