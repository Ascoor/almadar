import { Menu, PanelLeftOpen, PanelLeftClose } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Notifications from '@/components/common/DropdownNotifications';
import UserMenu from '@/components/common/DropdownProfile';
import ThemeToggle from '@/components/common/ThemeToggle';
import LanguageToggle from '@/components/common/LanguageToggle';
import { LogoNewArt } from '@/assets/images';
import { useLanguage } from '@/context/LanguageContext';
import { useIsMobile } from '@/hooks/use-mobile';

export default function Header({
  user,
  isSidebarExpanded,
  sidebarOffset = '0px',
  onToggleSidebar,
  onOpenMobile,
}) {
  const { dir } = useLanguage();
  const isMobile = useIsMobile();

  return (
    <header
      id="app-header"
      dir={dir}
      style={{ paddingInlineStart: sidebarOffset }}
      className="fixed top-0 inset-x-0 z-40 border-b border-border/70 bg-[color:var(--sidebar-bg)]/80 backdrop-blur-xl"
    >
      <div className="flex h-16 items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={isMobile ? onOpenMobile : onToggleSidebar}
            aria-label={isMobile ? 'Open menu' : 'Toggle sidebar'}
          >
            {isMobile ? (
              <Menu className="h-5 w-5" />
            ) : isSidebarExpanded ? (
              <PanelLeftClose className="h-5 w-5" />
            ) : (
              <PanelLeftOpen className="h-5 w-5" />
            )}
          </Button>

          <div className="flex items-center gap-3">
            <img
              src={LogoNewArt}
              alt="Almadar"
              className="h-9 w-auto"
            />
            <div className="hidden sm:block">
              <p className="text-sm font-semibold text-fg">المدار القانوني</p>
              <p className="text-xs text-muted-foreground">Legal Luminary UI</p>
            </div>
          </div>
        </div>

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
