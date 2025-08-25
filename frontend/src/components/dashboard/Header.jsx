
import Notifications from '../common/DropdownNotifications';
import UserMenu from '../common/DropdownProfile';
import ThemeToggle from '../common/ThemeToggle';
import LanguageSwitcher from '../common/LanguageSwitcher';
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
        ${isOpen ? 'sm:mr-64' : 'sm:mr-16'}
        py-3 px-6 flex justify-between items-center
        bg-sidebar text-sidebar-foreground border-b border-sidebar-border shadow-lg z-20
      `}
    >
      <Button variant="ghost" size="icon" onClick={onToggleSidebar}>
        <Menu className="h-5 w-5" />
      </Button>

      <div className="flex items-center gap-3">
        <Notifications userId={user.id} align="right" />
        <ThemeToggle />
        <LanguageSwitcher />
        <div className="hidden sm:block w-px h-6 bg-border" />
        <UserMenu align="left" />
      </div>
    </nav>
  );
}
