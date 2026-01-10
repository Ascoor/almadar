import { NavLink } from 'react-router-dom';
import {
  Archive,
  BookOpen,
  Briefcase,
  FileText,
  FolderKanban,
  Gavel,
  LayoutGrid,
  ListChecks,
  ShieldCheck,
  ShieldHalf,
  UserCog,
  Users,
} from 'lucide-react';
import { PERMISSION_TREE } from '@/auth/permissionCatalog';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';

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

const getIcon = (node) => ICONS[node.icon] || LayoutGrid;

export default function MiniSidebar({ onExpand }) {
  const { can, roles } = useAuth();
  const { lang, dir } = useLanguage();

  const isAdmin = Array.isArray(roles)
    ? roles.some((role) => String(role).toLowerCase() === 'admin')
    : false;

  const isAllowed = (node) =>
    isAdmin || (node.requiredPermission ? can(node.requiredPermission) : false);

  const items = PERMISSION_TREE.flatMap((section) => {
    const children = (section.children || []).filter(
      (child) => isAllowed(child) && child.route,
    );
    const parent = isAllowed(section) && section.route ? [section] : [];
    return [...parent, ...children];
  })
    .filter(Boolean)
    .filter((item, index, list) => {
      const routes = list.map((entry) => entry.route);
      return routes.indexOf(item.route) === index;
    });

  return (
    <aside
      dir={dir}
      className={`fixed inset-y-0 z-30 w-20 border-border bg-sidebar text-sidebar-fg shadow-lg ${
        dir === 'rtl' ? 'right-0 border-l' : 'left-0 border-r'
      }`}
    >
      <div className="flex h-full flex-col items-center gap-3 pt-5">
        {items.map((item) => {
          const Icon = getIcon(item);
          return (
            <NavLink
              key={item.key}
              to={item.route}
              title={lang === 'en' ? item.label.en || item.label.ar : item.label.ar}
              className={({ isActive }) =>
                `flex h-11 w-11 items-center justify-center rounded-2xl transition ${
                  isActive
                    ? 'bg-accent/30 text-sidebar-active shadow-sm'
                    : 'text-sidebar-fg hover:bg-accent/20'
                }`
              }
            >
              <Icon className="h-5 w-5" />
            </NavLink>
          );
        })}

        <Button
          variant="outline"
          size="icon"
          className="mt-auto mb-6 h-10 w-10 rounded-2xl"
          onClick={onExpand}
          aria-label={lang === 'en' ? 'Expand sidebar' : 'توسيع القائمة'}
        >
          <span className="text-lg">{dir === 'rtl' ? '«' : '»'}</span>
        </Button>
      </div>
    </aside>
  );
}
