import { lazy, Suspense, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useLitigations } from '@/hooks/dataHooks';
import {
  DetailsShell,
  InfoItem,
  SectionCard,
} from '@/components/common/details/DetailsPrimitives';
import EntityComments from '@/components/common/EntityComments';
import { Building2, Gavel, Hash, ShieldCheck, User, MessageCircle } from 'lucide-react';

const LitigationActionsTable = lazy(
  () => import('@/features/litigations/components/LitigationActionsTable'),
);

export default function LitigationDetailsPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();

  const { data, refetch } = useLitigations();
  const litigations = data?.data?.data || [];
  const initialLitigation =
    location.state || litigations.find((l) => l.id === Number(id));

  const [current] = useState(initialLitigation);

  if (!current) {
    return <div className="p-4">لا توجد بيانات</div>;
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 min-h-screen space-y-4">
      <div className="mb-2 flex gap-2">
        <Button onClick={() => navigate(-1)}>رجوع</Button>
      </div>

      <DetailsShell
        title="تفاصيل القضية"
        subtitle="بطاقات موحدة مع التعليقات"
        icon={Gavel}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 text-sm">
          <InfoItem icon={Hash} label="رقم الدعوى" value={current.case_number} />
          <InfoItem icon={Building2} label="المحكمة" value={current.court} />
          <InfoItem icon={User} label="الخصم" value={current.opponent} />
          <InfoItem icon={MessageCircle} label="الموضوع" value={current.subject} />
          <InfoItem icon={ShieldCheck} label="الحالة" value={current.status} />
          <InfoItem
            icon={User}
            label="المسؤول"
            value={current.assigned_to?.name || '—'}
          />
        </div>

        {/* ✅ سطر مستقل للـ الإجراءات */}
        <SectionCard title="الإجراءات" icon={ShieldCheck} hint="تحديث مباشر">
          {/* يجعل الجدول متجاوب على الموبايل */}
          <div className="w-full overflow-x-auto">
            <div className="min-w-[720px]">
              <Suspense fallback={<div>تحميل البيانات...</div>}>
                <LitigationActionsTable
                  litigationId={current.id}
                  scope={current.scope}
                  reloadLitigations={refetch}
                />
              </Suspense>
            </div>
          </div>
        </SectionCard>

        {/* ✅ سطر مستقل للتعليقات */}
        <SectionCard title="التعليقات" icon={MessageCircle}>
          <EntityComments entityType="litigations" entityId={current.id} />
        </SectionCard>
      </DetailsShell>
    </div>
  );
}
