import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Home, FileText, Users, FolderArchive, Scale,
  Feather, Gavel, ChevronDown
} from 'lucide-react';
import { LogoArt, LogoPatren, WelcomeLogo } from '../../assets/images';

const Sidebar = ({ isExpanded }) => {
  const location = useLocation();
  const currentPath = location.pathname;
  const [activeSection, setActiveSection] = useState(null);

  const navItems = [
    { id: 'home', label: 'الرئيسية', to: '/', icon: <Home size={18} /> },
    { id: 'contracts', label: 'قسم التعاقدات', to: '/contracts', icon: <FileText size={18} /> },
    {
      id: 'fatwa',
      label: 'قسم الرأي والفتوى',
      icon: <Scale size={18} />,
      children: [
        { id: 'investigations', label: 'وحدة التحقيقات', to: '/legal/investigations', icon: <Feather size={16} /> },
        { id: 'advices', label: 'المشورة القانونية', to: '/legal/legal-advices', icon: <Scale size={16} /> },
        { id: 'litigation', label: 'وحدة التقاضي', to: '/legal/litigations', icon: <Gavel size={16} /> },
      ],
    },
    { id: 'users', label: 'المستخدمين', to: '/users', icon: <Users size={18} /> },
    { id: 'archive', label: 'الأرشيف', to: '/archive', icon: <FolderArchive size={18} /> },
  ];

  const toggleSection = (id) => {
    setActiveSection((prev) => (prev === id ? null : id));
  };

  return (
    <aside
      dir="rtl"
      className={`  border border-blue-200
 
      dark:text-foreground dark:ring-2 dark:ring-mint-500 
      dark:shadow-[0_0_10px_#66ffcc40] bg-card text-card-foreground border-r border-border h-screen fixed top-0 right-0 pt-16 transition-all duration-300  
        ${isExpanded ? 'sidebar-expanded w-72' : 'sidebar-collapsed w-16'}`}
    >
<div className="flex justify-center items-center h-20">
  <img
    src={WelcomeLogo}
    alt="Logo"
    className={`transition-all duration-300 object-contain
      ${isExpanded ? 'w-32 h-19 mt-24' : 'w-16 h-16 mt-12'}`}
  />
</div>

      {/* القائمة */}
      <div className={`flex flex-col   p-4 space-y-2  ${isExpanded ? ' mt-16' : 'mt-4'}`}>
        {navItems.map((item) => (
          <div key={item.id} className="flex flex-col">
            {item.children ? (
              <>
                <button
                  onClick={() => isExpanded && toggleSection(item.id)}
                  className={`flex items-center gap-3 p-2 rounded-md hover:bg-navy-light transition-colors ${
                    currentPath.includes(item.to) || activeSection === item.id ? 'bg-navy-light' : ''
                  }`}
                >
                  {item.icon}
                  {isExpanded && (
                    <>
                      <span className="flex-1 text-right">{item.label}</span>
                      <ChevronDown className={`w-4 h-4 transition-transform ${activeSection === item.id ? 'rotate-180' : ''}`} />
                    </>
                  )}
                </button>

                {isExpanded && activeSection === item.id && (
                  <div className="mt-1 mr-4 border-r border-gray-600 pr-4 space-y-1">
                    {item.children.map((child) => (
                      <NavLink
                        key={child.id}
                        to={child.to}
                        className={({ isActive }) =>
                          `block p-2 text-sm rounded transition-colors ${
                            isActive
                              ? 'bg-navy-light text-white'
                              : 'text-gray-300 hover:text-white hover:bg-navy-light'
                          }`
                        }
                      >
                        <div className="flex items-center gap-2">
                          {child.icon}
                          <span>{child.label}</span>
                        </div>
                      </NavLink>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 p-2 rounded-md hover:bg-navy-light transition-colors ${
                    isActive ? 'bg-navy-light' : ''
                  }`
                }
              >
                {item.icon}
                {isExpanded && <span className="flex-1 text-right">{item.label}</span>}
              </NavLink>
            )}
          </div>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;
