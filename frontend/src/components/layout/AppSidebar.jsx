import React, { useState, useEffect, useMemo } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { LogoArt, LogoTextArtGreen, LogoTextArtWhite } from '../../assets/images';
import {
  ContractsIcon, ConsultationsIcon, LawsuitsIcon, DashboardIcon,
  ArchiveIcon, CourtHouseIcon, LawBookIcon
} from '@/components/ui/Icons';
import { Settings2, ListTree, UsersRound, UserCheck, ChevronRight, FileText } from 'lucide-react';

export default function AppSidebar({ isOpen, onToggle, onLinkClick }) {
  const { hasPermission } = useAuth();
  const { t, dir } = useLanguage();

  const [activeSection, setActiveSection] = useState(null);
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 1024);
  const [isTablet, setIsTablet] = useState(window.innerWidth >= 768 && window.innerWidth < 1024);

  // 🔦 Detect dark mode from either `.dark` class or [data-theme="dark"]
  const [isDark, setIsDark] = useState(() => {
    const root = document.documentElement;
    return root.classList.contains('dark') || root.getAttribute('data-theme') === 'dark';
  });

  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth >= 1024);
      setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024);
    };
    window.addEventListener('resize', handleResize);

    // Watch for theme changes (class or data-theme toggles)
    const root = document.documentElement;
    const mo = new MutationObserver(() => {
      setIsDark(root.classList.contains('dark') || root.getAttribute('data-theme') === 'dark');
    });
    mo.observe(root, { attributes: true, attributeFilter: ['class', 'data-theme'] });

    // Also respect system preference if you use it anywhere
    const mq = window.matchMedia?.('(prefers-color-scheme: dark)');
    const onMQ = e => setIsDark(e.matches || root.classList.contains('dark') || root.getAttribute('data-theme') === 'dark');
    mq?.addEventListener?.('change', onMQ);

    return () => {
      window.removeEventListener('resize', handleResize);
      mo.disconnect();
      mq?.removeEventListener?.('change', onMQ);
    };
  }, []);

  // ✅ Fix: choose logo by sidebar state + theme
  const logoSrc = isOpen
    ? (isDark ? LogoTextArtWhite : LogoTextArtGreen) // open → text logo (white in dark, green in light)
    : LogoArt;                                       // closed → compact mark

  const navConfig = useMemo(() => [
    { id: 'home', label: t('home'), to: '/', icon: <DashboardIcon size={20} /> },
    hasPermission('view contracts') && {
      id: 'contracts', label: t('contracts'), to: '/contracts', icon: <ContractsIcon size={20} />
    },
    (hasPermission('view investigations') || hasPermission('view legaladvices') || hasPermission('view litigations')) && {
      id: 'fatwa', label: t('fatwa'), icon: <ConsultationsIcon size={20} />, children: [
        hasPermission('view investigations') && {
          id: 'investigations', label: t('investigations'), to: '/legal/investigations', icon: <LawsuitsIcon size={16} />
        },
        hasPermission('view legaladvices') && {
          id: 'legal-advices', label: t('legalAdvices'), to: '/legal/legal-advices', icon: <LawBookIcon size={16} />
        },
        hasPermission('view litigations') && {
          id: 'litigations', label: t('litigations'), to: '/legal/litigations', icon: <CourtHouseIcon size={16} />
        },
      ].filter(Boolean)
    },
    hasPermission('view managment-lists') && {
      id: 'management', label: t('management'), icon: <Settings2 size={20} />, children: [
        { id: 'lists', label: t('lists'), to: '/managment-lists', icon: <ListTree size={16} /> },
      ]
    },
    hasPermission('view users') && {
      id: 'users', label: t('usersManagement'), icon: <UsersRound size={20} />, children: [
        { id: 'users-list', label: t('usersList'), to: '/users', icon: <UserCheck size={16} /> },
      ]
    },
    hasPermission('view archive') && {
      id: 'archive',
      label: t('archive'),
      icon: <ArchiveIcon size={20} />,
      children: [
        { id: 'archive-root', label: t('archive'), to: '/archive', icon: <ArchiveIcon size={16} /> },
        { id: 'editor', label: t('editor'), to: '/editor', icon: <FileText size={16} /> },
      ]
    },
    ].filter(Boolean), [hasPermission, t]);

  const handleSectionClick = (id, hasChildren) => {
    if (!isLargeScreen && !isOpen) onToggle();
    if (hasChildren) setActiveSection(prev => (prev === id ? null : id));
  };
  const showFullNav = isOpen || (!isLargeScreen && !isTablet);

  return (
    <aside
      dir={dir}
      style={isDark ? { boxShadow: '0 0 15px rgba(34,211,238,0.35)' } : undefined}
      className={`fixed ${dir === 'rtl' ? 'right-0' : 'left-0  border-r '} top-0 z-20 h-full bg-sidebar text-sidebar-fg border-l  border-border transition-all duration-300 ${
        isLargeScreen
          ? isOpen
            ? 'w-64'
            : 'w-16'
          : isTablet
          ? isOpen
            ? 'w-full'
            : 'w-16'
          : isOpen
          ? 'w-full mt-12'
          : `${dir === 'rtl' ? 'translate-x-full' : '-translate-x-full'}`
      }`}
    >
      <div className="flex items-center justify-center p-0 mt-6">
        <img
          src={logoSrc}
          alt="Almadar Logo"
          className={`transition-all duration-300 ${isOpen ? 'w-36' : 'w-10'}`}
        />
        {isOpen && <button onClick={onToggle} className="absolute top-4 left-4">×</button>}
      </div>


      <nav className={`${isOpen ? 'px-4 space-y-4 mt-6' : 'px-2 space-y-2 mt-8'} overflow-y-auto h-full`}>
        {showFullNav ? navConfig.map(item => (
          <div key={item.id}>
            {item.to ? (
              <NavLink
                to={item.to}
                onClick={onLinkClick}
                className={({ isActive }) =>
                  `group flex items-center gap-3 p-2 rounded-md text-sm font-semibold tracking-tight transition-all duration-300 ${
                    isActive
                      ? 'text-sidebar-active'
                      : 'text-sidebar-fg hover:bg-accent/50 hover:text-fg'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {React.cloneElement(item.icon, {
                      className: `transition-colors duration-200 ${
                        isActive
                          ? 'text-sidebar-active dark:text-[color:var(--neon-title)]'
                          : 'text-sidebar-fg group-hover:text-fg dark:group-hover:text-[color:var(--neon-title)]'
                      }`
                    })}
                    <span className="flex-1 text-right">{item.label}</span>
                  </>
                )}
              </NavLink>
            ) : (
              <button
                onClick={() => handleSectionClick(item.id, !!item.children)}
                className={`flex items-center gap-3 p-2 w-full rounded-md text-sm font-semibold tracking-tight transition-colors duration-200 ${
                  activeSection === item.id
                    ? 'text-sidebar-active'
                    : 'text-sidebar-fg hover:bg-accent/50 hover:text-fg'
                }`}
              >
                {React.cloneElement(item.icon, {
                  className: `transition-colors duration-200 ${
                    activeSection === item.id
                      ? 'text-sidebar-active dark:text-[color:var(--neon-title)]'
                      : 'text-sidebar-fg group-hover:text-fg dark:group-hover:text-[color:var(--neon-title)]'
                  }`
                })}
                <span className="flex-1 text-right">{item.label}</span>
                {item.children && (
                  <ChevronRight
                    className={`w-4 h-4 transform transition-transform duration-200 ${
                      activeSection === item.id ? (dir === 'rtl' ? 'rotate-90' : '-rotate-90') : ''
                    }`}
                  />
                )}
              </button>
            )}

            {item.children && activeSection === item.id && isOpen && (
              <div className="mr-4 pl-4 border-r border-border space-y-1">
                {item.children.map(ch => (
                  <NavLink
                    key={ch.id}
                    to={ch.to}
                    onClick={onLinkClick}
                    className={({ isActive }) =>
                      `flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
                        isActive
                          ? 'text-sidebar-active'
                          : 'text-sidebar-fg hover:bg-accent/50 hover:text-fg'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {React.cloneElement(ch.icon, {
                          className: `transition duration-200 ${
                            isActive
                              ? 'text-sidebar-active dark:text-[color:var(--neon-title)]'
                              : 'text-sidebar-fg group-hover:text-fg dark:group-hover:text-[color:var(--neon-title)]'
                          }`
                        })}
                        <span>{ch.label}</span>
                      </>
                    )}
                  </NavLink>
                ))}
              </div>
            )}
          </div>
        )) : (
          <div className="flex flex-col items-center space-y-4 pt-4">
            {navConfig.flatMap(item => [
              ...(item.to ? [item] : []),
              ...(item.children ? item.children : [])
            ]).map(it => (
              <NavLink
                key={it.id}
                to={it.to}
                onClick={onLinkClick}
                title={it.label}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-md transition-all duration-200 font-semibold tracking-tight flex items-center gap-2 group ${
                    isActive
                      ? 'text-sidebar-active shadow-md'
                      : 'text-sidebar-fg hover:bg-accent/50 hover:text-sidebar-active'
                  }`
                }
              >
                {({ isActive }) =>
                  React.cloneElement(it.icon, {
                    className: `transition duration-200 ${
                      isActive
                        ? 'text-sidebar-active dark:text-[color:var(--neon-title)]'
                        : 'text-sidebar-fg group-hover:text-sidebar-active dark:group-hover:text-[color:var(--neon-title)]'
                    }`
                  })
                }
              </NavLink>
            ))}
          </div>
        )}
      </nav>
    </aside>
  );
}
