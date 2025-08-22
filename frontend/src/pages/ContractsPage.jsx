import React, { useState, useEffect, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getContractCategories } from '../services/api/contracts';
import { LocalIcon, InternationalIcon } from '../assets/icons';
import { useNavigate } from 'react-router-dom';
import { useContracts } from '@/hooks/dataHooks'; // ✅ استخدم الهُوك المُخصص
const SectionHeader = lazy(() => import('../components/common/SectionHeader'));
const ContractsTable = lazy(() => import('../components/Contracts/ContractsTable'));

export default function Contracts() {
  const [activeTab, setActiveTab] = useState('local');
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  // ✅ استدعِ البيانات من hook
  const { data, isLoading, refetch } = useContracts();

  useEffect(() => {
    (async () => {
      try {
        const res = await getContractCategories();
        setCategories(res?.data?.data || []);
      } catch {
        console.error("فشل جلب التصنيفات");
      }
    })();
  }, []);

  // ✅ الوصول للعقود بطريقة آمنة
  const contracts = data?.data?.data || [];

  // ✅ معالجات الخطأ يمكن أن تُنقل للهُوك لاحقًا إن أردت
  useEffect(() => {
    if (data?.status === 403) {
      navigate('/forbidden');
    }
  }, [data, navigate]);

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">

      <motion.div
        key="header"
        initial={{ opacity: 0, y: -100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -40 }}
        transition={{ type: 'spring', stiffness: 70, damping: 14 }}
      >
        <Suspense fallback={<div className="text-center text-sm">تحميل العنوان...</div>}>
          <SectionHeader
            icon={activeTab === 'local' ? LocalIcon : InternationalIcon}
            listName={activeTab === 'local' ? 'العقود المحلية' : 'العقود الدولية'}
          />
        </Suspense>
      </motion.div>

      <div className="flex justify-center gap-4">
        {['local', 'international'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2 rounded-full text-sm font-bold transition border ${
              activeTab === tab
                ? 'dark:bg-greenic bg-gold/80 text-black dark:text-white'
                : 'dark:text-greenic text-gold dark:border-greenic border-gold hover:bg-royal'
            }`}
          >
            {tab === 'local' ? 'العقود المحلية' : 'العقود الدولية'}
          </button>
        ))}
      </div>

      <div className="mt-6 min-h-[300px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 60 }}
            transition={{ type: 'spring', stiffness: 60, damping: 14, delay: 0.1 }}
            className="rounded-xl bg-card text-card-foreground p-4 shadow-md"
          >
            <Suspense fallback={<div className="text-center text-sm">جاري تحميل الجدول...</div>}>
              <ContractsTable
                contracts={contracts}
                categories={categories}
                reloadContracts={refetch}
                scope={activeTab}
                loading={isLoading}
              />
            </Suspense> 
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
