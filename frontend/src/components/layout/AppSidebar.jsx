import React, { useState, useEffect, useMemo } from 'react';
import { NavLink } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { DashboardIcon, ContractsIcon, ConsultationsIcon, LawsuitsIcon, ArchiveIcon, CourtHouseIcon, LawBookIcon, LegalBriefcaseIcon } from '@/components/ui/Icons';

export default function AppSidebar({ isOpen, onToggle, onLinkClick, isRTL }) {
  const [activeSection, setActiveSection] = useState(null);
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 1024);

  useEffect(() => {
    const handleResize = () => setIsLargeScreen(window.innerWidth >= 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const logoSrc = isOpen ? '/path-to-logo-open' : '/path-to-logo-closed';

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
      id: 'users', label: 'إدارة المستخدمين', icon: <LegalBriefcaseIcon size={20} />, children: [
        { id: 'users-list', label: 'المستخدمين', to: '/users', icon: <LegalBriefcaseIcon size={16} /> },
      ]
    },
    { id: 'archive', label: 'الأرشيف', to: '/archive', icon: <ArchiveIcon size={20} /> },
  ], []);

  const handleSectionClick = (id, hasChildren) => {
    if (!isLargeScreen && !isOpen) onToggle();
    if (hasChildren) setActiveSection(prev => (prev === id ? null : id));
  };

  const getNavCls = (isActive) =>
    isActive 
      ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium" 
      : "hover:bg-sidebar-accent/50 text-sidebar-foreground hover:text-sidebar-accent-foreground";

  return (
    <aside
      dir={isRTL ? 'rtl' : 'ltr'}
      className={`fixed top-0 z-20 h-full bg-gradient-to-b from-gold via-greenic-dark/50 to-royal/80 transition-all duration-300
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

      <nav className={`${isOpen ? 'px-4 space-y-4 mt-6' : 'px-2 space-y-2 mt-8'} overflow-y-auto h-full`}>
        {navConfig.map(item => (
          <div key={item.id}>
            {item.to ? (
              <NavLink
                to={item.to}
                onClick={onLinkClick}
                className={({ isActive }) => `${getNavCls(isActive)} flex items-center gap-3 p-2 rounded-md text-sm font-semibold tracking-tight transition-all duration-300`}
              >
                {({ isActive }) => (
                  <>
                    {React.cloneElement(item.icon, { className: `transition-colors duration-200 ${isActive ? 'text-gold-light' : 'text-white'}` })}
                    <span className="flex-1 text-right">{item.label}</span>
                  </>
                )}
              </NavLink>
            ) : (
              <button
                onClick={() => handleSectionClick(item.id, !!item.children)}
                className={`flex items-center gap-3 p-2 w-full rounded-md text-sm font-semibold tracking-tight transition-colors duration-200
                  ${activeSection === item.id ? 'bg-gold-light text-greenic' : 'text-white hover:bg-gold-light'}`}
              >
                {React.cloneElement(item.icon, {
                  className: `transition-colors duration-200 ${activeSection === item.id ? 'text-gold-light' : 'text-white'}`,
                })}
                <span className="flex-1 text-right">{item.label}</span>
                {item.children && <ChevronRight className={`w-4 h-4 transform transition-transform duration-200 ${activeSection === item.id ? 'rotate-90' : ''}`} />}
              </button>
            )}

            {item.children && activeSection === item.id && isOpen && (
              <div className="mr-4 pl-4 border-r border-gray-600 space-y-1">
                {item.children.map(child => (
                  <NavLink
                    key={child.id}
                    to={child.to}
                    onClick={onLinkClick}
                    className={({ isActive }) => `${getNavCls(isActive)} flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-300`}
                  >
                    {({ isActive }) => (
                      <>
                        {React.cloneElement(child.icon, {
                          className: `transition duration-200 ${isActive ? 'text-greenic-dark' : 'text-white'}`,
                        })}
                        <span>{child.label}</span>
                      </>
                    )}
                  </NavLink>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </aside>
  );
}
