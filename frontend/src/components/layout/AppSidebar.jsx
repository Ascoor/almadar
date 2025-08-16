import React, { useEffect } from 'react';
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
  User as UserIcon,
} from 'lucide-react';
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
import { useAuth } from '@/context/AuthContext';

// helpers
const getInitials = (name) => {
  if (!name || typeof name !== 'string') return 'U';
  try {
    const parts = name.trim().split(/\s+/).filter(Boolean);
    const first = parts[0]?.[0] || '';
    const last = parts.length > 1 ? parts[parts.length - 1][0] : '';
    const initials = (first + last).toUpperCase();
    return initials || 'U';
  } catch {
    return 'U';
  }
};

const hasPermissionFn = (user, permission) => {
  if (!permission) return true;
  if (!user) return false;
  const role = (user.role || '').toLowerCase();
  if (role === 'admin') return true;

  const perms = user.permissions || [];
  return perms.some((p) =>
    typeof p === 'string' ? p === permission : p?.name === permission
  );
};

const getNavigationItems = (t) => [
  { titleKey: 'navigation.dashboard', url: '/dashboard', icon: LayoutDashboard, permission: 'dashboard' },
  { titleKey: 'navigation.contracts', url: '/contracts', icon: FileText, permission: 'contracts' },
  { titleKey: 'navigation.legalAdvice', url: '/legal-advice', icon: Scale, permission: 'legal-advice' },
  { titleKey: 'navigation.investigations', url: '/investigations', icon: Search, permission: 'investigations' },
  { titleKey: 'navigation.litigations', url: '/litigations', icon: Gavel, permission: 'litigations' },
  { titleKey: 'navigation.archive', url: '/archive', icon: Archive, permission: 'archive' },
];

const getAdminItems = (t) => [
  { titleKey: 'navigation.users', url: '/users', icon: Users, permission: 'users' },
  { titleKey: 'navigation.settings', url: '/settings', icon: Settings, permission: 'settings' },
];

export default function AppSidebar() {
  const { open, setOpen, isCollapsed } = useSidebar(); // from shadcn/ui
  const location = useLocation();
  const { user, logout } = useAuth();
  const { t } = useTranslation();
  const { isRTL } = useLanguage();

  const collapsed = isCollapsed;
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('sidebar:collapsed');
      if (stored !== null) {
        setOpen(!JSON.parse(stored));
      }
    }
  }, [setOpen]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('sidebar:collapsed', JSON.stringify(collapsed));
    }
  }, [collapsed]);
  const currentPath = location.pathname;

  const isActivePath = (path) => currentPath === path;

  const getNavCls = ({ isActive }) =>
    isActive
      ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium'
      : 'hover:bg-sidebar-accent/50 text-sidebar-foreground hover:text-sidebar-accent-foreground';

  const navigationItems = getNavigationItems(t);
  const adminItems = getAdminItems(t);

  return (
    <Sidebar
      id="app-sidebar"
      side={isRTL ? 'right' : 'left'}
      className={`${collapsed ? 'w-16' : 'w-64'} sidebar-transition border-r border-sidebar-border`}
      collapsible="icon"
    >
      <SidebarContent className="bg-sidebar">
        {/* User Profile */}
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0, y: -18 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 border-b border-sidebar-border"
          >
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-sidebar-accent text-sidebar-accent-foreground">
                  {getInitials(user?.name)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-sidebar-foreground truncate">{user?.name || ''}</p>
                <p className="text-xs text-sidebar-foreground/70 truncate">{user?.role || ''}</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Toggle */}
        <div className="p-2">
          <SidebarTrigger className="w-full justify-center hover:bg-sidebar-accent hover:text-sidebar-accent-foreground" />
        </div>

        {/* Main nav */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/70 px-4 py-2">
            {!collapsed && t('navigation.main', 'الصفحات الرئيسية')}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) =>
                hasPermissionFn(user, item.permission) ? (
                  <SidebarMenuItem key={item.titleKey}>
                    <SidebarMenuButton asChild>
                      <NavLink to={item.url} className={getNavCls}>
                        <item.icon
                          className={`h-5 w-5 ${collapsed ? 'mx-auto' : 'ltr:mr-3 rtl:ml-3'}`}
                        />
                        {!collapsed && (
                          <>
                            <span className="flex-1">{t(item.titleKey)}</span>
                            {isActivePath(item.url) && (
                              <ChevronRight className={`h-4 w-4 ${isRTL ? 'rotate-180' : ''}`} />
                            )}
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

        {/* Admin */}
        {(user?.role?.toLowerCase?.() === 'admin') && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-sidebar-foreground/70 px-4 py-2">
              {!collapsed && t('navigation.admin', 'الإدارة')}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {adminItems.map((item) =>
                  hasPermissionFn(user, item.permission) ? (
                    <SidebarMenuItem key={item.titleKey}>
                      <SidebarMenuButton asChild>
                        <NavLink to={item.url} className={getNavCls}>
                          <item.icon
                            className={`h-5 w-5 ${collapsed ? 'mx-auto' : 'ltr:mr-3 rtl:ml-3'}`}
                          />
                          {!collapsed && (
                            <>
                              <span className="flex-1">{t(item.titleKey)}</span>
                              {isActivePath(item.url) && (
                                <ChevronRight className={`h-4 w-4 ${isRTL ? 'rotate-180' : ''}`} />
                              )}
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

        {/* Footer */}
        <div className="mt-auto p-4 border-t border-sidebar-border space-y-2">
          <Button
            variant="ghost"
            size={collapsed ? 'icon' : 'sm'}
            className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            asChild
          >
            <NavLink to="/profile">
              <UserIcon className={`h-4 w-4 ${collapsed ? '' : 'ltr:mr-2 rtl:ml-2'}`} />
              {!collapsed && t('navigation.profile')}
            </NavLink>
          </Button>

          <Button
            variant="ghost"
            size={collapsed ? 'icon' : 'sm'}
            onClick={logout}
            className="w-full justify-start text-sidebar-foreground hover:bg-destructive hover:text-destructive-foreground"
          >
            <LogOut className={`h-4 w-4 ${collapsed ? '' : 'ltr:mr-2 rtl:ml-2'}`} />
            {!collapsed && t('auth.logout')}
          </Button>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
