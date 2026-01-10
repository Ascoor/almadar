import { useEffect, useMemo, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Archive,
  BookOpen,
  Briefcase,
  LayoutGrid,
  ListChecks,
  ShieldCheck,
  ShieldHalf,
  UserCog,
  Users,
  FileText,
  FolderKanban,
  Gavel,
} from 'lucide-react';
import { PERMISSION_TREE } from '@/auth/permissionCatalog';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';

const ICONS = {
  dashboard: LayoutGrid,
  contracts: FileText,
  'contract-categories': ListChecks,
  'legal-advices': BookOpen,
  investigations: Briefcase,
  'investigation-actions': FolderKanban,
  litigations: Gavel,
  'litigation-from': Gavel,
  'litigation-from-actions': FolderKanban,
  'litigation-against': Gavel,
  'litigation-against-actions': FolderKanban,
  archives: Archive,
  management: ListChecks,
  admin: ShieldHalf,
  users: Users,
  roles: ShieldCheck,
  permissions: UserCog,
  profile: UserCog,
};

const getLabel = (node, lang) =>
  lang === 'en' ? node.label.en || node.label.ar : node.label.ar;

const getIcon = (node, className = 'h-5 w-5') => {
  const Icon = ICONS[node.icon] || LayoutGrid;
  return <Icon className={className} />;
};

export default function Sidebar({
  isOpen,
  variant = 'desktop',
  onClose,
  onNavigate,
}) {
  const { can, roles } = useAuth();
  const { lang, dir } = useLanguage();
  const location = useLocation();
  const [expandedSection, setExpandedSection] = useState(null);

  const isAdmin = Array.isArray(roles)
    ? roles.some((role) => String(role).toLowerCase() === 'admin')
    : false;

  const isAllowed = (node) =>
    isAdmin || (node.requiredPermission ? can(node.requiredPermission) : false);

  const filteredSections = useMemo(() => {
    return PERMISSION_TREE.map((section) => {
      const visibleChildren = (section.children || []).filter(
        (child) => isAllowed(child) && child.route,
      );
      const isVisible = isAllowed(section) || visibleChildren.length > 0;
      return isVisible
        ? {
            ...section,
            children: visibleChildren,
          }
        : null;
    }).filter(Boolean);
  }, [can, isAdmin]);

  useEffect(() => {
    const match = filteredSections.find((section) =>
      section.children?.some((child) =>
        location.pathname.startsWith(child.route),
      ),
    );
    setExpandedSection(match?.key || null);
  }, [filteredSections, location.pathname]);

  const renderSectionLink = (section) => (
    <NavLink
      to={section.route}
      onClick={onNavigate}
      className={({ isActive }) =>
        `flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold transition-colors ${
          isActive
            ? 'bg-accent/20 text-sidebar-active'
            : 'text-sidebar-fg hover:bg-accent/10'
        }`
      }
    >
      {getIcon(section)}
      <span className="flex-1 truncate">{getLabel(section, lang)}</span>
    </NavLink>
  );

  const renderSectionButton = (section) => (
    <button
      type="button"
      onClick={() =>
        setExpandedSection((prev) => (prev === section.key ? null : section.key))
      }
      className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold transition-colors ${
        expandedSection === section.key
          ? 'bg-accent/20 text-sidebar-active'
          : 'text-sidebar-fg hover:bg-accent/10'
      }`}
    >
      {getIcon(section)}
      <span className="flex-1 truncate text-start">{getLabel(section, lang)}</span>
      <span className="text-xs text-muted-foreground">
        {expandedSection === section.key ? '−' : '+'}
      </span>
    </button>
  );

  const sidebarBody = (
    <div className="flex h-full flex-col">
      <div className="px-4 pt-5 pb-3">
        <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
          {lang === 'en' ? 'Main' : 'الرئيسية'}
        </p>
      </div>
      <nav className="flex-1 space-y-2 overflow-y-auto px-3 pb-6">
        {filteredSections.map((section) => (
          <div key={section.key} className="space-y-1">
            {section.route && !section.children?.length
              ? renderSectionLink(section)
              : renderSectionButton(section)}
            {section.children?.length && expandedSection === section.key && (
              <div className="space-y-1 border-s border-border ps-4">
                {section.children.map((child) => (
                  <NavLink
                    key={child.key}
                    to={child.route}
                    onClick={onNavigate}
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-accent/20 text-sidebar-active'
                          : 'text-sidebar-fg hover:bg-accent/10'
                      }`
                    }
                  >
                    {getIcon(child, 'h-4 w-4')}
                    <span className="truncate">{getLabel(child, lang)}</span>
                  </NavLink>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </div>
  );

  if (variant === 'mobile') {
    return (
      <>
        <div
          className={`fixed inset-0 z-40 bg-black/40 transition-opacity ${
            isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
          }`}
          onClick={onClose}
        />
        <aside
          dir={dir}
          className={`fixed inset-y-0 ${
            dir === 'rtl' ? 'right-0' : 'left-0'
          } z-50 w-72 bg-sidebar text-sidebar-fg shadow-xl transition-transform ${
            isOpen
              ? 'translate-x-0'
              : dir === 'rtl'
                ? 'translate-x-full'
                : '-translate-x-full'
          }`}
        >
          {sidebarBody}
        </aside>
      </>
    );
  }

  return (
    <aside
      dir={dir}
      className={`fixed inset-y-0 z-30 w-72 border-border bg-sidebar text-sidebar-fg shadow-lg ${
        dir === 'rtl' ? 'right-0 border-l' : 'left-0 border-r'
      }`}
    >
      {sidebarBody}
    </aside>
  );
}
