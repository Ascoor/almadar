import React from 'react';
import { motion } from 'framer-motion';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from './AppSidebar';
import { Bell, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { NavLink } from 'react-router-dom';
import { useAuth } from '@/components/auth/AuthContext';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/context/LanguageContext';
import { ThemeToggle } from '@/components/common/ThemeToggle';
import { LanguageToggle } from '@/components/common/LanguageToggle';

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const { t } = useTranslation();
  const { isRTL } = useLanguage();

  const initials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
    : 'U';

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="h-16 border-b border-border bg-sidebar text-sidebar-foreground sticky top-0 z-40"
          >
            <div className="flex items-center justify-between px-6 h-full">
              <div className={`flex items-center ${isRTL ? 'space-x-reverse' : 'space-x-4'}`}>
                <SidebarTrigger className="md:hidden" />
                <h1 className="text-xl font-semibold text-foreground">
                  {t('app.name')}
                </h1>
              </div>

              <div className={`flex items-center ${isRTL ? 'space-x-reverse' : 'space-x-4'}`}>
                {/* Search */}
                <div className="relative hidden md:block">
                  <Search className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground`} />
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
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative hover-scale"
                >
                  <Bell className="h-5 w-5" />
                  <Badge
                    variant="destructive"
                    className={`absolute -top-1 ${isRTL ? '-left-1' : '-right-1'} h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs`}
                  >
                    3
                  </Badge>
                </Button>

                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 rounded-full p-0">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>{initials}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align={isRTL ? 'start' : 'end'} className="w-40 bg-popover border border-border">
                    <DropdownMenuItem asChild>
                      <NavLink to="/profile">{t('navigation.profile')}</NavLink>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={logout} className="cursor-pointer">
                      {t('auth.logout')}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
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
            <div className="p-6">
              {children}
            </div>
          </motion.main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AppLayout;