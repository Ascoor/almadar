import React from 'react';
import { FileText, Gavel, MessageSquare } from "lucide-react";
import DashCard from '../common/DashCard';
import { ServiceIcon, ContractSection, MainLegalCases } from '../../assets/icons'; 

const DashboardStats = () => {
  const stats = [
    {
      title: 'التعاقدات',
      count: 46,
      imageSrc: ContractSection,
      subcategories: [
        { title: 'دولي', count: 25 },
        { title: 'محلي', count: 21 },
      ],
    },
    {
      title: 'الرأي والفتوى',
      count: 32,
      imageSrc: ServiceIcon,
      subcategories: [
        { title: 'تحقيقات', count: 15 }, 
        { title: 'مشورة', count: 17 },
      ],
    },
    {
      title: 'القضايا',
      count: 18,
      imageSrc: MainLegalCases,
      subcategories: [
        { title: 'من الشركة', count: 10 },
        { title: 'ضد الشركة', count: 8 },
      ],
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
      {stats.map((stat) => (
        <DashCard
          key={stat.title}
          title={stat.title}
          count={stat.count}
          imageSrc={stat.imageSrc}
          subcategories={stat.subcategories}
        />
      ))}
    </div>
  );
};

export default DashboardStats;