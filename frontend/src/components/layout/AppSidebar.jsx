import { useCallback, useEffect, useMemo, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { LogoNewArt } from '@/assets/images';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { ChevronRight } from 'lucide-react';
import { buildNavConfig } from '@/config/navigation';

const isItemActive = (item, path) =>
  Boolean(item.to && path.startsWith(item.to));

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
  const { can, roles } = useAuth();
  const { t, dir, lang } = useLanguage();
  const { state, isMobile, setOpenMobile } = useSidebar();
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

  useEffect(() => {
    setActiveSection(getActiveSectionId(navConfig, location.pathname));
  }, [location.pathname, navConfig]);

  const handleNavLinkClick = () => {
    if (isMobile) setOpenMobile(false);
  };

  const handleSectionToggle = (id) =>
    setActiveSection((prev) => (prev === id ? null : id));

  const appName = lang === 'ar' ? 'المدار القانوني' : 'Almadar Legal';

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
      </SidebarHeader>

      <SidebarContent className="px-2 pb-4">
        <SidebarMenu>
          {navConfig.map((item) => {
            const itemActive = isItemActive(item, location.pathname);
            const sectionActive = isSectionActive(item, location.pathname);
            const sectionOpen = activeSection === item.id;
            const chevronClass = getChevronRotation(sectionOpen, dir);
            const tooltip = item.label;

            return (
              <SidebarMenuItem key={item.id}>
                {item.to ? (
                  <SidebarMenuButton
                    asChild
                    isActive={itemActive}
                    tooltip={tooltip}
                  >
                    <NavLink
                      to={item.to}
                      onClick={handleNavLinkClick}
                      aria-current={itemActive ? 'page' : undefined}
                    >
                      {item.icon}
                      <span className="flex-1 truncate text-start">
                        {item.label}
                      </span>
                    </NavLink>
                  </SidebarMenuButton>
                ) : (
                  <>
                    <SidebarMenuButton
                      type="button"
                      onClick={() => handleSectionToggle(item.id)}
                      isActive={sectionActive}
                      tooltip={tooltip}
                      className="justify-start"
                      aria-expanded={sectionOpen}
                    >
                      {item.icon}
                      <span className="flex-1 truncate text-start">
                        {item.label}
                      </span>
                      {item.children && (
                        <ChevronRight
                          className={`ms-auto h-4 w-4 transition-transform ${chevronClass}`}
                        />
                      )}
                    </SidebarMenuButton>

                    {item.children && sectionOpen && (
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
                    )}
                  </>
                )}
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}
