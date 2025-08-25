/**
 * HeaderBar.jsx
 * Top navigation bar with search, theme toggle, direction toggle and user menu.
 *
 * i18n keys:
 * 'dashboard.search', 'dashboard.toggleTheme', 'dashboard.toggleDir',
 * 'dashboard.notifications', 'dashboard.profile', 'dashboard.logout'
 */

import { useTranslation } from 'react-i18next';
import { Search, Bell, Languages, SunMoon, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';

/**
 * @param {{ user: { name: string }, onThemeToggle?: () => void, onDirToggle?: () => void }} props
 */
export default function HeaderBar({ user, onThemeToggle, onDirToggle }) {
  const { t } = useTranslation();
  return (
    <header className="flex items-center justify-between gap-4">{/* breadcrumb slot left intentionally empty */}
      <div className="flex-1 max-w-xs relative">
        <Search className="absolute top-2 ms-2 h-4 w-4 text-muted" />
        <Input
          type="search"
          placeholder={t('dashboard.search')}
          className="ps-8"
          aria-label={t('dashboard.search')}
        />
      </div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={onThemeToggle} aria-label={t('dashboard.toggleTheme')}>
          <SunMoon className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" onClick={onDirToggle} aria-label={t('dashboard.toggleDir')}>
          <Languages className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" aria-label={t('dashboard.notifications')}>
          <Bell className="h-5 w-5" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" aria-label={user?.name}>
              <User className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem>{t('dashboard.profile')}</DropdownMenuItem>
            <DropdownMenuItem>{t('dashboard.logout')}</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
