import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getLitigations } from "../services/api/litigations";
import AgainstCompanyLitigations from "../components/Litigations/against/AgainstCompanyLitigations";
import FromCompanyLitigations from "../components/Litigations/from/FromCompanyLitigations";
import { toast,ToastContainer } from "react-toastify";
import {CaseIcon } from '../assets/icons';
import SectionHeader from "../components/common/SectionHeader";
export default function LitigationsPage() {
  const [activeTab, setActiveTab] = useState("against");
  const [litigations, setLitigations] = useState([]);

  useEffect(() => {
    loadLitigations();
  }, []);

  const loadLitigations = async () => {
    try {
      const res = await getLitigations();
      const litigationsData = Array.isArray(res?.data?.data) ? res.data.data : [];
      setLitigations(litigationsData);
    } catch (error) {
      console.error(error);
      toast.error("فشل تحميل الدعاوى");
    }
  };

  const fromCompanys = litigations.filter((c) => c.scope === "from");
  const againstCompanys = litigations.filter((c) => c.scope === "against");

  return (
 <div className="p-4 sm:p-6 lg:p-8 bg-white dark:bg-gray-900 min-h-screen transition-colors">
      {/* Header Section */}
      <SectionHeader 
        listName={"وحدة  التقاضي"} 
        icon={CaseIcon} 
      />

      {/* Toast Notifications */}
      <ToastContainer />

 
      <div className="flex flex-wrap justify-center gap-4 mb-6">
        <Button
          variant={activeTab === "against" ? "default" : "outline"}
          onClick={() => setActiveTab("against")}
          className="rounded-full px-6"
        >
          دعاوى ضد الشركة
        </Button>
        <Button
          variant={activeTab === "from" ? "default" : "outline"}
          onClick={() => setActiveTab("from")}
          className="rounded-full px-6"
        >
          دعاوى من الشركة
        </Button>
      </div>

      <Card className="p-6 rounded-xl shadow border">
        {activeTab === "against" ? (
          <AgainstCompanyLitigations
            litigations={againstCompanys}
            reloadLitigations={loadLitigations}
          />
        ) : (
          <FromCompanyLitigations
            litigations={fromCompanys}
            reloadLitigations={loadLitigations}
          />
        )}
      </Card>
    </div>
  );
}
