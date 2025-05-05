import React from 'react';
import DashboardStats from './DashboardStats';
import RecentItems from './RecentItems';

const Dashboard = () => {
  return (
    <div dir="rtl" className="p-6">
      <h2 className="text-2xl font-bold mb-6">لوحة القيادة</h2>
      <DashboardStats />
      <RecentItems />
    </div>
  );
};

export default Dashboard;
