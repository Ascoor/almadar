import React from 'react';
import { motion } from 'framer-motion';
import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from '@/components/ui/sidebar';
import AppSidebar from './AppSidebar';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { LanguageToggle } from '@/components/common/LanguageToggle';
import { ThemeToggle } from '@/components/common/ThemeToggle';
import ProfileMenu from '@/components/common/ProfileMenu';
import { useLanguage } from '@/context/LanguageContext';
import { useIsMobile } from '@/hooks/use-mobile';

const AppLayout = ({ children }) => {
  const { isRTL } = useLanguage();
  const isMobile = useIsMobile();

  return (
    <SidebarProvider defaultOpen={!isMobile}>
      <AppSidebar />
      <SidebarInset dir={isRTL ? 'rtl' : 'ltr'} className="flex flex-col">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="h-16 border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40"
        >
          <div className="flex items-center justify-between px-6 h-full">
            <div className="flex items-center space-x-4 space-x-reverse">
              <SidebarTrigger className="md:hidden" />
              <h1 className="text-xl font-semibold text-foreground">
                منصة المدار
              </h1>
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
      </SidebarInset>
    </SidebarProvider>
  );
};

export default AppLayout;