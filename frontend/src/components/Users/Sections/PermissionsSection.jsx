import React from 'react';
import { ToggleLeft, ToggleRight } from 'lucide-react';

// ترجمة أسماء الأفعال إلى العربية
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

// ترجمة أسماء الأقسام إلى العربية
const translateSection = (section) => {
  const map = {
    legaladvices: 'الرأي والمشورة',
    'litigation-against': 'قضايا ضد الشركة',
    'litigation-from': 'قضايا من الشركة',
    'contracts-local': 'العقود المحلية',
    'contracts-international': 'العقود الدولية',
    investigations: 'التحقيقات',
    users: 'المستخدمين',
    roles: 'الأدوار',
    permissions: 'الصلاحيات',
    profile: 'الملف الشخصي',
  };
  return map[section] || section;
};

// تجميع الصلاحيات كاملة حسب القسم مع تعيين حالة التمكين (enabled) حسب صلاحيات المستخدم
const groupPermissionsBySection = (allPermissions = [], userPermissions = []) => {
  const userPermissionNames = new Set(userPermissions.map(p => p.name));
  return allPermissions.reduce((acc, perm) => {
    const parts = perm.name.toLowerCase().split(' ');
    const action = parts[0];
    const section = parts.slice(1).join(' ');
    if (!acc[section]) acc[section] = [];
    const enabled = userPermissionNames.has(perm.name);
    acc[section].push({ ...perm, action, enabled });
    return acc;
  }, {});
};

const PermissionRow = ({ action, enabled, onChange }) => (
  <div className='flex items-center justify-between w-full p-2 bg-gray-100 dark:bg-gray-700 rounded-lg shadow-md transition-transform transform hover:scale-105 mb-2'>
    <label className='text-sm font-semibold text-gray-700 dark:text-gray-200'>
      {action}
    </label>
    <button
      onClick={onChange}
      className='focus:outline-none cursor-pointer text-2xl'
    >
      {enabled ? (
        <ToggleLeft className='text-green-500' />
      ) : (
        <ToggleLeft className='text-red-500' />
      )}
    </button>
  </div>
);

const PermissionsSection = ({ allPermissions, userPermissions, handlePermissionChange, loading }) => {
  const grouped = groupPermissionsBySection(allPermissions, userPermissions);
  const sections = Object.entries(grouped);

  return (
    <div className="permissions-container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {sections.map(([section, perms]) => {
        // صلاحية العرض تتحكم في تمكين باقي الصلاحيات في القسم
        const viewPermission = perms.find(p => p.action === 'view');
        const isViewEnabled = viewPermission?.enabled ?? false;

        return (
          <div key={section} className="p-4 bg-white dark:bg-gray-800 rounded shadow flex flex-col">
            <h3 className="text-lg font-bold mb-3 text-center text-green-800 dark:text-white">
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
                  onChange={() => handlePermissionChange(permission.id, !permission.enabled)}
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
