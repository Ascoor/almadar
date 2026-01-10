export type Action = 'view' | 'create' | 'edit' | 'delete';

export type PermissionNode = {
  key: string;
  module: string;
  label: { ar: string; en?: string };
  route?: string;
  icon?: string;
  requiredPermission?: string;
  children?: PermissionNode[];
};

export const ACTIONS: Action[] = ['view', 'create', 'edit', 'delete'];

export const MODULE_ALIASES: Record<string, string> = {
  legaladvices: 'legal-advices',
  'managment-lists': 'management-lists',
};

export function normalizeModule(raw: string) {
  const m = raw.trim().toLowerCase();
  return MODULE_ALIASES[m] ?? m;
}

export function normalizeAction(raw: string): Action | null {
  const action = raw.trim().toLowerCase();
  if (action === 'update') return 'edit';
  return ACTIONS.includes(action as Action) ? (action as Action) : null;
}

export function permKey(action: Action, module: string) {
  return `${action} ${normalizeModule(module)}`.toLowerCase();
}

export const PERMISSION_TREE: PermissionNode[] = [
  {
    key: 'dashboard',
    module: 'dashboard',
    label: { ar: 'لوحة التحكم', en: 'Dashboard' },
    route: '/dashboard',
    icon: 'dashboard',
    requiredPermission: permKey('view', 'dashboard'),
  },
  {
    key: 'contracts',
    module: 'contracts',
    label: { ar: 'العقود', en: 'Contracts' },
    route: '/contracts',
    icon: 'contracts',
    requiredPermission: permKey('view', 'contracts'),
    children: [
      {
        key: 'contract-categories',
        module: 'contract-categories',
        label: { ar: 'تصنيفات العقود', en: 'Contract Categories' },
        route: '/management-lists',
        icon: 'contract-categories',
        requiredPermission: permKey('view', 'contract-categories'),
      },
    ],
  },
  {
    key: 'legal-advices',
    module: 'legal-advices',
    label: { ar: 'الرأي والمشورة', en: 'Legal Advices' },
    route: '/legal/legal-advices',
    icon: 'legal-advices',
    requiredPermission: permKey('view', 'legal-advices'),
  },
  {
    key: 'investigations',
    module: 'investigations',
    label: { ar: 'التحقيقات', en: 'Investigations' },
    route: '/legal/investigations',
    icon: 'investigations',
    requiredPermission: permKey('view', 'investigations'),
    children: [
      {
        key: 'investigation-actions',
        module: 'investigation-actions',
        label: { ar: 'إجراءات التحقيق', en: 'Investigation Actions' },
        route: '/legal/investigations',
        icon: 'investigation-actions',
        requiredPermission: permKey('view', 'investigation-actions'),
      },
    ],
  },
  {
    key: 'litigations',
    module: 'litigations',
    label: { ar: 'القضايا', en: 'Litigations' },
    route: '/legal/litigations',
    icon: 'litigations',
    requiredPermission: permKey('view', 'litigations'),
    children: [
      {
        key: 'litigation-from',
        module: 'litigation-from',
        label: { ar: 'دعاوى من الشركة', en: 'Company Claims' },
        route: '/legal/litigations',
        icon: 'litigation-from',
        requiredPermission: permKey('view', 'litigation-from'),
      },
      {
        key: 'litigation-from-actions',
        module: 'litigation-from-actions',
        label: { ar: 'إجراءات دعاوى من الشركة', en: 'Company Claim Actions' },
        route: '/legal/litigations',
        icon: 'litigation-from-actions',
        requiredPermission: permKey('view', 'litigation-from-actions'),
      },
      {
        key: 'litigation-against',
        module: 'litigation-against',
        label: { ar: 'دعاوى ضد الشركة', en: 'Claims Against Company' },
        route: '/legal/litigations',
        icon: 'litigation-against',
        requiredPermission: permKey('view', 'litigation-against'),
      },
      {
        key: 'litigation-against-actions',
        module: 'litigation-against-actions',
        label: { ar: 'إجراءات دعاوى ضد الشركة', en: 'Claims Against Actions' },
        route: '/legal/litigations',
        icon: 'litigation-against-actions',
        requiredPermission: permKey('view', 'litigation-against-actions'),
      },
    ],
  },
  {
    key: 'archives',
    module: 'archives',
    label: { ar: 'الأرشيف', en: 'Archives' },
    route: '/archive',
    icon: 'archives',
    requiredPermission: permKey('view', 'archives'),
  },
  {
    key: 'management-lists',
    module: 'management-lists',
    label: { ar: 'قوائم الإدارة', en: 'Management Lists' },
    route: '/management-lists',
    icon: 'management',
    requiredPermission: permKey('view', 'management-lists'),
  },
  {
    key: 'admin',
    module: 'users',
    label: { ar: 'الإدارة', en: 'Administration' },
    icon: 'admin',
    requiredPermission: permKey('view', 'users'),
    children: [
      {
        key: 'users',
        module: 'users',
        label: { ar: 'المستخدمون', en: 'Users' },
        route: '/users',
        icon: 'users',
        requiredPermission: permKey('view', 'users'),
      },
      {
        key: 'roles',
        module: 'roles',
        label: { ar: 'الأدوار', en: 'Roles' },
        route: '/users',
        icon: 'roles',
        requiredPermission: permKey('view', 'roles'),
      },
      {
        key: 'permissions',
        module: 'permissions',
        label: { ar: 'الصلاحيات', en: 'Permissions' },
        route: '/users',
        icon: 'permissions',
        requiredPermission: permKey('view', 'permissions'),
      },
      {
        key: 'profile',
        module: 'profile',
        label: { ar: 'الملف الشخصي', en: 'Profile' },
        route: '/profile',
        icon: 'profile',
        requiredPermission: permKey('view', 'profile'),
      },
    ],
  },
];

export function normalizePermissionName(raw: string) {
  const cleaned = String(raw || '').trim().toLowerCase();
  if (!cleaned) return '';
  const [rawAction, ...parts] = cleaned.split(' ');
  const action = normalizeAction(rawAction);
  const module = normalizeModule(parts.join(' '));
  if (!action || !module) return cleaned;
  return `${action} ${module}`;
}

export function normalizePermissionsList(list: string[] = []) {
  const normalized: string[] = [];
  const seen = new Set<string>();
  list.forEach((perm) => {
    const next = normalizePermissionName(String(perm || ''));
    if (!next || seen.has(next)) return;
    seen.add(next);
    normalized.push(next);
  });
  return normalized;
}
