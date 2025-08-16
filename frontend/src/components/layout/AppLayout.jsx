import React from 'react';
import { motion } from 'framer-motion';
import { SidebarProvider } from '@/components/ui/sidebar';
import AppSidebar  from './AppSidebar';
import { Bell, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/AuthContext';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/context/LanguageContext';
import { ThemeToggle } from '@/components/common/ThemeToggle';
import { LanguageToggle } from '@/components/common/LanguageToggle';

function AppLayout({ children }) {
  const { user } = useAuth();
  const { t } = useTranslation();
  const { isRTL } = useLanguage();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">

        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="h-16 border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40"
          >
            <div className="flex items-center justify-between px-6 h-full">
              <div className={`flex items-center ${isRTL ? 'space-x-reverse' : 'space-x-4'}`}>
                <h1 className="text-xl font-semibold text-foreground">
                  {t('app.name')}
                </h1>
              </div>

        <AppSidebar />
              <div className={`flex items-center ${isRTL ? 'space-x-reverse' : 'space-x-4'}`}>
                {/* Search */}
                <div className="relative hidden md:block">
                  <Search
                    className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground`}
                  />
                  <Input
                    placeholder={t('common.search')}
                    className={`${isRTL ? 'pr-10' : 'pl-10'} w-64 focus-ring`}
                  />
                </div>

                {/* Theme Toggle */}
                <ThemeToggle />

                {/* Language Toggle */}
                <LanguageToggle />

                {/* Notifications */}
                <Button variant="ghost" size="icon" className="relative hover-scale">
                  <Bell className="h-5 w-5" />
                  <Badge
                    variant="destructive"
                    className={`absolute -top-1 ${isRTL ? '-left-1' : '-right-1'} h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs`}
                  >
                    3
                  </Badge>
                </Button>

                {/* User Info */}
                <div className={`hidden sm:flex items-center ${isRTL ? 'space-x-reverse' : 'space-x-2'} text-sm`}>
                  <span className="text-muted-foreground">{t('auth.welcome')}،</span>
                  <span className="font-medium text-foreground">{user?.name}</span>
                </div>
              </div>
            </div>
          </motion.header>

          {/* Main Content */}
          <motion.main
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="flex-1 overflow-auto bg-background"
          >
            <div className="p-6">{children}</div>
          </motion.main>
        </div>
      </div>
    </SidebarProvider>
  );
}

export default AppLayout;
