
import Notifications from '../common/DropdownNotifications';
import UserMenu from '../common/DropdownProfile';
import ThemeToggle from '../common/ThemeToggle';
import LanguageToggle from '../common/LanguageToggle';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function Header({ isOpen, user, onToggleSidebar }) {
  const { dir } = useLanguage();

  return (
    <nav
      dir={dir}
      className={`
        fixed top-0 left-0 right-0
        transition-all duration-300
        ${isOpen ? 'lg:mr-64' : 'lg:mr-16'}
        py-3 px-6 flex justify-between items-center
        bg-gradient-to-l from-primary via-secondary to-accent
        dark:from-accent dark:via-secondary dark:to-primary
        text-fg
        border-b border-border
        shadow-md
        z-20
      `}
    >
  


      <Button variant="ghost" size="icon" onClick={onToggleSidebar}>
        <Menu className="text-white dark:text-greenic h-5 w-5 hover:text-greenic-light" />
      </Button>
 
      <div className="flex items-center gap-3">
        <Notifications userId={user.id} align="right" />
        <ThemeToggle />
        <LanguageToggle />
        <div className="hidden sm:block w-px h-6 bg-border" />
        <UserMenu align="left" />
      </div>
    </nav>
  );
}
