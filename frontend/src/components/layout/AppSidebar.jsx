import { useCallback, useEffect, useMemo, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { LogoNewArt } from '@/assets/images';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { AnimatePresence, m } from 'framer-motion';
import { ChevronLeft, ChevronRight, LogOut } from 'lucide-react';
import { buildNavConfig } from '@/config/navigation';

const isItemActive = (item, path) => Boolean(item.to && path === item.to);

const isSectionActive = (item, path) =>
  Boolean(item.children?.some((child) => isItemActive(child, path)));

const getActiveSectionId = (navConfig, path) => {
  const activeSection = navConfig.find((item) =>
    isSectionActive(item, path),
  );
  return activeSection?.id ?? null;
};

const getChevronRotation = (isOpen, dir) => {
  if (!isOpen) return '';
  return dir === 'rtl' ? 'rotate-90' : '-rotate-90';
};

export default function AppSidebar() {
  const { can, roles, logout } = useAuth();
  const { t, dir, lang } = useLanguage();
  const { state, isMobile, setOpenMobile, toggleSidebar } = useSidebar();
  const navigate = useNavigate();
  const location = useLocation();
  const isAdmin = useMemo(
    () =>
      Array.isArray(roles)
        ? roles.some((role) => String(role).toLowerCase() === 'admin')
        : false,
    [roles],
  );
  const isCollapsed = state === 'collapsed';

  const canView = useCallback(
    (permission) => isAdmin || can(permission),
    [can, isAdmin],
  );
  const canViewAny = useCallback(
    (permissions) => isAdmin || can(permissions, { mode: 'any' }),
    [can, isAdmin],
  );

  const navConfig = useMemo(
    () =>
      buildNavConfig({
        t,
        canView,
        canViewAny,
        role: roles,
        dir,
      }),
    [t, canView, canViewAny, roles, dir],
  );

  const [activeSection, setActiveSection] = useState(() =>
    getActiveSectionId(navConfig, location.pathname),
  );
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    setActiveSection(getActiveSectionId(navConfig, location.pathname));
  }, [location.pathname, navConfig]);

  const handleNavLinkClick = () => {
    if (isMobile) setOpenMobile(false);
  };

  const handleLogout = async () => {
    if (isLoggingOut) return;
    if (isMobile) setOpenMobile(false);
    setIsLoggingOut(true);
    try {
      await logout();
      navigate('/', { replace: true });
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleSectionToggle = (id) =>
    setActiveSection((prev) => (prev === id ? null : id));

  const appName = lang === 'ar' ? 'المدار القانوني' : 'Almadar Legal';
  const logoutLabel = t('signOut');
  const collapseLabel = isCollapsed
    ? lang === 'ar'
      ? 'توسيع الشريط الجانبي'
      : 'Expand sidebar'
    : lang === 'ar'
      ? 'طي الشريط الجانبي'
      : 'Collapse sidebar';
  const collapseIcon =
    dir === 'rtl' ? (
      <ChevronLeft className="h-4 w-4" />
    ) : (
      <ChevronRight className="h-4 w-4" />
    );

  return (
    <Sidebar side={dir === 'rtl' ? 'right' : 'left'} collapsible="icon">
      <SidebarHeader className="px-3 py-4">
        <div className="flex items-center gap-3">
          <img
            src={LogoNewArt}
            alt="Almadar"
            className={`shrink-0 transition-all duration-300 ${
              isCollapsed ? 'h-8 w-8' : 'h-10 w-auto'
            }`}
          />
          {!isCollapsed && (
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-fg">
                {appName}
              </p>
              <p className="text-xs text-muted-foreground">
                Legal Luminary UI
              </p>
            </div>
          )}
        </div>
        <div className="hidden md:flex items-center justify-end">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            aria-label={collapseLabel}
            className="h-8 w-8"
          >
            {collapseIcon}
          </Button>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 pb-4">
        <SidebarMenu>
          {navConfig.map((item) => {
            const itemActive = isItemActive(item, location.pathname);
            const sectionActive = isSectionActive(item, location.pathname);
            const sectionOpen = activeSection === item.id;
            const chevronClass = getChevronRotation(sectionOpen, dir);
            const tooltip = item.label;
            const parentActive = sectionActive && !item.to;

            return (
              <SidebarMenuItem key={item.id}>
                {item.to ? (
                  <SidebarMenuButton
                    asChild
                    isActive={itemActive}
                    tooltip={tooltip}
                    className="data-[active=true]:bg-sidebar-primary data-[active=true]:text-sidebar-primary-foreground"
                  >
                    <NavLink
                      to={item.to}
                      onClick={handleNavLinkClick}
                      aria-current={itemActive ? 'page' : undefined}
                    >
                      {item.icon}
                      <span className="flex-1 truncate text-start group-data-[collapsible=icon]:hidden">
                        {item.label}
                      </span>
                    </NavLink>
                  </SidebarMenuButton>
                ) : (
                  <>
                    <SidebarMenuButton
                      type="button"
                      onClick={() => handleSectionToggle(item.id)}
                      isActive={itemActive}
                      tooltip={tooltip}
                      className={cn(
                        'justify-start data-[active=true]:bg-sidebar-primary data-[active=true]:text-sidebar-primary-foreground',
                        parentActive && 'bg-sidebar-accent/50 text-sidebar-fg',
                      )}
                      aria-expanded={sectionOpen}
                    >
                      {item.icon}
                      <span className="flex-1 truncate text-start group-data-[collapsible=icon]:hidden">
                        {item.label}
                      </span>
                      {item.children && (
                        <ChevronRight
                          className={cn(
                            'ms-auto h-4 w-4 transition-transform group-data-[collapsible=icon]:hidden',
                            chevronClass,
                          )}
                        />
                      )}
                    </SidebarMenuButton>

                    <AnimatePresence initial={false}>
                      {item.children && sectionOpen && (
                        <m.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <SidebarMenuSub>
                            {item.children.map((child) => {
                              const childActive = isItemActive(
                                child,
                                location.pathname,
                              );
                              return (
                                <SidebarMenuSubItem key={child.id}>
                                  <SidebarMenuSubButton
                                    asChild
                                    isActive={childActive}
                                    className="data-[active=true]:bg-sidebar-primary data-[active=true]:text-sidebar-primary-foreground"
                                  >
                                    <NavLink
                                      to={child.to}
                                      onClick={handleNavLinkClick}
                                      aria-current={
                                        childActive ? 'page' : undefined
                                      }
                                    >
                                      {child.icon}
                                      <span className="truncate">
                                        {child.label}
                                      </span>
                                    </NavLink>
                                  </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                              );
                            })}
                          </SidebarMenuSub>
                        </m.div>
                      )}
                    </AnimatePresence>
                  </>
                )}
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="mt-auto px-2 pb-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleLogout}
              tooltip={logoutLabel}
              className="text-destructive hover:text-destructive data-[active=true]:bg-sidebar-primary"
              disabled={isLoggingOut}
            >
              <LogOut className="h-4 w-4" />
              <span className="flex-1 truncate text-start group-data-[collapsible=icon]:hidden">
                {isLoggingOut
                  ? lang === 'ar'
                    ? 'جاري تسجيل الخروج...'
                    : 'Signing out...'
                  : logoutLabel}
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
