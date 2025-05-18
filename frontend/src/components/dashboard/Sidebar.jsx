import React, { useState, useEffect, useMemo, useContext } from 'react';
import { NavLink } from 'react-router-dom';
import {
  Home, FileText, Users, FolderArchive, Scale,
  Feather, Gavel, ChevronRight, SquareDashedKanban,
  LayoutDashboard, Settings, UserCog
} from 'lucide-react'; 
import { LogoArt, LogoPatren } from '../../assets/images'; 
import { AuthContext } from '../../components/auth/AuthContext';

export default function Sidebar({ isOpen, onToggle, onLinkClick }) {
  const { hasPermission, hasRole } = useContext(AuthContext);
  const [activeSection, setActiveSection] = useState(null);
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 640);

  // 1. مراقبة حجم الشاشة
  useEffect(() => {
    const handleResize = () => setIsLargeScreen(window.innerWidth >= 640);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const logoSrc = isOpen ? LogoPatren : LogoArt;

  // 2. هيكلية القائمة مع دوال canView
  const navConfig = useMemo(() => [
    {
      id: 'home',
      label: 'الرئيسية',
      to: '/',
      icon: <Home size={18} />,
      canView: () => true,
    },
    {
      id: 'contracts',
      label: 'التعاقدات',
      to: '/contracts',
      icon: <FileText size={18} />,
      canView: () =>
        hasPermission('view contracts')
    },
    {
      id: 'fatwa',
      label: 'الرأي والفتوى',
      icon: <Gavel size={18} />,
      children: [
        {
          id: 'investigations',
          label: 'التحقيقات',
          to: '/legal/investigations',
          icon: <Feather size={16} />,
          canView: () => hasPermission('view investigations'),
        },
        {
          id: 'legal-advices',
          label: 'المشورة القانونية',
          to: '/legal/legal-advices',
          icon: <Scale size={16} />,
          canView: () => hasPermission('view legaladvices'),
        },
        {
          id: 'litigations',
          label: 'التقاضي',
          to: '/legal/litigations',
          icon: <Gavel size={16} />,
          canView: () =>
            hasPermission('view litigations'),
        },
      ],
      // نعرض الأصل فقط لو لديه أبناء مرخص لهم
      canView: (kids) => kids.length > 0,
    },
    {
      id: 'management',
      label: 'إدارة التطبيق',
      icon: <LayoutDashboard size={18} />,
      children: [
        {
          id: 'lists',
          label: 'القوائم',
          to: '/management-lists',
          icon: <SquareDashedKanban size={16} />,
          canView: () => hasRole('Admin'),
        },
        {
          id: 'role-permissions',
          label: 'الأدوار والصلاحيات',
          to: '/role-management',
          icon: <SquareDashedKanban size={16} />,
          canView: () => hasRole('Admin'),
        },
        {
          id: 'settings',
          label: 'الإعدادات',
          to: '/management-settings',
          icon: <Settings size={16} />,
          canView: () => hasRole('Admin'),
        },
      ],
      canView: (kids) => kids.length > 0,
    },
    {
      id: 'users',
      label: 'إدارة المستخدمين',
      icon: <UserCog size={18} />,
      children: [
        {
          id: 'users-list',
          label: 'المستخدمين',
          to: '/users',
          icon: <Users size={16} />,
          canView: () => hasPermission('view users'),
        },
      ],
      canView: (kids) => kids.length > 0,
    },
    {
      id: 'archive',
      label: 'الأرشيف',
      to: '/archive',
      icon: <FolderArchive size={18} />,
      canView: () => true,
    },
  ], [hasPermission, hasRole]);

  // 3. فلترة البنود حسب الصلاحيات
  const permittedNav = useMemo(() => {
    return navConfig
      .map(item => {
        if (!item.children) {
          return item.canView() ? item : null;
        }
        const kids = item.children.filter(ch => ch.canView());
        return item.canView(kids) ? { ...item, children: kids } : null;
      })
      .filter(Boolean);
  }, [navConfig]);

  const handleSectionClick = (id) => {
    if (!isLargeScreen && !isOpen) onToggle();
    setActiveSection(prev => prev === id ? null : id);
  };
  const handleLinkClick = () => {
    if (!isLargeScreen && onLinkClick) setTimeout(onLinkClick, 50);
  };

  return (
    <aside
      dir="rtl"
      className={`
        fixed right-0 top-0 z-20 h-full bg-white dark:bg-black
        bg-gradient-to-b from-gold/70 via-navy/70 to-navy/90
        dark:bg-gradient-to-b dark:from-navy-dark/40 dark:via-navy-dark/20 dark:to-reded-dark/60
        border-l border-border transition-all duration-300
        ${isLargeScreen
          ? isOpen ? 'w-64' : 'w-16'
          : isOpen ? 'w-full mt-16' : 'translate-x-full'}
      `}
    >
      <div className="flex items-center justify-center p-4">
        <img
          src={logoSrc}
          alt="Logo"
          className={`transition-all duration-300 ${isOpen ? 'w-36' : 'w-10'}`}
        />
      </div>

      <nav className={`overflow-y-auto h-full px-2 ${isOpen ? 'space-y-4 mt-4' : 'space-y-2 mt-4'}`}>
        {permittedNav.map(item => (
          <div key={item.id}>
            {!item.children ? (
              <NavLink
                to={item.to}
                onClick={handleLinkClick}
                className={({ isActive }) =>
                  `flex items-center gap-3 p-2 rounded-md transition-colors duration-200
                   ${isActive ? 'bg-navy-light text-white' : 'hover:bg-yellow-100 hover:text-navy'}`
                }
              >
                {item.icon}
                {isOpen && <span className="flex-1 text-right">{item.label}</span>}
              </NavLink>
            ) : (
              <>
                <button
                  onClick={() => handleSectionClick(item.id)}
                  className={`
                    flex items-center gap-3 p-2 w-full rounded-md transition-colors duration-200
                    ${activeSection === item.id
                      ? 'bg-navy-light text-white'
                      : 'hover:bg-yellow-100 hover:text-navy'}`}
                >
                  {item.icon}
                  {isOpen && (
                    <>
                      <span className="flex-1 text-right">{item.label}</span>
                      <ChevronRight
                        className={`w-4 h-4 transition-transform duration-200 ${activeSection === item.id ? 'rotate-90' : ''}`}
                      />
                    </>
                  )}
                </button>
                {isOpen && activeSection === item.id && (
                  <div className="mr-4 pl-4 border-r border-gray-600 space-y-1">
                    {item.children.map(ch => (
                      <NavLink
                        key={ch.id}
                        to={ch.to}
                        onClick={handleLinkClick}
                        className={({ isActive }) =>
                          `flex items-center gap-2 p-2 rounded-md text-sm transition-colors duration-200
                           ${isActive ? 'bg-navy-light text-white' : 'hover:bg-yellow-100 hover:text-navy'}` 
                        }
                      >
                        {ch.icon}
                        {ch.label}
                      </NavLink>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </nav>
    </aside>
  );
}
