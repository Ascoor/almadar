import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ToggleLeft, ToggleRight } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';

const normalizeAction = (action) => (action === 'update' ? 'edit' : action);

// خلي الترتيب اللي تحبه
const ACTIONS = ['view', 'create', 'edit', 'delete', 'listen'];

const PERMISSIONS_TREE = {
  litigations: ['litigation-from', 'litigation-against'],
  'litigation-from': ['litigation-from-actions'],
  'litigation-against': ['litigation-against-actions'],
  investigations: ['investigation-actions'],
};

const buildParentMap = (tree) => {
  const parents = {};
  Object.entries(tree).forEach(([parent, children]) => {
    children.forEach((child) => {
      parents[child] = parent;
    });
  });
  return parents;
};

const getAncestors = (node, parentMap) => {
  const result = [];
  let current = parentMap[node];
  while (current) {
    result.push(current);
    current = parentMap[current];
  }
  return result;
};

const getDescendants = (node, tree) => {
  const result = [];
  const stack = [...(tree[node] || [])];
  while (stack.length) {
    const child = stack.pop();
    result.push(child);
    const children = tree[child] || [];
    stack.push(...children);
  }
  return result;
};

/**
 * local:
 * {
 *   [sectionKey]: {
 *     view: { id, name, enabled, action },
 *     create: {...},
 *     edit: {...},
 *     delete: {...},
 *     listen: {...}
 *   }
 * }
 */
const groupPermissionsBySection = (all = [], user = []) => {
  const have = new Set((user || []).map((p) => String(p?.name || '').toLowerCase()));
  const out = {};

  for (const perm of all || []) {
    const lower = String(perm?.name || '').toLowerCase().trim();
    if (!lower) continue;

    let [action, ...parts] = lower.split(' ');
    action = normalizeAction(action);

    // لو عندك أفعال أخرى غير اللي فوق سيبها تتعدى أو ضيفها
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
  allPermissions = [],
  userPermissions = [],
  handlePermissionChange,
  loading,
}) {
  const { hasPermission } = useAuth();
  const { t, lang } = useLanguage();

  const canEdit = hasPermission('edit permissions');

  const [local, setLocal] = useState({});
  const [pending, setPending] = useState({}); // { [permName]: true }

  const dir = lang === 'ar' ? 'rtl' : 'ltr';
  const localRef = useRef(local);
  useEffect(() => {
    localRef.current = local;
  }, [local]);

  // ✅ Sync always مع props
  useEffect(() => {
    setLocal(groupPermissionsBySection(allPermissions, userPermissions));
  }, [allPermissions, userPermissions]);

  const translatePermission = useMemo(
    () => (action) => {
      const key = `permissions.actions.${action}`;
      const label = t(key);
      return label === key ? action : label;
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

  const disabledReasonGlobal = useMemo(() => {
    if (loading) return t('common.loading') === 'common.loading' ? 'جاري التحميل...' : t('common.loading');
    if (!canEdit) return t('permissions.noEdit') === 'permissions.noEdit' ? 'ليست لديك صلاحية تعديل الصلاحيات' : t('permissions.noEdit');
    return null;
  }, [loading, canEdit, t]);

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
      for (const k of Object.keys(sec)) sec[k] = { ...sec[k] };
      patchFn(sec);
      next[sectionKey] = sec;
      return next;
    });
  };

  const applySectionsPatch = (sectionKeys, patchFn) => {
    setLocal((prev) => {
      const next = { ...prev };
      sectionKeys.forEach((sectionKey) => {
        if (!next[sectionKey]) return;
        const sec = { ...(next[sectionKey] || {}) };
        for (const k of Object.keys(sec)) sec[k] = { ...sec[k] };
        patchFn(sectionKey, sec);
        next[sectionKey] = sec;
      });
      return next;
    });
  };

  const applyChanges = async (changes, options = {}) => {
    const names = changes.map((c) => c.name);
    markPending(names, true);

    try {
      await Promise.all(
        changes.map((c) =>
          Promise.resolve(handlePermissionChange?.(c.name, c.enabled, options)),
        ),
      );
    } catch (err) {
      // رجوع لآخر source of truth
      setLocal(groupPermissionsBySection(allPermissions, userPermissions));
      toast.error(t('permissions.updateFailedTitle') === 'permissions.updateFailedTitle' ? 'فشل تحديث الصلاحيات' : t('permissions.updateFailedTitle'), {
        description:
          err?.message ||
          (t('permissions.tryAgain') === 'permissions.tryAgain' ? 'حاول مرة أخرى' : t('permissions.tryAgain')),
      });
    } finally {
      markPending(names, false);
    }
  };

  const parentMap = useMemo(() => buildParentMap(PERMISSIONS_TREE), []);

  const roots = useMemo(() => {
    const rootOrder = ['litigations', 'investigations'];
    const keys = Object.keys(local).filter((key) => !parentMap[key]);

    return keys.sort((a, b) => {
      const ia = rootOrder.indexOf(a);
      const ib = rootOrder.indexOf(b);
      if (ia !== -1 || ib !== -1) {
        if (ia === -1) return 1;
        if (ib === -1) return -1;
        return ia - ib;
      }

      return translateSection(a).localeCompare(translateSection(b), lang === 'ar' ? 'ar' : 'en');
    });
  }, [lang, local, parentMap, translateSection]);

  const onToggleView = async (sectionKey, secPerms, val) => {
    const viewPerm = secPerms?.view;
    if (!viewPerm) return;

    if (disabledReasonGlobal) return toast.error(disabledReasonGlobal);
    if (pending[viewPerm.name]) return;

    if (val === false) {
      const targetSections = [sectionKey, ...getDescendants(sectionKey, PERMISSIONS_TREE)].filter(
        (key) => localRef.current[key],
      );
      const targetPendingNames = targetSections
        .flatMap((key) => ACTIONS.map((actionKey) => localRef.current[key]?.[actionKey]?.name))
        .filter(Boolean);
      if (targetPendingNames.some((name) => pending[name])) return;
      const changes = [];

      applySectionsPatch(targetSections, (key, sec) => {
        ACTIONS.forEach((actionKey) => {
          if (sec[actionKey]) {
            if (sec[actionKey].enabled) changes.push({ name: sec[actionKey].name, enabled: false });
            sec[actionKey].enabled = false;
          }
        });
      });

      await applyChanges(changes, { silent: true, batch: true });

      toast(
        t('permissions.viewOffCascade') === 'permissions.viewOffCascade'
          ? 'تم إلغاء عرض القسم وتعطيل جميع صلاحياته.'
          : t('permissions.viewOffCascade'),
      );
      return;
    }

    applySectionPatch(sectionKey, (sec) => {
      if (sec.view) sec.view.enabled = true;
    });

    await applyChanges([{ name: viewPerm.name, enabled: true }]);
  };

  const onToggleAction = async (sectionKey, secPerms, actionKey, val) => {
    const perm = secPerms?.[actionKey];
    if (!perm) return;

    if (disabledReasonGlobal) return toast.error(disabledReasonGlobal);

    const ancestors = getAncestors(sectionKey, parentMap);
    const sectionsNeedingView = [sectionKey, ...ancestors]
      .map((key) => ({ key, sec: localRef.current[key] }))
      .filter(({ sec }) => sec?.view && !sec.view.enabled);

    const namesPendingCheck = [perm.name, ...sectionsNeedingView.map(({ sec }) => sec.view.name)];
    if (namesPendingCheck.some((name) => pending[name])) return;

    const viewPerm = secPerms?.view;
    const isViewOn = viewPerm?.enabled ?? false;
    const needView = actionKey !== 'view';

    if (val === true && needView) {
      const changes = [];
      const sectionsToPatch = new Set([sectionKey, ...sectionsNeedingView.map(({ key }) => key)]);

      applySectionsPatch([...sectionsToPatch], (key, sec) => {
        if (sectionsNeedingView.find((s) => s.key === key) && sec.view) {
          sec.view.enabled = true;
        }
        if (key === sectionKey) {
          sec[actionKey].enabled = true;
        }
      });

      sectionsNeedingView.forEach(({ sec }) => {
        changes.push({ name: sec.view.name, enabled: true });
      });
      changes.push({ name: perm.name, enabled: true });

      await applyChanges(changes, { silent: true, batch: true });

      if (!isViewOn && viewPerm) {
        toast(
          t('permissions.autoEnabledView') === 'permissions.autoEnabledView'
            ? 'تم تفعيل "عرض" تلقائياً ثم تفعيل الصلاحية.'
            : t('permissions.autoEnabledView'),
        );
      }
      return;
    }

    if (pending[perm.name]) return;

    applySectionPatch(sectionKey, (sec) => {
      sec[actionKey].enabled = val;
    });

    await applyChanges([{ name: perm.name, enabled: val }]);
  };

  const renderNode = (sectionKey, depth = 0) => {
    const secPerms = local[sectionKey];
    if (!secPerms) return null;

    const viewPerm = secPerms?.view;
    const isViewOn = viewPerm?.enabled ?? false;
    const total = ACTIONS.filter((a) => secPerms?.[a]).length;
    const enabledCount = ACTIONS.filter((a) => secPerms?.[a]?.enabled).length;

    const children = (PERMISSIONS_TREE[sectionKey] || []).filter((child) => local[child]);

    return (
      <div key={sectionKey} className="space-y-3">
        <div
          className={`rounded-2xl border border-border bg-card/75 backdrop-blur shadow-md p-4 space-y-3 border-l-4`}
          style={{ marginInlineStart: depth * 16 }}
        >
          <div className="space-y-1">
            <h3 className="font-extrabold text-fg flex items-center justify-between">
              <span>{translateSection(sectionKey)}</span>
              <span className="text-xs text-muted-foreground">
                {t('permissions.enabledCount') === 'permissions.enabledCount'
                  ? 'مفعّل'
                  : t('permissions.enabledCount')}
                : <b className="text-fg">{enabledCount}</b> / {total}
              </span>
            </h3>
          </div>

          <div className="space-y-2">
            {ACTIONS.map((actionKey) => {
              const perm = secPerms?.[actionKey];
              if (!perm) return null;

              const isPending = !!pending[perm.name];

              const reason =
                disabledReasonGlobal ||
                (actionKey !== 'view' && !isViewOn
                  ? t('permissions.needView') === 'permissions.needView'
                    ? 'يجب تفعيل "عرض" أولاً.'
                    : t('permissions.needView')
                  : isPending
                    ? t('common.updating') === 'common.updating' ? 'جاري التحديث...' : t('common.updating')
                    : null);

              const onToggle =
                actionKey === 'view'
                  ? (val) => onToggleView(sectionKey, secPerms, val)
                  : (val) => onToggleAction(sectionKey, secPerms, actionKey, val);

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

        {children.length > 0 && (
          <div className="space-y-3">
            {children.map((child) => renderNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div dir={dir} className="space-y-4">
      {roots.map((root) => renderNode(root))}
    </div>
  );
}
