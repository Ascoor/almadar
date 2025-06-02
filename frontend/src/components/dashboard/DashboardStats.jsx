import React, { useEffect, useState } from "react";
import {
  DoceIcon,
  ContractSection,
  MainProcedure
} from "@/assets/icons";
import DashCard from "@/components/common/DashCard"; // Ensure correct import path
import WarpperCard from "@/components/layout/WarpperCard";
import { getDashboardCounts } from "@/services/api/dashboard";

const DashboardStats = () => {
  const [loading, setLoading] = useState(true); // State for loading indicator
  const [stats, setStats] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await getDashboardCounts();
        const { contracts, litigations, investigations, legal_advices } = data;

        setStats([
          {
            title: "التعاقدات",
            count: contracts.length,
            imageSrc: ContractSection,
            subcategories: [
              {
                title: "محلي",
                count: contracts.filter(c => c.scope === "local").length,
                to: "/contracts?scope=local"
              },
              {
                title: "دولي",
                count: contracts.filter(c => c.scope === "international").length,
                to: "/contracts?scope=international"
              }
            ]
          },
          {
            title: "الرأي والفتوى",
            count: legal_advices.length,
            imageSrc: DoceIcon,
            subcategories: [
              {
                title: "تحقيقات",
                count: investigations.length,
                to: "/legal/investigations"
              },
              {
                title: "مشورة",
                count: legal_advices.length,
                to: "/legal/legal-advices"
              }
            ]
          },
          {
            title: "القضايا",
            count: litigations.length,
            imageSrc: MainProcedure,
            subcategories: [
              {
                title: "من الشركة",
                count: litigations.filter(l => l.scope === "from").length,
                to: "/legal/litigations?scope=from"
              },
              {
                title: "ضد الشركة",
                count: litigations.filter(l => l.scope === "against").length,
                to: "/legal/litigations?scope=against"
              }
            ]
          }
        ]);
        setLoading(false); // Turn off loading indicator after data fetch
      } catch (err) {
        console.error("Error fetching dashboard statistics:", err);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-4">
        <p className="text-lg font-bold">جارٍ التحميل...</p>
        {/* Add your loading animation or spinner here */}
      </div>
    );
  }

  return (
    <div className="grid gap-2 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-4">
      <WarpperCard /> {/* Assuming this is a placeholder card */}
      {stats.map(stat => <DashCard key={stat.title} {...stat} />)}
    </div>
  );
};

export default DashboardStats;
