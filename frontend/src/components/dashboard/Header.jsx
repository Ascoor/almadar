
import Notifications from '../common/DropdownNotifications';
import UserMenu from '../common/DropdownProfile';
import ThemeToggle from '../common/ThemeToggle';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function Header({ isOpen, user, onToggleSidebar }) {
  const { dir, toggleLanguage, lang } = useLanguage();

  return (
    <nav
      dir={dir}
      className={`
        fixed top-0 left-0 right-0
        transition-all duration-300
        ${isOpen
          ? dir === 'rtl'
            ? 'sm:mr-64'
            : 'sm:ml-64'
          : dir === 'rtl'
          ? 'sm:mr-16'
          : 'sm:ml-16'}
        py-3 px-6 flex justify-between items-center
        bg-card text-fg
        border-b border-border shadow-md
        z-20
      `}
    >
      <Button variant="ghost" size="icon" onClick={onToggleSidebar}>
        <Menu className="h-5 w-5 text-fg hover:text-primary" />
      </Button>

      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={toggleLanguage}>
          {lang === 'ar' ? 'EN' : 'AR'}
        </Button>
        <Notifications userId={user.id} align={dir === 'rtl' ? 'right' : 'left'} />
        <ThemeToggle />
        <div className="hidden sm:block w-px h-6 bg-border" />
        <UserMenu align={dir === 'rtl' ? 'left' : 'right'} />
      </div>
    </nav>
  );
}
