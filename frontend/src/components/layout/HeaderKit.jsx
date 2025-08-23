/**
 * HeaderKit
 * Rounded top header with search input and quick actions.
 * Usage: <HeaderKit onToggleSidebar={fn} isSidebarOpen={bool} dir="ltr|rtl" />
 */
import React from 'react';
import { Menu, Search, Bell, UserCircle } from 'lucide-react';
import clsx from 'clsx';

export default function HeaderKit({ onToggleSidebar, isSidebarOpen, dir = 'ltr', title = 'Almadar' }) {
  return (
    <header
      dir={dir}
      className="sticky top-0 z-30 bg-white/70 dark:bg-zinc-900/60 backdrop-blur shadow-sm rounded-b-2xl md:rounded-b-3xl"
    >
      <div className="flex items-center gap-2 md:gap-4 px-3 md:px-6 h-12 md:h-16">
        <button
          type="button"
          onClick={onToggleSidebar}
          aria-label={isSidebarOpen ? 'Close sidebar' : 'Open sidebar'}
          aria-expanded={isSidebarOpen}
          aria-controls="app-sidebar"
          className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="font-semibold whitespace-nowrap me-2">{title}</div>

        <div className="flex-1 flex items-center relative">
          <Search className="w-4 h-4 absolute top-1/2 -translate-y-1/2 ms-3 text-zinc-400" />
          <input
            type="search"
            placeholder="Search"
            className="w-full ps-9 pe-3 py-1.5 text-sm rounded-full bg-zinc-100 dark:bg-zinc-800 focus:outline-none"
          />
        </div>

        <div className={clsx('flex items-center gap-2 ms-2', dir === 'rtl' && 'flex-row-reverse')}>
          <button className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800" aria-label="Notifications">
            <Bell className="w-5 h-5" />
          </button>
          <button className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800" aria-label="Account">
            <UserCircle className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
