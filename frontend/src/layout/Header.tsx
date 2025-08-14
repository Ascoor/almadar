import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';
import { DropdownNotifications } from '@/components/DropdownNotifications';
import { DropdownProfile } from '@/components/DropdownProfile';
import { Sun, Moon, Menu, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

export function Header() {
  const { theme, setTheme } = useTheme();
  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60"
    >
      <div className="flex h-16 items-center justify-between px-6">
        {/* Right Side - Mobile Menu & Search */}
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
          
          {/* Global Search */}
          <div className="hidden md:flex relative">
            {isSearchOpen ? (
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: 300 }}
                className="relative"
              >
                <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="البحث في النظام..."
                  className="pr-10 pl-4"
                  onBlur={() => setIsSearchOpen(false)}
                  autoFocus
                />
              </motion.div>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsSearchOpen(true)}
                className="gap-2"
              >
                <Search className="h-4 w-4" />
                البحث
              </Button>
            )}
          </div>
        </div>

        {/* Center - Breadcrumb (could be added later) */}
        <div className="flex-1" />

        {/* Left Side - Actions */}
        <div className="flex items-center gap-3">
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            className="h-9 w-9 p-0"
          >
            {theme === 'dark' ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </Button>

          {/* Notifications */}
          <DropdownNotifications />

          {/* Profile */}
          <DropdownProfile />
        </div>
      </div>
    </motion.header>
  );
}