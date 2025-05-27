import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import ContractsTable from '../components/Contracts/ContractsTable';
import { getContracts, getContractCategories } from '../services/api/contracts';
import SectionHeader from '../components/common/SectionHeader';
import { ContractSection } from '../assets/icons';
import AuthSpinner from '../components/common/Spinners/AuthSpinner';
import { useNavigate } from 'react-router-dom';

export default function Contracts() {
  const [activeTab, setActiveTab] = useState('local');
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['contracts'],
    queryFn: getContracts,
    onError: (error) => {
      if (error.response?.status === 403) {
        navigate('/forbidden');
      }
    },
    retry: false, // حتى لا يعيد المحاولة تلقائيًا في حالة 403
  });

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

  const contracts = data?.data?.data || [];

  if (isLoading) return <AuthSpinner />;
  if (isError) return null; // تم التوجيه إلى forbidden بالفعل

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      <SectionHeader icon={ContractSection} listName="وحدة التعاقدات" />

      <div className="flex justify-center gap-4">
        {['local', 'international'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2 rounded-full text-sm font-bold transition border ${
              activeTab === tab
                ? 'dark:bg-greenic  bg-gold/80 text-black dark:text-white'
                : '  dark:text-greenic text-gold dark:border-greenic  border-gold hover:bg-royal'
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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="rounded-xl bg-card text-card-foreground p-4 shadow-md"
          >
            <ContractsTable
              contracts={contracts}
              categories={categories}
              reloadContracts={refetch}
              scope={activeTab}
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
