import React from "react";
import {
  DoceIcon,
  ContractSection,
  MainProcedure
} from "@/assets/icons/index";
import DashCard from "@/components/common/DashCard";
  import WarpperCard from "@/components/layout/WarpperCard";
  import HomeSpinner from '@/components/common/Spinners/HomeSpinner'
import { useDashboardStats } from "@/hooks/dataHooks"; // تأكد من المسار الصحيح

const DashboardStats = () => {
  const { data, isLoading, error } = useDashboardStats();

  if (isLoading) {
    return (
      <div className="text-center pt-16 py-4">
   <HomeSpinner />
      </div>
    );
  }

  if (error || !data?.data) {
    return (
      <div className="text-center py-4 text-red-500 font-bold">
        فشل في تحميل البيانات
      </div>
    );
  }

  const { contracts, litigations, investigations, legal_advices } = data.data;

  const stats = [
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
  ];

  return (
    <div className="grid gap-2 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-4">
      <WarpperCard />
      {stats.map(stat => (
        <DashCard key={stat.title} {...stat} />
      ))}
    </div>
  );
};

export default DashboardStats;
