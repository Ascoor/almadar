import React from 'react';
import DashboardStats from './DashboardStats';
import RecentItems from './RecentItems';

const Dashboard = () => {
  return (
    <div dir="rtl" className="mt-6 bg-green-100/40 dark:bg-royal-dark">
      <h2 className="text-2xl text-center font-bold mb-6 text-gray-800 dark:text-violet-300">لوحة التحكم</h2>
      <DashboardStats />
      <RecentItems />
    </div>
  );
};

export default Dashboard;
