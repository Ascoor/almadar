import Notifications from '../common/DropdownNotifications';
import UserMenu from '../common/DropdownProfile';
import ThemeToggle from '../common/ThemeToggle';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { useMobileTheme } from '../MobileThemeProvider';

export default function Header({ isOpen, user, onToggleSidebar }) {
  const { isMobile, isStandalone, safeAreaInsets } = useMobileTheme();
  
  return (
    <nav
      dir="rtl"
      className={`
        fixed top-0 left-0 right-0
        transition-all duration-300
        ${isOpen && !isMobile ? 'sm:mr-64' : !isMobile ? 'sm:mr-16' : ''}
        ${isMobile ? 'px-4 py-2' : 'px-6 py-3'} 
        flex justify-between items-center
        bg-navy-light dark:bg-navy-dark 
        bg-gradient-to-l from-gold via-greenic/80 to-royal/80 
        dark:bg-gradient-to-l dark:from-royal-dark/30 dark:via-royal-dark/40 dark:to-greenic-dark/60
        text-gray-900 dark:text-white
        border-b border-gray-200 dark:border-navy-dark
        shadow-md dark:shadow-[0_01px_#16b8f640]
        z-20
        ${isStandalone ? 'standalone-header' : ''}
      `}
      style={{
        paddingTop: isStandalone && isMobile ? `max(${safeAreaInsets.top + 8}px, 1rem)` : undefined
      }}
    >
      <Button 
        variant="ghost" 
        size={isMobile ? "sm" : "icon"} 
        onClick={onToggleSidebar}
        className={`${isMobile ? 'px-2 py-1' : ''}`}
      >
        <Menu className={`text-white dark:text-greenic hover:text-greenic-light ${isMobile ? 'h-4 w-4' : 'h-5 w-5'}`} />
      </Button>
 
      <div className={`flex items-center ${isMobile ? 'gap-2' : 'gap-3'}`}>
        <Notifications userId={user.id} align="right" />
        <ThemeToggle />
        {!isMobile && <div className="hidden sm:block w-px h-6 bg-border" />}
        <UserMenu align="left" />
      </div>
    </nav>
  );
}