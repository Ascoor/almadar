import { SidebarTrigger } from '@/components/ui/sidebar';
import Notifications from '@/components/common/DropdownNotifications';
import UserMenu from '@/components/common/DropdownProfile';
import ThemeToggle from '@/components/common/ThemeToggle';
import LanguageToggle from '@/components/common/LanguageToggle';
import { useLanguage } from '@/context/LanguageContext';

export default function Header({ user }) {
  const { dir } = useLanguage();

  return (
    <header
      id="app-header"
      dir={dir}
      className="sticky top-0 z-30 border-b border-border/70 bg-[color:var(--sidebar-bg)]/80 backdrop-blur-xl"
    >
      <div className="flex h-16 items-center justify-between px-4 sm:px-6">
        <SidebarTrigger aria-label="Toggle sidebar" />

        <div className="flex items-center gap-2 sm:gap-3">
          <Notifications userId={user?.id} align="right" />
          <ThemeToggle />
          <LanguageToggle />
          <div className="hidden sm:block w-px h-6 bg-border" />
          <UserMenu align="left" />
        </div>
      </div>
    </header>
  );
}
