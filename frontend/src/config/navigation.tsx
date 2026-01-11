import type { ReactNode } from 'react';
import {
  ArchiveIcon,
  ConsultationsIcon,
  ContractsIcon,
  CourtHouseIcon,
  DashboardIcon,
  LawBookIcon,
  LawsuitsIcon,
} from '@/components/ui/Icons';
import { FileText, ListTree, Settings2, UserCheck, UsersRound } from 'lucide-react';
import { permKey } from '@/auth/permissionCatalog';
import { getDashboardRoute } from '@/auth/getDashboardRoute';

export type NavItem = {
  id: string;
  label: string;
  to?: string;
  icon: ReactNode;
  children?: NavItem[];
  roles?: string[];
};

type NavConfigItem = NavItem & {
  requiredPermission?: string;
  requireAnyPermissions?: string[];
};

type BuildNavConfigInput = {
  t: (key: string) => string;
  canView: (permission: string) => boolean;
  canViewAny: (permissions: string[]) => boolean;
  role: string[] | undefined;
  dir: string;
};

const isNavItem = (
  item: NavConfigItem | null,
): item is NavConfigItem => item !== null;

const normalizeRoles = (roles: string[] | undefined) =>
  Array.isArray(roles)
    ? roles.map((role) => String(role).toLowerCase())
    : [];

export function buildNavConfig({
  t,
  canView,
  canViewAny,
  role,
  dir,
}: BuildNavConfigInput): NavItem[] {
  const normalizedRoles = normalizeRoles(role);
  const isAdmin = normalizedRoles.includes('admin');

  const matchesRole = (roles?: string[]) => {
    if (!roles || roles.length === 0) return true;
    if (isAdmin) return true;
    return roles.some((itemRole) =>
      normalizedRoles.includes(String(itemRole).toLowerCase()),
    );
  };

  const isAllowed = (item: NavConfigItem) => {
    if (!matchesRole(item.roles)) return false;
    if (item.requiredPermission && !canView(item.requiredPermission)) {
      return false;
    }
    if (
      item.requireAnyPermissions &&
      !canViewAny(item.requireAnyPermissions)
    ) {
      return false;
    }
    return true;
  };

  const mapNavItems = (items: Array<NavConfigItem | null>): NavItem[] =>
    items
      .filter(isNavItem)
      .map((item) => {
        const children = item.children ? mapNavItems(item.children) : undefined;
        const nextItem: NavConfigItem = {
          ...item,
          children,
        };
        return nextItem;
      })
      .filter((item) => {
        if (!isAllowed(item)) return false;
        if (item.children && item.children.length === 0) return false;
        return true;
      })
      .map(({ requiredPermission, requireAnyPermissions, ...rest }) => rest);

  return mapNavItems([
    {
      id: 'home',
      label: t('dashboard'),
      to: getDashboardRoute(role),
      icon: <DashboardIcon size={20} />,
    },
    {
      id: 'contracts',
      label: t('contracts'),
      to: '/contracts',
      icon: <ContractsIcon size={20} />,
      requiredPermission: permKey('view', 'contracts'),
      roles: ['contracts'],
    },
    {
      id: 'fatwa',
      label: t('fatwa'),
      icon: <ConsultationsIcon size={20} />,
      requireAnyPermissions: [
        permKey('view', 'investigations'),
        permKey('view', 'legal-advices'),
        permKey('view', 'litigations'),
      ],
      roles: ['legal'],
      children: [
        {
          id: 'investigations',
          label: t('investigations'),
          to: '/legal/investigations',
          icon: <LawsuitsIcon size={16} />,
          requiredPermission: permKey('view', 'investigations'),
        },
        {
          id: 'legal-advices',
          label: t('legalAdvices'),
          to: '/legal/legal-advices',
          icon: <LawBookIcon size={16} />,
          requiredPermission: permKey('view', 'legal-advices'),
        },
        {
          id: 'litigations',
          label: t('litigations'),
          to: '/legal/litigations',
          icon: <CourtHouseIcon size={16} />,
          requiredPermission: permKey('view', 'litigations'),
        },
      ],
    },
    {
      id: 'management',
      label: t('management'),
      icon: <Settings2 size={20} />,
      requiredPermission: permKey('view', 'management-lists'),
      roles: ['admin'],
      children: [
        {
          id: 'lists',
          label: t('lists'),
          to: '/management-lists',
          icon: <ListTree size={16} />,
          requiredPermission: permKey('view', 'management-lists'),
        },
      ],
    },
    {
      id: 'users',
      label: t('usersManagement'),
      icon: <UsersRound size={20} />,
      requiredPermission: permKey('view', 'users'),
      roles: ['admin'],
      children: [
        {
          id: 'users-list',
          label: t('usersList'),
          to: '/users',
          icon: <UserCheck size={16} />,
          requiredPermission: permKey('view', 'users'),
        },
      ],
    },
    {
      id: 'archive',
      label: t('archive'),
      icon: <ArchiveIcon size={20} />,
      requiredPermission: permKey('view', 'archives'),
      children: [
        {
          id: 'archive-root',
          label: t('archive'),
          to: '/archive',
          icon: <ArchiveIcon size={16} />,
          requiredPermission: permKey('view', 'archives'),
        },
        {
          id: 'editor',
          label: t('editor'),
          to: '/editor',
          icon: <FileText size={16} />,
          requiredPermission: permKey('view', 'archives'),
        },
      ],
    },
  ]);
}
