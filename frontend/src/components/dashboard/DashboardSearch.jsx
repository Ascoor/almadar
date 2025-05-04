import React, { useState, useEffect } from 'react';
import ServicesModal from './SearchModals/ServicesModal';
import LegCasesModal from './SearchModals/LegCasesModal';
import ClientPowerOfAttorneys from './SearchModals/ClientPowerOfAttorneys';
import { motion } from 'framer-motion';
import AuthSpinner from '../common/Spinners/AuthSpinner';

const DashboardSearch = ({
  loading,
  error,
  filteredClients,
  onSearchChange,
}) => {
  const [selectedClient, setSelectedClient] = useState(null);
  const [activeTab, setActiveTab] = useState('legCases');

  useEffect(() => {
    setSelectedClient(null);
    setActiveTab('legCases');
  }, [filteredClients]);

  const handleClientClick = (client) => {
    setSelectedClient(client);
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white dark:bg-almadar-mint-dark p-6 rounded-lg shadow-lg">
      {loading && <AuthSpinner />}
      {error && <p className="text-red-500">{error}</p>}

      {filteredClients?.length === 0 && (
        <p className="text-center text-gray-500 dark:text-gray-400">
          لم يتم العثور على نتائج.
        </p>
      )}

      {filteredClients.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full mt-4 bg-white dark:bg-almadar-gray-dark rounded-lg shadow-lg"
        >
          <table className="w-full border-collapse overflow-hidden rounded-lg shadow-lg">
            <thead className="bg-gradient-to-r from-almadar-blue-light to-almadar-blue">
              <tr className="text-md text-center text-white">
                <th className="px-4 py-3 border-b border-almadar-blue">
                  📌 رقم الموكل
                </th>
                <th className="px-4 py-3 border-b border-almadar-blue">
                  👤 الاسم
                </th>
                <th className="px-4 py-3 border-b border-almadar-blue">
                  📞 رقم الجوال
                </th>
                <th className="px-4 py-3 border-b border-almadar-blue">
                  ⚡ الحالة
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredClients.map((client) => (
                <tr
                  key={client.id}
                  onClick={() => handleClientClick(client)}
                  className={`cursor-pointer text-center transition-all ${
                    selectedClient?.id === client.id
                      ? 'bg-almadar-blue-light/20 dark:bg-almadar-blue-dark/50'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <td className="px-4 py-3 font-semibold text-gray-700 dark:text-gray-300">
                    {client.slug}
                  </td>
                  <td className="px-4 py-3 text-gray-800 dark:text-gray-200">
                    {client.name}
                  </td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                    {client.phone_number || '—'}
                  </td>
                  <td className="px-4 py-3 font-bold">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        client.status === 'active'
                          ? 'bg-almadar-blue text-white'
                          : 'bg-red-500 text-white'
                      }`}
                    >
                      {client.status === 'active' ? '✅ نشط' : '❌ غير نشط'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      )}

      {selectedClient && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full mt-6 bg-gray-50 dark:bg-almadar-gray-dark rounded-lg shadow-lg"
        >
          <div className="flex justify-center mb-4 space-x-2 rtl:space-x-reverse">
            {[
              { tab: 'legCases', label: 'القضايا' },
              { tab: 'services', label: 'الخدمات' },
              { tab: 'clientPowerOfAttorneys', label: 'التوكيلات' },
            ].map(({ tab, label }) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 rounded-full transition-all duration-300 ${
                  activeTab === tab
                    ? 'bg-gradient-to-r from-almadar-blue-light to-almadar-blue text-white font-bold shadow-lg'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-almadar-blue/30 dark:hover:bg-almadar-blue/50 hover:scale-105'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <LegCasesModal selectedClient={selectedClient} activeTab={activeTab} />
          <ServicesModal selectedClient={selectedClient} activeTab={activeTab} />
          <ClientPowerOfAttorneys
            selectedClient={selectedClient}
            activeTab={activeTab}
          />
        </motion.div>
      )}
    </div>
  );
};

export default DashboardSearch;
