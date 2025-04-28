import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useSidebar } from '../../utils/SidebarContext';
import { motion, AnimatePresence } from 'framer-motion';
import { LogoArt, LogoText } from '../../assets/images';
import {
  FaHome, FaUsers, FaBars, FaHandshake, FaUniversity,
  FaBalanceScale, FaFeatherAlt, FaGavel, FaFileContract,
  FaChevronDown, FaChevronRight
} from 'react-icons/fa';
import { IoMdClose } from 'react-icons/io';

const Sidebar = () => {
  const { isSidebarOpen, setIsSidebarOpen, isMobile } = useSidebar();
  const [openMenus, setOpenMenus] = useState({});

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const toggleMenu = (index) => setOpenMenus((prev) => ({ ...prev, [index]: !prev[index] }));

  const sidebarVariants = {
    open: {
      width: isMobile ? '100%' : '18rem',
      opacity: 1,
      x: 0,
      transition: { type: 'spring', stiffness: 300, damping: 30 },
    },
    closed: {
      width: isMobile ? '0' : '4rem',
      opacity: 0.9,
      y: '0%',
      transition: { type: 'spring', stiffness: 300, damping: 30 },
    },
  };

  const menuItems = [
    { label: 'الرئيسية', to: '/', icon: <FaHome /> },
    { label: 'قسم التعاقدات', to: '/contracts', icon: <FaFileContract /> },
    {
      label: 'قسم الرأي والفتوى', icon: <FaBalanceScale />, children: [
        { to: '/legal/investigations', label: 'وحدة التحقيقات', icon: <FaFeatherAlt /> },
        { to: '/legal/consultations', label: 'وحدة المشورة القانونية', icon: <FaBalanceScale /> },
        { to: '/legal/litigations', label: 'وحدة التقاضي', icon: <FaGavel /> },
      ],
    },
    { label: 'المستخدمين', to: '/users', icon: <FaUsers /> },
  ];

  const getLinkClasses = (isActive, isOpen) =>
    `flex items-center w-full p-3 rounded-lg transition-all duration-300 ease-in-out
    ${isOpen ? 'space-x-4' : 'justify-center'}
    ${isActive
      ? 'bg-almadar-yellow-light text-almadar-gray-dark font-bold'
      : 'text-gray-100 dark:text-gray-300 hover:bg-almadar-green-light hover:text-almadar-yellow dark:hover:bg-yellow-400 dark:hover:text-black'
    }
    group-hover:scale-105`;

  return (
    <motion.div
      variants={sidebarVariants}
      initial="closed"
      animate={isSidebarOpen ? 'open' : 'closed'}
      className={`fixed top-0 right-0 h-full z-30 flex flex-col shadow-lg
        bg-gradient-to-b from-almadar-green via-almadar-green-dark to-almadar-yellow-dark
        dark:bg-gradient-to-b dark:from-almadar-green-darker dark:via-almadar-green-dark dark:to-almadar-green-darker
        ${isMobile ? (isSidebarOpen ? 'w-full' : 'w-0') : 'w-16 md:w-72'}
      `}
    >
      <div className="flex items-center justify-center h-16">
        <img
          src={isSidebarOpen ? LogoText : LogoArt}
          alt="Logo"
          className={isSidebarOpen ? 'w-28 h-20 mt-4' : 'w-12 h-12 mt-2'}
        />
      </div>

      <ul className={`mt-6 flex-1 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 md:opacity-100'} transition-all`}>
        {menuItems.map((item, index) => (
          <li key={index} className="group">
            {item.children ? (
              <>
                <button
                  onClick={() => toggleMenu(index)}
                  className="flex items-center w-full p-3 font-bold text-gray-100 hover:bg-almadar-green-light rounded-lg transition"
                >
                  <span className="text-xl ml-2 text-gray-300">{item.icon}</span>
                  {isSidebarOpen && (
                    <>
                      <span className="flex-1 text-center">{item.label}</span>
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
                      className="ml-6 overflow-hidden"
                    >
                      {item.children.map((child, childIndex) => (
                        <li key={childIndex}>
                          <NavLink
                            to={child.to}
                            onClick={() => setIsSidebarOpen(false)}
                            className={({ isActive }) => getLinkClasses(isActive, isSidebarOpen)}
                          >
                            <span className="text-lg text-gray-300">{child.icon}</span>
                            {isSidebarOpen && (
                              <span className="flex-1 text-center">{child.label}</span>
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
                className={({ isActive }) => getLinkClasses(isActive, isSidebarOpen)}
              >
                <span className="text-xl text-gray-300">{item.icon}</span>
                {isSidebarOpen && (
                  <span className="flex-1 text-center">{item.label}</span>
                )}
              </NavLink>
            )}
          </li>
        ))}
      </ul>

      <button
        onClick={toggleSidebar}
        className="absolute bottom-6 right-4 p-2 hidden md:block bg-indigo-700 dark:bg-purple-500/50 text-white rounded-full hover:bg-indigo-500 dark:hover:bg-yellow-500 shadow-lg transition-all transform hover:scale-110"
      >
        {isSidebarOpen ? <IoMdClose className="text-2xl" /> : <FaBars className="text-2xl" />}
      </button>
    </motion.div>
  );
};

export default Sidebar;
