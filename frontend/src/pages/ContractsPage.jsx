// داخل ملف ContractsTabs.jsx
import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Local from '../components/Contracts/Local';
import International from '../components/Contracts/International';
import { getContracts, getContractCategories } from '../services/api/contracts'; // أضفنا الاستيراد
import ContractModal from '../components/Contracts/ContractModal';
import ContractDetails from '../components/Contracts/ContractDetails';
import { ToastContainer, toast } from 'react-toastify';


export default function Contracts() {
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
    setSelectedContract(null);
  }, [activeTab]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (detailsRef.current && !detailsRef.current.contains(event.target)) {
        setSelectedContract(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  const loadContracts = async () => {
    try {
      const res = await getContracts();
      const contractsData = res?.data?.data || []; // ✅ تصحيح
      setContracts(contractsData);
    } catch (error) {
      console.error(error);
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
 

  const localContracts = contracts.filter(c => c.scope === 'local');
  const internationalContracts = contracts.filter(c => c.scope === 'international');

  return (
    <div className="w-full p-4 space-y-6 shadow-lg bg-yellow-100/50 dark:bg-green-900/50 rounded-lg">
      <ToastContainer />
      <div className="flex justify-start mb-4">
        <button 
          onClick={handleAddContract}
          className="px-6 py-2 rounded-full bg-almadar-green text-white dark:bg-almadar-yellow dark:text-black font-semibold shadow-md hover:bg-almadar-green-dark dark:hover:bg-yellow-400"
        >
          إضافة عقد جديد
        </button>
      </div>

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

        {selectedContract && (
          <div ref={detailsRef}>
            <ContractDetails selected={selectedContract} onClose={() => setSelectedContract(null)} />
          </div>
        )}
      </div>

      <ContractModal
  isOpen={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  initialData={selectedContract}
  categories={categories}
  reloadContracts={loadContracts} // ✅ نرسل دالة تحميل العقود إلى المودال
/>

    </div>
  );
}

