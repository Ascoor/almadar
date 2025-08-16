import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  FileText,
  Scale,
  Search,
  Users,
  Settings,
  Gavel,
  Archive,
  ChevronRight,
  LogOut,
  User,
} from 'lucide-react';
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
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';

const navigationItems = [
  {
    title: 'لوحة التحكم',
    url: '/dashboard',
    icon: LayoutDashboard,
    permission: 'dashboard',
  },
  {
    title: 'العقود',
    url: '/contracts',
    icon: FileText,
    permission: 'contracts',
  },
  {
    title: 'الاستشارات القانونية',
    url: '/legal-advice',
    icon: Scale,
    permission: 'legal-advice',
  },
  {
    title: 'التحقيقات',
    url: '/investigations',
    icon: Search,
    permission: 'investigations',
  },
  {
    title: 'القضايا',
    url: '/litigations',
    icon: Gavel,
    permission: 'litigations',
  },
  {
    title: 'الأرشيف',
    url: '/archive',
    icon: Archive,
    permission: 'archive',
  },
];

const adminItems = [
  {
    title: 'إدارة المستخدمين',
    url: '/users',
    icon: Users,
    permission: 'users',
  },
  {
    title: 'الإعدادات',
    url: '/settings',
    icon: Settings,
    permission: 'settings',
  },
];
function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { isRTL } = useLanguage();
  const currentPath = location.pathname;
  const collapsed = state === 'collapsed';

  const isActive = (path) => currentPath === path;

  const getNavCls = ({ isActive }) =>
    isActive
      ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium'
      : 'hover:bg-sidebar-accent/50 text-sidebar-foreground hover:text-sidebar-accent-foreground';

  const hasPermission = (permission) => {
    return user?.role === 'Admin' || user?.permissions?.includes(permission);
  };

  return (
    <Sidebar
      side={isRTL ? 'right' : 'left'}
      className={`${isRTL ? 'border-l' : 'border-r'} border-sidebar-border`}
      collapsible="icon"
    >
      <SidebarContent
        className={`bg-sidebar transition-all duration-300 ${
          isRTL ? 'animate-slide-in-right' : 'animate-slide-in-left'
        }`}
      >
        {/* User Profile Section */}
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 border-b border-sidebar-border"
          >
            <div className="flex items-center space-x-3 space-x-reverse">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-sidebar-accent text-sidebar-accent-foreground">
                  {user?.name
                    ? user.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .toUpperCase()
                    : 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-sidebar-foreground truncate">{user?.name}</p>
                <p className="text-xs text-sidebar-foreground/70 truncate">{user?.role}</p>
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
            {!collapsed && 'الصفحات الرئيسية'}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) =>
                hasPermission(item.permission) ? (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink to={item.url} className={getNavCls}>
                        <item.icon
                          className={`h-5 w-5 ${
                            collapsed ? 'mx-auto' : isRTL ? 'ml-3' : 'mr-3'
                          }`}
                        />
                        {!collapsed && (
                          <>
                            <span className="flex-1">{item.title}</span>
                            {isActive(item.url) && <ChevronRight className="h-4 w-4" />}
                          </>
                        )}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ) : null
              )}
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
                {adminItems.map((item) =>
                  hasPermission(item.permission) ? (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <NavLink to={item.url} className={getNavCls}>
                          <item.icon
                            className={`h-5 w-5 ${
                              collapsed ? 'mx-auto' : isRTL ? 'ml-3' : 'mr-3'
                            }`}
                          />
                          {!collapsed && (
                            <>
                              <span className="flex-1">{item.title}</span>
                              {isActive(item.url) && <ChevronRight className="h-4 w-4" />}
                            </>
                          )}
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ) : null
                )}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* Footer Actions */}
        <div className="mt-auto p-4 border-t border-sidebar-border space-y-2">
          <Button
            variant="ghost"
            size={collapsed ? 'icon' : 'sm'}
            className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            asChild
          >
            <NavLink to="/profile">
              <User className={`h-4 w-4 ${collapsed ? '' : isRTL ? 'ml-2' : 'mr-2'}`} />
              {!collapsed && 'الملف الشخصي'}
            </NavLink>
          </Button>

          <Button
            variant="ghost"
            size={collapsed ? 'icon' : 'sm'}
            onClick={logout}
            className="w-full justify-start text-sidebar-foreground hover:bg-destructive hover:text-destructive-foreground"
          >
            <LogOut className={`h-4 w-4 ${collapsed ? '' : isRTL ? 'ml-2' : 'mr-2'}`} />
            {!collapsed && 'تسجيل الخروج'}
          </Button>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}

export default AppSidebar;