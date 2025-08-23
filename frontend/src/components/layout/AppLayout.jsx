<<<<<<< HEAD
 
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Menu } from 'lucide-react';
import AppSidebar from './AppSidebar';
import { Input } from '@/components/ui/input'; 
import { ThemeToggle } from '@/components/common/ThemeToggle';
import ProfileMenu from '@/components/common/ProfileMenu';
import DropdownNotifications from '@/components/common/DropdownNotifications';

import { useIsMobile } from '@/hooks/use-mobile';
import EchoListener from '@/context/EchoListener';
import AdminListener from '@/context/AdminListener';
import { NotificationProvider } from '@/context/NotificationContext';
import logoLight from '@/assets/images/logo-art.png';
import logoDark from '@/assets/images/logo-art-text.png';

const AppLayout = ({ children }) => { 
  const isMobile = useIsMobile();
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    // Always start collapsed; hide completely on mobile
    setSidebarOpen(false);
  }, [isMobile]);

  const toggleSidebar = () => setSidebarOpen((o) => !o);
  const closeSidebar = () => setSidebarOpen(false);

  const contentMargin = !isMobile
    ? isSidebarOpen
      ? isRTL
        ? 'mr-64'
        : 'ml-64'
      : isRTL
        ? 'mr-16'
        : 'ml-16'
    : '';

  return (
      <NotificationProvider>  
  
    <div dir={isRTL ? 'rtl' : 'ltr'}>
      <AppSidebar
        isOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        closeSidebar={closeSidebar}
        isMobile={isMobile}
        isRTL={isRTL}
      />
      <div className="flex flex-col min-h-screen">
        {/* Header */}
  <motion.header
  initial={{ opacity: 0, y: -20 }}
  animate={{ opacity: 1, y: 0 }}
  className="w-full h-16 border-b border-border
             bg-gradient-to-l
             from-[#69a52b]
             via-[#3aa8a0]
             to-[#3b82f6]
             dark:from-[#131b2a]
             dark:via-[#1b2f56]
             dark:to-[#171f37]
             backdrop-blur-sm sticky top-0 z-30
             flex items-center justify-between px-6 animate-gradient"
>

            <div className="flex items-center">
              <img src={logoLight} alt="logo" className="h-14   dark:hidden" />
              <img src={logoDark} alt="logo" className="h-16 hidden dark:block" />
            </div>
          <div className="flex items-center gap-4">
            {isMobile && (
              <button onClick={toggleSidebar} className="p-2 rounded md:hidden hover:bg-muted">
                <Menu className="h-5 w-5" />
              </button>
            )}
            {!isMobile && (
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="البحث..." className="pl-10 w-64 focus-ring" />
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
     
 
            <ThemeToggle />
            <ProfileMenu />
          </div>
        </motion.header>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className={`flex-1 overflow-auto bg-background transition-all duration-300 ${contentMargin}`}
        >
          <AdminListener />
          <EchoListener />
          <div className="p-6">{children}</div>
        </motion.div>
      </div>
    </div>
    </NotificationProvider>
  );
};

export default AppLayout;
=======
import React, { useState, useEffect, lazy, Suspense } from 'react';
import { useLocation } from 'react-router-dom';
import ResponsiveLayout from '@/components/ResponsiveLayout';
import { useMobileTheme } from '@/components/MobileThemeProvider';

const Header = lazy(() => import('@/components/dashboard/Header'));
const AppSidebar = lazy(() => import('./AppSidebar'));

export default function AppLayout({ children, user }) {
  const { isMobile, isStandalone, safeAreaInsets } = useMobileTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

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
        <AppSidebar
          isOpen={sidebarOpen}
          onToggle={toggleSidebar}
          onLinkClick={() => isMobile && setSidebarOpen(false)}
        />
        {isMobile && sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-10"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </Suspense>
      <div className="flex-1 flex flex-col transition-all duration-300">
        <Suspense fallback={<div className="text-center p-4">جاري تحميل الرأس...</div>}>
          <Header user={user} isOpen={sidebarOpen} onToggleSidebar={toggleSidebar} />
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
          {children}
        </main>
      </div>
    </ResponsiveLayout>
  );
}
>>>>>>> a14b8fd1b562cdad616b0d565f9e7246cc89b0a2
