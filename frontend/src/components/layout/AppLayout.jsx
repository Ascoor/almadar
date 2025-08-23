/**
 * AppLayout.jsx
 *
 * Shell that combines the HeaderKit and Orbit Sidebar. Maintains sidebar
 * state in localStorage and provides a mock permission check for demo
 * purposes.
 *
 * Usage:
 * <AppLayout>
 *   <YourPage />
 * </AppLayout>
 */
import React, { useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import HeaderKit from './HeaderKit';
import AppSidebar from './AppSidebar';
import useLocalStorage from './useLocalStorage';
import { useLanguage } from '@/context/LanguageContext';
import { Home, FileText, Settings, Users } from 'lucide-react';

export default function AppLayout({ children, dir: dirProp = 'auto' }) {
  const location = useLocation();
  const { dir } = useLanguage();
  const [sidebarOpen, setSidebarOpen] = useLocalStorage('ui.sidebarOpen', true);

  const toggleSidebar = () => setSidebarOpen(o => !o);

  useEffect(() => {
    if (window.innerWidth < 768) setSidebarOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    window.dispatchEvent(new Event(sidebarOpen ? 'sidebar_opened' : 'sidebar_closed'));
  }, [sidebarOpen]);

  const hasPermissions = key => key !== 'secret';

  const nav = useMemo(
    () => [
      { key: 'home', label: 'Home', icon: Home, to: '/' },
      {
        key: 'admin',
        label: 'Admin',
        icon: Settings,
        children: [
          { key: 'users', label: 'Users', icon: Users, to: '/users' },
          { key: 'docs', label: 'Docs', icon: FileText, to: '/docs', permissionKey: 'secret' },
        ],
      },
    ],
    []
  );

  return (
    <div dir={dirProp === 'auto' ? dir : dirProp} className="flex min-h-screen bg-background">
      <AppSidebar
        isOpen={sidebarOpen}
        onToggle={toggleSidebar}
        nav={nav}
        hasPermissions={hasPermissions}
      />
      <div className="flex-1 flex flex-col min-h-screen">
        <HeaderKit onToggleSidebar={toggleSidebar} isSidebarOpen={sidebarOpen} />
        <main className="flex-1 p-4">{children}</main>
      </div>
    </div>
  );
}
