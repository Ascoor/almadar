  import   { useState, useEffect } from 'react'; 
  import { Toaster } from 'sonner';
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
    <Toaster
      position="top-center"
      theme="system"
      duration={3000}
      closeButton
      toastOptions={{
        style: { borderRadius: '10px', background: '#1f2937', color: 'white' },
      }}
    />
  
<div className="min-h-screen flex flex-col sm:flex-row relative">
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
    flex-1 pt-16 px-4 sm:px-6 md:px-8 transition-all duration-300
    ${sidebarOpen ? 'sm:mr-[280px]' : 'sm:mr-[80px]'}
    bg-gradient-to-tr from-[#a0f2e5] via-[#f5fefd] to-[#ffffff] 
    dark:bg-gradient-to-tr dark:from-navy-dark dark:via-[#1e293b] dark:to-[#0f172a]
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
