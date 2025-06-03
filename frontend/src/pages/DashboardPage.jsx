import React, { useState, useEffect, useContext } from 'react';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";
import { NotificationProvider } from '../components/Notifications/NotificationContext';
import Header from '../components/dashboard/Header';
import Sidebar from '../components/dashboard/Sidebar';
import AuthRoutes from '../components/layout/AuthRoutes';
import { firstLoginPassword } from '@/services/api/users';
import ForcePasswordChangeModal from '@/components/auth/ForcePasswordChangeModal';

import { AuthContext } from '@/components/auth/AuthContext';
import EchoListener from '../components/EchoListener';
import AdminListener from '../components/AdminListener';
import { AnimatePresence, motion } from 'framer-motion';
import { toast } from 'sonner'; 
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const queryClient = new QueryClient();

const AuthWrapper = () => {
  const { user, updateUserContext } = useContext(AuthContext);

  const [forcePasswordModal, setForcePasswordModal] = useState(false);
const [newPassword, setNewPassword] = useState('');
const [confirmPassword, setConfirmPassword] = useState('');
const [submitting, setSubmitting] = useState(false);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation(); 
  
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 1024);
 useEffect(() => {
  if (user && user.password_changed === 0) {
    setForcePasswordModal(true);
  }
}, [user]);

 

  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth >= 1024);
      if (window.innerWidth < 640) setSidebarOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [location.pathname]);

  const toggleSidebar = () => setSidebarOpen(prev => !prev);

  return (
    <QueryClientProvider client={queryClient}>
      <NotificationProvider>
        <AdminListener />
        <EchoListener />
        <div className="min-h-screen flex flex-col sm:flex-row relative">
          <Sidebar
            isOpen={sidebarOpen}
            onToggle={toggleSidebar}
            onLinkClick={() => !isLargeScreen && setSidebarOpen(false)}
          />
          {/* Overlay to close sidebar when it's open on small screens */}
          {!isLargeScreen && sidebarOpen && (
            <div className="fixed inset-0 bg-black/50 z-10" onClick={() => setSidebarOpen(false)} />
          )}
          <div className="flex-1 flex flex-col transition-all duration-300">
            <Header user={user?.id} isOpen={sidebarOpen} onToggleSidebar={toggleSidebar} />
            <main className={`flex-1 pt-28 pb-8 px-4 sm:px-6 lg:px-8 bg-greenic-light/10 dark:bg-greenic-darker/20 transition-all duration-500 ${isLargeScreen ? (sidebarOpen ? 'sm:mr-[260px]' : 'sm:mr-[64px]') : ''}`}>
              <AuthRoutes />
            </main>
          </div>
     <AnimatePresence>
  {forcePasswordModal && (
    <ForcePasswordChangeModal onClose={() => setForcePasswordModal(false)} />
  )}
</AnimatePresence>


        </div>
      </NotificationProvider>
    </QueryClientProvider>
  );
};

export default AuthWrapper;
