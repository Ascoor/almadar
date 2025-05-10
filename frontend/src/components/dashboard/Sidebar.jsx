import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import {
  Home, FileText, Users, FolderArchive, Scale,
  Feather, Gavel, ChevronDown
} from 'lucide-react';
import { LogoArt, WelcomeLogo, WelcomeLogoWhite } from '../../assets/images';
import { useThemeProvider } from '../../utils/ThemeContext';

export default function Sidebar({ isOpen, onToggle, onLinkClick }) {
  const [activeSection, setActiveSection] = useState(null);
  const { currentTheme } = useThemeProvider();
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 640);

  useEffect(() => {
    const handleResize = () => setIsLargeScreen(window.innerWidth >= 640);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const logoSrc = () => {
    if (!isOpen && isLargeScreen) {
      return LogoArt; // شعار ثابت عند الإغلاق الكبير
    }
    return currentTheme === 'dark' ? WelcomeLogoWhite : WelcomeLogo;
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
        fixed right-0 top-0 h-full z-30  
        bg-gradient-to-b from-gold/40 via-royal-dark to-navy-dark/90
        dark:bg-gradient-to-br dark:from-royal-dark/70 dark:via-royal/40 dark:to-reded/40
        text-green-100/95  border-l border-border
        dark:ring-2 dark:ring-mint-500 dark:shadow-[0_0_10px_#66ffcc40]
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
                    ? 'bg-navy-light text-white dark:bg-accent'
                    : 'hover:bg-yellow-100 hover:text-navy dark:hover:bg-navy-light dark:text-yellow-100'}`
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
                      : 'hover:bg-yellow-100 hover:text-navy'}`}
                >
                  {item.icon}
                  {isOpen && (
                    <>
                      <span className="flex-1 text-right">{item.label}</span>
                      <ChevronDown
                        className={`w-4 h-4 transition-transform ${activeSection === item.id ? 'rotate-180' : ''}`}
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
                            : 'hover:bg-navy-light hover:text-white'}`}
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
