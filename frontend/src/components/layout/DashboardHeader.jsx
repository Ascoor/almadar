import  { useState } from 'react';
import Notifications from '../common/DropdownNotifications';
import UserMenu from '../common/DropdownProfile';
import ThemeToggle from '../common/ThemeToggle';
import LanguageToggle from '../common/LanguageToggle';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function Header({ isOpen, user, onToggleSidebar }) {
  const { dir } = useLanguage();
  const [isDark] = useState(() => {
    const root = document.documentElement;
    return root.classList.contains('dark') || root.getAttribute('data-theme') === 'dark';
  });

  const marginClass = isOpen
    ? dir === 'rtl'
      ? 'lg:mr-64'
      : 'lg:ml-64'
    : dir === 'rtl'
      ? 'lg:mr-16'
      : 'lg:ml-16';

  return (
    <nav
      dir={dir}
     style={{
  boxShadow: isDark
    ? '0 10px 30px -10px rgba(34,211,238,0.35)'  // إضاءة للأسفل فقط
    : '0 6px 12px -4px rgba(0,0,0,0.1)'          // ظل خفيف للأسفل فقط
}}
 className={`
        fixed top-0 left-0 right-0
        transition-all duration-300
        ${marginClass}
        py-3 px-6 flex justify-between items-center
        bg-sidebar
        text-gray-900 dark:text-white
        dark:border-navy-dark
        shadow-md dark:shadow-[0_01px_#16b8f640]
        z-30
      `}
    >
      <Button variant="ghost" size="icon" onClick={onToggleSidebar}>
        <Menu className="text-freen-900 dark:text-greenic h-5 w-5 hover:text-greenic-light" />
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
