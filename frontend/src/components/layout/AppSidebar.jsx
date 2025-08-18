import React, { useMemo, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import {
  DashboardIcon,
  ContractsIcon,
  ConsultationsIcon,
  LawsuitsIcon,
  ArchiveIcon,
  CourtHouseIcon,
  LawBookIcon,
  LegalBriefcaseIcon,
} from '@/components/ui/Icons';

export default function AppSidebar({
  isOpen,
  toggleSidebar,
  closeSidebar,
  isMobile,
  isRTL,
}) {
  const [activeSection, setActiveSection] = useState(null);
  const navConfig = useMemo(
    () => [
      { id: 'home', label: 'الرئيسية', to: '/', icon: <DashboardIcon size={20} /> },
      { id: 'contracts', label: 'التعاقدات', to: '/contracts', icon: <ContractsIcon size={20} /> },
      {
        id: 'fatwa',
        label: 'الرأي والفتوى',
        icon: <ConsultationsIcon size={20} />,
        children: [
          { id: 'investigations', label: 'التحقيقات', to: '/legal/investigations', icon: <LawsuitsIcon size={16} /> },
          { id: 'legal-advices', label: 'المشورة القانونية', to: '/legal/legal-advices', icon: <LawBookIcon size={16} /> },
          { id: 'litigations', label: 'التقاضي', to: '/legal/litigations', icon: <CourtHouseIcon size={16} /> },
        ],
      },
      {
        id: 'management',
        label: 'إدارة التطبيق',
        icon: <LegalBriefcaseIcon size={20} />,
        children: [
          { id: 'lists', label: 'القوائم', to: '/managment-lists', icon: <LegalBriefcaseIcon size={16} /> },
        ],
      },
      {
        id: 'users',
        label: 'إدارة المستخدمين',
        icon: <LegalBriefcaseIcon size={20} />,
        children: [
          { id: 'users-list', label: 'المستخدمين', to: '/users', icon: <LegalBriefcaseIcon size={16} /> },
        ],
      },
      { id: 'archive', label: 'الأرشيف', to: '/archive', icon: <ArchiveIcon size={20} /> },
    ],
    []
  );

  const handleSectionClick = (id, hasChildren) => {
    if (hasChildren) {
      setActiveSection((prev) => (prev === id ? null : id));
    } else if (isMobile) {
      closeSidebar();
    }
  };

  const side = isRTL ? 'right-0' : 'left-0';
  const translate = isMobile
    ? isOpen
      ? 'translate-x-0'
      : isRTL
        ? 'translate-x-full'
        : '-translate-x-full'
    : 'translate-x-0';
  const width = isMobile ? 'w-64' : isOpen ? 'w-64' : 'w-16';

  return (
    <aside
      dir={isRTL ? 'rtl' : 'ltr'}
      className={`fixed top-0 z-40 h-full ${side} ${width} ${translate} flex flex-col bg-text-sidebar-foreground transition-all duration-300`}
    >
      <div className={`flex items-center ${isOpen ? 'justify-between' : 'justify-center'} p-4`}>
        {isOpen && <span className="font-bold">Almadar</span>}
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-md hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        >
          <ChevronRight
            className={`h-4 w-4 transition-transform ${isRTL ? 'rotate-180' : ''} ${isOpen ? 'rotate-180' : ''}`}
          />
        </button>
      </div>

      <nav className={`flex-1 space-y-1 overflow-y-auto ${isOpen ? 'px-4' : 'px-2'}`}>
        {navConfig.map((item) => (
          <div key={item.id} className="text-sm">
            {item.to ? (
              <NavLink
                to={item.to}
                onClick={isMobile ? closeSidebar : undefined}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-md p-2 transition-colors ${
                    isActive
                      ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium'
                      : 'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                  } ${!isOpen && !isMobile ? 'justify-center' : ''}`
                }
              >
                {item.icon}
                {(isOpen || isMobile) && <span className="flex-1 truncate">{item.label}</span>}
              </NavLink>
            ) : (
              <button
                onClick={() => handleSectionClick(item.id, !!item.children)}
                className={`flex w-full items-center gap-3 rounded-md p-2 transition-colors ${
                  activeSection === item.id
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium'
                    : 'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                } ${!isOpen && !isMobile ? 'justify-center' : ''}`}
              >
                {item.icon}
                {(isOpen || isMobile) && <span className="flex-1 truncate">{item.label}</span>}
                {item.children && (isOpen || isMobile) && (
                  <ChevronRight
                    className={`h-4 w-4 transition-transform ${
                      activeSection === item.id ? (isRTL ? '-rotate-90' : 'rotate-90') : ''
                    }`}
                  />
                )}
              </button>
            )}

            {item.children && activeSection === item.id && (isOpen || isMobile) && (
              <div className="mt-1 space-y-1 border-r border-sidebar-border pr-4">
                {item.children.map((child) => (
                  <NavLink
                    key={child.id}
                    to={child.to}
                    onClick={isMobile ? closeSidebar : undefined}
                    className={({ isActive }) =>
                      `flex items-center gap-2 rounded-md px-4 py-2 text-sm transition-colors ${
                        isActive
                          ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                          : 'hover:bg-sidebar-accent/70 hover:text-sidebar-accent-foreground'
                      }`
                    }
                  >
                    {child.icon}
                    <span className="truncate">{child.label}</span>
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
