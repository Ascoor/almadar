import React, { useState, useEffect, lazy, Suspense } from 'react';

import AuthSpinner from '@/components/common/Spinners/AuthSpinner';
import { useAuth } from '@/context/AuthContext';
import { AnimatePresence } from 'framer-motion';
import { MobileThemeProvider } from '@/components/MobileThemeProvider';
import { NotificationProvider } from '@/context/NotificationContext';

const AppLayout = lazy(() => import('@/components/layout/AppLayout'));
const ForcePasswordChangeModal = lazy(
  () => import('@/components/organisms/ForcePasswordChangeModal'),
);

const DashboardContent = () => {
  const { user } = useAuth();

  const [forcePasswordModal, setForcePasswordModal] = useState(false);

  useEffect(() => {
    if (user && user.password_changed === 0) setForcePasswordModal(true);
  }, [user]);
  return (
    <>
      <AppLayout />
      <AnimatePresence>
        {forcePasswordModal && (
          <Suspense
            fallback={
              <div className="text-center mt-16 p-4">
                <AuthSpinner />
                تحميل نافذة تغيير كلمة المرور...
              </div>
            }
          >
            <ForcePasswordChangeModal
              onClose={() => setForcePasswordModal(false)}
            />
          </Suspense>
        )}
      </AnimatePresence>
    </>
  );
};

const AuthWrapper = () => (
  <MobileThemeProvider>
    <NotificationProvider>
      <DashboardContent />
    </NotificationProvider>
  </MobileThemeProvider>
);

export default AuthWrapper;
