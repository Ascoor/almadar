import React, { useEffect, useMemo, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { LogoNewArt } from '@/assets/images';
import {
  ContractsIcon,
  ConsultationsIcon,
  LawsuitsIcon,
  DashboardIcon,
  ArchiveIcon,
  CourtHouseIcon,
  LawBookIcon,
} from '@/components/ui/Icons';

import {
  Settings2,
  ListTree,
  UsersRound,
  UserCheck,
  ChevronRight,
  FileText,
} from 'lucide-react';

export default function AppSidebar({ isOpen, onToggle, onLinkClick, mode }) {
  const { hasPermission } = useAuth();
  const { t, dir } = useLanguage();
  const isMobile = useIsMobile();
  const location = useLocation();

  // ========= breakpoints =========
  const [isTabletUp, setIsTabletUp] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth >= 768 : true,
  );

  useEffect(() => {
    const onResize = () => setIsTabletUp(window.innerWidth >= 768);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // ========= theme detect =========
  const [isDark, setIsDark] = useState(() => {
    const root = document.documentElement;
    return (
      root.classList.contains('dark') ||
      root.getAttribute('data-theme') === 'dark'
    );
  });

  useEffect(() => {
    const root = document.documentElement;
    const mo = new MutationObserver(() => {
      setIsDark(
        root.classList.contains('dark') ||
          root.getAttribute('data-theme') === 'dark',
      );
    });
    mo.observe(root, {
      attributes: true,
      attributeFilter: ['class', 'data-theme'],
    });

    const mq = window.matchMedia?.('(prefers-color-scheme: dark)');
    const onMQ = (e) => {
      setIsDark(
        e.matches ||
          root.classList.contains('dark') ||
          root.getAttribute('data-theme') === 'dark',
      );
    };
    mq?.addEventListener?.('change', onMQ);

    return () => {
      mo.disconnect();
      mq?.removeEventListener?.('change', onMQ);
    };
  }, []);

  // ========= state =========
  const [activeSection, setActiveSection] = useState(null);

  // ========= mode =========
  // mobile dropdown only (no mini sidebar)
  const showMobileDropdown = isMobile; // <768
  // sidebar visible only tabletUp
  const showSidebar = isTabletUp; // >=768

  // Desktop/Tablet layout behavior:
  // - if isOpen => full
  // - else => collapsed icons
  const showMiniNav = showSidebar && !isOpen;
  const showFullNav = showSidebar && isOpen;

  // ========= config =========
  const navConfig = useMemo(
    () =>
      [
        {
          id: 'home',
          label: t('dashboard'),
          to: '/dashboard',
          icon: <DashboardIcon size={20} />,
        },

        hasPermission('view contracts') && {
          id: 'contracts',
          label: t('contracts'),
          to: '/contracts',
          icon: <ContractsIcon size={20} />,
        },

        (hasPermission('view investigations') ||
          hasPermission('view legal-advices') ||
          hasPermission('view litigations')) && {
          id: 'fatwa',
          label: t('fatwa'),
          icon: <ConsultationsIcon size={20} />,
          children: [
            hasPermission('view investigations') && {
              id: 'investigations',
              label: t('investigations'),
              to: '/legal/investigations',
              icon: <LawsuitsIcon size={16} />,
            },
            hasPermission('view legal-advices') && {
              id: 'legal-advices',
              label: t('legalAdvices'),
              to: '/legal/legal-advices',
              icon: <LawBookIcon size={16} />,
            },
            hasPermission('view litigations') && {
              id: 'litigations',
              label: t('litigations'),
              to: '/legal/litigations',
              icon: <CourtHouseIcon size={16} />,
            },
          ].filter(Boolean),
        },

        hasPermission('view managment-lists') && {
          id: 'management',
          label: t('management'),
          icon: <Settings2 size={20} />,
          children: [
            {
              id: 'lists',
              label: t('lists'),
              to: '/management-lists',
              icon: <ListTree size={16} />,
            },
          ],
        },

        hasPermission('view users') && {
          id: 'users',
          label: t('usersManagement'),
          icon: <UsersRound size={20} />,
          children: [
            {
              id: 'users-list',
              label: t('usersList'),
              to: '/users',
              icon: <UserCheck size={16} />,
            },
          ],
        },

        hasPermission('view archives') && {
          id: 'archive',
          label: t('archive'),
          icon: <ArchiveIcon size={20} />,
          children: [
            {
              id: 'archive-root',
              label: t('archive'),
              to: '/archive',
              icon: <ArchiveIcon size={16} />,
            },
            {
              id: 'editor',
              label: t('editor'),
              to: '/editor',
              icon: <FileText size={16} />,
            },
          ],
        },
      ].filter(Boolean),
    [hasPermission, t],
  );

  const miniItems = useMemo(() => {
    const flat = [];
    navConfig.forEach((item) => {
      if (item.to) flat.push(item);
      if (item.children) flat.push(...item.children);
    });
    const seen = new Set();
    return flat.filter((x) => {
      if (seen.has(x.id)) return false;
      seen.add(x.id);
      return true;
    });
  }, [navConfig]);

  useEffect(() => {
    const activeParent = navConfig.find((item) =>
      item.children?.some((child) =>
        location.pathname.startsWith(child.to),
      ),
    );

    setActiveSection(activeParent?.id ?? null);
  }, [location.pathname, navConfig]);

  // ========= handlers =========
  const closeAll = () => {
    setActiveSection(null);
    onLinkClick?.();
    if (isOpen) onToggle?.();
  };

  const handleNavLinkClick = () => {
    setActiveSection(null);
    onLinkClick?.();
    // ✅ close dropdown on mobile
    if (showMobileDropdown && isOpen) onToggle?.();
  };

  const handleSectionToggle = (id) => {
    setActiveSection((prev) => (prev === id ? null : id));
  };

  // ========= styles =========
  const desktopOpenWidth = '16rem';
  const desktopCollapsedWidth = '72px';
  // ✅ dynamic mobile top: stick exactly under header
  const [mobileTop, setMobileTop] = useState(0);

  useEffect(() => {
    if (!showMobileDropdown) return;

    const calcTop = () => {
      const header = document.getElementById('app-header');
      if (!header) return setMobileTop(0);

      const rect = header.getBoundingClientRect();
      // bottom relative to viewport + current scroll = absolute top in page
      // لكن احنا بنستخدم position: fixed => نحتاج bottom داخل viewport فقط
      setMobileTop(Math.max(0, Math.round(rect.bottom)));
    };

    calcTop();
    window.addEventListener('resize', calcTop);
    window.addEventListener('scroll', calcTop, { passive: true });

    // لو الهيدر بيغير ارتفاعه (مثلاً بسبب ترجمة/خط/...) راقب تغيّره
    const header = document.getElementById('app-header');
    const ro = header ? new ResizeObserver(calcTop) : null;
    if (header && ro) ro.observe(header);

    return () => {
      window.removeEventListener('resize', calcTop);
      window.removeEventListener('scroll', calcTop);
      ro?.disconnect();
    };
  }, [showMobileDropdown]);

  // RTL translate for sidebar overlay (not used here because we don't do overlay slide on tablet)
  const sideBorder = dir === 'rtl' ? 'border-l' : 'border-r';

  // ========= RENDER =========
  return (
    <>
      {/* ===========================
          MOBILE DROPDOWN (<768)
          - hidden on md+
          - appears below header
      =========================== */}
      {showMobileDropdown && (
        <>
          {/* Backdrop */}
          <div
            className={`fixed inset-0 z-30 bg-black/40 transition-opacity duration-200 md:hidden ${
              isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
            onClick={() => isOpen && onToggle?.()}
            aria-hidden="true"
          />

          {/* Panel */}
          <div
            dir={dir}
            className={`fixed left-0 right-0 z-40 md:hidden
              bg-sidebar text-sidebar-fg ${sideBorder} border-border
              transition-[transform,opacity] duration-200 origin-top
              ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'}
            `}
            style={{ top: `${mobileTop}px` }}
          >
            <div className="max-h-[70vh] overflow-y-auto px-6 py-6 space-y-2">
              {navConfig.map((item) => (
                <div key={item.id} className="rounded-xl">
                  {item.to ? (
                    <NavLink
                      to={item.to}
                      onClick={handleNavLinkClick}
                      className={({ isActive }) =>
                        `flex items-center gap-3 p-3 rounded-xl text-sm font-semibold
                         transition-colors
                         ${isActive ? 'bg-accent/40 text-sidebar-active' : 'hover:bg-accent/30'}`
                      }
                    >
                      {item.icon}
                      <span className="flex-1 truncate text-right">
                        {item.label}
                      </span>
                    </NavLink>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => handleSectionToggle(item.id)}
                        className={`w-full flex items-center gap-3 p-3 rounded-xl text-sm font-semibold
                          transition-colors
                          ${activeSection === item.id ? 'bg-accent/35 text-sidebar-active' : 'hover:bg-accent/30'}`}
                      >
                        {item.icon}
                        <span className="flex-1 truncate text-right">
                          {item.label}
                        </span>
                        <ChevronRight
                          className={`w-4 h-4 transition-transform ${
                            activeSection === item.id
                              ? dir === 'rtl'
                                ? 'rotate-90'
                                : '-rotate-90'
                              : ''
                          }`}
                        />
                      </button>

                      {item.children && activeSection === item.id && (
                        <div className="mt-1 ms-4 ps-3 border-s border-border space-y-1">
                          {item.children.map((ch) => (
                            <NavLink
                              key={ch.id}
                              to={ch.to}
                              onClick={handleNavLinkClick}
                              className={({ isActive }) =>
                                `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium
                                 transition-colors
                                 ${isActive ? 'bg-accent/40 text-sidebar-active' : 'hover:bg-accent/25'}`
                              }
                            >
                              {ch.icon}
                              <span className="truncate">{ch.label}</span>
                            </NavLink>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* ===========================
          TABLET / DESKTOP SIDEBAR (>=768)
          - hidden on mobile
          - collapsed icons when closed
          - full when open
      =========================== */}
      {showSidebar && (
        <aside
          dir={dir}
          className={`
            hidden md:block
            fixed ${dir === 'rtl' ? 'right-0' : 'left-0'} top-0 z-20 h-full
            bg-sidebar text-sidebar-fg ${sideBorder} border-border
          `}
          style={{
            boxShadow: isDark ? '0 0 15px rgba(34,211,238,0.35)' : undefined,
            width: isOpen ? desktopOpenWidth : desktopCollapsedWidth,
          }}
        >
          {/* Header / Logo */}
          <div
            className={`relative flex items-center justify-center mt-6 min-w-0 ${isOpen ? 'px-2' : 'px-0'}`}
          >
            <img
              src={LogoNewArt}
              alt="Almadar Logo"
              className={`transition-[width] duration-200 ${isOpen ? 'w-36' : 'w-10'}`}
            />

            {isOpen && (
              <button
                onClick={onToggle}
                className={`absolute top-2 ${dir === 'rtl' ? 'left-3' : 'right-3'} rounded-md px-2 py-1 text-sm
                  hover:bg-accent/50 transition-colors`}
                aria-label="Close sidebar"
                type="button"
              >
                ×
              </button>
            )}
          </div>

          <nav
            className={`h-full overflow-y-auto min-w-0 ${isOpen ? 'px-4 mt-6 space-y-3' : 'px-2 mt-8'}`}
          >
            {/* FULL NAV */}
            {showFullNav && (
              <>
                {navConfig.map((item) => (
                  <div key={item.id}>
                    {item.to ? (
                      <NavLink
                        to={item.to}
                        onClick={onLinkClick}
                        className={({ isActive }) =>
                          `group flex items-center gap-3 p-2 rounded-md text-sm font-semibold tracking-tight
                           transition-colors duration-200
                           ${isActive ? 'text-sidebar-active' : 'text-sidebar-fg hover:bg-accent/50 hover:text-fg'}`
                        }
                      >
                        {({ isActive }) => (
                          <>
                            {React.cloneElement(item.icon, {
                              className: `transition-colors duration-200 ${
                                isActive
                                  ? 'text-sidebar-active dark:text-[color:var(--neon-title)]'
                                  : 'text-sidebar-fg group-hover:text-fg dark:group-hover:text-[color:var(--neon-title)]'
                              }`,
                            })}
                            <span className="flex-1 text-right min-w-0 truncate">
                              {item.label}
                            </span>
                          </>
                        )}
                      </NavLink>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={() => handleSectionToggle(item.id)}
                          className={`group flex items-center gap-3 p-2 w-full rounded-md text-sm font-semibold tracking-tight
                            transition-colors duration-200
                            ${
                              activeSection === item.id
                                ? 'text-sidebar-active'
                                : 'text-sidebar-fg hover:bg-accent/50 hover:text-fg'
                            }`}
                        >
                          {React.cloneElement(item.icon, {
                            className: `transition-colors duration-200 ${
                              activeSection === item.id
                                ? 'text-sidebar-active dark:text-[color:var(--neon-title)]'
                                : 'text-sidebar-fg group-hover:text-fg dark:group-hover:text-[color:var(--neon-title)]'
                            }`,
                          })}
                          <span className="flex-1 text-right min-w-0 truncate">
                            {item.label}
                          </span>
                          {item.children && (
                            <ChevronRight
                              className={`w-4 h-4 transform transition-transform duration-200 ${
                                activeSection === item.id
                                  ? dir === 'rtl'
                                    ? 'rotate-90'
                                    : '-rotate-90'
                                  : ''
                              }`}
                            />
                          )}
                        </button>

                        {item.children && activeSection === item.id && (
                          <div className="me-4 ps-4 border-s border-border space-y-1">
                            {item.children.map((ch) => (
                              <NavLink
                                key={ch.id}
                                to={ch.to}
                                onClick={onLinkClick}
                                className={({ isActive }) =>
                                  `group flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium
                                   transition-colors duration-200
                                   ${
                                     isActive
                                       ? 'text-sidebar-active'
                                       : 'text-sidebar-fg hover:bg-accent/50 hover:text-fg'
                                   }`
                                }
                              >
                                {({ isActive }) => (
                                  <>
                                    {React.cloneElement(ch.icon, {
                                      className: `transition-colors duration-200 ${
                                        isActive
                                          ? 'text-sidebar-active dark:text-[color:var(--neon-title)]'
                                          : 'text-sidebar-fg group-hover:text-fg dark:group-hover:text-[color:var(--neon-title)]'
                                      }`,
                                    })}
                                    <span className="min-w-0 truncate">
                                      {ch.label}
                                    </span>
                                  </>
                                )}
                              </NavLink>
                            ))}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                ))}
              </>
            )}

            {/* MINI NAV (collapsed icons) */}
            {showMiniNav && (
              <div className="flex flex-col items-center space-y-3 pt-4">
                {miniItems.map((it) => (
                  <NavLink
                    key={it.id}
                    to={it.to}
                    onClick={onLinkClick}
                    title={it.label}
                    className={({ isActive }) =>
                      `group flex items-center justify-center w-11 h-11 rounded-xl
                       transition-colors duration-200
                       ${isActive ? 'bg-accent/50 text-sidebar-active shadow-sm' : 'text-sidebar-fg hover:bg-accent/40'}`
                    }
                  >
                    {({ isActive }) =>
                      React.cloneElement(it.icon, {
                        className: `transition-colors duration-200 ${
                          isActive
                            ? 'text-sidebar-active dark:text-[color:var(--neon-title)]'
                            : 'text-sidebar-fg group-hover:text-sidebar-active dark:group-hover:text-[color:var(--neon-title)]'
                        }`,
                      })
                    }
                  </NavLink>
                ))}

                <button
                  type="button"
                  onClick={onToggle}
                  className="mt-3 w-11 h-11 rounded-xl border border-border bg-card/30 hover:bg-accent/30 transition-colors"
                  title={t('open')}
                  aria-label="Open sidebar"
                >
                  <span className="text-lg leading-none">≡</span>
                </button>
              </div>
            )}
          </nav>
        </aside>
      )}
    </>
  );
}
