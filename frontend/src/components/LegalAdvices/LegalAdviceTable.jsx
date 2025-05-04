import React, { useState, useEffect, useRef } from "react";
import { FaEdit, FaFilePdf } from "react-icons/fa";
import { AnimatePresence, motion } from "framer-motion";
import API_CONFIG from "../../config/config";
import LegalAdviceDetails from "./LegalAdviceDetails";

export default function LegalAdviceTable({ advices = [], onEditAdvice }) {
  const [expandedId, setExpandedId] = useState(null);
  const tableRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (tableRef.current && !tableRef.current.contains(e.target)) {
        setExpandedId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={tableRef} className="space-y-6">
 
    

      <div className="overflow-x-auto bg-white dark:bg-gray-900 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
        {advices.length > 0 ? (
          <table className="min-w-full text-sm text-center border-collapse text-almadar-gray-dark dark:text-gray-200">
            <thead className="bg-almadar-gray-light dark:bg-gray-800 text-gray-700 dark:text-almadar-yellow-light">
              <tr>
                <th className="p-3 whitespace-nowrap">تعديل</th>
                <th className="p-3 whitespace-nowrap">نوع المشورة</th>
                <th className="p-3 whitespace-nowrap">الموضوع</th>
                <th className="p-3 whitespace-nowrap">تاريخ المشورة</th>
                <th className="p-3 whitespace-nowrap">رقم المشورة</th>
                <th className="p-3 whitespace-nowrap">مرفق</th>
              </tr>
            </thead>
            <tbody>
              {advices.map((advice) => (
                <React.Fragment key={advice.id}>
                  <tr
                    onClick={() =>
                      setExpandedId((prev) =>
                        prev === advice.id ? null : advice.id
                      )
                    }
                    className={`cursor-pointer border-t border-gray-200 dark:border-gray-700 transition-colors
                      hover:bg-almadar-gray-light/40 dark:hover:bg-gray-800/60 ${
                        expandedId === advice.id
                          ? "bg-almadar-blue/10 dark:bg-almadar-yellow/10"
                          : ""
                      }`}
                  >
                    <td className="p-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditAdvice(advice);
                        }}
                        title="تعديل"
                        className="text-almadar-blue-dark dark:text-almadar-blue-light hover:text-green-700 dark:hover:text-yellow-300 transition"
                      >
                        <FaEdit className="mx-auto text-lg" />
                      </button>
                    </td>
                    <td className="p-3">{advice.type}</td>
                    <td className="p-3">{advice.topic}</td>
                    <td className="p-3">{advice.advice_date}</td>
                    <td className="p-3">{advice.advice_number}</td>
                    <td className="p-3">
                      {advice.attachment ? (
                
                        <a
                        href={`${API_CONFIG.baseURL}/storage/${advice.attachment}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-red-600 dark:text-red-400 hover:underline flex items-center justify-center gap-1"
                        >
                          <FaFilePdf />
                          عرض
                        </a>
                      ) : (
                        <span className="text-gray-400">لا يوجد</span>
                      )}
                    </td>
                  </tr>

                  <AnimatePresence>
                    {expandedId === advice.id && (
                      <motion.tr
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <td colSpan={6} className="p-0">
                          <LegalAdviceDetails
                            selected={advice}
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
            لا توجد منشورات قانونية متاحة.
          </div>
        )}
      </div>
    </div>
  );
}
