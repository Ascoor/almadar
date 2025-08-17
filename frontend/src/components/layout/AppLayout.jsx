+62
-29

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Menu } from 'lucide-react';
import AppSidebar from './AppSidebar';
import { Input } from '@/components/ui/input';
import { LanguageToggle } from '@/components/common/LanguageToggle';
import { ThemeToggle } from '@/components/common/ThemeToggle';
import ProfileMenu from '@/components/common/ProfileMenu';
import { useLanguage } from '@/context/LanguageContext';
import { useIsMobile } from '@/hooks/use-mobile';

const AppLayout = ({ children }) => {
  const { isRTL } = useLanguage();
  const isMobile = useIsMobile();
  const [isSidebarOpen, setSidebarOpen] = useState(!isMobile);

  useEffect(() => {
    setSidebarOpen(!isMobile);
  }, [isMobile]);

  const toggleSidebar = () => setSidebarOpen((o) => !o);
  const closeSidebar = () => setSidebarOpen(false);

  const marginClass = !isMobile
    ? isSidebarOpen
      ? isRTL
        ? 'mr-64'
        : 'ml-64'
      : isRTL
      ? 'mr-16'
      : 'ml-16'
    : '';

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'}>
      {!isSidebarOpen && isMobile && (
        <button
          onClick={toggleSidebar}
          className={`fixed top-1/2 -translate-y-1/2 z-40 p-2 rounded bg-primary text-primary-foreground ${
            isRTL ? 'right-0' : 'left-0'
          }`}
        >
          <Menu className="h-5 w-5" />
        </button>
      )}

      <AppSidebar
        isOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        closeSidebar={closeSidebar}
        isMobile={isMobile}
        isRTL={isRTL}
      />

      <div className={`flex flex-col min-h-screen transition-all duration-300 ${marginClass}`}>
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="h-16 border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-30 flex items-center justify-between px-6"
        >
          <div className="flex items-center space-x-4 space-x-reverse">
            {!isMobile && (
              <button onClick={toggleSidebar} className="p-2 rounded hover:bg-muted">
                <Menu className="h-5 w-5" />
              </button>
            )}
            <h1 className="text-xl font-semibold text-foreground">منصة المدار</h1>
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="البحث..." className="pl-10 w-64 focus-ring" />
            </div>
          </div>

          <div className="flex items-center space-x-2 space-x-reverse">
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
          className="flex-1 overflow-auto bg-background"
        >
          <div className="p-6">{children}</div>
        </motion.div>
      </div>
    </div>
  );
};

export default AppLayout;