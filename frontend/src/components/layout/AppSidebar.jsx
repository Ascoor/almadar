/**
 * AppSidebar
 * Collapsible sidebar with orbiting toggle button and permission-based nav.
 * Usage: <AppSidebar isOpen={bool} onToggle={fn} nav={array} hasPermissions={fn} dir="ltr|rtl" />
 */
import React, { useState, useMemo } from 'react';
import { NavLink } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import clsx from 'clsx';

export default function AppSidebar({
  isOpen,
  onToggle,
  nav = [],
  hasPermissions = () => true,
  dir = 'ltr'
}) {
  const prefersReduced = useReducedMotion();
  const [openGroups, setOpenGroups] = useState({});

  const filteredNav = useMemo(() => {
    const filterItems = items =>
      items
        .filter(item => !item.permissionKey || hasPermissions(item.permissionKey))
        .map(item =>
          item.children
            ? { ...item, children: filterItems(item.children) }
            : item
        );
    return filterItems(nav);
  }, [nav, hasPermissions]);

  const handleGroupToggle = key =>
    setOpenGroups(prev => ({ ...prev, [key]: !prev[key] }));

  const handleKeyDown = e => {
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
    e.preventDefault();
    const focusables = Array.from(
      e.currentTarget.querySelectorAll('a, button')
    );
    const index = focusables.indexOf(document.activeElement);
    const nextIndex =
      (index + (e.key === 'ArrowDown' ? 1 : -1) + focusables.length) %
      focusables.length;
    focusables[nextIndex]?.focus();
  };

  const ToggleIcon = dir === 'rtl'
    ? (isOpen ? ChevronRight : ChevronLeft)
    : (isOpen ? ChevronLeft : ChevronRight);

  const orbitContainer = prefersReduced
    ? {
        open: { opacity: 1 },
        closed: { opacity: 0 }
      }
    : {
        open: {
          rotate: 360,
          opacity: 1,
          transition: {
            rotate: { repeat: Infinity, duration: 12, ease: 'linear' }
          }
        },
        closed: { rotate: 0, opacity: 0 }
      };

  const satelliteVariants = prefersReduced
    ? {
        open: { opacity: 1, scale: 1 },
        closed: { opacity: 0, scale: 0 }
      }
    : {
        open: i => ({
          opacity: 1,
          scale: 1,
          x: Math.cos((i / 5) * 2 * Math.PI) * 14,
          y: Math.sin((i / 5) * 2 * Math.PI) * 14,
          transition: { type: 'spring', stiffness: 300, damping: 20, delay: i * 0.05 }
        }),
        closed: { opacity: 0, scale: 0, x: 0, y: 0 }
      };

  const mobileTranslate = isOpen
    ? 'translate-x-0'
    : dir === 'rtl'
    ? 'translate-x-full'
    : '-translate-x-full';

  const renderItems = items =>
    items.map(item => {
      const Icon = item.icon;
      if (item.children && item.children.length) {
        const open = openGroups[item.key];
        return (
          <div key={item.key}>
            <button
              onClick={() => handleGroupToggle(item.key)}
              className={clsx(
                'flex items-center w-full gap-3 px-3 py-2 rounded-md text-sm font-medium',
                'hover:bg-zinc-100 dark:hover:bg-zinc-800',
                !isOpen && 'justify-center'
              )}
              aria-expanded={open}
            >
              {Icon && <Icon className="w-5 h-5" />}
              <span
                className={clsx(
                  'transition-opacity',
                  isOpen ? 'opacity-100 ms-2' : 'opacity-0 pointer-events-none'
                )}
              >
                {item.label}
              </span>
              <ChevronDown
                className={clsx(
                  'ms-auto transition-transform',
                  open && 'rotate-180',
                  !isOpen && 'hidden'
                )}
              />
            </button>
            {open && isOpen && item.children && (
              <div className="ms-4 border-s border-zinc-200 dark:border-zinc-700 my-1 ps-2 space-y-1">
                {renderItems(item.children)}
              </div>
            )}
          </div>
        );
      }
      return (
        <NavLink
          key={item.key}
          to={item.to}
          aria-label={item.label}
          className={({ isActive }) =>
            clsx(
              'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium focus:outline-none',
              'hover:bg-zinc-100 dark:hover:bg-zinc-800',
              isActive && 'bg-zinc-100 dark:bg-zinc-800',
              !isOpen && 'justify-center'
            )
          }
        >
          {({ isActive }) => (
            <>
              {Icon && <Icon className="w-5 h-5" />}
              <span
                className={clsx(
                  'transition-opacity',
                  isOpen ? 'opacity-100 ms-2' : 'opacity-0 pointer-events-none'
                )}
              >
                {item.label}
              </span>
            </>
          )}
        </NavLink>
      );
    });

  return (
    <aside
      id="app-sidebar"
      dir={dir}
      className={clsx(
        'fixed md:static inset-y-0 z-40 flex flex-col bg-white dark:bg-zinc-950',
        'border-e border-zinc-200/60 dark:border-zinc-800 transition-[width] duration-300',
        dir === 'rtl' ? 'right-0 md:right-auto' : 'left-0 md:left-auto',
        isOpen ? 'w-64' : 'w-64 md:w-16',
        'md:translate-x-0',
        mobileTranslate
      )}
    >
      <div className="flex items-center justify-center h-14 md:h-16 relative">
        <button
          type="button"
          onClick={onToggle}
          aria-label={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          aria-expanded={isOpen}
          aria-controls="app-sidebar"
          className="relative z-10 flex items-center justify-center w-10 h-10 rounded-full bg-zinc-200 dark:bg-zinc-800"
        >
          <ToggleIcon className="w-4 h-4" />
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            variants={orbitContainer}
            animate={isOpen ? 'open' : 'closed'}
          >
            {[0, 1, 2, 3, 4].map(i => (
              <motion.span
                key={i}
                custom={i}
                variants={satelliteVariants}
                className="absolute block w-2 h-2 rounded-full bg-zinc-400 dark:bg-zinc-600"
                style={{ top: '50%', left: '50%' }}
              />
            ))}
          </motion.div>
        </button>
      </div>
      <nav
        className="flex-1 overflow-y-auto px-2 py-4 space-y-1"
        onKeyDown={handleKeyDown}
      >
        {renderItems(filteredNav)}
      </nav>
    </aside>
  );
}
