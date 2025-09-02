import { useState, lazy, Suspense } from 'react';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
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
  const [activeTab, setActiveTab] = useState('against');
  const [litigationToDelete, setLitigationToDelete] = useState(null);
  const location = useLocation();

  // ✅ استخدام React Query لجلب الدعاوى
  const { data, isLoading, refetch } = useLitigations();

  const allLitigations = data?.data?.data || [];

  const filteredLitigations =
    activeTab === 'against'
      ? allLitigations.filter((c) => c.scope === 'against')
      : allLitigations.filter((c) => c.scope === 'from');

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
    <div className="p-4 sm:p-6 lg:p-8 min-h-screen space-y-8 transition-colors">
      <motion.div
        key="header"
        initial={{ opacity: 0, y: -80 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -40 }}
        transition={{ type: 'spring', stiffness: 70, damping: 14 }}
      >
        <SectionHeader    showBackButton listName="قسم التقاضي" icon={CaseIcon} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="flex justify-center gap-4"
      >
        {[
          { key: 'from', label: 'من الشركة' },
          { key: 'against', label: 'ضد الشركة' },
        ].map((tab) => (
          <motion.button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-6 py-2 text-sm font-bold border rounded-full transition ${
              activeTab === tab.key
                ? 'bg-primary text-primary-foreground shadow-md'
                : 'bg-bg text-primary border-primary hover:bg-primary/10'
            }`}
          >
            {tab.label}
          </motion.button>
        ))}
      </motion.div>

      <motion.div
        key={`table-wrapper-${activeTab}`}
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -40 }}
        transition={{
          type: 'spring',
          stiffness: 60,
          damping: 18,
          delay: 0.2,
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{
              type: 'spring',
              stiffness: 60,
              damping: 18,
              delay: 0.1,
            }}
          >
            <Card className="p-4 sm:p-6 rounded-xl shadow-md border overflow-x-auto bg-card text-fg">
              <Suspense fallback={<div>تحميل الجدول...</div>}>
                <UnifiedLitigationsTable
                  litigations={filteredLitigations}
                  reloadLitigations={refetch}
                  scope={activeTab}
                  onDelete={setLitigationToDelete}
                  loading={isLoading}
                  autoOpen={location.state?.openModal}
                />
              </Suspense>
            </Card>
          </motion.div>
        </AnimatePresence>
      </motion.div>

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
