  import  { useState, useEffect, useRef } from "react";
  import { motion, AnimatePresence } from "framer-motion";
  import { FaEdit } from "react-icons/fa";
  import API_CONFIG from "../../config/config";
  import ContractDetails from "./ContractDetails"; // تأكد من المسار الصحيح

  export default function ContractsTable({ title, contracts = [], isInternational = false, onEditContract }) {
    const [expandedId, setExpandedId] = useState(null);
    const tableRef = useRef(null);

    const handleOutsideClick = (e) => {
      if (tableRef.current && !tableRef.current.contains(e.target)) {
        setExpandedId(null);
      }
    };

    useEffect(() => {
      document.addEventListener("mousedown", handleOutsideClick);
      return () => document.removeEventListener("mousedown", handleOutsideClick);
    }, []);

    const calculateDuration = (start, end) => {
      const s = new Date(start);
      const e = new Date(end);
      const days = Math.floor(Math.abs(e - s) / (1000 * 60 * 60 * 24));
      const years = Math.floor(days / 365);
      const remainDays = days % 365;
      return `${years ? `${years} سنة` : ""}${years && remainDays ? " و" : ""}${remainDays ? `${remainDays} يوم` : ""}`;
    };

    return (
      <div className="space-y-6" ref={tableRef}>
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-wide text-almadar-blue dark:text-almadar-yellow-dark drop-shadow-sm">
            {title}
          </h1>
          <div className="mt-1 h-1 w-24 mx-auto bg-almadar-blue dark:bg-almadar-yellow-dark rounded-full" />
        </div>
        <div className="overflow-x-auto bg-white dark:bg-gray-900 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 transition-all">
          {contracts.length > 0 ? (
            <table className="min-w-full text-sm text-center border-collapse text-almadar-mint-dark dark:text-gray-200">
            <thead className="bg-almadar-mint-light dark:bg-gray-800 text-gray-700 dark:text-almadar-yellow-light">
              <tr>
                <th className="p-3 whitespace-nowrap">تعديل</th>
                {isInternational && <th className="p-3 whitespace-nowrap">المتعاقد معه</th>}
                <th className="p-3 whitespace-nowrap">رقم العقد</th>
                <th className="p-3 whitespace-nowrap">القيمة</th>
                <th className="p-3 whitespace-nowrap">التصنيف</th>
                <th className="p-3 whitespace-nowrap">الحالة</th>
                <th className="p-3 whitespace-nowrap">المدة</th>
                <th className="p-3 whitespace-nowrap">مرفق</th>
              </tr>
            </thead>
            <tbody>
                {contracts.map(contract => (
                  <React.Fragment key={contract.id}>
                    <tr
                      onClick={() =>
                        setExpandedId(prev => (prev === contract.id ? null : contract.id))
                      }
                      className={`cursor-pointer transition-colors border-t border-gray-200 dark:border-gray-700
                        hover:bg-almadar-mint-light/40 dark:hover:bg-gray-800/60 ${
                          expandedId === contract.id ? "bg-almadar-blue/10 dark:bg-almadar-yellow/10" : ""
                        }`}
                    >
                      <td className="p-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onEditContract(contract);
                          }}
                          title="تعديل"
                          className="text-almadar-blue-dark dark:text-almadar-blue-light hover:text-green-700 dark:hover:text-yellow-300 transition"
                        >
                          <FaEdit className="mx-auto text-lg" />
                        </button>
                      </td>
                      {isInternational && (
                        <td className="p-3">{contract.contract_parties || "ـ"}</td>
                      )}
                      <td className="p-3">{contract.number || "ـ"}</td>
                      <td className="p-3">{contract.value?.toLocaleString()} ﷼</td>
                      <td className="p-3">{contract.category?.name}</td>
                      <td className="p-3">{contract.status}</td>
                      <td className="p-3">
                        {contract.start_date && contract.end_date
                          ? calculateDuration(contract.start_date, contract.end_date)
                          : "غير متاح"}
                      </td>
                      <td className="p-3">
                        {contract.attachment ? (
                          <a
                            href={`${API_CONFIG.baseURL}/storage/${contract.attachment}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 dark:text-blue-400 hover:underline"
                          >
                            عرض
                          </a>
                        ) : (
                          <span className="text-gray-400">لا يوجد</span>
                        )}
                      </td>
                    </tr>

                    {/* عرض تفاصيل العقد باستخدام المكون الكامل */}
                    <AnimatePresence>
                      {expandedId === contract.id && (
                        <motion.tr
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <td colSpan={isInternational ? 8 : 7} className="p-0">
                            <ContractDetails
                              selected={contract}
                              onClose={() => setExpandedId(null)}
                            />
                          </td>
                        </motion.tr>
                      )}
                    </AnimatePresence>
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center text-gray-500 dark:text-gray-400 py-8">
              لا توجد {isInternational ? "تعاقدات دولية" : "تعاقدات محلية"} متاحة.
            </div>
          )}
        </div>
      </div>
    );
  }
