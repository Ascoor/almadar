import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, LogOut, User } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/context/LanguageContext';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/components/auth/AuthContext';
import { navigationItems, adminItems } from './sidebar';

export function AppSidebar() {
  const { open } = useSidebar();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const currentPath = location.pathname;
  const collapsed = !open;

  const isActive = (path: string) => currentPath === path;
  
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive 
      ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium" 
      : "hover:bg-sidebar-accent/50 text-sidebar-foreground hover:text-sidebar-accent-foreground";

  const hasPermission = (permission: string) => {
    return user?.permissions.includes(permission) || user?.role === 'Admin';
  };

  return (
    <Sidebar
      className={`${collapsed ? "w-16" : "w-64"} sidebar-transition border-r border-sidebar-border`}
      collapsible="icon"
    >
      <SidebarContent className="bg-sidebar">
        {/* User Profile Section */}
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 border-b border-sidebar-border"
          >
            <div className={`flex items-center ${isRTL ? 'space-x-reverse' : 'space-x-3'}`}>
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-sidebar-accent text-sidebar-accent-foreground">
                  {user?.name.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-sidebar-foreground truncate">
                  {user?.name}
                </p>
                <p className="text-xs text-sidebar-foreground/70 truncate">
                  {user?.role}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Toggle Button */}
        <div className="p-2">
          <SidebarTrigger className="w-full justify-center hover:bg-sidebar-accent hover:text-sidebar-accent-foreground" />
        </div>

        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/70 px-4 py-2">
            {!collapsed && t('navigation.dashboard')}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                hasPermission(item.permission) && (
                  <SidebarMenuItem key={item.titleKey}>
                    <SidebarMenuButton asChild>
                      <NavLink to={item.url} className={getNavCls}>
                        <item.icon className={`h-5 w-5 ${collapsed ? 'mx-auto' : isRTL ? 'ml-3' : 'mr-3'}`} />
                        {!collapsed && (
                          <>
                            <span className="flex-1">{t(item.titleKey)}</span>
                            {isActive(item.url) && (
                              <ChevronRight className={`h-4 w-4 ${isRTL ? 'rotate-180' : ''}`} />
                            )}
                          </>
                        )}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Admin Section */}
        {user?.role === 'Admin' && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-sidebar-foreground/70 px-4 py-2">
              {!collapsed && 'الإدارة'}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {adminItems.map((item) => (
                  hasPermission(item.permission) && (
                    <SidebarMenuItem key={item.titleKey}>
                      <SidebarMenuButton asChild>
                        <NavLink to={item.url} className={getNavCls}>
                          <item.icon className={`h-5 w-5 ${collapsed ? 'mx-auto' : isRTL ? 'ml-3' : 'mr-3'}`} />
                          {!collapsed && (
                            <>
                              <span className="flex-1">{t(item.titleKey)}</span>
                              {isActive(item.url) && (
                                <ChevronRight className={`h-4 w-4 ${isRTL ? 'rotate-180' : ''}`} />
                              )}
                            </>
                          )}
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* Footer Actions */}
        <div className="mt-auto p-4 border-t border-sidebar-border space-y-2">
          <Button
            variant="ghost"
            size={collapsed ? "icon" : "sm"}
            className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            asChild
          >
            <NavLink to="/profile">
              <User className={`h-4 w-4 ${collapsed ? '' : isRTL ? 'ml-2' : 'mr-2'}`} />
              {!collapsed && t('navigation.profile')}
            </NavLink>
          </Button>
          
          <Button
            variant="ghost"
            size={collapsed ? "icon" : "sm"}
            onClick={logout}
            className="w-full justify-start text-sidebar-foreground hover:bg-destructive hover:text-destructive-foreground"
          >
            <LogOut className={`h-4 w-4 ${collapsed ? '' : isRTL ? 'ml-2' : 'mr-2'}`} />
            {!collapsed && t('auth.logout')}
          </Button>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}