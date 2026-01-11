import { useState, lazy, Suspense } from 'react';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import SectionHeader from '@/components/common/SectionHeader';
import { deleteLitigation } from '@/services/api/litigations';
import { CaseIcon } from '@/assets/icons';
import { useLitigations } from '@/hooks/dataHooks'; // ✅ hook من React Query
import { useLocation } from 'react-router-dom';
const UnifiedLitigationsTable = lazy(
  () => import('@/features/litigations/components/UnifiedLitigationsTable'),
);
const GlobalConfirmDeleteModal = lazy(
  () => import('@/components/common/GlobalConfirmDeleteModal'),
);

export default function LitigationsPage() {
  const [litigationToDelete, setLitigationToDelete] = useState(null);
  const location = useLocation();

  // ✅ استخدام React Query لجلب الدعاوى
  const { data, isLoading, refetch } = useLitigations();

  const allLitigations = data?.data?.data || [];

  const sections = [
    {
      key: 'from',
      label: 'من الشركة',
      description: 'الدعاوى التي تم رفعها من الشركة ضد الأطراف الأخرى.',
    },
    {
      key: 'against',
      label: 'ضد الشركة',
      description: 'الدعاوى المقامة ضد الشركة والتي تحتاج للمتابعة.',
    },
  ];

  const handleConfirmDelete = async () => {
    if (!litigationToDelete) return;
    try {
      await deleteLitigation(litigationToDelete.id);
      toast.success('تم الحذف بنجاح');
      setLitigationToDelete(null);
      await refetch(); // ✅ تحديث البيانات بعد الحذف
    } catch {
      toast.error('فشل الحذف');
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 min-h-screen space-y-10 transition-colors">
      <motion.div
        key="header"
        initial={{ opacity: 0, y: -80 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -40 }}
        transition={{ type: 'spring', stiffness: 70, damping: 14 }}
      >
        <SectionHeader showBackButton listName="قسم التقاضي" icon={CaseIcon} />
      </motion.div>

      {sections.map((section, index) => (
        <motion.section
          key={section.key}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            type: 'spring',
            stiffness: 60,
            damping: 18,
            delay: 0.1 + index * 0.1,
          }}
          className="section-surface"
        >
          <div className="section-header">
            <div className="section-header-stack">
              <h3 className="text-lg font-semibold section-title section-title-animate">
                {section.label}
              </h3>
              <p className="text-sm text-muted-foreground">
                {section.description}
              </p>
            </div>
          </div>

          <Card className="p-4 sm:p-6 rounded-xl border overflow-x-auto bg-card text-fg shadow-sm">
            <Suspense fallback={<div>تحميل الجدول...</div>}>
              <UnifiedLitigationsTable
                litigations={allLitigations.filter(
                  (item) => item.scope === section.key,
                )}
                reloadLitigations={refetch}
                scope={section.key}
                onDelete={setLitigationToDelete}
                loading={isLoading}
                autoOpen={Boolean(location.state?.openModal && index === 0)}
              />
            </Suspense>
          </Card>
        </motion.section>
      ))}

      <Suspense fallback={null}>
        {litigationToDelete && (
          <GlobalConfirmDeleteModal
            isOpen={!!litigationToDelete}
            onClose={() => setLitigationToDelete(null)}
            onConfirm={handleConfirmDelete}
            itemName={litigationToDelete?.case_number || 'الدعوى'}
          />
        )}
      </Suspense>
    </div>
  );
}
