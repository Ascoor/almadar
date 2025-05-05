
import React from 'react';
import { FileText, Gavel, MessageSquare } from "lucide-react";
import DashboardCard from './DashboardCard';

const DashboardStats = () => {
  const stats = [
    {
      title: 'العقود',
      count: 46,
      icon: <FileText className="h-5 w-5 text-blue-600" />,
      color: 'bg-blue-100',
    },
    {
      title: 'الاستشارات',
      count: 32,
      icon: <MessageSquare className="h-5 w-5 text-green-600" />,
      color: 'bg-green-100',
    },
    {
      title: 'القضايا',
      count: 18,
      icon: <Gavel className="h-5 w-5 text-red-600" />,
      color: 'bg-red-100',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {stats.map((stat) => (
        <DashboardCard
          key={stat.title}
          title={stat.title}
          count={stat.count}
          icon={stat.icon}
          color={stat.color}
        />
      ))}
    </div>
  );
};

export default DashboardStats;
