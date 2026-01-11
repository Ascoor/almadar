import { SidebarTrigger, useSidebar } from '@/components/ui/sidebar';
import Notifications from '@/components/common/DropdownNotifications';
import UserMenu from '@/components/common/DropdownProfile';
import ThemeToggle from '@/components/common/ThemeToggle';
import LanguageToggle from '@/components/common/LanguageToggle';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { useNetworkStatus } from '@/context/NetworkStatusContext';
import { cn } from '@/lib/utils';

export default function Header() {
  const { user } = useAuth();
  const { dir, lang } = useLanguage();
  const { isOnline } = useNetworkStatus();
  const { isMobile, state } = useSidebar();
  const isCollapsed = state === 'collapsed';
  const greeting = lang === 'ar' ? 'مرحباً بعودتك' : 'Welcome back';
  const statusLabel = isOnline
    ? lang === 'ar'
      ? 'متصل'
      : 'Online'
    : lang === 'ar'
      ? 'غير متصل'
      : 'Offline';
  const sidebarOffset = isMobile ? '0rem' : isCollapsed ? '4rem' : '16rem';
  const insetStyle =
    dir === 'rtl'
      ? { right: sidebarOffset, left: '0rem' }
      : { left: sidebarOffset, right: '0rem' };

  return (
    <header
      id="app-header"
      dir={dir}
      className={cn(
        'fixed top-0 z-30 h-16 border-b border-border/70 bg-background/80 backdrop-blur-xl transition-[left,right] duration-300 ease-linear motion-reduce:transition-none',
      )}
      style={insetStyle}
    >
      <div className="flex h-full items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <SidebarTrigger
            aria-label="Toggle sidebar"
            className="md:hidden"
          />
          <div className="hidden md:flex flex-col">
            <span className="text-xs text-muted-foreground">{greeting}</span>
            <span className="text-sm font-semibold text-fg">
              {user?.name || user?.email || (lang === 'ar' ? 'زائر' : 'Guest')}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <Badge
            className={cn(
              'hidden sm:inline-flex border-transparent px-2 text-xs',
              isOnline
                ? 'bg-emerald-500/10 text-emerald-600'
                : 'bg-rose-500/10 text-rose-600',
            )}
          >
            {statusLabel}
          </Badge>
          <Notifications />
          <ThemeToggle />
          <LanguageToggle />
          <div className="hidden sm:block w-px h-6 bg-border" />
          <UserMenu align="left" />
        </div>
      </div>
    </header>
  );
}
