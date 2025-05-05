import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Local from '../components/Contracts/Local';
import International from '../components/Contracts/International';
import { getContracts, getContractCategories } from '../services/api/contracts';
import { toast } from 'react-toastify';
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
      setContracts(res?.data?.data || []);
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
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      <SectionHeader icon={ContractSection} listName="وحدة التعاقدات" />

      {/* التبويبات */}
      <div className="flex flex-wrap justify-center gap-4">
        <button
          onClick={() => setActiveTab('local')}
          className={`px-6 py-2 rounded-full text-sm font-bold transition-all duration-300 border
            ${
              activeTab === 'local'
                ? 'bg-primary text-primary-foreground'
                : 'bg-background text-primary border-primary hover:bg-muted'
            }`}
        >
          العقود المحلية
        </button>
        <button
          onClick={() => setActiveTab('international')}
          className={`px-6 py-2 rounded-full text-sm font-bold transition-all duration-300 border
            ${
              activeTab === 'international'
                ? 'bg-primary text-primary-foreground'
                : 'bg-background text-primary border-primary hover:bg-muted'
            }`}
        >
          العقود الدولية
        </button>
      </div>

      {/* الجداول */}
      <div className="mt-6 min-h-[300px]">
        <AnimatePresence mode="wait">
          {activeTab === 'local' ? (
            <motion.div
              key="local"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="rounded-xl bg-card text-card-foreground p-4 shadow-md"
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
              className="rounded-xl bg-card text-card-foreground p-4 shadow-md"
            >
              <International reloadContracts={loadContracts} categories={categories} contracts={internationalContracts} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
