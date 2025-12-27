import { useState, useContext, useRef } from 'react';
import { Pencil, Trash2, BookmarkPlus } from 'lucide-react';
import { toast } from 'sonner';
import { AuthContext } from '@/context/AuthContext';

import InvestigationActionModal from './InvestigationActionModal';
import GlobalConfirmDeleteModal from '@/components/common/GlobalConfirmDeleteModal';
import InvestigationActionDetailsCard from '@/features/investigations/components/InvestigationActionDetailsCard';

import {
  deleteInvestigationAction,
  updateInvestigationAction,
  createInvestigationAction,
} from '@/services/api/investigations';

import { useInvestigationActions, useActionTypes } from '@/hooks/dataHooks';

export default function InvestigationActionsTable({
  investigationId,
  reloadInvestigations,
}) {
  const [showModal, setShowModal] = useState(false);
  const [editingAction, setEditingAction] = useState(null);
  const [actionToDelete, setActionToDelete] = useState(null);

  // ✅ هنا نعرض التفاصيل داخل نفس الصفحة
  const [selectedAction, setSelectedAction] = useState(null);
  const lastScrollY = useRef(0);

  const { data: investigationActions = [], refetch } =
    useInvestigationActions(investigationId);

  const { data: investigationActionTypes = [] } =
    useActionTypes('investigation');

  const { hasPermission } = useContext(AuthContext);
  const moduleName = 'investigation-actions';
  const can = (action) => hasPermission(`${action} ${moduleName}`);

  const handleSave = async (data) => {
    try {
      if (editingAction) {
        await updateInvestigationAction(
          investigationId,
          editingAction.id,
          data,
        );
        toast.success('✅ تم تعديل الإجراء');
      } else {
        await createInvestigationAction(investigationId, data);
        toast.success('✅ تمت إضافة الإجراء');
      }

      setShowModal(false);
      await refetch();
      reloadInvestigations();
    } catch (error) {
      toast.error('❌ فشل في حفظ الإجراء');
      console.error('Save Error:', error);
    }
  };

  const handleConfirmDelete = async () => {
    if (!actionToDelete) return;
    try {
      await deleteInvestigationAction(investigationId, actionToDelete.id);
      toast.success('تم حذف الإجراء');
      setActionToDelete(null);
      refetch();
      reloadInvestigations();
    } catch {
      toast.error('فشل في حذف الإجراء');
    }
  };

  const openDetails = (action) => {
    lastScrollY.current = window.scrollY;
    setSelectedAction(action);
    requestAnimationFrame(() =>
      window.scrollTo({ top: 0, behavior: 'smooth' }),
    );
  };

  const closeDetails = () => {
    setSelectedAction(null);
    requestAnimationFrame(() =>
      window.scrollTo({ top: lastScrollY.current || 0, behavior: 'auto' }),
    );
  };

  if (!can('view')) {
    return (
      <div
        dir="rtl"
        className="rounded-2xl border border-border bg-destructive/5 px-4 py-3 text-center text-sm font-semibold text-destructive shadow-sm"
      >
        ليس لديك صلاحية الاطلاع على الإجراءات
      </div>
    );
  }

  return (
    <section dir="rtl" className="space-y-4">
      {/* Header */}
      <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <div className="space-y-1 text-right">
          <h3 className="text-lg font-bold tracking-tight text-foreground md:text-xl">
            <span className="bg-gradient-to-l from-primary to-secondary bg-clip-text text-transparent">
              إجراءات التحقيق
            </span>
          </h3>
          <p className="text-xs text-muted-foreground">
            متابعة وحوكمة الإجراءات المرتبطة بهذه الدعوى
          </p>
        </div>

        {can('create') && (
          <div className="flex w-full justify-end sm:w-auto">
            <button
              onClick={() => {
                setEditingAction(null);
                setShowModal(true);
              }}
              className="group inline-flex items-center gap-2 rounded-lg bg-gradient-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-md shadow-[var(--shadow-sm)] transition-all hover:-translate-y-[1px] hover:shadow-[var(--shadow-md)]"
            >
              <BookmarkPlus className="h-4 w-4 transition-transform group-hover:scale-110" />
              <span>إضافة إجراء</span>
            </button>
          </div>
        )}
      </div>

      {/* ✅ التفاصيل تظهر فوق الجدول مباشرة */}
      {selectedAction ? (
        <div className="mb-6">
          <InvestigationActionDetailsCard
            selected={selectedAction}
            onClose={closeDetails}
          />
        </div>
      ) : null}

      {/* Content */}
      {investigationActions.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border bg-muted/60 px-4 py-6 text-center text-sm text-muted-foreground">
          لا توجد إجراءات مسجلة لهذه الدعوى حتى الآن.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <div className="min-w-[720px] max-h-[420px] overflow-y-auto rounded-xl border border-border bg-card/70">
            <table className="w-full border-collapse text-center text-xs text-foreground/90 sm:text-sm">
              <thead className="bg-muted/80 text-xs font-semibold text-muted-foreground">
                <tr>
                  {can('edit') && <th className="px-3 py-2">تعديل</th>}
                  {can('delete') && <th className="px-3 py-2">حذف</th>}
                  <th className="px-3 py-2">تاريخ الإجراء</th>
                  <th className="px-3 py-2">نوع الإجراء</th>
                  <th className="px-3 py-2">المحامي / المستشار</th>
                  <th className="px-3 py-2">المتطلبات</th>
                  <th className="px-3 py-2">النتيجة</th>
                  <th className="px-3 py-2">المُسند إليه</th>
                  <th className="px-3 py-2">الحالة</th>
                </tr>
              </thead>

              <tbody>
                {investigationActions.map((action, idx) => (
                  <tr
                    key={action.id}
                    onClick={() => openDetails(action)} // ✅ بدون روابط
                    className={`cursor-pointer border-t border-border/60 transition-colors hover:bg-muted/40 ${
                      idx % 2 === 0 ? 'bg-card/40' : 'bg-card/20'
                    }`}
                  >
                    {can('edit') && (
                      <td className="px-2 py-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingAction(action);
                            setShowModal(true);
                          }}
                          className="inline-flex items-center justify-center rounded-full border border-border bg-bg/60 p-1.5 text-foreground transition-colors hover:bg-muted"
                          title="تعديل الإجراء"
                          type="button"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                      </td>
                    )}

                    {can('delete') && (
                      <td className="px-2 py-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActionToDelete(action);
                          }}
                          className="inline-flex items-center justify-center rounded-full border border-border bg-bg/60 p-1.5 text-foreground transition-colors hover:bg-muted"
                          title="حذف الإجراء"
                          type="button"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    )}

                    <td className="px-3 py-2 text-xs sm:text-sm">
                      {action.action_date}
                    </td>
                    <td className="px-3 py-2 text-xs sm:text-sm">
                      {action.action_type?.action_name || 'غير محدد'}
                    </td>
                    <td className="px-3 py-2 text-xs sm:text-sm">
                      {action.officer_name}
                    </td>
                    <td className="px-3 py-2 text-xs sm:text-sm text-muted-foreground">
                      {action.requirements || '—'}
                    </td>
                    <td className="px-3 py-2 text-xs sm:text-sm text-muted-foreground">
                      {action.results || '—'}
                    </td>
                    <td className="px-3 py-2 text-xs sm:text-sm">
                      {action.assigned_to?.name ||
                        action.assigned_to_user?.name ||
                        '—'}
                    </td>
                    <td className="px-3 py-2">
                      <StatusPill status={action.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modals */}
      {showModal && (
        <InvestigationActionModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          reloadInvestigations={reloadInvestigations}
          actionTypes={investigationActionTypes}
          initialData={editingAction}
          onSubmit={handleSave}
        />
      )}

      <GlobalConfirmDeleteModal
        isOpen={!!actionToDelete}
        onClose={() => setActionToDelete(null)}
        onConfirm={handleConfirmDelete}
        itemName={actionToDelete?.action_type?.action_name || 'الإجراء'}
      />
    </section>
  );
}

function StatusPill({ status }) {
  let label = 'منجز';
  let tone = 'done';

  if (status === 'pending') {
    label = 'معلّق';
    tone = 'pending';
  } else if (status === 'in_review') {
    label = 'قيد المراجعة';
    tone = 'review';
  } else if (status === 'cancelled') {
    label = 'ملغي';
    tone = 'cancelled';
  }

  const base =
    'inline-flex items-center justify-center rounded-full px-3 py-1 text-[0.7rem] font-medium sm:text-xs border';

  // ✅ token-safe (بدون warning/success لو مش موجودين عندك)
  const toneClass =
    tone === 'pending'
      ? 'border-border bg-muted text-foreground'
      : tone === 'review'
        ? 'border-border bg-bg/70 text-foreground'
        : tone === 'cancelled'
          ? 'border-border bg-bg/60 text-muted-foreground'
          : 'border-border bg-primary/10 text-foreground';

  return <span className={`${base} ${toneClass}`}>{label}</span>;
}
