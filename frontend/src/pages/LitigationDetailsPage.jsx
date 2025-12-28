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
import { Building2, Gavel, Hash, ShieldCheck, User, MessageCircle, Pencil } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { getLitigationById } from '@/services/api/litigations';
import { toast } from 'sonner';

const LitigationActionsTable = lazy(
  () => import('@/features/litigations/components/LitigationActionsTable'),
);
const LitigationModal = lazy(
  () => import('@/features/litigations/components/LitigationModal'),
);

export default function LitigationDetailsPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const { hasPermission } = useAuth();
  const canEdit = hasPermission('edit litigations');

  const { data, refetch } = useLitigations();
  const litigations = data?.data?.data || [];
  const initialLitigation =
    location.state || litigations.find((l) => l.id === Number(id));

  const [current, setCurrent] = useState(initialLitigation);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

      <Suspense fallback={null}>
        {isModalOpen && canEdit ? (
          <LitigationModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            initialData={current}
            reloadLitigations={async () => {
              try {
                const refreshed = await getLitigationById(current.id);
                setCurrent(refreshed.data?.data ?? refreshed.data ?? current);
              } catch (error) {
                console.error(error);
                toast.error('تعذر تحديث بيانات القضية بعد التعديل');
              }
              refetch();
            }}
          />
        ) : null}
      </Suspense>
    </div>
  );
}
