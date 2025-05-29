import React from 'react';
import { ToggleLeft, ToggleRight } from 'lucide-react';

const translatePermission = (name) => {
  switch (name) {
    case 'view': return 'عرض';
    case 'create': return 'إضافة';
    case 'update':
    case 'edit': return 'تعديل';
    case 'delete': return 'حذف';
    default: return name;
  }
};

const translateSection = (section) => {
  const map = {
    'litigation-from': 'دعاوى من الشركة',
    'litigation-against-actions': 'إجراءات دعاوى ضد الشركة',
    'litigation-against': 'دعاوى ضد الشركة',
    'litigation-from-actions': 'إجراءات دعاوى من الشركة',
    legaladvices: 'الرأي والمشورة',
    'managment-lists': 'قوائم البيانات',
    litigations: 'القضايا',
    contracts: 'العقود',
    investigations: 'التحقيقات',
    'investigation-actions': 'إجراءات التحقيق',
    users: 'المستخدمين',
    roles: 'الأدوار',
    profile: 'الملف الشخصي',
    permissions: 'الصلاحيات',
  };
  return map[section] || section;
};

const groupPermissionsBySection = (allPermissions = [], userPermissions = []) => {
  const userPermissionNames = new Set(userPermissions.map(p => p.name.toLowerCase()));
  return allPermissions.reduce((acc, perm) => {
    const [action, ...sectionParts] = perm.name.toLowerCase().split(' ');
    const section = sectionParts.join(' ');
    if (!section) return acc;

    if (!acc[section]) acc[section] = [];
    acc[section].push({
      ...perm,
      action,
      enabled: userPermissionNames.has(perm.name.toLowerCase()),
    });
    return acc;
  }, {});
};

const PermissionRow = ({ action, enabled, onChange, disabled }) => (
  <div
    className={`flex items-center justify-between w-full px-4 py-2 rounded-lg shadow-sm 
                transition-all duration-200 hover:shadow-md transform hover:scale-[1.01] mb-2
                ${enabled ? 'bg-green-50 dark:bg-green-900/20' : 'bg-gray-100 dark:bg-zinc-800'}`}
  >
    <label className="text-sm font-medium  text-gray-800 dark:text-gray-200">
      {translatePermission(action)}
    </label>
    <button
      onClick={onChange}
      disabled={disabled}
      title={disabled ? 'الصلاحية مقيدة بدون "عرض"' : ''}
      className="focus:outline-none cursor-pointer transition-all"
    >
      {enabled ? (
        <ToggleRight className="text-green-600 dark:text-green-400" size={22} />
      ) : (
        <ToggleLeft className="text-red-500 dark:text-red-400" size={22} />
      )}
    </button>
  </div>
);

const PermissionsSection = ({ allPermissions, userPermissions, handlePermissionChange, loading }) => {
  const grouped = groupPermissionsBySection(allPermissions, userPermissions);
  const sections = Object.entries(grouped);

  return (
    <div className="permissions-container grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {sections.map(([section, perms]) => {
        const viewPermission = perms.find(p => p.action === 'view');
        const isViewEnabled = viewPermission?.enabled ?? false;

        return (
          <div
            key={section}
            className="p-5 bg-white dark:bg-royal-darker dark:bg-greenic/10 border border-gray-200 dark:border-zinc-700 rounded-2xl shadow-lg transition-all hover:shadow-xl"
          >
            <h3 className="text-lg font-bold mb-4 text-center text-navy dark:text-gold">
              {translateSection(section)}
            </h3>

            {['view', 'create', 'edit', 'delete'].map((actionType) => {
              const permission = perms.find(p => p.action === actionType);
              if (!permission) return null;

              const disabled = (!isViewEnabled && actionType !== 'view') || loading;

              return (
                <PermissionRow
                  key={permission.id}
                  action={permission.action}
                  enabled={permission.enabled}
                  disabled={disabled}
                  onChange={() => handlePermissionChange(permission.name, !permission.enabled)}
                />
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

export default PermissionsSection;
