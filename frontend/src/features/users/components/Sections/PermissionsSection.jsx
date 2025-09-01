  import React, { useState, useEffect, useRef } from 'react';
  import { ToggleLeft, ToggleRight } from 'lucide-react';
  import { toast } from 'sonner';
  import { useAuth } from '@/context/AuthContext';

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
      archive:'الأرشيف'
    };
    return map[section] || section;
  };

  const groupPermissionsBySection = (all = [], user = []) => {
    const have = new Set(user.map(p => p.name.toLowerCase()));
    return all.reduce((acc, perm) => {
      let [action, ...parts] = perm.name.toLowerCase().split(' ');
      if (action === 'update') action = 'edit';
      const section = parts.join(' ');
      if (!section) return acc;
      acc[section] = acc[section] || [];
      acc[section].push({
        id: perm.id,
        name: perm.name.toLowerCase(),
        action,
        enabled: have.has(perm.name.toLowerCase()),
      });
      return acc;
    }, {});
  };

  const PermissionRow = ({ label, enabled, disabled, onToggle, suppressToast }) => (
    <div className="flex items-center justify-between p-2 bg-gray-100 dark:bg-gray-700 rounded mb-2">
      <span className="font-medium">{label}</span>
      <button
        className={`text-2xl ${disabled ? 'opacity-50' : 'cursor-pointer'}`}
        disabled={disabled}
        onClick={() => {
          if (disabled) {
            if (!suppressToast) {
              toast('يجب تفعيل "عرض" أولاً.');
            }
            return;
          }
          onToggle(!enabled);
        }}
      >
        {enabled
          ? <ToggleRight className="text-green-500" />
          : <ToggleLeft className="text-red-500" />
        }
      </button>
    </div>
  );

  export default function PermissionsSection({
    allPermissions,
    userPermissions,
    handlePermissionChange,
    loading
  }) {
    const { hasPermission } = useAuth();
    const [local, setLocal] = useState({});
    const isInitialized = useRef(false);
    const [suppressToast, setSuppressToast] = useState(false);
    const [batchUpdate, setBatchUpdate] = useState(false);

    useEffect(() => {
      if (!isInitialized.current) {
        setLocal(groupPermissionsBySection(allPermissions, userPermissions));
        isInitialized.current = true;
      }
    }, [allPermissions, userPermissions]);

    const toggleLocal = (permName, val, options = {}) => {
      setLocal(prev => {
        const out = {};
        for (const [sec, perms] of Object.entries(prev)) {
          out[sec] = perms.map(p =>
            p.name === permName ? { ...p, enabled: val } : p
          );
        }
        return out;
      });
      handlePermissionChange(permName, val, options);
    };

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(local).map(([section, perms]) => {
          const viewPerm = perms.find(p => p.action === 'view');
          const isViewOn = viewPerm?.enabled ?? false;

          const onViewToggle = (val) => {
            if (!hasPermission('edit permissions')) {
              toast.error('ليست لديك صلاحية تعديل الصلاحيات');
              return;
            }
            toggleLocal(viewPerm.name, val);
            if (!val) {
              setSuppressToast(true);
              setBatchUpdate(true);
              let anyDisabled = false;
              perms
                .filter(p => p.action !== 'view' && p.enabled)
                .forEach(p => {
                  anyDisabled = true;
                  toggleLocal(p.name, false, { silent: true, batch: true });
                });
              if (anyDisabled) {
                toast('تم تعطيل جميع الصلاحيات بسبب إلغاء عرض القسم.');
              }
              setTimeout(() => {
                setSuppressToast(false);
                setBatchUpdate(false);
              }, 0);
            }
          };

          return (
            <div key={section} className="p-4 bg-white dark:bg-gray-800 rounded shadow">
              <h3 className="text-center font-bold mb-4">
                {translateSection(section)}
              </h3>
              {['view', 'create', 'edit', 'delete'].map(actionType => {
                const perm = perms.find(p => p.action === actionType);
                if (!perm) return null;
                const disabled = loading || (actionType !== 'view' && !isViewOn);
                const onToggle = actionType === 'view'
                  ? onViewToggle
                  : (val) => {
                      if (!hasPermission('edit permissions')) {
                        toast.error('ليست لديك صلاحية تعديل الصلاحيات');
                        return;
                      }
                      toggleLocal(perm.name, val);
                    };
                return (
                  <PermissionRow
                    key={perm.id}
                    label={translatePermission(actionType)}
                    enabled={perm.enabled}
                    disabled={disabled}
                    onToggle={onToggle}
                    suppressToast={suppressToast}
                  />
                );
              })}
            </div>
          );
        })}
      </div>
    );
  }
