import React, { useState,useEffect } from "react";

import { getLitigations } from "../services/api/litigations";
import AgainstCompanyLitigations from "../components/Litigations/against/AgainstCompanyLitigations";
import FromCompanyLitigations from "../components/Litigations/from/FromCompanyLitigations";

export default function LitigationsPage() {

  const [activeTab, setActiveTab] = useState("against");
  
  const [litigations, setLitigations] = useState([]);
  useEffect(() => {
    loadLitigations();
  
  }, []);

  const loadLitigations = async () => {
    try {
      const res = await getLitigations();
      const litigationsData = res?.data?.data || []; // ✅ تصحيح
      setLitigations(litigationsData);
    } catch (error) {
      console.error(error);
      toast.error('فشل تحميل العقود');
    }
  };
  
  const fromCompanys = litigations.filter(c => c.scope === 'from');
  const againstCompanys = litigations.filter(c => c.scope === 'against');
  return (
    <div className="p-6 sm:p-8 lg:p-10 bg-white dark:bg-gray-900 min-h-screen transition-all">
      <h1 className="text-3xl font-bold text-center mb-10 text-almadar-blue dark:text-almadar-yellow">
        إدارة الدعاوى القضائية
      </h1>

      <div className="flex justify-center gap-4 mb-6">
        <button
          onClick={() => setActiveTab("against")}
          className={`px-6 py-2 rounded-full font-semibold transition-all
            ${activeTab === "against"
              ? "bg-almadar-blue text-white"
              : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"}
          `}
        >
          دعاوى ضد الشركة
        </button>
        <button
          onClick={() => setActiveTab("from")}
          className={`px-6 py-2 rounded-full font-semibold transition-all
            ${activeTab === "from"
              ? "bg-almadar-blue text-white"
              : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"}
          `}
        >
          دعاوى من الشركة
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl shadow p-6">
        {activeTab === "against" ? <AgainstCompanyLitigations  litigations={againstCompanys}  /> : <FromCompanyLitigations   litigations={fromCompanys}/>}
      </div>
    </div>
  );
}
