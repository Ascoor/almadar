import React from 'react';
import Notifications from '../common/DropdownNotifications';
import UserMenu from '../common/DropdownProfile';
import ThemeToggle from '../common/ThemeToggle';
import { Button } from "@/components/ui/button";
import { Bell, Menu } from "lucide-react";

const Header = ({ toggleSidebar }) => {
  return (
    <nav
      dir="rtl"
      className="bg-background text-foreground   border border-blue-200
     
      dark:text-foreground dark:ring-2 dark:ring-mint-500 
      dark:shadow-[0_0_30px_#66ffcc40] border-border shadow-sm py-3 px-6 flex justify-between items-center sticky top-0 z-10"
    >
      {/* الشعار والعنوان */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={toggleSidebar}>
          <Menu className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-bold">نظام إدارة الشؤون القانونية</h1>
      </div>

      {/* أدوات التحكم */}
      <div className="flex items-center gap-3">
        <Notifications align="right" />
        <ThemeToggle />
        <hr className="w-px h-6 bg-border border-none" />
        <UserMenu align="left" />
      </div>
    </nav>
  );
};

export default Header;
