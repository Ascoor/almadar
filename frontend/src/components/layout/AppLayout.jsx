 
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Menu } from 'lucide-react';
import AppSidebar from './AppSidebar';
import { Input } from '@/components/ui/input';
import { LanguageToggle } from '@/components/common/LanguageToggle';
import { ThemeToggle } from '@/components/common/ThemeToggle';
import ProfileMenu from '@/components/common/ProfileMenu';
import DropdownNotifications from '@/components/common/DropdownNotifications';
import { useLanguage } from '@/context/LanguageContext';
import { useIsMobile } from '@/hooks/use-mobile';
import EchoListener from '@/context/EchoListener';
import AdminListener from '@/context/AdminListener';
import { NotificationProvider } from '@/context/NotificationContext';
import logoLight from '@/assets/images/logo-green.png';
import logoDark from '@/assets/images/logo-art-text.png';

const AppLayout = ({ children }) => {
  const { isRTL } = useLanguage();
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
          className="w-full h-16 border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-30 flex items-center justify-between px-6"
        >
            <div className="flex items-center">
              <img src={logoLight} alt="logo" className="h-16   dark:hidden" />
              <img src={logoDark} alt="logo" className="h-8 hidden dark:block" />
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
            <DropdownNotifications isRTL={isRTL} />
            <LanguageToggle />
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