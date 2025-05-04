import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Local from '../components/Contracts/Local';
import International from '../components/Contracts/International';
import { getContracts, getContractCategories } from '../services/api/contracts'; 
import { ToastContainer, toast } from 'react-toastify';
import SectionHeader from '../components/common/SectionHeader';
import { ContractSection } from '../assets/icons';

export default function Contracts() {
  const [activeTab, setActiveTab] = useState('local');
  const [contracts, setContracts] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    loadContracts();
    loadCategories();
  }, []);

  const loadContracts = async () => {
    try {
      const res = await getContracts();
      const contractsData = res?.data?.data || [];
      setContracts(contractsData);  // تحديث البيانات عند تحميل العقود
    } catch (error) {
      console.error('Error loading contracts:', error);
      toast.error('فشل تحميل العقود');
    }
  };

  const loadCategories = async () => {
    try {
      const res = await getContractCategories();
      setCategories(res?.data?.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  const localContracts = contracts.filter(c => c.scope === 'local');
  const internationalContracts = contracts.filter(c => c.scope === 'international');

  return (
    <div className="w-full p-4 space-y-6 shadow-lg bg-yellow-100/50 dark:bg-almadar-blue-dark/40 rounded-lg">
      <SectionHeader icon={ContractSection} listName="وحدة التعاقدات" />

      {/* تبويبات */}
      <div className="flex justify-center gap-4">
        <button
          onClick={() => setActiveTab('local')}
          className={`px-6 py-2 rounded-full font-semibold ${
            activeTab === 'local'
              ? 'bg-almadar-blue text-white'
              : 'bg-white text-almadar-blue border border-almadar-blue'
          }`}
        >
          العقود المحلية
        </button>
        <button
          onClick={() => setActiveTab('international')}
          className={`px-6 py-2 rounded-full font-semibold ${
            activeTab === 'international'
              ? 'bg-almadar-blue text-white'
              : 'bg-white text-almadar-blue border border-almadar-blue'
          }`}
        >
          العقود الدولية
        </button>
      </div>

      {/* الجداول */}
      <div className="mt-8 min-h-[300px]">
 
        <AnimatePresence mode="wait">
          {activeTab === 'local' ? (
            <motion.div
              key="local"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="rounded-xl bg-white dark:bg-gray-800 p-4 shadow-lg"
            >
              <Local reloadContracts={loadContracts} categories={categories} contracts={localContracts} />
            </motion.div>
          ) : (
            <motion.div
              key="international"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="rounded-xl bg-white dark:bg-gray-800 p-4 shadow-lg"
            >
              <International reloadContracts={loadContracts} categories={categories} contracts={internationalContracts} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
