  import React, { useEffect, useMemo, useRef, useState } from 'react';
  import { ToggleLeft, ToggleRight } from 'lucide-react';
  import { toast } from 'sonner';
  import { useAuth } from '@/context/AuthContext';
  import { useLanguage } from '@/context/LanguageContext';

  const normalizeAction = (action) => (action === 'update' ? 'edit' : action);

  // خلي الترتيب اللي تحبه
  const ACTIONS = ['view', 'create', 'edit', 'delete', 'listen'];

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

    const sections = useMemo(() => {
      return Object.entries(local).sort(([a], [b]) =>
        translateSection(a).localeCompare(translateSection(b), lang === 'ar' ? 'ar' : 'en'),
      );
    }, [local, translateSection, lang]);

    const enableAll = async (sectionKey, secPerms) => {
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
      toast(t('permissions.enabledAll') === 'permissions.enabledAll' ? 'تم تفعيل جميع صلاحيات القسم.' : t('permissions.enabledAll'));
    };

    const disableAll = async (sectionKey, secPerms) => {
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
      toast(t('permissions.disabledAll') === 'permissions.disabledAll' ? 'تم إلغاء جميع صلاحيات القسم.' : t('permissions.disabledAll'));
    };

    const onToggleView = async (sectionKey, secPerms, val) => {
      const viewPerm = secPerms?.view;
      if (!viewPerm) return;

      if (disabledReasonGlobal) return toast.error(disabledReasonGlobal);
      if (pending[viewPerm.name]) return;

      if (val === false) {
        // إطفاء view => إطفاء الباقي دفعة واحدة
        const changes = [{ name: viewPerm.name, enabled: false }];

        applySectionPatch(sectionKey, (sec) => {
          if (sec.view) sec.view.enabled = false;
          for (const a of ['create', 'edit', 'delete', 'listen']) {
            if (sec[a]?.enabled) changes.push({ name: sec[a].name, enabled: false });
            if (sec[a]) sec[a].enabled = false;
          }
        });

        await applyChanges(changes, { silent: true, batch: true });

        toast(
          t('permissions.viewOffCascade') === 'permissions.viewOffCascade'
            ? 'تم إلغاء عرض القسم وتعطيل جميع صلاحياته.'
            : t('permissions.viewOffCascade'),
        );
        return;
      }

      // تشغيل view فقط
      applySectionPatch(sectionKey, (sec) => {
        if (sec.view) sec.view.enabled = true;
      });

      await applyChanges([{ name: viewPerm.name, enabled: true }]);
    };

    const onToggleAction = async (sectionKey, secPerms, actionKey, val) => {
      const perm = secPerms?.[actionKey];
      if (!perm) return;

      if (disabledReasonGlobal) return toast.error(disabledReasonGlobal);
      if (pending[perm.name]) return;

      const viewPerm = secPerms?.view;
      const isViewOn = viewPerm?.enabled ?? false;

      // لو المستخدم يفعّل create/edit/delete/listen والـ view مطفي => فعّل view تلقائياً
      const needView = actionKey !== 'view';

      if (needView && val === true && !isViewOn && viewPerm) {
        applySectionPatch(sectionKey, (sec) => {
          sec.view.enabled = true;
          sec[actionKey].enabled = true;
        });

        await applyChanges(
          [
            { name: viewPerm.name, enabled: true },
            { name: perm.name, enabled: true },
          ],
          { silent: true, batch: true },
        );

        toast(
          t('permissions.autoEnabledView') === 'permissions.autoEnabledView'
            ? 'تم تفعيل "عرض" تلقائياً ثم تفعيل الصلاحية.'
            : t('permissions.autoEnabledView'),
        );
        return;
      }

      // Toggle طبيعي
      applySectionPatch(sectionKey, (sec) => {
        sec[actionKey].enabled = val;
      });

      await applyChanges([{ name: perm.name, enabled: val }]);
    };

    return (
      <div dir={dir} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sections.map(([sectionKey, secPerms]) => {
          const viewPerm = secPerms?.view;
          const isViewOn = viewPerm?.enabled ?? false;

          const total = ACTIONS.filter((a) => secPerms?.[a]).length;
          const enabledCount = ACTIONS.filter((a) => secPerms?.[a]?.enabled).length;

          return (
            <div
              key={sectionKey}
              className="rounded-2xl border border-border bg-card/75 backdrop-blur shadow-md p-4 space-y-3"
            >
              <div className="space-y-1">
                <h3 className="text-center font-extrabold text-fg">
                  {translateSection(sectionKey)}
                </h3>

                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>
                    {t('permissions.enabledCount') === 'permissions.enabledCount'
                      ? 'مفعّل'
                      : t('permissions.enabledCount')}
                    : <b className="text-fg">{enabledCount}</b> / {total}
                  </span>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => enableAll(sectionKey, secPerms)}
                      className="px-2 py-1 rounded-lg border border-border bg-muted/40 hover:bg-muted/60 transition"
                    >
                      {t('permissions.enableAll') === 'permissions.enableAll' ? 'تفعيل الكل' : t('permissions.enableAll')}
                    </button>
                    <button
                      type="button"
                      onClick={() => disableAll(sectionKey, secPerms)}
                      className="px-2 py-1 rounded-lg border border-border bg-muted/40 hover:bg-muted/60 transition"
                    >
                      {t('permissions.disableAll') === 'permissions.disableAll' ? 'إلغاء الكل' : t('permissions.disableAll')}
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                {ACTIONS.map((actionKey) => {
                  const perm = secPerms?.[actionKey];
                  if (!perm) return null;

                  const isPending = !!pending[perm.name];

                  // سبب التعطيل:
                  // - لو مش مسموح تعديل
                  // - لو action مش view والـ view مطفي
                  // - لو request شغال
                  const reason =
                    disabledReasonGlobal ||
                    (actionKey !== 'view' && !isViewOn
                      ? (t('permissions.needView') === 'permissions.needView'
                          ? 'يجب تفعيل "عرض" أولاً.'
                          : t('permissions.needView'))
                      : isPending
                        ? (t('common.updating') === 'common.updating' ? 'جاري التحديث...' : t('common.updating'))
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
          );
        })}
      </div>
    );
  }
