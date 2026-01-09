export type Action = 'view' | 'create' | 'edit' | 'delete';

export type PermissionNode = {
  key: string;
  module: string;
  label: { ar: string; en?: string };
  children?: PermissionNode[];
};

export const ACTIONS: Action[] = ['view', 'create', 'edit', 'delete'];

export const PERMISSION_TREE: PermissionNode[] = [
  { key: 'dashboard', module: 'dashboard', label: { ar: 'لوحة التحكم' } },
  {
    key: 'contracts',
    module: 'contracts',
    label: { ar: 'العقود' },
    children: [
      {
        key: 'contract-categories',
        module: 'contract-categories',
        label: { ar: 'تصنيفات العقود' },
      },
    ],
  },
  {
    key: 'legal-advices',
    module: 'legal-advices',
    label: { ar: 'الرأي والمشورة' },
  },
  {
    key: 'investigations',
    module: 'investigations',
    label: { ar: 'التحقيقات' },
    children: [
      {
        key: 'investigation-actions',
        module: 'investigation-actions',
        label: { ar: 'إجراءات التحقيق' },
      },
    ],
  },
  {
    key: 'litigations',
    module: 'litigations',
    label: { ar: 'القضايا' },
    children: [
      {
        key: 'litigation-from',
        module: 'litigation-from',
        label: { ar: 'دعاوى من الشركة' },
      },
      {
        key: 'litigation-from-actions',
        module: 'litigation-from-actions',
        label: { ar: 'إجراءات دعاوى من الشركة' },
      },
      {
        key: 'litigation-against',
        module: 'litigation-against',
        label: { ar: 'دعاوى ضد الشركة' },
      },
      {
        key: 'litigation-against-actions',
        module: 'litigation-against-actions',
        label: { ar: 'إجراءات دعاوى ضد الشركة' },
      },
    ],
  },
  { key: 'archives', module: 'archives', label: { ar: 'الأرشيف' } },
  {
    key: 'management-lists',
    module: 'management-lists',
    label: { ar: 'قوائم الإدارة' },
  },
  {
    key: 'admin',
    module: 'users',
    label: { ar: 'الإدارة' },
    children: [
      { key: 'users', module: 'users', label: { ar: 'المستخدمون' } },
      { key: 'roles', module: 'roles', label: { ar: 'الأدوار' } },
      { key: 'permissions', module: 'permissions', label: { ar: 'الصلاحيات' } },
      { key: 'profile', module: 'profile', label: { ar: 'الملف الشخصي' } },
    ],
  },
];

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
