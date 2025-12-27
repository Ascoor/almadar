import { lazy, Suspense } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import InvestigationDetailsSmart from '@/features/investigations/components/InvestigationDetailsSmart';
import {
  DetailsShell,
  InfoItem,
  SectionCard,
} from '@/components/common/details/DetailsPrimitives';
import EntityComments from '@/components/common/EntityComments';
import { Building2, Hash, ShieldCheck, User, MessageCircle } from 'lucide-react';

const InvestigationActionsTable = lazy(
  () => import('@/features/investigations/components/InvestigationActionsTable'),
);

export default function InvestigationDetailsPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();

  const initial = location.state || null; // from table click

  return (
    <InvestigationDetailsSmart id={id} selected={initial}>
      {(current) => (
        <div className="p-4 sm:p-6 lg:p-8 min-h-screen space-y-4">
          <div className="flex gap-2">
            <Button onClick={() => navigate(-1)}>رجوع</Button>
          </div>

          <DetailsShell
            title="تفاصيل التحقيق"
            subtitle="واجهة موحدة للمعلومات والتعليقات"
            icon={ShieldCheck}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 text-sm">
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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <SectionCard title="التعليقات" icon={MessageCircle}>
                <EntityComments entityType="investigations" entityId={current.id} />
              </SectionCard>

              <SectionCard title="الإجراءات" icon={ShieldCheck} hint="محدثة تلقائيًا">
                <Suspense fallback={<div>تحميل البيانات...</div>}>
                  <InvestigationActionsTable
                    investigationId={current.id}
                    reloadInvestigations={() => {}}
                  />
                </Suspense>
              </SectionCard>
            </div>
          </DetailsShell>
        </div>
      )}
    </InvestigationDetailsSmart>
  );
}
