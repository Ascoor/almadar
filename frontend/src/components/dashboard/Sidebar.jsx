import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useSidebar } from '../../utils/SidebarContext';
import { motion, AnimatePresence } from 'framer-motion';
import { LogoArt, LogoPatren } from '../../assets/images';
import {
  FaHome, FaUsers, FaBars, FaHandshake, FaArchive,
  FaBalanceScale, FaFeatherAlt, FaGavel, FaFileContract,
  FaChevronDown, FaChevronRight
} from 'react-icons/fa';
import { IoMdClose } from 'react-icons/io';

const Sidebar = () => {
  const { isSidebarOpen, setIsSidebarOpen, isMobile } = useSidebar();
  const [openMenus, setOpenMenus] = useState({});

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const toggleMenu = (index) =>
    setOpenMenus((prev) => ({ ...prev, [index]: !prev[index] }));

  const sidebarVariants = {
    open: { width: isMobile ? '100%' : '18rem' },
    closed: { width: isMobile ? '0' : '4rem' },
  };

  const menuItems = [
    { label: 'الرئيسية', to: '/', icon: <FaHome /> },
    { label: 'قسم التعاقدات', to: '/contracts', icon: <FaFileContract /> },
    {
      label: 'قسم الرأي والفتوى',
      icon: <FaBalanceScale />,
      children: [
        { to: '/legal/investigations', label: 'وحدة التحقيقات', icon: <FaFeatherAlt /> },
        { to: '/legal/legal-advices', label: 'المشورة القانونية', icon: <FaBalanceScale /> },
        { to: '/legal/litigations', label: 'وحدة التقاضي', icon: <FaGavel /> },
      ],
    },
    { label: 'المستخدمين', to: '/users', icon: <FaUsers /> },
    { label: 'الأرشيف', to: '/archive', icon: <FaArchive /> },
  ];

  const getLinkClasses = (isActive) =>
    `flex items-center w-full p-3 rounded-lg transition-all duration-300 ${
      isActive
        ? 'bg-almadar-sidebar-accent text-almadar-sidebar-dark font-bold'
        : 'text-white  hover:bg-almadar-sidebar-dark hover:text-almadar-sand dark:hover:bg-almadar-sidebar-dark  dark:hover:text-almadar-sand dark:text-almadar-mint-light'
    }`;

  return (
    <motion.div
      variants={sidebarVariants}
      initial="closed"
      animate={isSidebarOpen ? 'open' : 'closed'}
      className={`fixed top-0 right-0 h-full z-30 flex flex-col bg-gradient-to-b from-almadar-sidebar via-almadar-sidebar to-almadar-sidebar-light
      dark:from-almadar-blue-dark dark:via-almadar-blue-dark  dark:to-almadar-sidebar-dark ransition-all duration-500`}
    >
      {/* Logo */}
      <div className="flex items-center justify-center h-20">
        <img
          src={isSidebarOpen ? LogoPatren : LogoArt}
          alt="Logo"
          className={isSidebarOpen ? 'w-21 h-16' : 'w-16 h-16'}
        />
      </div>

      {/* Menu Items */}
      <ul className="flex-1 mt-4 space-y-1 px-2 overflow-y-auto">
        {menuItems.map((item, index) => (
          <li key={index}>
            {item.children ? (
              <>
                <button
                  onClick={() => toggleMenu(index)}
                  className="w-full flex items-center p-3 text-white hover:bg-almadar-sidebar-dark hover:text-almadar-sand rounded-lg transition group"
                >
                  <span className="text-xl">{item.icon}</span>
                  {isSidebarOpen && (
                    <>
                      <span className="flex-1 text-center text-sm font-medium">
                        {item.label}
                      </span>
                      {openMenus[index] ? <FaChevronDown /> : <FaChevronRight />}
                    </>
                  )}
                </button>
                <AnimatePresence>
                  {openMenus[index] && (
                    <motion.ul
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="ml-6"
                    >
                      {item.children.map((child, i) => (
                        <li key={i}>
                          <NavLink
                            to={child.to}
                            className={({ isActive }) => getLinkClasses(isActive)}
                            onClick={() => setIsSidebarOpen(false)}
                          >
                            <span className="text-lg">{child.icon}</span>
                            {isSidebarOpen && (
                              <span className="flex-1 text-center text-sm">{child.label}</span>
                            )}
                          </NavLink>
                        </li>
                      ))}
                    </motion.ul>
                  )}
                </AnimatePresence>
              </>
            ) : (
              <NavLink
                to={item.to}
                onClick={() => setIsSidebarOpen(false)}
                className={({ isActive }) => getLinkClasses(isActive)}
              >
                <span className="text-xl">{item.icon}</span>
                {isSidebarOpen && (
                  <span className="flex-1 text-center text-sm">{item.label}</span>
                )}
              </NavLink>
            )}
          </li>
        ))}
      </ul>

      {/* Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="absolute bottom-6 right-4 p-2 hidden md:block bg-almadar-sidebar-dark text-white rounded-full hover:bg-almadar-sidebar transition transform hover:scale-105"
      >
        {isSidebarOpen ? <IoMdClose className="text-2xl" /> : <FaBars className="text-2xl" />}
      </button>
    </motion.div>
  );
};

export default Sidebar;
