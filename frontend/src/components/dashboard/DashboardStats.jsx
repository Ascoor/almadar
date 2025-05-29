import React, { useEffect, useState } from "react";
import {
  ServiceIcon,
  ContractSection,
  MainLegalCases
} from "@/assets/icons";
import DashCard     from "@/components/common/DashCard";   // فيه Link
import WarpperCard  from "@/components/layout/WarpperCard";
import { getDashboardCounts } from "@/services/api/dashboard";

export default function DashboardStats() {
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
            imageSrc: ServiceIcon,
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
            imageSrc: MainLegalCases,
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
      } catch (err) {
        console.error("Error fetching dashboard statistics:", err);
      }
    })();
  }, []);

  return (
    <div className="grid gap-2 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-4">
      <WarpperCard />   {/* بطاقة الساعة */}
      {stats.map(stat => <DashCard key={stat.title} {...stat} />)}
    </div>
  );
}
