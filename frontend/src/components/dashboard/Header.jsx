
import Notifications from '../common/DropdownNotifications';
import UserMenu from '../common/DropdownProfile';
import ThemeToggle from '../common/ThemeToggle';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';

export default function Header({ isOpen, onToggleSidebar }) {
  
  return (
    <nav
      dir="rtl"
      className={`
        fixed top-0 left-0 right-0
        transition-all duration-300
        ${isOpen ? 'sm:mr-64' : 'sm:mr-16'}
        py-3 px-6 flex justify-between items-center
        bg-white dark:bg-black
        bg-gradient-to-l from-gold/70 via-navy/80 to-navy-light/80 
             dark:bg-gradient-to-r dark:from-navy-dark/70 dark:via-navy-dark/40 dark:to-reded-dark/40
        text-gray-900 dark:text-white
        border-b border-gray-200 dark:border-navy-dark
        shadow-md dark:shadow-[0_0_10px_#14b8a640]
        z-20
      `}
    >
      {/* زر الفتح/الإغلاق */}
      <Button variant="ghost" size="icon" onClick={onToggleSidebar}>
        <Menu className="h-5 w-5" />
      </Button>

      {/* أدوات التحكم */}
      <div className="flex items-center gap-3">
        <Notifications align="right" />
        <ThemeToggle />
        <div className="hidden sm:block w-px h-6 bg-border" />
        <UserMenu align="left" />
      </div>
    </nav>
  );
}
