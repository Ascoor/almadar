import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ToggleLeft, ToggleRight } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import {
  ACTIONS,
  PERMISSION_TREE,
  normalizePermissionName,
  permKey,
} from '@/auth/permissionCatalog';

const buildPermissionIndex = (all = [], user = []) => {
  const enabledSet = new Set(
    (user || []).map((p) => normalizePermissionName(p?.name || p)),
  );
  const index = new Map();

  for (const perm of all || []) {
    const normalized = normalizePermissionName(perm?.name || perm);
    if (!normalized) continue;
    const [action, ...moduleParts] = normalized.split(' ');
    const module = moduleParts.join(' ');
    if (!action || !module) continue;
    if (!ACTIONS.includes(action)) continue;

    index.set(`${action} ${module}`, {
      id: perm?.id ?? `${action}-${module}`,
      name: perm?.name ?? normalized,
      normalizedName: normalized,
      action,
      module,
      enabled: enabledSet.has(normalized),
    });
  }

  return index;
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

const getNodeLabel = (node, lang) => {
  if (lang === 'en') return node.label.en || node.label.ar || node.key;
  return node.label.ar || node.label.en || node.key;
};

export default function PermissionsSection({
  allPermissions = [],
  userPermissions = [],
  handlePermissionChange,
  loading,
}) {
  const { hasPermission } = useAuth();
  const { t, lang } = useLanguage();
  const canEdit = hasPermission(permKey('edit', 'permissions'));

  const [localIndex, setLocalIndex] = useState(new Map());
  const [pending, setPending] = useState({});
  const dir = lang === 'ar' ? 'rtl' : 'ltr';

  const localRef = useRef(localIndex);
  useEffect(() => {
    localRef.current = localIndex;
  }, [localIndex]);

  useEffect(() => {
    setLocalIndex(buildPermissionIndex(allPermissions, userPermissions));
  }, [allPermissions, userPermissions]);

  const translatePermission = useMemo(
    () => (action) => {
      const key = `permissions.actions.${action}`;
      const label = t(key);
      return label === key ? action : label;
    },
    [t],
  );

  const disabledReasonGlobal = useMemo(() => {
    if (loading)
      return t('common.loading') === 'common.loading'
        ? 'جاري التحميل...'
        : t('common.loading');
    if (!canEdit)
      return t('permissions.noEdit') === 'permissions.noEdit'
        ? 'ليست لديك صلاحية تعديل الصلاحيات'
        : t('permissions.noEdit');
    return null;
  }, [loading, canEdit, t]);

  const markPending = (keys, isOn) => {
    setPending((prev) => {
      const next = { ...prev };
      for (const key of keys) {
        if (isOn) next[key] = true;
        else delete next[key];
      }
      return next;
    });
  };

  const applyLocalChanges = (changes) => {
    if (!changes.length) return;
    setLocalIndex((prev) => {
      const next = new Map(prev);
      changes.forEach(({ key, enabled }) => {
        const item = next.get(key);
        if (!item) return;
        next.set(key, { ...item, enabled });
      });
      return next;
    });
  };

  const applyChanges = async (changes, options = {}) => {
    if (!changes.length) return;
    const keys = changes.map((c) => c.key);
    markPending(keys, true);

    try {
      await Promise.all(
        changes.map((c) =>
          Promise.resolve(handlePermissionChange?.(c.name, c.enabled, options)),
        ),
      );
    } catch (err) {
      setLocalIndex(buildPermissionIndex(allPermissions, userPermissions));
      toast.error(
        t('permissions.updateFailedTitle') === 'permissions.updateFailedTitle'
          ? 'فشل تحديث الصلاحيات'
          : t('permissions.updateFailedTitle'),
        {
          description:
            err?.message ||
            (t('permissions.tryAgain') === 'permissions.tryAgain'
              ? 'حاول مرة أخرى'
              : t('permissions.tryAgain')),
        },
      );
    } finally {
      markPending(keys, false);
    }
  };

  const enableAll = async (module) => {
    if (disabledReasonGlobal) return toast.error(disabledReasonGlobal);
    const index = localRef.current;
    const changes = [];
    const localChanges = [];

    ACTIONS.forEach((action) => {
      const key = permKey(action, module);
      const item = index.get(key);
      if (!item || item.enabled) return;
      changes.push({ key, name: item.name, enabled: true });
      localChanges.push({ key, enabled: true });
    });

    applyLocalChanges(localChanges);
    await applyChanges(changes, { silent: true, batch: true });
    if (changes.length)
      toast(
        t('permissions.enabledAll') === 'permissions.enabledAll'
          ? 'تم تفعيل جميع صلاحيات القسم.'
          : t('permissions.enabledAll'),
      );
  };

  const disableAll = async (module) => {
    if (disabledReasonGlobal) return toast.error(disabledReasonGlobal);
    const index = localRef.current;
    const changes = [];
    const localChanges = [];

    ACTIONS.forEach((action) => {
      const key = permKey(action, module);
      const item = index.get(key);
      if (!item || !item.enabled) return;
      changes.push({ key, name: item.name, enabled: false });
      localChanges.push({ key, enabled: false });
    });

    applyLocalChanges(localChanges);
    await applyChanges(changes, { silent: true, batch: true });
    if (changes.length)
      toast(
        t('permissions.disabledAll') === 'permissions.disabledAll'
          ? 'تم إلغاء جميع صلاحيات القسم.'
          : t('permissions.disabledAll'),
      );
  };

  const onToggleView = async (module, val) => {
    const key = permKey('view', module);
    const index = localRef.current;
    const viewPerm = index.get(key);
    if (!viewPerm) return;

    if (disabledReasonGlobal) return toast.error(disabledReasonGlobal);
    if (pending[key]) return;

    if (!val) {
      const changes = [];
      const localChanges = [];
      ACTIONS.forEach((action) => {
        const actionKey = permKey(action, module);
        const item = index.get(actionKey);
        if (!item || !item.enabled) return;
        changes.push({ key: actionKey, name: item.name, enabled: false });
        localChanges.push({ key: actionKey, enabled: false });
      });

      applyLocalChanges(localChanges);
      await applyChanges(changes, { silent: true, batch: true });

      if (changes.length)
        toast(
          t('permissions.viewOffCascade') === 'permissions.viewOffCascade'
            ? 'تم إلغاء عرض القسم وتعطيل جميع صلاحياته.'
            : t('permissions.viewOffCascade'),
        );
      return;
    }

    if (viewPerm.enabled) return;
    applyLocalChanges([{ key, enabled: true }]);
    await applyChanges([{ key, name: viewPerm.name, enabled: true }]);
  };

  const onToggleAction = async (module, actionKey, val) => {
    const key = permKey(actionKey, module);
    const index = localRef.current;
    const perm = index.get(key);
    if (!perm) return;

    if (disabledReasonGlobal) return toast.error(disabledReasonGlobal);
    if (pending[key]) return;

    const viewKey = permKey('view', module);
    const viewPerm = index.get(viewKey);
    const isViewOn = viewPerm?.enabled ?? false;
    if (!isViewOn && actionKey !== 'view') {
      return toast(
        t('permissions.needView') === 'permissions.needView'
          ? 'يجب تفعيل "عرض" أولاً.'
          : t('permissions.needView'),
      );
    }

    applyLocalChanges([{ key, enabled: val }]);
    await applyChanges([{ key, name: perm.name, enabled: val }]);
  };

  const renderNode = (node) => {
    const label = getNodeLabel(node, lang);
    const availableActions = ACTIONS.filter((action) =>
      localIndex.has(permKey(action, node.module)),
    );
    const hasActions = availableActions.length > 0;
    const viewPerm = localIndex.get(permKey('view', node.module));
    const isViewOn = viewPerm?.enabled ?? false;

    const enabledCount = availableActions.filter((action) =>
      localIndex.get(permKey(action, node.module))?.enabled,
    ).length;

    return (
      <div key={node.key} className="space-y-3">
        <div className="rounded-2xl border border-border bg-card/75 backdrop-blur shadow-md p-4 space-y-3">
          <div className="space-y-1">
            <h3 className="text-center font-extrabold text-fg">{label}</h3>

            {hasActions && (
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>
                  {t('permissions.enabledCount') ===
                  'permissions.enabledCount'
                    ? 'مفعّل'
                    : t('permissions.enabledCount')}
                  : <b className="text-fg">{enabledCount}</b> /{' '}
                  {availableActions.length}
                </span>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => enableAll(node.module)}
                    className="px-2 py-1 rounded-lg border border-border bg-muted/40 hover:bg-muted/60 transition"
                  >
                    {t('permissions.enableAll') === 'permissions.enableAll'
                      ? 'تفعيل الكل'
                      : t('permissions.enableAll')}
                  </button>
                  <button
                    type="button"
                    onClick={() => disableAll(node.module)}
                    className="px-2 py-1 rounded-lg border border-border bg-muted/40 hover:bg-muted/60 transition"
                  >
                    {t('permissions.disableAll') === 'permissions.disableAll'
                      ? 'إلغاء الكل'
                      : t('permissions.disableAll')}
                  </button>
                </div>
              </div>
            )}
          </div>

          {hasActions && (
            <div className="space-y-2">
              {availableActions.map((actionKey) => {
                const perm = localIndex.get(permKey(actionKey, node.module));
                if (!perm) return null;

                const isPending = !!pending[permKey(actionKey, node.module)];

                const reason =
                  disabledReasonGlobal ||
                  (actionKey !== 'view' && !isViewOn
                    ? t('permissions.needView') === 'permissions.needView'
                      ? 'يجب تفعيل "عرض" أولاً.'
                      : t('permissions.needView')
                    : isPending
                      ? t('common.updating') === 'common.updating'
                        ? 'جاري التحديث...'
                        : t('common.updating')
                      : null);

                const onToggle =
                  actionKey === 'view'
                    ? (val) => onToggleView(node.module, val)
                    : (val) => onToggleAction(node.module, actionKey, val);

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
          )}
        </div>

        {node.children?.length ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pr-2 border-r border-white/10">
            {node.children.map(renderNode)}
          </div>
        ) : null}
      </div>
    );
  };

  return (
    <div
      dir={dir}
      className="grid grid-cols-1 lg:grid-cols-2 gap-6"
    >
      {PERMISSION_TREE.map(renderNode)}
    </div>
  );
}
