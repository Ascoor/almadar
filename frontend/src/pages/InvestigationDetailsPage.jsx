import { lazy, Suspense, useState } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import InvestigationDetailsSmart from '@/features/investigations/components/InvestigationDetailsSmart';
import {
  DetailsShell,
  InfoItem,
  SectionCard,
} from '@/components/common/details/DetailsPrimitives';
import EntityComments from '@/components/common/EntityComments';
import { Building2, Hash, ShieldCheck, User, MessageCircle } from 'lucide-react';
import { updateInvestigation } from '@/services/api/investigations';

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

  const [currentInvestigation, setCurrentInvestigation] = useState(
    location.state || null,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const initial = location.state || null; // from table click

  return (
    <InvestigationDetailsSmart
      id={id}
      selected={currentInvestigation || initial}
      onResolved={setCurrentInvestigation}
    >
      {(current) => (
        <div className="p-4 sm:p-6 lg:p-8 min-h-screen space-y-4">
          <div className="flex gap-2">
            <Button onClick={() => navigate(-1)}>رجوع</Button>
          </div>

          <DetailsShell
            title="تفاصيل التحقيق"
            subtitle="واجهة موحدة للمعلومات + الإجراءات + التعليقات"
            icon={ShieldCheck}
            actions={
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsModalOpen(true)}
              >
                تعديل
              </Button>
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
            {isModalOpen && (
              <InvestigationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                initialData={currentInvestigation || current}
                onSubmit={async (formData) => {
                  if (!current?.id) return;
                  try {
                    await updateInvestigation(current.id, formData);
                    toast.success('تم تحديث التحقيق بنجاح');
                    setCurrentInvestigation((prev) => ({
                      ...(prev || current),
                      ...formData,
                    }));
                  } catch (error) {
                    toast.error('فشل تحديث التحقيق');
                    throw error;
                  }
                }}
              />
            )}
          </Suspense>
        </div>
      )}
    </InvestigationDetailsSmart>
  );
}
