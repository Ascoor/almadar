import React from 'react';
import DashboardStats from './DashboardStats';
import RecentItems from './RecentItems';

const Dashboard = () => {
  return (
    <div dir="rtl" className="mt-8 border border-royal/10 ">
      <h2 className="text-2xl p-6 text-center font-bold mb-6 text-royal-light  dark:text-gold">لوحة التحكم</h2>
      <DashboardStats />
      <RecentItems />
    </div>
  );
};

export default Dashboard;
