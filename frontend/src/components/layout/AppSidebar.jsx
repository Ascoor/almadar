// src/components/layout/AppSidebar.jsx
/**
 * AppSidebar.jsx
 *
 * Collapsible permission-aware sidebar. Includes an orbiting toggle
 * button animated with Framer Motion. Items show icons only when the
 * sidebar is collapsed. Supports nested groups, RTL and mobile drawer
 * behaviour.
 *
 * Props:
 * - isOpen: boolean
 * - onToggle: () => void
 * - nav: Array of { key, label, icon, to, children?, permissionKey? }
 * - hasPermissions: (key: string) => boolean
 */
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import clsx from 'clsx';
import { motion, useReducedMotion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function AppSidebar({ isOpen, onToggle, nav = [], hasPermissions }) {
  const { dir } = useLanguage();
  const location = useLocation();
  const reduced = useReducedMotion();
  const navRef = useRef(null);
  const [activeGroup, setActiveGroup] = useState(null);
  const [mobile, setMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 768 : false);

  useEffect(() => {
    const onResize = () => setMobile(window.innerWidth < 768);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const items = useMemo(
    () =>
      nav
        .filter(it => !it.permissionKey || hasPermissions(it.permissionKey))
        .map(it =>
          it.children
            ? { ...it, children: it.children.filter(ch => !ch.permissionKey || hasPermissions(ch.permissionKey)) }
            : it
        ),
    [nav, hasPermissions]
  );

  useEffect(() => {
    items.forEach(it => {
      if (it.children && it.children.some(ch => ch.to === location.pathname)) {
        setActiveGroup(it.key);
      }
    });
  }, [location.pathname, items]);

  const handleKeyDown = e => {
    const focusable = navRef.current?.querySelectorAll('a,button');
    const list = Array.from(focusable || []);
    const idx = list.indexOf(document.activeElement);
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      list[(idx + 1) % list.length]?.focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      list[(idx - 1 + list.length) % list.length]?.focus();
    }
  };

  const position = dir === 'rtl' ? 'right-0' : 'left-0';
  const translateClosed = dir === 'rtl' ? 'translate-x-full' : '-translate-x-full';
  const container = clsx(
    'bg-white dark:bg-zinc-950 border-e border-zinc-200/60 dark:border-zinc-800',
    'transition-[width] duration-300 flex flex-col z-40',
    mobile
      ? `fixed top-0 ${position} h-full transform ${isOpen ? 'translate-x-0' : translateClosed} w-64`
      : `h-screen ${isOpen ? 'w-64' : 'w-16'}`
  );

  return (
    <>
      {mobile && isOpen && (
        <div className="fixed inset-0 bg-black/40 z-30" onClick={onToggle} aria-hidden="true" />
      )}
      <aside dir={dir} className={container}>
        <div className="p-2 flex items-center justify-center">
          <OrbitToggle isOpen={isOpen} onToggle={onToggle} dir={dir} reduced={reduced} />
        </div>
        <nav
          id="app-sidebar-nav"
          ref={navRef}
          role="menu"
          onKeyDown={handleKeyDown}
          className="flex-1 overflow-y-auto py-4 space-y-1"
        >
          {items.map(item => (
            <SidebarItem
              key={item.key}
              item={item}
              dir={dir}
              isOpen={isOpen}
              activeGroup={activeGroup}
              setActiveGroup={setActiveGroup}
              onNavigate={mobile ? onToggle : undefined}
            />
          ))}
        </nav>
      </aside>
    </>
  );
}

function SidebarItem({ item, dir, isOpen, activeGroup, setActiveGroup, onNavigate }) {
  const isGroup = item.children && item.children.length > 0;
  const Caret = dir === 'rtl' ? ChevronLeft : ChevronRight;

  const linkClasses = ({ isActive }) =>
    clsx(
      'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium focus:outline-none',
      isActive
        ? 'bg-zinc-100 dark:bg-zinc-800'
        : 'hover:bg-zinc-100 dark:hover:bg-zinc-800'
    );

  if (!isGroup) {
    const Icon = item.icon;
    return (
      <NavLink to={item.to} end className={linkClasses} onClick={onNavigate}>
        <Icon className="w-5 h-5" />
        <span className={clsx(isOpen ? 'ms-2' : 'sr-only')}>{item.label}</span>
      </NavLink>
    );
  }

  const Icon = item.icon;
  const expanded = activeGroup === item.key;

  return (
    <div>
      <button
        type="button"
        onClick={() => setActiveGroup(expanded ? null : item.key)}
        className={clsx(
          'w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium',
          expanded
            ? 'bg-zinc-100 dark:bg-zinc-800'
            : 'hover:bg-zinc-100 dark:hover:bg-zinc-800'
        )}
        aria-expanded={expanded}
      >
        <Icon className="w-5 h-5" />
        <span className={clsx(isOpen ? 'ms-2 flex-1 text-start' : 'sr-only')}>{item.label}</span>
        {isOpen && (
          <Caret
            className={clsx(
              'w-4 h-4 ms-auto transition-transform',
              expanded ? (dir === 'rtl' ? '-rotate-90' : 'rotate-90') : ''
            )}
          />
        )}
      </button>
      {isOpen && expanded && (
        <div className="mt-1 ps-7 space-y-1" role="group">
          {item.children.map(ch => {
            const ChIcon = ch.icon;
            return (
              <NavLink
                key={ch.key}
                to={ch.to}
                end
                className={({ isActive }) =>
                  clsx(
                    'flex items-center gap-2 px-2 py-1.5 rounded-md text-sm',
                    isActive
                      ? 'bg-zinc-100 dark:bg-zinc-800'
                      : 'hover:bg-zinc-100 dark:hover:bg-zinc-800'
                  )
                }
                onClick={onNavigate}
              >
                <ChIcon className="w-4 h-4" />
                <span>{ch.label}</span>
              </NavLink>
            );
          })}
        </div>
      )}
    </div>
  );
}

function OrbitToggle({ isOpen, onToggle, dir, reduced }) {
  const radius = 14;
  const satellites = useMemo(
    () =>
      Array.from({ length: 4 }).map((_, i) => {
        const angle = (i * 360) / 4;
        return {
          id: i,
          x: radius * Math.cos((angle * Math.PI) / 180),
          y: radius * Math.sin((angle * Math.PI) / 180),
        };
      }),
    []
  );

  const orbitVariants = {
    closed: { rotate: 0 },
    open: reduced
      ? { rotate: 0 }
      : { rotate: 360, transition: { duration: 8, ease: 'linear', repeat: Infinity } },
  };

  const dotVariants = {
    closed: { opacity: 0, scale: 0 },
    open: { opacity: 1, scale: 1 },
  };

  const Icon =
    dir === 'rtl'
      ? isOpen
        ? ChevronRight
        : ChevronLeft
      : isOpen
      ? ChevronLeft
      : ChevronRight;

  return (
    <div className="relative">
      <button
        type="button"
        aria-label="Toggle sidebar"
        aria-controls="app-sidebar-nav"
        aria-expanded={isOpen}
        onClick={onToggle}
        className="relative z-10 p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-primary"
      >
        <Icon className="w-4 h-4" />
      </button>
      <motion.div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        variants={orbitVariants}
        animate={isOpen ? 'open' : 'closed'}
        initial={false}
      >
        {satellites.map(s => (
          <motion.span
            key={s.id}
            variants={dotVariants}
            className="absolute w-1.5 h-1.5 bg-primary rounded-full"
            style={{ x: s.x, y: s.y }}
          />
        ))}
      </motion.div>
    </div>
  );
}
