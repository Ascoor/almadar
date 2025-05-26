import React from 'react';
import DashboardStats from './DashboardStats';
import RecentItems from './RecentItems';

const Dashboard = () => {
  return (
    <div className="mt-6 px-4 sm:px-6 lg:px-8">
      <h2 className="text-xl sm:text-2xl text-center font-bold mb-6 text-royal-light dark:text-gold">
        لوحة التحكم
      </h2>

      <div className="space-y-8">
        <DashboardStats />
        <RecentItems />
      </div>
    </div>
  );
};

export default Dashboard;
