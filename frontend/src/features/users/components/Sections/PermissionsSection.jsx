import React, { useState, useEffect, useRef, useMemo } from 'react';
import { ToggleLeft, ToggleRight } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';

const normalizeAction = (action) => (action === 'update' ? 'edit' : action);

/**
 * شكل local:
 * {
 *   [sectionKey]: {
 *     view: { id, name, enabled },
 *     create: {...},
 *     edit: {...},
 *     delete: {...}
 *   }
 * }
 */
const groupPermissionsBySection = (all = [], user = []) => {
  const have = new Set(user.map((p) => p.name.toLowerCase()));
  return all.reduce((acc, perm) => {
    let [action, ...parts] = perm.name.toLowerCase().split(' ');
    action = normalizeAction(action);
    const section = parts.join(' ');
    if (!section) return acc;
    acc[section] = acc[section] || [];
    acc[section].push({
      id: perm.id,
      name: lower,
      action,
      enabled: have.has(lower),
    };
  }

  return out;
};

function PermissionRow({ label, enabled, reason, onToggle }) {
  const isDisabled = Boolean(reason);

  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      aria-disabled={isDisabled}
      onClick={() => {
        if (isDisabled) {
          // نخليها clickable عشان نقدر نظهر سبب المنع
          toast(reason);
          return;
        }
        onToggle(!enabled);
      }}
      className={`
        w-full flex items-center justify-between
        rounded-xl border border-border
        px-3 py-2
        bg-muted/40 hover:bg-muted/55
        transition
        ${isDisabled ? 'opacity-60' : 'opacity-100'}
      `}
    >
      <span className="text-sm font-medium text-fg">{label}</span>

      <span className="text-2xl">
        {enabled ? (
          <ToggleRight className="text-success drop-shadow-sm" />
        ) : (
          <ToggleLeft className="text-destructive/80" />
        )}
      </span>
    </button>
  );
}

export default function PermissionsSection({
  allPermissions,
  userPermissions,
  handlePermissionChange,
  loading,
}) {
  const { hasPermission } = useAuth();
  const { t } = useLanguage();
  const [local, setLocal] = useState({});
  const isInitialized = useRef(false);
  const [suppressToast, setSuppressToast] = useState(false);

  const translatePermission = useMemo(
    () => (name) => {
      const key = `permissions.actions.${name}`;
      const label = t(key);
      return label === key ? name : label;
    },
    [t],
  );

  const translateSection = useMemo(
    () => (section) => {
      const key = `permissions.sections.${section}`;
      const label = t(key);
      return label === key ? section : label;
    },
    [t],
  );

  const actionOrder = ['view', 'create', 'edit', 'delete', 'listen'];

  useEffect(() => {
    localRef.current = local;
  }, [local]);

  // ✅ Sync always (بدون isInitialized)
  useEffect(() => {
    setLocal(groupPermissionsBySection(allPermissions, userPermissions));
  }, [allPermissions, userPermissions]);

  const markPending = (names, isOn) => {
    setPending((prev) => {
      const next = { ...prev };
      for (const n of names) {
        if (isOn) next[n] = true;
        else delete next[n];
      }
      return next;
    });
  };

  const applySectionPatch = (sectionKey, patchFn) => {
    setLocal((prev) => {
      const next = { ...prev };
      const sec = { ...(next[sectionKey] || {}) };

      // clone items to avoid mutation bugs
      for (const k of Object.keys(sec)) {
        sec[k] = { ...sec[k] };
      }

      patchFn(sec);
      next[sectionKey] = sec;
      return next;
    });
  };

  /**
   * changes: [{ name, enabled }]
   * options: passed to handlePermissionChange
   */
  const applyChanges = async (changes, options = {}) => {
    const names = changes.map((c) => c.name);

    // optimistic update should be done by caller via applySectionPatch
    markPending(names, true);

    try {
      await Promise.all(
        changes.map((c) =>
          Promise.resolve(handlePermissionChange?.(c.name, c.enabled, options)),
        ),
      );
    } catch (err) {
      // fallback: رجّع من props (source of truth)
      setLocal(groupPermissionsBySection(allPermissions, userPermissions));
      toast.error('فشل تحديث الصلاحيات', {
        description: err?.message || 'حاول مرة أخرى',
      });
    } finally {
      markPending(names, false);
    }
  };

  const sections = useMemo(() => {
    // ترتيب لطيف (اختياري)
    return Object.entries(local).sort(([a], [b]) =>
      translateSection(a).localeCompare(translateSection(b), 'ar'),
    );
  }, [local]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {sections.map(([sectionKey, secPerms]) => {
        const viewPerm = secPerms?.view;
        const isViewOn = viewPerm?.enabled ?? false;

        const total = ACTIONS.filter((a) => secPerms?.[a]).length;
        const enabledCount = ACTIONS.filter((a) => secPerms?.[a]?.enabled).length;

        const disabledReasonGlobal = loading
          ? 'جاري التحميل...'
          : !canEdit
            ? 'ليست لديك صلاحية تعديل الصلاحيات'
            : null;

        // ✅ Turn OFF view => disable all others in ONE shot + one toast
        const onToggleView = async (val) => {
          if (!viewPerm) return;

          if (disabledReasonGlobal) {
            toast.error(disabledReasonGlobal);
            return;
          }
          toggleLocal(viewPerm.name, val);
          if (!val) {
            setSuppressToast(true);
            let anyDisabled = false;
            perms
              .filter((p) => p.action !== 'view' && p.enabled)
              .forEach((p) => {
                anyDisabled = true;
                toggleLocal(p.name, false, { silent: true, batch: true });
              });
            if (anyDisabled) {
              toast('تم تعطيل جميع الصلاحيات بسبب إلغاء عرض القسم.');
            }
            setTimeout(() => {
              setSuppressToast(false);
            }, 0);
          }

          // val === true
          applySectionPatch(sectionKey, (sec) => {
            if (sec.view) sec.view.enabled = true;
          });

          await applyChanges([{ name: viewPerm.name, enabled: true }]);
        };

        // ✅ Toggle create/edit/delete:
        // if turning ON while view is OFF => auto-enable view then enable action
        const onToggleAction = async (actionKey, val) => {
          const perm = secPerms?.[actionKey];
          if (!perm) return;

          if (disabledReasonGlobal) {
            toast.error(disabledReasonGlobal);
            return;
          }

          if (pending[perm.name]) return;

          // require view
          const needView = actionKey !== 'view';

          if (needView && val === true && !isViewOn && viewPerm) {
            // patch local once
            applySectionPatch(sectionKey, (sec) => {
              sec.view.enabled = true;
              sec[actionKey].enabled = true;
            });

            // update server: view then action (or parallel)
            await applyChanges(
              [
                { name: viewPerm.name, enabled: true },
                { name: perm.name, enabled: true },
              ],
              { silent: true, batch: true },
            );

            toast('تم تفعيل "عرض" تلقائياً ثم تفعيل الصلاحية.');
            return;
          }

          // normal toggle
          applySectionPatch(sectionKey, (sec) => {
            sec[actionKey].enabled = val;
          });

          await applyChanges([{ name: perm.name, enabled: val }]);
        };

        // ✅ Enable all / disable all per section (اختياري لكنه ممتاز)
        const enableAll = async () => {
          if (disabledReasonGlobal) return toast.error(disabledReasonGlobal);

          const changes = [];
          applySectionPatch(sectionKey, (sec) => {
            for (const a of ACTIONS) {
              if (sec[a]) {
                sec[a].enabled = true;
                changes.push({ name: sec[a].name, enabled: true });
              }
            }
          });

          await applyChanges(changes, { silent: true, batch: true });
          toast('تم تفعيل جميع صلاحيات القسم.');
        };

        const disableAll = async () => {
          if (disabledReasonGlobal) return toast.error(disabledReasonGlobal);

          const changes = [];
          applySectionPatch(sectionKey, (sec) => {
            for (const a of ACTIONS) {
              if (sec[a]) {
                if (sec[a].enabled) changes.push({ name: sec[a].name, enabled: false });
                sec[a].enabled = false;
              }
            }
          });

          await applyChanges(changes, { silent: true, batch: true });
          toast('تم إلغاء جميع صلاحيات القسم.');
        };

        return (
          <div
            key={sectionKey}
            className="
              rounded-2xl border border-border
              bg-card/75 backdrop-blur
              shadow-md p-4 space-y-3
            "
          >
            <h3 className="text-center font-bold mb-4">
              {translateSection(section)}
            </h3>
            {actionOrder.map((actionType) => {
              const perm = perms.find((p) => p.action === actionType);
              if (!perm) return null;
              const disabled = loading || (actionType !== 'view' && !isViewOn);
              const onToggle =
                actionType === 'view'
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
