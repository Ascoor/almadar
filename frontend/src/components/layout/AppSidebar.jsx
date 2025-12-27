import React, { useState, useEffect, useMemo } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { LogoNewArt, LogoTextArtGreen, LogoTextArtWhite } from '../../assets/images';
import {
  ContractsIcon,
  ConsultationsIcon,
  LawsuitsIcon,
  DashboardIcon,
  ArchiveIcon,
  CourtHouseIcon,
  LawBookIcon,
} from '@/components/ui/Icons';
import { Settings2, ListTree, UsersRound, UserCheck, ChevronRight, FileText } from 'lucide-react';

export default function AppSidebar({ isOpen, onToggle, onLinkClick }) {
  const { hasPermission } = useAuth();
  const { t, dir } = useLanguage();

  const [activeSection, setActiveSection] = useState(null);
  const [isLargeScreen, setIsLargeScreen] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth >= 1024 : true,
  );
  const [isTablet, setIsTablet] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth >= 768 && window.innerWidth < 1024 : false,
  );

  // Detect dark mode from `.dark` or [data-theme="dark"]
  const [isDark, setIsDark] = useState(() => {
    const root = document.documentElement;
    return root.classList.contains('dark') || root.getAttribute('data-theme') === 'dark';
  });

  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth >= 1024);
      setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024);
    };
    window.addEventListener('resize', handleResize);

    const root = document.documentElement;
    const mo = new MutationObserver(() => {
      setIsDark(root.classList.contains('dark') || root.getAttribute('data-theme') === 'dark');
    });
    mo.observe(root, { attributes: true, attributeFilter: ['class', 'data-theme'] });

    const mq = window.matchMedia?.('(prefers-color-scheme: dark)');
    const onMQ = (e) => {
      setIsDark(e.matches || root.classList.contains('dark') || root.getAttribute('data-theme') === 'dark');
    };
    mq?.addEventListener?.('change', onMQ);

    return () => {
      window.removeEventListener('resize', handleResize);
      mo.disconnect();
      mq?.removeEventListener?.('change', onMQ);
    };
  }, []);

  const isOverlayMode = !isLargeScreen || isTablet; // tablet/mobile => overlay slide
  const showFullNav = isOpen || isOverlayMode;      // desktop collapsed => icons only

  // Desktop widths: open vs collapsed
  const desktopOpenWidth = '16rem';
  const desktopCollapsedWidth = '72px';

  // RTL-aware translate for overlay mode
  const overlayTranslateHidden = dir === 'rtl' ? 'translate-x-full' : '-translate-x-full';
  const sidebarTransformClass = isOverlayMode ? (isOpen ? 'translate-x-0' : overlayTranslateHidden) : 'translate-x-0';
  const sidebarEasing = isOpen ? 'ease-out' : 'ease-in';

  // Logo selection
  const logoSrc = isOpen
    ? isDark
      ? LogoTextArtWhite
      : LogoTextArtGreen
    : LogoNewArt;

  const navConfig = useMemo(
    () =>
      [
        { id: 'home', label: t('home'), to: '/', icon: <DashboardIcon size={20} /> },

        hasPermission('view contracts') && {
          id: 'contracts',
          label: t('contracts'),
          to: '/contracts',
          icon: <ContractsIcon size={20} />,
        },

        (hasPermission('view investigations') ||
          hasPermission('view legaladvices') ||
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
            hasPermission('view legaladvices') && {
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
            { id: 'lists', label: t('lists'), to: '/managment-lists', icon: <ListTree size={16} /> },
          ],
        },

        hasPermission('view users') && {
          id: 'users',
          label: t('usersManagement'),
          icon: <UsersRound size={20} />,
          children: [
            { id: 'users-list', label: t('usersList'), to: '/users', icon: <UserCheck size={16} /> },
          ],
        },

        hasPermission('view archive') && {
          id: 'archive',
          label: t('archive'),
          icon: <ArchiveIcon size={20} />,
          children: [
            { id: 'archive-root', label: t('archive'), to: '/archive', icon: <ArchiveIcon size={16} /> },
            { id: 'editor', label: t('editor'), to: '/editor', icon: <FileText size={16} /> },
          ],
        },
      ].filter(Boolean),
    [hasPermission, t],
  );

  const handleSectionClick = (id, hasChildren) => {
    // في overlay: إذا مغلق افتحه أولاً
    if (isOverlayMode && !isOpen) onToggle();
    if (hasChildren) setActiveSection((prev) => (prev === id ? null : id));
  };

  // Mini icons list when collapsed (desktop only)
  const miniItems = useMemo(() => {
    const flat = [];
    navConfig.forEach((item) => {
      if (item.to) flat.push(item);
      if (item.children) flat.push(...item.children);
    });
    // إزالة تكرارات حسب id
    const seen = new Set();
    return flat.filter((x) => {
      if (seen.has(x.id)) return false;
      seen.add(x.id);
      return true;
    });
  }, [navConfig]);

  return (
    <aside
      dir={dir}
      className={`
        sidebar-surface
        fixed ${dir === 'rtl' ? 'right-0' : 'left-0'} top-0 z-20 h-full
        bg-sidebar text-sidebar-fg border-s border-border
        ${isOverlayMode ? `sidebar-anim ${isOpen ? 'sidebar-anim--open' : 'sidebar-anim--hidden'}` : 'sidebar-desktop-width'}
      `}
      style={{
        boxShadow: isDark ? '0 0 15px rgba(34,211,238,0.35)' : undefined,
        width: isOverlayMode
          ? isTablet
            ? '18rem'
            : 'min(20rem, 90vw)'
          : isOpen
            ? desktopOpenWidth
            : desktopCollapsedWidth,
      }}
    >
      {/* Header / Logo */}
      <div className={`relative flex items-center justify-center mt-6 min-w-0 ${isOpen ? 'px-2' : 'px-0'}`}>
        <img
          src={logoSrc}
          alt="Almadar Logo"
          className={`transition-[width] duration-250 ${isOpen ? 'w-36 ease-out' : 'w-10 ease-in'}`}
        />

        {/* Close button (overlay or open) */}
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

      {/* Nav */}
      <nav
        className={`
          h-full overflow-y-auto min-w-0
          ${showFullNav ? 'px-4 space-y-3 mt-6' : 'px-2 space-y-2 mt-8'}
        `}
      >
        {showFullNav ? (
          navConfig.map((item) => (
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
                      <span className="flex-1 text-right min-w-0 truncate">{item.label}</span>
                    </>
                  )}
                </NavLink>
              ) : (
                <button
                  type="button"
                  onClick={() => handleSectionClick(item.id, !!item.children)}
                  className={`group flex items-center gap-3 p-2 w-full rounded-md text-sm font-semibold tracking-tight
                    transition-colors duration-200
                    ${activeSection === item.id ? 'text-sidebar-active' : 'text-sidebar-fg hover:bg-accent/50 hover:text-fg'}`}
                >
                  {React.cloneElement(item.icon, {
                    className: `transition-colors duration-200 ${
                      activeSection === item.id
                        ? 'text-sidebar-active dark:text-[color:var(--neon-title)]'
                        : 'text-sidebar-fg group-hover:text-fg dark:group-hover:text-[color:var(--neon-title)]'
                    }`,
                  })}
                  <span className="flex-1 text-right min-w-0 truncate">{item.label}</span>

                  {item.children && (
                    <ChevronRight
                      className={`w-4 h-4 transform transition-transform duration-200 ${
                        activeSection === item.id ? (dir === 'rtl' ? 'rotate-90' : '-rotate-90') : ''
                      }`}
                    />
                  )}
                </button>
              )}

              {/* Children */}
              {item.children && activeSection === item.id && isOpen && (
                <div className="me-4 ps-4 border-s border-border space-y-1">
                  {item.children.map((ch) => (
                    <NavLink
                      key={ch.id}
                      to={ch.to}
                      onClick={onLinkClick}
                      className={({ isActive }) =>
                        `group flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium
                         transition-colors duration-200
                         ${isActive ? 'text-sidebar-active' : 'text-sidebar-fg hover:bg-accent/50 hover:text-fg'}`
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
                          <span className="min-w-0 truncate">{ch.label}</span>
                        </>
                      )}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          ))
        ) : (
          // Collapsed desktop: icons only
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

            {/* Expand button (desktop collapsed only) */}
            {!isOverlayMode && (
              <button
                type="button"
                onClick={onToggle}
                className="mt-3 w-11 h-11 rounded-xl border border-border bg-card/30 hover:bg-accent/30 transition-colors"
                title={t('open')}
                aria-label="Open sidebar"
              >
                <span className="text-lg leading-none">≡</span>
              </button>
            )}
          </div>
        )}
      </nav>
    </aside>
  );
}
