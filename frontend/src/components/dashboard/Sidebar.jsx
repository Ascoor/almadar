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
      { id: 'legal-advices', label: 'المشورة القانونية', to: '/legal/legal-advices', icon: <Landmark  size={16}/> },
      { id: 'litigations', label: 'التقاضي', to: '/legal/litigations', icon: <Hammer  size={16}/> },
    ]},
    { id: 'management', label: 'إدارة التطبيق', icon: <Settings2  size={20}/>, children: [
      { id: 'lists', label: 'القوائم', to: '/managment-lists', icon: <ListTree size={16}/> },
    ]},
    { id: 'users', label: 'إدارة المستخدمين', icon: <UsersRound size={20}/>, children: [
      { id: 'users-list', label: 'المستخدمين', to: '/users', icon: <UserCheck  size={16}/> },
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
      className={`fixed right-0 bg-gold dark:bg-black top-0 z-20 h-full bg-gradient-to-b from-gold-light/70 via-reded/20 to-navy-light/90 dark:from-navy-dark/40 dark:via-navy-dark/20 dark:to-greenic-dark/60
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
                    `flex items-center gap-3 p-2 rounded-md transition-colors duration-200
                     ${isActive ? 'bg-navy-light text-white' : 'hover:bg-yellow-100 hover:text-navy'}`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {React.cloneElement(item.icon, {
                        className: `transition-colors duration-200 ${
                          isActive ? 'text-yellow-300' : 'text-gray-700 dark:text-gray-300'
                        }`
                      })}
                      <span className="flex-1 text-right">{item.label}</span>
                    </>
                  )}
                </NavLink>
              ) : (
                <button
                  onClick={() => handleSectionClick(item.id, !!item.children)}
                  className={`flex items-center gap-3 p-2 w-full rounded-md transition-colors duration-200
                    ${activeSection === item.id ? 'bg-navy-light text-white' : 'hover:bg-yellow-100 hover:text-g'}`}
                >
                  {React.cloneElement(item.icon, {
                    className: `transition-colors duration-200 ${
                      activeSection === item.id ? 'text-yellow-300' : 'text-gray-700 dark:text-gray-300'
                    }`
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
                        `flex items-center gap-2 p-2 rounded-md text-sm transition-colors duration-200
                         ${isActive ? 'bg-navy-light text-white' : ' hover:bg-gold-light/80 hover:text-royal'}`
                      }
                    >
                      {({ isActive }) => (
                        <>
                          {React.cloneElement(ch.icon, {
                            className: `transition-colors duration-200 ${
                              isActive ? 'text-yellow-300' : ' hover:bg-gold-light/80 hover:text-royal'
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
     ${
       isActive
         ? 'bg-greenic text-white shadow-md dark:bg-greenic-light'
         : 'text-foreground hover:bg-gold-light/20 hover:text-gold-dark dark:text-greenic-light dark:hover:bg-gold-light/10 dark:hover:text-gold'
     }`
  }
              >
                {({ isActive }) =>
                  React.cloneElement(it.icon, {
                    className: `transition-greenic duration-200 ${
                      isActive ? 'text-royal  font-bold ' : ' hover:bg-gold-light/80 hover:text-   '
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
