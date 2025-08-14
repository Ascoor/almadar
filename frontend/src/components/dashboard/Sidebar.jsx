import { motion } from 'framer-motion';
import { NavLink, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from '@/components/ui/tooltip';
import {
  LayoutDashboard,
  FileText,
  Search,
  Scale,
  Users,
  Archive,
  Settings,
  ChevronLeft,
  Building2,
  MessageSquare,
  List,
  User,
} from 'lucide-react';
import { useContext, useState } from 'react';
import { AuthContext } from '@/components/auth/AuthContext';

export const menuItems = [
  { id: 'dashboard', title: 'الرئيسية', href: '/', icon: LayoutDashboard },
  {
    id: 'contracts',
    title: 'التعاقدات',
    href: '/contracts',
    icon: FileText,
    permission: 'view contracts',
  },
  {
    id: 'legal',
    title: 'الرأي والفتوى',
    icon: Scale,
    children: [
      {
        title: 'التحقيقات',
        href: '/legal/investigations',
        icon: Search,
        permission: 'view investigations',
      },
      {
        title: 'المشورة القانونية',
        href: '/legal/legal-advices',
        icon: MessageSquare,
        permission: 'view legaladvices',
      },
      {
        title: 'التقاضي',
        href: '/legal/litigations',
        icon: Building2,
        permission: 'view litigations',
      },
    ],
  },
  {
    id: 'app-management',
    title: 'إدارة التطبيق',
    icon: Settings,
    children: [
      {
        title: 'القوائم',
        href: '/managment-lists',
        icon: List,
        permission: 'view managment-lists',
      },
    ],
  },
  {
    id: 'user-management',
    title: 'إدارة المستخدمين',
    icon: Users,
    children: [
      {
        title: 'المستخدمين',
        href: '/users',
        icon: User,
        permission: 'view users',
      },
    ],
  },
  { id: 'archive', title: 'الأرشيف', href: '/archive', icon: Archive },
];

export function Sidebar() {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [expandedItems, setExpandedItems] = useState([]);

  const hasPermission = (permission) => {
    if (!permission) return true;
    return user?.permissions?.includes(permission) || false;
  };

  const isRouteActive = (href) => {
    if (href === '/') return location.pathname === '/';
    return location.pathname.startsWith(href);
  };

  const isActive = (item) => {
    if (item.children) {
      return item.children.some((child) => isActive(child));
    }
    return isRouteActive(item.href);
  };

  const toggleExpanded = (id) => {
    setExpandedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const renderMenuItem = (item, level = 0) => {
    if (item.permission && !hasPermission(item.permission)) return null;

    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.includes(item.id);
    const active = isActive(item);

    if (hasChildren) {
      const content = (
        <Button
          variant="ghost"
          className={cn(
            'w-full justify-between h-11 px-3',
            level > 0 && 'mr-4',
            collapsed && 'justify-center px-2'
          )}
          onClick={() => !collapsed && toggleExpanded(item.id)}
        >
          <div className="flex items-center gap-3">
            <item.icon
              className={cn(
                'h-5 w-5 flex-shrink-0',
                active ? 'text-accent-foreground' : 'text-muted-foreground'
              )}
            />
            {!collapsed && <span className="text-sm font-medium">{item.title}</span>}
          </div>
          {!collapsed && (
            <ChevronLeft
              className={cn('h-4 w-4 transition-transform', isExpanded && 'rotate-90')}
            />
          )}
        </Button>
      );

      const children =
        !collapsed && isExpanded ? (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="space-y-1 mr-6 mt-1">
              {item.children?.map((child) => renderMenuItem(child, level + 1))}
            </div>
          </motion.div>
        ) : null;

      if (collapsed) {
        return (
          <Tooltip key={`${item.id}-${level}`}>
            <TooltipTrigger asChild>{content}</TooltipTrigger>
            <TooltipContent side="right">{item.title}</TooltipContent>
          </Tooltip>
        );
      }

      return (
        <div key={`${item.id}-${level}`}>
          {content}
          {children}
        </div>
      );
    }

    const link = (
      <NavLink
        key={`${item.href}-${level}`}
        to={item.href}
        className={cn(
          'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground',
          level > 0 && 'mr-4',
          collapsed && 'justify-center px-2',
          active && 'bg-accent text-accent-foreground'
        )}
      >
        <item.icon
          className={cn(
            'h-5 w-5 flex-shrink-0',
            active ? 'text-accent-foreground' : 'text-muted-foreground'
          )}
        />
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

    if (collapsed) {
      return (
        <Tooltip key={`${item.href}-${level}`}>
          <TooltipTrigger asChild>{link}</TooltipTrigger>
          <TooltipContent side="right">{item.title}</TooltipContent>
        </Tooltip>
      );
    }

    return link;
  };

  return (
    <TooltipProvider>
      <motion.aside
        initial={{ x: -280 }}
        animate={{ x: 0 }}
        className={cn(
          'hidden md:flex flex-col border-l bg-card transition-all duration-300 overflow-hidden',
          collapsed ? 'w-16' : 'w-64'
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
          {menuItems.map((item) => renderMenuItem(item))}
        </nav>

        {/* Collapse Toggle */}
        <div className="border-t p-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCollapsed(!collapsed)}
            className={cn('w-full', collapsed && 'px-2')}
          >
            <ChevronLeft
              className={cn('h-4 w-4 transition-transform', collapsed && 'rotate-180')}
            />
            {!collapsed && <span className="mr-2">طي الشريط</span>}
          </Button>
        </div>
      </motion.aside>
    </TooltipProvider>
  );
}

export default Sidebar;
