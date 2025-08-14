import React, { useContext, useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NotificationProvider } from '@/components/Notifications/NotificationContext';
import ForcePasswordChangeModal from '@/components/auth/ForcePasswordChangeModal';
import { AuthContext } from '@/components/auth/AuthContext';
import EchoListener from '@/components/EchoListener';
import AdminListener from '@/components/AdminListener';
import { AnimatePresence } from 'framer-motion';
import AppLayout from '@/components/dashboard/AppLayout';
import AuthRoutes from '@/components/layout/AuthRoutes';

const queryClient = new QueryClient();

const DashboardContent = () => {
  const { user } = useContext(AuthContext);
  const [forcePasswordModal, setForcePasswordModal] = useState(false);

  useEffect(() => {
    if (user && user.password_changed === 0) {
      setForcePasswordModal(true);
    }
  }, [user]);

  return (
    <QueryClientProvider client={queryClient}>
      <NotificationProvider>
        <AdminListener />
        <EchoListener />
        <AppLayout>
          <AuthRoutes />
        </AppLayout>
        <AnimatePresence>
          {forcePasswordModal && (
            <ForcePasswordChangeModal onClose={() => setForcePasswordModal(false)} />
          )}
        </AnimatePresence>
      </NotificationProvider>
    </QueryClientProvider>
  );
};

export default function AuthWrapper() {
  return <DashboardContent />;
}
