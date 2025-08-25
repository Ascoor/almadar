import React from 'react';
import { useSidebar } from '@/components/ui/sidebar';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

function HeaderToggle() {
  const { open, toggleSidebar } = useSidebar();
  const { isRTL } = useLanguage();

  const Icon = isRTL
    ? open
      ? ChevronRight
      : ChevronLeft
    : open
    ? ChevronLeft
    : ChevronRight;

  return (
    <button
      className="mr-2 text-sidebar-foreground hover:text-sidebar-primary transition-colors duration-300 ease-in-out"
      onClick={toggleSidebar}
      aria-controls="sidebar"
      aria-expanded={open}
    >
      <span className="sr-only">
        {open ? 'Close sidebar' : 'Open sidebar'}
      </span>
      <Icon className="w-6 h-6" />
    </button>
  );
}

export default HeaderToggle;
