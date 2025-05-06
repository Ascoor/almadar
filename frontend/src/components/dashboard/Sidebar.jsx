import React, { useState,useEffect  } from 'react';
import { NavLink } from 'react-router-dom';
import {
  Home, FileText, Users, FolderArchive, Scale,
  Feather, Gavel, ChevronDown
} from 'lucide-react';

export default function Sidebar({ isOpen, onToggle, onLinkClick }) {
  const [activeSection, setActiveSection] = useState(null);
  const navItems = [
    { id: 'home',      label: 'الرئيسية',        to: '/',                      icon: <Home size={18}/> },
    { id: 'contracts', label: 'التعاقدات',       to: '/contracts',             icon: <FileText size={18}/> },
    {
      id: 'fatwa',
      label: 'الرأي والفتوى',
      icon: <Scale size={18}/> ,
      children: [
        { id: 'inv',  label: 'التحقيقات',        to: '/legal/investigations', icon: <Feather size={16}/> },
        { id: 'adv',  label: 'المشورة القانونية', to: '/legal/legal-advices',  icon: <Scale size={16}/> },
        { id: 'lit',  label: 'التقاضي',           to: '/legal/litigations',    icon: <Gavel size={16}/> },
      ]
    },
    { id: 'users',   label: 'المستخدمين',       to: '/users',                icon: <Users size={18}/> },
    { id: 'archive', label: 'الأرشيف',         to: '/archive',              icon: <FolderArchive size={18}/> },
  ];

  const toggleSection = id => {
    setActiveSection(prev => prev === id ? null : id);
  };
 
  return (
    <aside
      dir="rtl"
      className={`
        
         bg-gradient-to-t from-navy/80 via-primary/250 to-accent/10
       dark:bg-gradient-to-b dark:from-accent/50 dark:via-navy-dark dark:to-navy/20 dark:text-navy 
        fixed top-2 right-0 h-full z-30 mt-16
        text-card-foreground border-r border-border
        dark:ring-2 dark:ring-mint-500 dark:shadow-[0_0_10px_#66ffcc40]
        transform transition-transform duration-300
        ${isOpen 
          ? 'translate-x-0 w-full sm:w-72' 
          : 'translate-x-full sm:translate-x-0 sm:w-16'}
      `}
    >
 

      {/* Navigation */}
      <nav className={`px-2 ${isOpen ? 'space-y-4 mt-4' : 'space-y-2 mt-4'}`}>
        {navItems.map(item => (
          <div key={item.id}>
            {!item.children ? (
              <NavLink
                to={item.to}
                onClick={onLinkClick}
                className={({ isActive }) =>
                  `flex items-center text-center gap-3 p-2 rounded-md transition-colors
                    ${isActive 
                      ? 'bg-navy-light text-white dark:bg-accent dark-text-green-400' 
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
                  className={`
                    flex items-center gap-3 p-2 w-full rounded-md transition-colors
                    ${activeSection === item.id 
                      ? 'bg-navy-light text-white' 
                      : 'hover:bg-yellow-100 hover:text-navy'}` 
                  }
                >
                  {item.icon}
                  {isOpen && (
                    <>
                      <span className="flex-1 text-right">{item.label}</span>
                      <ChevronDown
                        className={`w-4 h-4 transition-transform 
                          ${activeSection === item.id ? 'rotate-180' : ''}`}
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
                        onClick={onLinkClick}
                        className={({ isActive }) =>
                          `flex items-center gap-2 p-2 rounded-md text-sm transition-colors
                            ${isActive 
                              ? 'bg-navy-light text-white' 
                              : 'hover:bg-navy-light hover:text-white'}` 
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
