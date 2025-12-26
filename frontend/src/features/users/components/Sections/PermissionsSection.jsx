import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ToggleLeft, ToggleRight } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';

const ACTIONS = ['view', 'create', 'edit', 'delete'];

const translatePermission = (name) => {
  switch (name) {
    case 'view':
      return 'عرض';
    case 'create':
      return 'إضافة';
    case 'update':
    case 'edit':
      return 'تعديل';
    case 'delete':
      return 'حذف';
    default:
      return name;
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
    archive: 'الأرشيف',
  };
  return map[section] || section;
};

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
  const have = new Set((user || []).map((p) => String(p.name || '').toLowerCase()));
  const out = {};

  for (const perm of all || []) {
    const lower = String(perm.name || '').toLowerCase();
    if (!lower) continue;

    let [action, ...parts] = lower.split(' ');
    if (action === 'update') action = 'edit';

    if (!ACTIONS.includes(action)) continue;

    const section = parts.join(' ').trim();
    if (!section) continue;

    out[section] ??= {};
    out[section][action] = {
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

  const canEdit = hasPermission('edit permissions');

  const [local, setLocal] = useState({});
  const localRef = useRef(local);

  // pending map: { [permName]: true }
  const [pending, setPending] = useState({});

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

          if (pending[viewPerm.name]) return;

          if (val === false) {
            // patch local once
            applySectionPatch(sectionKey, (sec) => {
              if (sec.view) sec.view.enabled = false;
              for (const a of ['create', 'edit', 'delete']) {
                if (sec[a]) sec[a].enabled = false;
              }
            });

            const changes = [];
            changes.push({ name: viewPerm.name, enabled: false });

            for (const a of ['create', 'edit', 'delete']) {
              const p = secPerms?.[a];
              if (p?.enabled) changes.push({ name: p.name, enabled: false });
            }

            await applyChanges(changes, { silent: true, batch: true });
            toast('تم إلغاء عرض القسم وتعطيل جميع صلاحياته.');
            return;
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
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-extrabold text-fg text-center w-full">
                {translateSection(sectionKey)}
              </h3>
            </div>

            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>
                مفعّل: <b className="text-fg">{enabledCount}</b> / {total}
              </span>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={enableAll}
                  className="px-2 py-1 rounded-lg border border-border bg-muted/40 hover:bg-muted/60 transition"
                >
                  تفعيل الكل
                </button>
                <button
                  type="button"
                  onClick={disableAll}
                  className="px-2 py-1 rounded-lg border border-border bg-muted/40 hover:bg-muted/60 transition"
                >
                  إلغاء الكل
                </button>
              </div>
            </div>

            <div className="space-y-2">
              {ACTIONS.map((actionKey) => {
                const perm = secPerms?.[actionKey];
                if (!perm) return null;

                const isPending = !!pending[perm.name];

                // Reason: global lock or need view first
                const reason =
                  disabledReasonGlobal ||
                  (actionKey !== 'view' && !isViewOn
                    ? 'يجب تفعيل "عرض" أولاً.'
                    : isPending
                      ? 'جاري التحديث...'
                      : null);

                const onToggle =
                  actionKey === 'view'
                    ? onToggleView
                    : (val) => onToggleAction(actionKey, val);

                return (
                  <PermissionRow
                    key={perm.id}
                    label={translatePermission(actionKey)}
                    enabled={perm.enabled}
                    reason={reason}
                    onToggle={onToggle}
                  />
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
