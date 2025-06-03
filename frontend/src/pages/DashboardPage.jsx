import React, { useState, useEffect, useContext } from 'react';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";
import { NotificationProvider } from '@/components/Notifications/NotificationContext';
import Header from '@/components/dashboard/Header';
import Sidebar from '@/components/dashboard/Sidebar';
import AuthRoutes from '@/components/layout/AuthRoutes';
import { firstLoginPassword } from '@/services/api/users';
import ForcePasswordChangeModal from '@/components/auth/ForcePasswordChangeModal';
import { AuthContext } from '@/components/auth/AuthContext';
import EchoListener from '@/components/EchoListener';
import AdminListener from '@/components/AdminListener';
import { AnimatePresence, motion } from 'framer-motion';
import { toast } from 'sonner'; 
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MobileThemeProvider, useMobileTheme } from '@/components/MobileThemeProvider';
import ResponsiveLayout from '@/components/ResponsiveLayout';

const queryClient = new QueryClient();

const DashboardContent = () => {
  const { user, updateUserContext } = useContext(AuthContext);
  const { isMobile, isStandalone, safeAreaInsets } = useMobileTheme();

  const [forcePasswordModal, setForcePasswordModal] = useState(false);
const [newPassword, setNewPassword] = useState('');
const [confirmPassword, setConfirmPassword] = useState('');
const [submitting, setSubmitting] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation(); 

  useEffect(() => {
    if (user && user.password_changed === 0) {
      setForcePasswordModal(true);
    }
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
    <QueryClientProvider client={queryClient}>
      <NotificationProvider>
        <AdminListener />
        <EchoListener />
        <ResponsiveLayout className="min-h-screen flex flex-col sm:flex-row relative">
          <Sidebar
            isOpen={sidebarOpen}
            onToggle={toggleSidebar}
            onLinkClick={() => isMobile && setSidebarOpen(false)}
          />
          
          {/* Mobile overlay */}
          {isMobile && sidebarOpen && (
            <div 
              className="fixed inset-0 bg-black/50 z-10" 
              onClick={() => setSidebarOpen(false)} 
            />
          )}
          
          <div className="flex-1 flex flex-col transition-all duration-300">
            <Header user={user?.id} isOpen={sidebarOpen} onToggleSidebar={toggleSidebar} />
            
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
              <AuthRoutes />
            </main>
          </div>

          <AnimatePresence>
      {forcePasswordModal && (
    <ForcePasswordChangeModal onClose={() => setForcePasswordModal(false)} />
  )}
          </AnimatePresence>
        </ResponsiveLayout>
      </NotificationProvider>
    </QueryClientProvider>
  );
};

const AuthWrapper = () => {
  return (
    <MobileThemeProvider>
      <DashboardContent />
    </MobileThemeProvider>
  );
};

export default AuthWrapper;
