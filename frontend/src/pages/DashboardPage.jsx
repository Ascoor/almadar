import { useState, useEffect, useContext } from 'react';
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";
import { NotificationProvider } from '../components/Notifications/NotificationContext';
import Header from '../components/dashboard/Header';
import Sidebar from '../components/dashboard/Sidebar';
import AuthRoutes from '../components/layout/AuthRoutes';
import { AuthContext } from '@/components/auth/AuthContext';
import EchoListener from '../components/EchoListener';
import AdminListener from '../components/AdminListener';
import { AnimatePresence, motion } from 'framer-motion';

const queryClient = new QueryClient();
export default function AuthWrapper() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { user } = useContext(AuthContext);
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 1024);

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
      <TooltipProvider>
        <NotificationProvider>
          <AdminListener />
          <EchoListener />
          <div className="min-h-screen flex flex-col sm:flex-row relative">

            {/* الشريط الجانبي */}
            <Sidebar
              isOpen={sidebarOpen}
              onToggle={toggleSidebar}
              onLinkClick={() => !isLargeScreen && setSidebarOpen(false)}
            />

            {/* التعتيم للجوال */}
            {!isLargeScreen && sidebarOpen && (
              <div
                className="fixed inset-0 bg-black/50 z-10"
                onClick={() => setSidebarOpen(false)}
              />
            )}

            {/* محتوى الصفحة */}
            <div className="flex-1 flex flex-col transition-all duration-300">
              <Header
                user={user?.id}
                isOpen={sidebarOpen}
                onToggleSidebar={toggleSidebar}
              />
              <main
                className={`
                  flex-1 pt-28 pb-8 px-4 sm:px-6 lg:px-8
                  bg-greenic-light/20 dark:bg-greenic-darker/20
                  transition-all duration-500
                  ${isLargeScreen ? (sidebarOpen ? 'sm:mr-[260px]' : 'sm:mr-[64px]') : ''}
                `}
              >
                <AuthRoutes />
              </main>
            </div>
          </div>
        </NotificationProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
