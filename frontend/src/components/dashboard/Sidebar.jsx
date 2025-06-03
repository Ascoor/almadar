import React, { useState, useMemo } from 'react';
import { NavLink } from 'react-router-dom';
import { LogoArt, LogoPatren } from '../../assets/images';
import {
  ContractsIcon, ConsultationsIcon, LawsuitsIcon, DashboardIcon,
  ArchiveIcon, CourtHouseIcon, LawBookIcon, LegalBriefcaseIcon
} from '@/components/ui/Icons';
import { UsersRound, UserCheck, ChevronRight } from 'lucide-react';
import { useMobileTheme } from '../MobileThemeProvider';

const Sidebar = ({ isOpen, onToggle, onLinkClick }) => {
  const [activeSection, setActiveSection] = useState(null);
  const [showMiniSidebar, setShowMiniSidebar] = useState(false);
  const { isMobile, isStandalone, safeAreaInsets } = useMobileTheme();

  const logoSrc = isOpen ? LogoPatren : LogoArt;

  const navConfig = useMemo(() => [
    { id: 'home', label: 'الرئيسية', to: '/', icon: <DashboardIcon size={20} /> },
    { id: 'contracts', label: 'التعاقدات', to: '/contracts', icon: <ContractsIcon size={20} /> },
    {
      id: 'fatwa', label: 'الرأي والفتوى', icon: <ConsultationsIcon size={20} />, children: [
        { id: 'investigations', label: 'التحقيقات', to: '/legal/investigations', icon: <LawsuitsIcon size={16} /> },
        { id: 'legal-advices', label: 'المشورة القانونية', to: '/legal/legal-advices', icon: <LawBookIcon size={16} /> },
        { id: 'litigations', label: 'التقاضي', to: '/legal/litigations', icon: <CourtHouseIcon size={16} /> },
      ]
    },
    {
      id: 'management', label: 'إدارة التطبيق', icon: <LegalBriefcaseIcon size={20} />, children: [
        { id: 'lists', label: 'القوائم', to: '/managment-lists', icon: <LegalBriefcaseIcon size={16} /> },
      ]
    },
    {
      id: 'users', label: 'إدارة المستخدمين', icon: <UsersRound size={20} />, children: [
        { id: 'users-list', label: 'المستخدمين', to: '/users', icon: <UserCheck size={16} /> },
      ]
    },
    { id: 'archive', label: 'الأرشيف', to: '/archive', icon: <ArchiveIcon size={20} /> },
  ], []);

  const handleSectionClick = (id, hasChildren) => {
    if (isMobile && !isOpen) onToggle();
    if (hasChildren) setActiveSection(prev => (prev === id ? null : id));
  };

  const sidebarStyles = {
    paddingTop: isStandalone && isMobile ? `${safeAreaInsets.top + 16}px` : undefined,
    paddingBottom: isStandalone && isMobile ? `${safeAreaInsets.bottom + 16}px` : undefined
  };

  const handleToggleSidebar = () => {
    setShowMiniSidebar(prev => !prev);
  };

  return (
    <aside
      dir="rtl"
      className={`
        fixed top-0 z-20 h-full bg-navy-light dark:bg-navy-dark 
        bg-gradient-to-b from-gold via-greenic-dark/50 to-royal/80
        dark:from-royal-dark/30 dark:via-royal-dark/40 dark:to-greenic-dark/40
        transition-all duration-300
        ${isMobile ? 
          (isOpen ? 'w-full mt-12' : 'translate-x-full') : 
          (isOpen ? 'w-64' : showMiniSidebar ? 'w-16' : 'w-0')
        }
        ${isStandalone ? 'standalone-sidebar' : ''}
      `}
      style={sidebarStyles}
    >
      <div className="flex items-center justify-center p-0 mt-6">
        <img
          src={logoSrc}
          alt="Logo"
          className={`transition-all duration-300 ${isOpen ? (isMobile ? 'w-32' : 'w-36') : 'w-10'}`}
        />
        {isOpen && isMobile && (
          <button 
            onClick={onToggle} 
            className="absolute top-4 left-4 text-white text-2xl"
          >
            ×
          </button>
        )}
      </div>

      {!isMobile && (
        <button 
          onClick={handleToggleSidebar} 
          className="absolute top-4 right-4 text-white text-xl"
        >
          {showMiniSidebar ? '☰' : '×'}
        </button>
      )}

      <nav className="px-4 space-y-4 overflow-y-auto h-full pb-20">
        {(isOpen || !isMobile || showMiniSidebar) ? navConfig.map(item => (
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
                      : 'text-white group-hover:text-greenic-dark dark:group-hover:text-gold'}`}
                )}
                <span className="flex-1 text-right">{item.label}</span>
                {item.children && (
                  <ChevronRight
                    className={`w-4 h-4 transform transition-transform duration-200
                      ${activeSection === item.id ? 'rotate-90' : ''}`}
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
                        : 'text-white dark:text-greenic-light hover:bg-gold-light hover:text-greenic-dark dark:hover:bg-greenic-light/50 dark:hover:text-gold'}`}
                  >
                    {({ isActive }) => (
                      <>
                        {React.cloneElement(ch.icon, {
                          className: `transition duration-200
                            ${isActive
                              ? 'text-greenic-dark dark:text-white'
                              : 'group-hover:text-greenic-dark dark:group-hover:text-white'}`,
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
                    : 'text-white hover:bg-gold-light/70 hover:text-greenic dark:hover:bg-greenic/50 dark:text-gold-light'}`}
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
};

export default Sidebar;
