import React from 'react';
import Notifications from '../common/DropdownNotifications';
import UserMenu from '../common/DropdownProfile';
import ThemeToggle from '../common/ThemeToggle';
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

import { WelcomeLogo,WelcomeLogoWhite } from '../../assets/images';
import { useThemeProvider } from '../../utils/ThemeContext';
export default function Header({ onToggleSidebar, isOpen  }) {
  
  const { currentTheme } = useThemeProvider();
  return (
    <nav
      dir="rtl"
      className="
        fixed inset-x-0 top-0 z-50
        flex items-center justify-between
        px-4 sm:px-6 lg:px-8 py-3
         bg-gradient-to-l from-white via-green-300 to-blue-300/20
       dark:bg-luxury-green-gradient dark:text-white/70
        border-b border-border
        dark:ring-2 dark:ring-mint-500 dark:shadow-[0_0_30px_#66ffcc40]
        "
    >     {/* Logo */}
        <div className="flex items-center gap-4">
     <img      src={currentTheme === 'dark' ? WelcomeLogoWhite : WelcomeLogo} // Change logo based on the theme
     alt="Logo"
        className={`
          object-contain transition-all duration-300  w-12 h-12'}
        `}
        onClick={onToggleSidebar}
      />
 
        <Button variant="ghost" size="icon" onClick={onToggleSidebar}>
          <Menu className="h-5 w-5" />
        </Button>
 
      </div>

      <div className="flex items-center gap-3">
        <Notifications align="right" />
        <ThemeToggle />
        <div className="hidden sm:block w-px h-6 bg-border" />
        <UserMenu align="left" />
      </div>
    </nav>
  );
}
