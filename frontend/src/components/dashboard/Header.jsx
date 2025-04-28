import React from 'react';
import Notifications from '../common/DropdownNotifications';
import UserMenu from '../common/DropdownProfile';
import ThemeToggle from '../common/ThemeToggle';
import HeaderToggle from '../common/HeaderToggle';
import { useSidebar } from '../../utils/SidebarContext';
import { motion } from 'framer-motion';

const Header = () => {
  const { isSidebarOpen } = useSidebar();
  const headerVariants = {
    hidden: { y: '-100%', opacity: 0 },
    visible: {
      y: '0%',
      opacity: 1,
      transition: { type: 'spring', stiffness: 200, damping: 20 },
    },
  };

  return (
    <motion.header
      variants={headerVariants}
      initial="hidden"
      animate="visible"
      className={`fixed top-0 right-0 left-0 z-20 
        bg-gradient-to-r from-almadar-yellow-dark via-almadar-yellow to-almadar-green 
        dark:bg-gradient-to-l dark:from-almadar-green-darker dark:via-almadar-green-dark dark:to-almadar-green-dark
        border-b-4 border-almadar-green dark:border-white 
        shadow-md transition-all duration-300 ${isSidebarOpen ? 'md:mr-72' : 'md:mr-16'}
      `}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
        {/* زر فتح وقفل السايدبار */}
        <HeaderToggle />
        
        {/* أدوات التحكم الجانبية */}
        <div className="flex items-center space-x-6 space-x-reverse">
          <Notifications align="right" />
          <ThemeToggle />
          <hr className="w-px h-6 bg-almadar-green dark:bg-white/50 border-none" />
          <UserMenu align="left" />
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
