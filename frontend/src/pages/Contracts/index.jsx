import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Local from './Local';
import International from './International';
import { getContracts, getContractCategories } from '../../services/api/contracts';
import ContractModal from './ContractModal';
import ContractDetails from './ContractDetails'; 
import api from '../../services/api/axiosConfig'; 

export default function ContractsTabs() {
  const [activeTab, setActiveTab] = useState('local');
  const [contracts, setContracts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedContract, setSelectedContract] = useState(null);
  const detailsRef = useRef(null);

  useEffect(() => {
    loadContracts();
    loadCategories();
  }, []);

  useEffect(() => {
    setSelectedContract(null); // إغلاق التفاصيل عند تغيير التاب
  }, [activeTab]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (detailsRef.current && !detailsRef.current.contains(event.target)) {
        setSelectedContract(null); // يغلق التفاصيل لو ضغط خارج
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  const loadContracts = async () => {
    try {
      const res = await getContracts();
      setContracts(res?.data?.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  const loadCategories = async () => {
    try {
      const res = await getContractCategories();
      setCategories(res.data.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  const localContracts = contracts.filter(c => c.scope === 'local');
  const internationalContracts = contracts.filter(c => c.scope === 'international');

  const handleAddContract = () => {
    setSelectedContract(null);
    setIsModalOpen(true);
  };

  const handleEditContract = (contract) => {
    setSelectedContract(contract);
    setIsModalOpen(true);
  };

  const handleSelectContract = (contract) => {
    setSelectedContract(contract);
  };

  const handleSaveContract = () => {
    setIsModalOpen(false);
    loadContracts();
  };

  return (
    <div className="w-full p-4 space-y-6 shadow-lg bg-yellow-100/50 dark:bg-green-900/50 rounded-lg">
      {/* زر الإضافة */}
      <div className="flex justify-start mb-4">
        <button 
          onClick={handleAddContract}
          className="px-6 py-2 rounded-full bg-almadar-green text-white dark:bg-almadar-yellow dark:text-black font-semibold shadow-md hover:bg-almadar-green-dark dark:hover:bg-yellow-400"
        >
          إضافة عقد جديد
        </button>
      </div>

      {/* التابات */}
      <div className="flex justify-center gap-4">
        <button
          onClick={() => setActiveTab('local')}
          className={`px-6 py-2 rounded-full font-semibold ${activeTab === 'local' ? 'bg-almadar-green text-white' : 'bg-white text-almadar-green border border-almadar-green'}`}
        >
          العقود المحلية
        </button>
        <button
          onClick={() => setActiveTab('international')}
          className={`px-6 py-2 rounded-full font-semibold ${activeTab === 'international' ? 'bg-almadar-green text-white' : 'bg-white text-almadar-green border border-almadar-green'}`}
        >
          العقود الدولية
        </button>
      </div>

      {/* عرض الجداول مع تفاصيل العقد */}
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
              <Local contracts={localContracts} onSelectContract={handleSelectContract} onEditContract={handleEditContract} />
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
              <International contracts={internationalContracts} onSelectContract={handleSelectContract} onEditContract={handleEditContract} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* تفاصيل العقد المختار */}
        {selectedContract && (
          <div ref={detailsRef}>
            <ContractDetails selected={selectedContract} onClose={() => setSelectedContract(null)} />
          </div>
        )}
      </div>

      {/* مودال إضافة أو تعديل */}
      <ContractModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveContract}
        initialData={selectedContract}
        categories={categories}
      />
    </div>
  );
}
