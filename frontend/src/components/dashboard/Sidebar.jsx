import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import {
  Home, FileText, Users, FolderArchive, Scale,
  Feather, Gavel, ChevronRight,SquareDashedKanban
} from 'lucide-react';
import { LogoArt, LogoPatren } from '../../assets/images'; // استخدام الشعارين

export default function Sidebar({ isOpen, onToggle, onLinkClick }) {
  const [activeSection, setActiveSection] = useState(null);
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 640);

  useEffect(() => {
    const handleResize = () => setIsLargeScreen(window.innerWidth >= 640);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const logoSrc = () => {
    return isOpen ? LogoPatren : LogoArt; // استخدام LogoPatren عندما يكون isOpen === true و LogoArt عندما يكون isOpen === false
  };

  const navItems = [
    { id: 'home', label: 'الرئيسية', to: '/', icon: <Home size={18} /> },
    { id: 'contracts', label: 'التعاقدات', to: '/contracts', icon: <FileText size={18} /> },
    {
      id: 'fatwa',
      label: 'الرأي والفتوى',
      icon: <Scale size={18} />,
      children: [
        { id: 'inv', label: 'التحقيقات', to: '/legal/investigations', icon: <Feather size={16} /> },
        { id: 'adv', label: 'المشورة القانونية', to: '/legal/legal-advices', icon: <Scale size={16} /> },
        { id: 'lit', label: 'التقاضي', to: '/legal/litigations', icon: <Gavel size={16} /> },
      ]
    }, 
        {
      id: 'managment',
      label: 'إدارة التطبيق',
      icon: <Scale size={18} />,
      children: [
        { id: 'inv', label: 'القوائم', to: '/managment-lists', icon: <SquareDashedKanban size={16} /> },
             ]
    },
    { id: 'users', label: 'المستخدمين', to: '/users', icon: <Users size={18} /> },
    { id: 'archive', label: 'الأرشيف', to: '/archive', icon: <FolderArchive size={18} /> },
  ];

  const toggleSection = (id) => {
    setActiveSection(prev => (prev === id ? null : id));
  };

  const handleClick = () => {
    if (!isLargeScreen) onLinkClick?.();
  };

  return (
    <aside
      dir="rtl"
      className={`
        fixed right-0 top-0 h-full z-30 bg-white dark:bg-black
          bg-gradient-to-b from-gold/70 via-navy/70 to-navy/90
        dark:bg-gradient-to-t dark:from-navy-dark/70 dark:via-navy-dark/40 dark:to-reded-dark/40
        text-green-100/95 border-l border-border
        transition-all duration-300 ease-in-out
        ${isLargeScreen 
          ? isOpen 
            ? 'translate-x-0 w-64' 
            : 'translate-x-0 w-16' 
          : isOpen 
            ? 'translate-x-0 w-full' 
            : 'translate-x-full'
        }
      `}
    >
      <div className="flex items-center justify-center px-2 py-4">
        <img
          src={logoSrc()}
          alt="Logo"
          className={`transition-all duration-300 ${isOpen ? 'w-36' : 'w-10'}`}
        />
      </div>

      <nav className={`px-2 overflow-y-auto h-full ${isOpen ? 'space-y-4 mt-4' : 'space-y-2 mt-4'}`}>
        {navItems.map(item => (
          <div key={item.id}>
            {!item.children ? (
              <NavLink
                to={item.to}
                onClick={handleClick}
                className={({ isActive }) =>
                  `flex items-center gap-3 p-2 rounded-md transition-colors
                  ${isActive
                    ? 'bg-navy-light text-white'
                    : 'hover:bg-yellow-100 hover:text-navy'
                  }`
                }
              >
                {item.icon}
                {isOpen && <span className="flex-1 text-right">{item.label}</span>}
              </NavLink>
            ) : (
              <>
                <button
                  onClick={() => { if (isOpen) toggleSection(item.id); }}
                  className={`flex items-center gap-3 p-2 w-full rounded-md transition-colors
                    ${activeSection === item.id
                      ? 'bg-navy-light text-white'
                      : 'hover:bg-yellow-100 hover:text-navy'
                    }`
                  }
                >
                  {item.icon}
                  {isOpen && (
                    <>
                      <span className="flex-1 text-right">{item.label}</span>
              <ChevronRight
  className={`w-4 h-4 transition-transform duration-300 ${activeSection === item.id ? 'rotate-90' : 'rotate-0'}`}
/>
                    </>
                  )}
                </button>
                {isOpen && activeSection === item.id && (
                  <div className="mr-4 border-r border-gray-600 pl-4 space-y-1">
                    {item.children.map(child => (
                      <NavLink
                        key={child.id}
                        to={child.to}
                        onClick={handleClick}
                        className={({ isActive }) =>
                          `flex items-center gap-2 p-2 rounded-md text-sm transition-colors
                          ${isActive
                            ? 'bg-navy-light text-white'
                            : 'hover:bg-navy-light hover:text-white'
                          }`
                        }
                      >
                        {child.icon}
                        <span>{child.label}</span>
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
