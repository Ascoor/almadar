  import   { useState, useEffect ,useContext} from 'react'; 
 import { motion, AnimatePresence } from 'framer-motion';

  import { TooltipProvider } from "@/components/ui/tooltip";
  import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
  import { useLocation } from "react-router-dom";
import {NotificationProvider} from '../components/Notifications/NotificationContext';
  import Header from '../components/dashboard/Header';
  import Sidebar from '../components/dashboard/Sidebar';
  import AuthRoutes from '../components/layout/AuthRoutes'; 
import { AuthContext } from '@/components/auth/AuthContext';   
import EchoListener from '../components/EchoListener';
import AdminListener from '../components/AdminListener';
  const queryClient = new QueryClient();

  export default function AuthWrapper() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const location = useLocation();
  const { user } = useContext(AuthContext); 
// Demo function to simulate logging in a user
  const activateEcho = () => {
    setUserId(1); // Simulate user ID 1
    setIsEchoEnabled(true);
  };
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
       
      <NotificationProvider> 
   <AdminListener />  
   <EchoListener />  
   <div className="min-h-screen flex flex-col sm:flex-row relative">
    {/* Sidebar with slide animation */}
  <AnimatePresence initial={false} mode="wait">
    {sidebarOpen ? (
      <motion.div
        key="expanded-sidebar"
        initial={{ x: '-100%', opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: '-100%', opacity: 0 }}
        transition={{ type: 'spring', stiffness: 80, damping: 14 }}
      >
        <Sidebar
          isOpen={true}
          onToggle={toggleSidebar}
          onLinkClick={handleLinkClick}
        />
      </motion.div>
    ) : (
      // ✅ Sidebar in collapsed mode (no animation)
      <div key="mini-sidebar" className="hidden sm:block">
        <Sidebar
          isOpen={false}
          onToggle={toggleSidebar}
          onLinkClick={handleLinkClick}
        />
      </div>
    )}
  </AnimatePresence>

  {/* Main Content */}
  <div className="flex-1 flex flex-col">
    {/* Header Animation */}
    <motion.div
      key="header"
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 80, damping: 18 }}
    >
      <Header user={user.id} isOpen={sidebarOpen} onToggleSidebar={toggleSidebar} />
    </motion.div>

    {/* Main Area */}
    <motion.main
      key={location.pathname}
      initial={{ y: 60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 40, opacity: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className={`
        flex-1 pt-16 pb-8
        px-4 sm:px-6 lg:px-8
        ${sidebarOpen ? 'sm:mr-[280px]' : 'sm:mr-[80px]'}
      `}
    >
      <AuthRoutes />
    </motion.main>
  </div>
</div>

  </NotificationProvider>
        </TooltipProvider>
      </QueryClientProvider>
    );
  }
