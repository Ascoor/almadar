/**
 * AppLayout
 * Combines HeaderKit and AppSidebar into a responsive dashboard shell.
 * Usage:
 *   <AppLayout>
 *     <YourPage />
 *   </AppLayout>
 */
import React, { useEffect, useState, useMemo } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import HeaderKit from './HeaderKit';
import AppSidebar from './AppSidebar';
import useLocalStorage from './useLocalStorage';
import {
  LayoutDashboard,
  Folder,
  BookOpen,
  Users,
  Settings,
  BarChart3
} from 'lucide-react';
import clsx from 'clsx';

export default function AppLayout({ children, dir: propDir }) {
  const { dir: ctxDir = 'ltr' } = useLanguage?.() || {};
  const dir = propDir || ctxDir;
  const [sidebarOpen, setSidebarOpen] = useLocalStorage('ui.sidebarOpen', true);
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  );

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    const next = !sidebarOpen;
    setSidebarOpen(next);
    const eventName = next ? 'sidebar_opened' : 'sidebar_closed';
    window.dispatchEvent(new CustomEvent(eventName));
  };

  const hasPermissions = key => key !== 'restricted';

  const nav = useMemo(() => [
    {
      key: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      to: '/'
    },
    {
      key: 'library',
      label: 'Library',
      icon: Folder,
      children: [
        { key: 'books', label: 'Books', icon: BookOpen, to: '/books' },
        {
          key: 'clients',
          label: 'Clients',
          icon: Users,
          to: '/clients',
          permissionKey: 'clients:view'
        }
      ]
    },
    {
      key: 'admin',
      label: 'Admin',
      icon: Settings,
      children: [
        { key: 'users', label: 'Users', icon: Users, to: '/users' },
        {
          key: 'reports',
          label: 'Reports',
          icon: BarChart3,
          to: '/reports',
          permissionKey: 'restricted'
        }
      ]
    }
  ], []);

  return (
    <div dir={dir} className="min-h-screen flex bg-background text-foreground">
      <AppSidebar
        isOpen={sidebarOpen}
        onToggle={toggleSidebar}
        nav={nav}
        hasPermissions={hasPermissions}
        dir={dir}
      />
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40"
          onClick={toggleSidebar}
        />
      )}
      <div className={clsx('flex-1 flex flex-col transition-all', sidebarOpen ? 'md:ms-64' : 'md:ms-16')}>
        <HeaderKit
          onToggleSidebar={toggleSidebar}
          isSidebarOpen={sidebarOpen}
          dir={dir}
        />
        <main className="flex-1 p-4">{children}</main>
      </div>
    </div>
  );
}
