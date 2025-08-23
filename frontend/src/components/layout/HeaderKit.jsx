/**
 * HeaderKit.jsx
 *
 * Rounded top header used across the app. Contains a sidebar toggle,
 * search input and quick action buttons. Direction is taken from the
 * language context and it remains fully responsive.
 *
 * Usage:
 * <HeaderKit onToggleSidebar={() => setOpen(o=>!o)} isSidebarOpen={open} />
 */
import React from 'react';
import { Menu, Bell, Search, User } from 'lucide-react';
import clsx from 'clsx';
import { useLanguage } from '@/context/LanguageContext';

export default function HeaderKit({ onToggleSidebar, isSidebarOpen, title = 'Almadar' }) {
  const { dir } = useLanguage();

  return (
    <header className="sticky top-0 z-30 w-full">
      <div
        className={clsx(
          'flex items-center gap-2 sm:gap-4 px-2 sm:px-4',
          'h-14 sm:h-20 rounded-b-2xl shadow-sm',
          'bg-white/70 dark:bg-zinc-900/60 backdrop-blur'
        )}
      >
        <button
          type="button"
          onClick={onToggleSidebar}
          aria-label="Toggle sidebar"
          aria-expanded={isSidebarOpen}
          className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <Menu className="w-5 h-5" />
        </button>

        <h1
          className={clsx(
            'text-lg sm:text-xl font-bold whitespace-nowrap',
            dir === 'rtl' ? 'ml-auto' : 'mr-auto'
          )}
        >
          {title}
        </h1>

        <div className="relative hidden sm:block max-w-xs w-full">
          <Search className="absolute top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none ms-2" />
          <input
            type="search"
            placeholder="Search"
            className="w-full ps-8 pe-2 py-1.5 text-sm rounded-md border border-zinc-300 dark:border-zinc-700 bg-transparent focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className={clsx('flex items-center gap-2 sm:gap-4', dir === 'rtl' ? 'mr-auto' : 'ml-auto')}>
          <button
            type="button"
            className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-primary"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
          </button>
          <button
            type="button"
            className="p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-primary"
            aria-label="Account menu"
          >
            <User className="w-6 h-6" />
          </button>
        </div>
      </div>
    </header>
  );
}
