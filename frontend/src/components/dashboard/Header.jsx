import React from 'react';
import Notifications from '../common/DropdownNotifications';
import UserMenu from '../common/DropdownProfile';
import ThemeToggle from '../common/ThemeToggle';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { WelcomeLogo, WelcomeLogoWhite } from '../../assets/images';
import { useThemeProvider } from '../../utils/ThemeContext';

export default function Header({ onToggleSidebar }) {
  const { currentTheme } = useThemeProvider();
  const isDark = currentTheme === 'dark';

  return (
    <nav
    dir="rtl"
    className={`
      py-3 px-6 flex justify-between items-center sticky top-0 z-10
      sm:px-6 lg:px-8
    bg-gradient-to-r from-navy-light/60 via-navy/40 to-accent/10
      text-gray-900 dark:text-white
      border-b border-gray-200
      dark:bg-navy-dark
      shadow-md dark:shadow-[0_0_10px_#14b8a640]
      transition-all
    `}
  >
  
      {/* Logo & Menu Toggle */}
      <div className="flex items-center gap-4">
        <img
          src={isDark ? WelcomeLogoWhite : WelcomeLogo}
          alt="Logo"
          className="w-12 h-12 object-contain cursor-pointer transition"
          
        />
        <Button variant="ghost" size="icon" onClick={onToggleSidebar}>
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3">
        <Notifications align="right" />
        <ThemeToggle />
        <div className="hidden sm:block w-px h-6 bg-border" />
        <UserMenu align="left" />
      </div>
    </nav>
  );
}
