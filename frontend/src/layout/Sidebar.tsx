import { motion } from 'framer-motion';
import { NavLink, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  FileText,
  Search,
  Scale,
  Users,
  BarChart3,
  Archive,
  User,
  Settings,
  ChevronLeft,
  Building2,
  MessageSquare,
} from 'lucide-react';
import { useState } from 'react';

interface MenuItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  permission?: string;
  children?: MenuItem[];
}

const menuItems: MenuItem[] = [
  {
    title: 'لوحة التحكم',
    href: '/',
    icon: LayoutDashboard,
  },
  {
    title: 'العقود',
    href: '/contracts',
    icon: FileText,
    permission: 'view contracts',
  },
  {
    title: 'الشؤون القانونية',
    href: '#',
    icon: Scale,
    children: [
      {
        title: 'التحقيقات',
        href: '/legal/investigations',
        icon: Search,
        permission: 'view investigations',
      },
      {
        title: 'الاستشارات القانونية',
        href: '/legal/legal-advices',
        icon: MessageSquare,
        permission: 'view legaladvices',
      },
      {
        title: 'القضايا',
        href: '/legal/litigations',
        icon: Building2,
        permission: 'view litigations',
      },
    ],
  },
  {
    title: 'إدارة المستخدمين',
    href: '/users',
    icon: Users,
    permission: 'view users',
  },
  {
    title: 'التقارير',
    href: '/reports',
    icon: BarChart3,
  },
  {
    title: 'الأرشيف',
    href: '/archive',
    icon: Archive,
  },
  {
    title: 'الملف الشخصي',
    href: '/profile',
    icon: User,
  },
  {
    title: 'الإعدادات',
    href: '/settings',
    icon: Settings,
  },
];

export function Sidebar() {
  const { user } = useAuth();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const hasPermission = (permission?: string) => {
    if (!permission) return true;
    return user?.permissions?.includes(permission) || false;
  };

  const isActive = (href: string) => {
    if (href === '/') return location.pathname === '/';
    return location.pathname.startsWith(href);
  };

  const toggleExpanded = (href: string) => {
    setExpandedItems(prev =>
      prev.includes(href)
        ? prev.filter(item => item !== href)
        : [...prev, href]
    );
  };

  const renderMenuItem = (item: MenuItem, level = 0) => {
    if (item.permission && !hasPermission(item.permission)) {
      return null;
    }

    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.includes(item.href);
    const active = isActive(item.href);

    if (hasChildren) {
      return (
        <div key={item.href}>
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-between h-11 px-3",
              level > 0 && "mr-4",
              collapsed && "justify-center px-2"
            )}
            onClick={() => toggleExpanded(item.href)}
          >
            <div className="flex items-center gap-3">
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {!collapsed && (
                <span className="text-sm font-medium">{item.title}</span>
              )}
            </div>
            {!collapsed && (
              <ChevronLeft
                className={cn(
                  "h-4 w-4 transition-transform",
                  isExpanded && "rotate-90"
                )}
              />
            )}
          </Button>
          
          {!collapsed && isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="space-y-1 mr-6 mt-1">
                {item.children?.map(child => renderMenuItem(child, level + 1))}
              </div>
            </motion.div>
          )}
        </div>
      );
    }

    return (
      <NavLink
        key={item.href}
        to={item.href}
        className={({ isActive }) =>
          cn(
            "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
            level > 0 && "mr-4",
            collapsed && "justify-center px-2",
            isActive && "bg-accent text-accent-foreground"
          )
        }
      >
        <item.icon className="h-5 w-5 flex-shrink-0" />
        {!collapsed && (
          <>
            <span className="flex-1">{item.title}</span>
            {item.badge && (
              <Badge variant="secondary" className="text-xs">
                {item.badge}
              </Badge>
            )}
          </>
        )}
      </NavLink>
    );
  };

  return (
    <motion.aside
      initial={{ x: -280 }}
      animate={{ x: 0 }}
      className={cn(
        "flex flex-col border-l bg-card transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center border-b px-4">
        {collapsed ? (
          <div className="h-8 w-8 rounded-lg bg-accent flex items-center justify-center">
            <Scale className="h-5 w-5 text-accent-foreground" />
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-accent flex items-center justify-center">
              <Scale className="h-5 w-5 text-accent-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-bold">مدار</h1>
              <p className="text-xs text-muted-foreground">الإدارة القانونية</p>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2 p-4">
        {menuItems.map(item => renderMenuItem(item))}
      </nav>

      {/* Collapse Toggle */}
      <div className="border-t p-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
          className={cn("w-full", collapsed && "px-2")}
        >
          <ChevronLeft
            className={cn(
              "h-4 w-4 transition-transform",
              collapsed && "rotate-180"
            )}
          />
          {!collapsed && <span className="mr-2">طي الشريط</span>}
        </Button>
      </div>
    </motion.aside>
  );
}