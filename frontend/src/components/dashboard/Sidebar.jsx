import React, { useState, useEffect, useMemo } from 'react';
import { NavLink } from 'react-router-dom';
import { LogoArt, LogoPatren } from '../../assets/images';
import {
  Gauge, ScrollText, BookText, ClipboardList, Landmark,
  Hammer, Settings2, ListTree, UsersRound, UserCheck,
  Archive, ChevronRight
} from 'lucide-react';

export default function Sidebar({ isOpen, onToggle, onLinkClick }) {
  const [activeSection, setActiveSection] = useState(null);
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 1024);

  useEffect(() => {
    const handleResize = () => setIsLargeScreen(window.innerWidth >= 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const logoSrc = isOpen ? LogoPatren : LogoArt;

  const navConfig = useMemo(() => [
    { id: 'home', label: 'الرئيسية', to: '/', icon: <Gauge size={20}/> },
    { id: 'contracts', label: 'التعاقدات', to: '/contracts', icon: <ScrollText size={20}/> },
    { id: 'fatwa', label: 'الرأي والفتوى', icon: <BookText size={20} />, children: [
      { id: 'investigations', label: 'التحقيقات', to: '/legal/investigations', icon: <ClipboardList size={16}/> },
      { id: 'legal-advices', label: 'المشورة القانونية', to: '/legal/legal-advices', icon: <Landmark size={16}/> },
      { id: 'litigations', label: 'التقاضي', to: '/legal/litigations', icon: <Hammer size={16}/> },
    ]},
    { id: 'management', label: 'إدارة التطبيق', icon: <Settings2  size={20}/>, children: [
      { id: 'lists', label: 'القوائم', to: '/managment-lists', icon: <ListTree size={16}/> },
    ]},
    { id: 'users', label: 'إدارة المستخدمين', icon: <UsersRound size={20}/>, children: [
      { id: 'users-list', label: 'المستخدمين', to: '/users', icon: <UserCheck size={16}/> },
    ]},
    { id: 'archive', label: 'الأرشيف', to: '/archive', icon: <Archive size={20}/> },
  ], []);

  const handleSectionClick = (id, hasChildren) => {
    if (!isLargeScreen && !isOpen) onToggle();
    if (hasChildren) setActiveSection(prev => (prev === id ? null : id));
  };

  return (
    <aside
      dir="rtl"
      className={`fixed right-0 bg-navy-light dark:bg-black top-0 z-20 h-full  bg-gradient-to-b  from-gold  via-greenic-dark/50 to-royal/80  dark:from-royal-dark/30 dark:via-royal-dark/40 dark:to-greenic-dark/40
        transition-all duration-300
        ${isLargeScreen ? (isOpen ? 'w-64' : 'w-16') : (isOpen ? 'w-full mt-16' : 'translate-x-full')}`}
    >
      <div className="flex items-center justify-center p-0 mt-6">
        <img
          src={logoSrc}
          alt="Logo"
          className={`transition-all duration-300 ${isOpen ? 'w-36' : 'w-10'}`}
        />
        {isOpen && <button onClick={onToggle} className="absolute top-4 left-4">×</button>}
      </div>

      <nav className={`overflow-y-auto h-full ${isOpen ? 'px-4 space-y-4 mt-6' : 'px-2 space-y-2 mt-8'}`}>
        {isOpen || !isLargeScreen ? (
          navConfig.map(item => (
            <div key={item.id}>
              {item.to ? (
                <NavLink
                  to={item.to}
                  onClick={onLinkClick}
                  className={({ isActive }) =>
                    `group flex items-center gap-3 p-2 rounded-md transition-all duration-300 ease-in-out
                     text-sm font-semibold tracking-tight
                     ${isActive
                       ? 'bg-greenic-dark text-gold-light dark:bg-greenic-light/80 dark:text-royal-dark'
                       : 'text-white dark:text-greenic-light hover:bg-gold-light hover:text-greenic-dark dark:hover:bg-greenic dark:hover:text-gold-light'}`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {React.cloneElement(item.icon, {
                        className: `transition-colors duration-200
                          ${isActive
                            ? 'dark:text-royal-darker'
                            : 'text-white dark:text-gold-light group-hover:text-greenic-dark dark:group-hover:text-greenic'}`,
                      })}
                      <span className="flex-1 text-right">{item.label}</span>
                    </>
                  )}
                </NavLink>
              ) : (
                <button
                  onClick={() => handleSectionClick(item.id, !!item.children)}
                  className={`flex items-center gap-3 p-2 w-full rounded-md transition-colors font-bold text-white duration-200
                    ${activeSection === item.id ? 'bg-greenic-dark dark:bg-greenic-light/40 dark:text-gold text-white' : 'text-white dark:text-greenic-light hover:bg-gold-light dark:hover:bg-greenic-light/30 hover:text-greenic-dark'}`}
                >
                  {React.cloneElement(item.icon, {
                    className: `transition-colors duration-200 ${activeSection === item.id ? 'text-gold-light' : 'text-white group-hover:text-greenic-dark dark:text-gold'}`,
                  })}
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
                           ? 'bg-gold-light text-greenic-dark dark:bg-greenic-light/60 dark:text-gold-light'
                           : 'text-white dark:text-greenic-light hover:bg-gold-light hover:text-greenic-dark dark:hover:bg-greenic-light/50 dark:hover:text-gold'}`}
                    >
                      {({ isActive }) => (
                        <>
                          {React.cloneElement(ch.icon, {
                            className: `transition duration-200 ${isActive
                              ? 'text-greenic-dark'
                              : 'text-gold group-hover:text-greenic-dark dark:text-gold-light'}`,
                          })}
                          <span>{ch.label}</span>
                        </>
                      )}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          ))
        ) : (
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
                  `px-4 py-2 rounded-md transition-all duration-200 font-semibold tracking-tight
                   flex items-center gap-2 group
                   ${isActive
                     ? 'bg-greenic-dark text-greenic-dark shadow-md dark:text-greenic dark:bg-greenic-light/60'
                     : 'text-white hover:bg-gold-light/70 hover:text-greenic dark:text-white dark:hover:bg-greenic-light/60'}`
                }
              >
                {({ isActive }) =>
                  React.cloneElement(it.icon, {
                    className: `transition duration-200 ${isActive ? 'text-gold-light dark:text-gold-light font-bold' : 'dark:text-gold-light group-hover:text-greenic-dark'}`,
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
``
