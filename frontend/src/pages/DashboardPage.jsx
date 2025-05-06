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

  // Close sidebar on mobile whenever the route changes
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

        <div className="min-h-screen flex  ">
          {/* Sidebar */}
          <Sidebar
            isOpen={sidebarOpen}
            onToggle={toggleSidebar}
            onLinkClick={handleLinkClick}
          />

          <div className="flex-1 flex flex-col">
            <Header     isOpen={sidebarOpen} onToggleSidebar={toggleSidebar} />
          {/* Main Content */}
            <main
      className={`pt-16  transition-all duration-300 ${
        sidebarOpen ? 'content-expanded' : 'content-collapsed'
      } 
      dark:bg-gradient-to-r  dark:from-navy-dark dark:via-navy/30 dark:to-accent-dark
      bg-gradient-to-r from-[#a0f2e5] to-[#ffffff]`}
    >
      <AuthRoutes />
            </main>
          </div>
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
