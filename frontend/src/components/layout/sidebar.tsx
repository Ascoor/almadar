import { LayoutDashboard, FileText, Scale, Search, Gavel, Archive, Users, Settings } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface SidebarItem {
  titleKey: string;
  url: string;
  icon: LucideIcon;
  permission: string;
}

export const navigationItems: SidebarItem[] = [
  {
    titleKey: 'navigation.dashboard',
    url: '/',
    icon: LayoutDashboard,
    permission: 'dashboard',
  },
  {
    titleKey: 'navigation.contracts',
    url: '/contracts',
    icon: FileText,
    permission: 'contracts',
  },
  {
    titleKey: 'navigation.legalAdvice',
    url: '/legal/legal-advices',
    icon: Scale,
    permission: 'legal-advice',
  },
  {
    titleKey: 'navigation.investigations',
    url: '/legal/investigations',
    icon: Search,
    permission: 'investigations',
  },
  {
    titleKey: 'navigation.litigations',
    url: '/legal/litigations',
    icon: Gavel,
    permission: 'litigations',
  },
  {
    titleKey: 'navigation.archive',
    url: '/archive',
    icon: Archive,
    permission: 'archive',
  },
];

export const adminItems: SidebarItem[] = [
  {
    titleKey: 'navigation.users',
    url: '/users',
    icon: Users,
    permission: 'users',
  },
  {
    titleKey: 'navigation.settings',
    url: '/managment-lists',
    icon: Settings,
    permission: 'settings',
  },
];

export default navigationItems;
