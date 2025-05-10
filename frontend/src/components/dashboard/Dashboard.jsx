import React from 'react';
import DashboardStats from './DashboardStats';
import RecentItems from './RecentItems';

const Dashboard = () => {
  return (
    <div dir="rtl" className="p-6 bg-green-100/40 dark:bg-black/70">
      <h2 className="text-2xl font-bold mb-6">لوحة التحكم</h2>
      <DashboardStats />
      <RecentItems />
    </div>
  );
};

export default Dashboard;
