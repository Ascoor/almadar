import React, { useState, useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";

import Header from '../components/dashboard/Header';
import Sidebar from '../components/dashboard/Sidebar';
import AuthRoutes from '../components/layout/AuthRoutes';

const queryClient = new QueryClient();

export default function AuthWrapper() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  // إغلاق الـ sidebar عند تغيير المسار على الشاشات الصغيرة
  useEffect(() => {
    if (window.innerWidth < 640) {
      setSidebarOpen(false);
    }
  }, [location.pathname]);

  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  const handleLinkClick = () => {
    if (window.innerWidth < 640) {
      setSidebarOpen(false);
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />

        <div className="min-h-screen flex relative">
          {/* Sidebar */}
          <Sidebar
            isOpen={sidebarOpen}
            onToggle={toggleSidebar}
            onLinkClick={handleLinkClick}
          />

          {/* Overlay على الجوال */}
          {sidebarOpen && (
            <div
              className="fixed inset-0 bg-black/50 z-20 sm:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          {/* Main Content */}
          <div className="flex-1 flex flex-col">
            <Header isOpen={sidebarOpen} onToggleSidebar={toggleSidebar} />
            <main
              className={`
                pt-16 transition-all duration-300 
                ${sidebarOpen ? 'sm:mr-72' : 'sm:mr-16'}
                dark:bg-gradient-to-r dark:from-navy-dark dark:via-destructive/  dark:to-popover-dark/40
                bg-gradient-to-r from-[#a0f2e5] to-[#ffffff]
              `}
            >
              <AuthRoutes />
            </main>
          </div>
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
