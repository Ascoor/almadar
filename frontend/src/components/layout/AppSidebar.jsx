import React, { useState, useEffect, useMemo } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '@/components/auth/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { LogoArt, LogoPatren } from '../../assets/images';
import {
  ContractsIcon, ConsultationsIcon, LawsuitsIcon, DashboardIcon,
  ArchiveIcon, CourtHouseIcon, LawBookIcon
} from '@/components/ui/Icons';
import {
  Settings2, ListTree, UsersRound, UserCheck, ChevronRight
} from 'lucide-react';

export default function AppSidebar({ isOpen, onToggle, onLinkClick }) {
  const { hasPermission } = useAuth();
  const { t, dir } = useLanguage();
  const [activeSection, setActiveSection] = useState(null);
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 1024);
  const [isTablet, setIsTablet] = useState(
    window.innerWidth >= 768 && window.innerWidth < 1024
  );

  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth >= 1024);
      setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const logoSrc = isOpen ? LogoPatren : LogoArt;

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
      id: 'users', label: t('users'), icon: <UsersRound size={20} />, children: [
        { id: 'users-list', label: t('usersList'), to: '/users', icon: <UserCheck size={16} /> },
      ]
    },
    hasPermission('view archive') && {
      id: 'archive', label: t('archive'), to: '/archive', icon: <ArchiveIcon size={20} />
    },
  ].filter(Boolean), [hasPermission, t]);

  const handleSectionClick = (id, hasChildren) => {
    if (!isLargeScreen && !isOpen) onToggle();
    if (hasChildren) setActiveSection(prev => (prev === id ? null : id));
  };

  return (
    <aside
      dir={dir}
      className={`fixed ${dir === 'rtl' ? 'right-0' : 'left-0'} top-0 z-20 h-full bg-gold dark:bg-navy-darker
        bg-gradient-to-b from-gold via-greenic-dark/50 to-royal/80
        dark:from-royal-dark/30 dark:via-royal-dark/40 dark:to-greenic-dark/40
        text-greenic-dark dark:text-gold-light
        transition-all duration-300
        ${isLargeScreen
          ? isOpen
            ? 'w-64'
            : 'w-16'
          : isTablet
          ? isOpen
            ? 'w-full'
            : 'w-16'
          : isOpen
          ? 'w-full mt-12'
          : `${dir === 'rtl' ? 'translate-x-full' : '-translate-x-full'}`}
      `}
    >
      <div className="flex items-center justify-center p-0 mt-6">
        <img src={logoSrc} alt="Logo" className={`transition-all duration-300 ${isOpen ? 'w-36' : 'w-10'}`} />
        {isOpen && <button onClick={onToggle} className="absolute top-4 left-4">×</button>}
      </div>

      <nav className={`${isOpen ? 'px-4 space-y-4 mt-6' : 'px-2 space-y-2 mt-8'} overflow-y-auto h-full`}>
        {(isOpen || !isLargeScreen) ? navConfig.map(item => (
          <div key={item.id}>
            {item.to ? (
              <NavLink
                to={item.to}
                onClick={onLinkClick}
                className={({ isActive }) =>
                  `group flex items-center gap-3 p-2 rounded-md text-sm font-semibold tracking-tight transition-all duration-300
                   ${isActive
                     ? 'bg-greenic-dark text-gold-light dark:bg-greenic-light/80 dark:text-royal-dark'
                     : 'text-white dark:text-greenic-light hover:bg-gold-light hover:text-greenic-dark dark:hover:bg-greenic-light/50 dark:hover:text-white'}`
                }
              >
                {({ isActive }) => (
                  <>
                    {React.cloneElement(item.icon, {
                      className: `transition-colors duration-200
                        ${isActive
                          ? 'text-gold-light dark:text-royal-darker'
                          : 'text-white group-hover:text-greenic-dark dark:group-hover:text-white'}`
                    })}
                    <span className="flex-1 text-right">{item.label}</span>
                  </>
                )}
              </NavLink>
            ) : (
              <button
                onClick={() => handleSectionClick(item.id, !!item.children)}
                className={`flex items-center gap-3 p-2 w-full rounded-md text-sm font-semibold tracking-tight transition-colors duration-200
                  ${activeSection === item.id
                    ? 'bg-gold-light text-greenic dark:bg-greenic-light/40 dark:text-gold'
                    : 'text-white dark:text-greenic-light hover:bg-gold-light hover:text-greenic-dark dark:hover:bg-greenic-light/30 dark:hover:text-white'}`}
              >
                {React.cloneElement(item.icon, {
                  className: `transition-colors duration-200
                    ${activeSection === item.id
                      ? 'text-gold-light dark:text-gold'
                      : 'text-white group-hover:text-greenic-dark dark:group-hover:text-gold'}`
                })}
                <span className="flex-1 text-right">{item.label}</span>
                {item.children && (
                  <ChevronRight
                    className={`w-4 h-4 transform transition-transform duration-200
                      ${activeSection === item.id ? (dir === 'rtl' ? 'rotate-90' : '-rotate-90') : ''}`}
                  />
                )}
              </button>
            )}

            {item.children && activeSection === item.id && isOpen && (
              <div className="mr-4 pl-4 border-r border-gray-600 space-y-1">
                {item.children.map(ch => (
                  <NavLink
                    key={ch.id}
                    to={ch.to}
                    onClick={onLinkClick}
                    className={({ isActive }) =>
                      `flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-300
                       ${isActive
                         ? 'bg-gold-light/90 text-greenic-dark dark:bg-greenic-light/60 dark:text-white'
                         : 'text-white dark:text-greenic-light hover:bg-gold-light hover:text-greenic-dark dark:hover:bg-greenic-light/50 dark:hover:text-gold'}`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {React.cloneElement(ch.icon, {
                          className: `transition duration-200
                            ${isActive
                              ? 'text-greenic-dark dark:text-white'
                              : 'group-hover:text-greenic-dark dark:group-hover:text-white'}`
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
                  `px-4 py-2 rounded-md transition-all duration-200 font-semibold tracking-tight flex items-center gap-2 group
                   ${isActive
                     ? 'bg-greenic-dark text-gold-light shadow-md dark:bg-greenic-light/60 dark:text-gold-light'
                     : 'text-white hover:bg-gold-light/70 hover:text-greenic dark:hover:bg-greenic/50 dark:text-gold-light'}`
                }
              >
                {({ isActive }) =>
                  React.cloneElement(it.icon, {
                    className: `transition duration-200
                      ${isActive
                        ? 'text-gold-light dark:text-gold-light'
                        : 'dark:text-gold-light group-hover:text-greenic-dark dark:group-hover:text-white'}`
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
