import React from 'react';
import { motion } from 'framer-motion';
import { Menu } from 'lucide-react';
import { useSidebar } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';

function HeaderToggle() {
  const { open, toggleSidebar } = useSidebar();

  return (
    <Button
      variant="ghost"
      size="icon"
      className="text-white mr-2 hover:text-almadar-sidebar-danger dark:text-almadar-mint-light dark:hover:text-almadar-sand transition-colors duration-300 ease-in-out"
      onClick={toggleSidebar}
      aria-controls="sidebar"
      aria-expanded={open}
      aria-label={open ? 'Close sidebar' : 'Open sidebar'}
    >
      <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.3 }}>
        <Menu className="w-6 h-6" />
      </motion.div>
    </Button>
  );
}

export default HeaderToggle;
