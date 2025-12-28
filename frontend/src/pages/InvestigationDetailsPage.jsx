import { lazy, Suspense, useState } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import InvestigationDetailsSmart from '@/features/investigations/components/InvestigationDetailsSmart';
import {
  DetailsShell,
  InfoItem,
  SectionCard,
} from '@/components/common/details/DetailsPrimitives';
import EntityComments from '@/components/common/EntityComments';
import { Building2, Hash, ShieldCheck, User, MessageCircle, Pencil } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { updateInvestigation, getInvestigationById } from '@/services/api/investigations';
import { toast } from 'sonner';

const InvestigationActionsTable = lazy(
  () => import('@/features/investigations/components/InvestigationActionsTable'),
);
const InvestigationModal = lazy(
  () => import('@/features/investigations/components/InvestigationModal'),
);

export default function InvestigationDetailsPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const { hasPermission } = useAuth();
  const canEdit = hasPermission('edit investigations');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const initial = location.state || null; // from table click

  return (
    <InvestigationDetailsSmart id={id} selected={initial}>
      {(current, setCurrent) => {
        const handleSave = async (formData) => {
          try {
            await updateInvestigation(current.id, formData);
            const refreshed = await getInvestigationById(current.id);
            setCurrent(refreshed.data?.data ?? refreshed.data ?? {
              ...current,
              ...formData,
            });
            toast.success('تم تحديث بيانات التحقيق بنجاح');
            setIsModalOpen(false);
          } catch (error) {
            console.error(error);
            toast.error('فشل تحديث بيانات التحقيق');
          }
        };

        return (
          <div className="p-4 sm:p-6 lg:p-8 min-h-screen space-y-4">
            <div className="flex gap-2">
              <Button onClick={() => navigate(-1)}>رجوع</Button>
            </div>

            <DetailsShell
              title="تفاصيل التحقيق"
              subtitle="واجهة موحدة للمعلومات + الإجراءات + التعليقات"
              icon={ShieldCheck}
              actions={
                canEdit ? (
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(true)}
                    className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 border border-border bg-muted/40 hover:bg-muted/60 text-fg text-sm font-semibold shadow-[var(--shadow-sm)] transition focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <Pencil size={16} className="text-primary" />
                    تعديل
                  </button>
                ) : null
              }
            >
              {/* ✅ سطر مستقل: ملخص التحقيق */}
              <SectionCard title="ملخص التحقيق" icon={ShieldCheck}>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                  <InfoItem icon={User} label="الموظف" value={current.employee_name} />
                  <InfoItem icon={Building2} label="الجهة المحيلة" value={current.source} />
                  <InfoItem icon={Hash} label="رقم القضية" value={current.case_number} />
                  <InfoItem icon={ShieldCheck} label="الحالة" value={current.status} />
                  <InfoItem icon={MessageCircle} label="الموضوع" value={current.subject} />
                  <InfoItem
                    icon={User}
                    label="المحقق"
                    value={current.assigned_to?.name || '—'}
                  />
                </div>
              </SectionCard>

              {/* ✅ سطر مستقل: الإجراءات (جدول متجاوب) */}
              <SectionCard title="الإجراءات" icon={ShieldCheck} hint="محدثة تلقائيًا">
                <div className="w-full overflow-x-auto">
                  <div className="min-w-[720px]">
                    <div className="overflow-hidden rounded-xl border border-border/70 bg-card/70">
                      <Suspense fallback={<div className="p-4">تحميل البيانات...</div>}>
                        <InvestigationActionsTable
                          investigationId={current.id}
                          reloadInvestigations={() => {}}
                        />
                      </Suspense>
                    </div>
                  </div>
                </div>
              </SectionCard>

              {/* ✅ سطر مستقل: التعليقات */}
              <SectionCard title="التعليقات" icon={MessageCircle}>
                <EntityComments entityType="investigations" entityId={current.id} />
              </SectionCard>
            </DetailsShell>

            <Suspense fallback={null}>
              {isModalOpen && canEdit ? (
                <InvestigationModal
                  isOpen={isModalOpen}
                  onClose={() => setIsModalOpen(false)}
                  initialData={current}
                  onSubmit={handleSave}
                />
              ) : null}
            </Suspense>
          </div>
        );
      }}
    </InvestigationDetailsSmart>
  );
}
