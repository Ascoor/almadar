import React, { useState } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import Header from '../components/dashboard/Header';
import Sidebar from '../components/dashboard/Sidebar';
import AuthRoutes from '../components/layout/AuthRoutes';

const queryClient = new QueryClient();

const AuthWrapper = () => {
  const [sidebarExpanded, setSidebarExpanded] = useState(true);

  const toggleSidebar = () => {
    setSidebarExpanded((prev) => !prev);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <div className="min-h-screen bg-gray-50 dark:bg-background">
          <Header toggleSidebar={toggleSidebar} />
          <Sidebar isExpanded={sidebarExpanded} />
          <main className={`pt-16 transition-all duration-300 ${sidebarExpanded ? 'content-expanded' : 'content-collapsed'}`}>
            <AuthRoutes />
          </main>
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default AuthWrapper;
