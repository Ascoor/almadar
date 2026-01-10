import React, { useEffect, useMemo, useState } from 'react';
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
import {
  ContractsIcon,
  ConsultationsIcon,
  LawsuitsIcon,
  DashboardIcon,
  ArchiveIcon,
  CourtHouseIcon,
  LawBookIcon,
} from '@/components/ui/Icons';

import {
  Settings2,
  ListTree,
  UsersRound,
  UserCheck,
  ChevronRight,
  FileText,
} from 'lucide-react';
import { permKey } from '@/auth/permissionCatalog';

export default function AppSidebar() {
  const { can, roles } = useAuth();
  const { t, dir, lang } = useLanguage();
  const { state, isMobile, setOpenMobile } = useSidebar();
  const location = useLocation();
  const isAdmin = Array.isArray(roles)
    ? roles.some((role) => String(role).toLowerCase() === 'admin')
    : false;
  const isCollapsed = state === 'collapsed';

  const canView = (permission) => isAdmin || can(permission);
  const canViewAny = (permissions) =>
    isAdmin || can(permissions, { mode: 'any' });

  const navConfig = useMemo(
    () =>
      [
        {
          id: 'home',
          label: t('dashboard'),
          to: '/dashboard',
          icon: <DashboardIcon size={20} />,
        },

        canView(permKey('view', 'contracts')) && {
          id: 'contracts',
          label: t('contracts'),
          to: '/contracts',
          icon: <ContractsIcon size={20} />,
        },

        canViewAny(
          [
            permKey('view', 'investigations'),
            permKey('view', 'legal-advices'),
            permKey('view', 'litigations'),
          ],
        ) && {
          id: 'fatwa',
          label: t('fatwa'),
          icon: <ConsultationsIcon size={20} />,
          children: [
            canView(permKey('view', 'investigations')) && {
              id: 'investigations',
              label: t('investigations'),
              to: '/legal/investigations',
              icon: <LawsuitsIcon size={16} />,
            },
            canView(permKey('view', 'legal-advices')) && {
              id: 'legal-advices',
              label: t('legalAdvices'),
              to: '/legal/legal-advices',
              icon: <LawBookIcon size={16} />,
            },
            canView(permKey('view', 'litigations')) && {
              id: 'litigations',
              label: t('litigations'),
              to: '/legal/litigations',
              icon: <CourtHouseIcon size={16} />,
            },
          ].filter(Boolean),
        },

        canView(permKey('view', 'management-lists')) && {
          id: 'management',
          label: t('management'),
          icon: <Settings2 size={20} />,
          children: [
            {
              id: 'lists',
              label: t('lists'),
              to: '/management-lists',
              icon: <ListTree size={16} />,
            },
          ],
        },

        canView(permKey('view', 'users')) && {
          id: 'users',
          label: t('usersManagement'),
          icon: <UsersRound size={20} />,
          children: [
            {
              id: 'users-list',
              label: t('usersList'),
              to: '/users',
              icon: <UserCheck size={16} />,
            },
          ],
        },

        canView(permKey('view', 'archives')) && {
          id: 'archive',
          label: t('archive'),
          icon: <ArchiveIcon size={20} />,
          children: [
            {
              id: 'archive-root',
              label: t('archive'),
              to: '/archive',
              icon: <ArchiveIcon size={16} />,
            },
            {
              id: 'editor',
              label: t('editor'),
              to: '/editor',
              icon: <FileText size={16} />,
            },
          ],
        },
      ].filter(Boolean),
    [can, isAdmin, t],
  );

  const [activeSection, setActiveSection] = useState(null);

  useEffect(() => {
    const activeParent = navConfig.find((item) =>
      item.children?.some((child) =>
        location.pathname.startsWith(child.to),
      ),
    );

    setActiveSection(activeParent?.id ?? null);
  }, [location.pathname, navConfig]);

  const handleNavLinkClick = () => {
    setActiveSection(null);
    if (isMobile) setOpenMobile(false);
  };

  const handleSectionToggle = (id) => {
    setActiveSection((prev) => (prev === id ? null : id));
  };

  const isItemActive = (item) =>
    Boolean(item.to && location.pathname.startsWith(item.to));
  const isSectionActive = (item) =>
    Boolean(
      item.children?.some((child) =>
        location.pathname.startsWith(child.to),
      ),
    );

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
          {navConfig.map((item) => (
            <SidebarMenuItem key={item.id}>
              {item.to ? (
                <SidebarMenuButton
                  asChild
                  isActive={isItemActive(item)}
                  tooltip={item.label}
                >
                  <NavLink to={item.to} onClick={handleNavLinkClick}>
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
                    isActive={isSectionActive(item)}
                    tooltip={item.label}
                    className="justify-start"
                  >
                    {item.icon}
                    <span className="flex-1 truncate text-start">
                      {item.label}
                    </span>
                    {item.children && (
                      <ChevronRight
                        className={`ms-auto h-4 w-4 transition-transform ${
                          activeSection === item.id
                            ? dir === 'rtl'
                              ? 'rotate-90'
                              : '-rotate-90'
                            : ''
                        }`}
                      />
                    )}
                  </SidebarMenuButton>

                  {item.children && activeSection === item.id && (
                    <SidebarMenuSub>
                      {item.children.map((child) => (
                        <SidebarMenuSubItem key={child.id}>
                          <SidebarMenuSubButton
                            asChild
                            isActive={isItemActive(child)}
                          >
                            <NavLink
                              to={child.to}
                              onClick={handleNavLinkClick}
                            >
                              {child.icon}
                              <span className="truncate">{child.label}</span>
                            </NavLink>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  )}
                </>
              )}
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}
