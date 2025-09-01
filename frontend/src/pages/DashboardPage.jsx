import React, { useState, useEffect, useContext, lazy, Suspense } from 'react';

import AuthSpinner from '@/components/common/Spinners/AuthSpinner';
import { AuthContext } from '@/context/AuthContext';
import { AnimatePresence } from 'framer-motion';
import { MobileThemeProvider } from '@/components/MobileThemeProvider';
import { NotificationProvider } from '@/context/NotificationContext';
import { AppWithQuery } from '@/hooks/dataHooks';

const AppLayout = lazy(() => import('@/components/layout/AppLayout'));
const AuthRoutes = lazy(() => import('@/components/layout/AuthRoutes'));
const ForcePasswordChangeModal = lazy(() => import('@/components/organisms/ForcePasswordChangeModal'));

const DashboardContent = () => {
  const { user } = useContext(AuthContext);

  const [forcePasswordModal, setForcePasswordModal] = useState(false);

  useEffect(() => {
    if (user && user.password_changed === 0) setForcePasswordModal(true);
  }, [user]);
  return (
    <AppLayout user={user}>
      <Suspense fallback={<AuthSpinner />}>
        <AuthRoutes />
      </Suspense>
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
    <AppWithQuery>
      <NotificationProvider>
        <DashboardContent />
      </NotificationProvider>
    </AppWithQuery>
  </MobileThemeProvider>
);

export default AuthWrapper;
