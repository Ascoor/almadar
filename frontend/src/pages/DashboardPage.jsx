import React from 'react';
import Sidebar from '../components/dashboard/Sidebar';
import Header from '../components/dashboard/Header';
import { useSidebar } from '../utils/SidebarContext';
import AuthRoutes from '../components/layout/AuthRoutes';
import { motion } from 'framer-motion';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AuthWrapper = () => {
  const { isSidebarOpen, isMobile, isTablet } = useSidebar();

  const sidebarWidth = isMobile
    ? isSidebarOpen
      ? '100%'
      : '0'
    : isTablet
      ? isSidebarOpen
        ? '14rem'
        : '5rem'
      : isSidebarOpen
        ? '18rem'
        : '5rem';

  return (
    <motion.div
      className="relative h-screen flex flex-col md:flex-row font-['Tajawal'] transition-all duration-500 ease-in-out
        bg-gradient-to-br from-almadar-blue-light via-white to-almadar-sky
        dark:bg-gradient-to-b dark:from-almadar-blue-dark dark:via-almadar-blue-dark/90 dark:to-almadar-blue-dark"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Sidebar */}
      <motion.div
        style={{ width: sidebarWidth }}
        className="transition-all duration-500 ease-in-out shadow-xl dark:shadow-gray-900/60"
        initial={{ x: '-100%' }}
        animate={{ x: '0%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        <Sidebar />
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col transition-all duration-500 ease-in-out">
        {/* Header */}
        <motion.div
          className="shadow-md dark:shadow-black border-b border-yellow-200 dark:border-gray-700"
          initial={{ y: '-100%' }}
          animate={{ y: '0%' }}
          transition={{ type: 'spring', stiffness: 200, damping: 25 }}
        >
          <Header />
        </motion.div>

        {/* AuthRoutes Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-white/30 dark:bg-almadar-blue-dark/90 transition-colors">
          {/* Positioned Toast Container */}
          <ToastContainer
  position="top-right"
  autoClose={3000}
  hideProgressBar
  newestOnTop
  closeOnClick
  rtl
  pauseOnFocusLoss
  draggable
  pauseOnHover
  className="z-[9999] fixed top-16 right-4 w-[300px]"
  toastClassName="bg-white dark:bg-gray-800 text-sm font-semibold shadow-md dark:text-white"
/>

          <div className="w-full flex justify-center">
            <main className="w-full max-w-screen-xl p-4 md:p-6 lg:p-8 bg-white/80 dark:bg-gray-800/60 shadow-lg rounded-lg backdrop-blur-md">
              <AuthRoutes />
            </main>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AuthWrapper;
