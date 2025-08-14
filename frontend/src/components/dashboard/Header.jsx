import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import DropdownNotifications from '@/components/common/DropdownNotifications';
import DropdownProfile from '@/components/common/DropdownProfile';
import { Sun, Moon, Menu, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { useThemeProvider } from '@/utils/ThemeContext';
import { menuItems } from './Sidebar';
import { NavLink } from 'react-router-dom';

export function Header() {
  const { currentTheme, changeCurrentTheme } = useThemeProvider();
  const toggleTheme = () =>
    changeCurrentTheme(currentTheme === 'dark' ? 'light' : 'dark');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const renderMobileItem = (item, level = 0) => {
    if (item.children) {
      return (
        <div key={`${item.id}-mobile-${level}`} className="mt-2">
          <div className="px-2 py-1 font-medium text-sm text-muted-foreground">
            {item.title}
          </div>
          <div className="pl-4">
            {item.children.map((child) => renderMobileItem(child, level + 1))}
          </div>
        </div>
      );
    }

    return (
      <NavLink
        key={`${item.href}-mobile-${level}`}
        to={item.href}
        onClick={() => setIsMenuOpen(false)}
        className="flex items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground"
      >
        <item.icon className="h-4 w-4" />
        <span>{item.title}</span>
      </NavLink>
    );
  };

  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60"
      >
        <div className="flex h-16 items-center justify-between px-6">
        {/* Right Side - Mobile Menu & Search */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setIsMenuOpen(true)}
          >
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
            {currentTheme === 'dark' ? (
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

      {isMenuOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/50 md:hidden"
            onClick={() => setIsMenuOpen(false)}
          />
          <motion.nav
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            className="fixed top-0 right-0 z-50 h-full w-64 bg-card p-4 overflow-y-auto md:hidden"
          >
            <div className="mb-4 flex items-center justify-between">
              <span className="font-semibold">القائمة</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMenuOpen(false)}
              >
                إغلاق
              </Button>
            </div>
            {menuItems.map((item) => renderMobileItem(item))}
          </motion.nav>
        </>
      )}
    </>
  );
}

export default Header;

