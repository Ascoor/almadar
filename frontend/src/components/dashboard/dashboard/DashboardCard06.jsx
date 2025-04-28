import React, { useState } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
);

function DashboardCard06({ isDarkMode }) {
  const [revenueData] = useState({
    labels: [
      'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
      'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر',
    ],
    expectedRevenue: [20000, 25000, 22000, 27000, 30000, 31000, 33000, 35000, 34000, 38000, 39000, 41000],
    actualRevenue: [18000, 23000, 21000, 26000, 28000, 29000, 32000, 34000, 33000, 37000, 38000, 40000],
  });

  const chartData = {
    labels: revenueData.labels,
    datasets: [
      {
        type: 'bar',
        label: 'الإيرادات المتوقعة',
        data: revenueData.expectedRevenue,
        backgroundColor: isDarkMode ? '#60A5FA' : '#3B82F6',
        borderColor: isDarkMode ? '#2563EB' : '#1E40AF',
        borderWidth: 1,
        borderRadius: 6,
        barThickness: 40,
      },
      {
        type: 'line',
        label: 'الإيرادات المحققة',
        data: revenueData.actualRevenue,
        borderColor: isDarkMode ? '#34D399' : '#10B981',
        backgroundColor: 'transparent',
        borderWidth: 2,
        pointRadius: 5,
        pointBackgroundColor: isDarkMode ? '#34D399' : '#10B981',
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: isDarkMode ? '#E5E7EB' : '#374151',
          font: { size: 14 },
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: isDarkMode ? '#E5E7EB' : '#374151' },
      },
      y: {
        ticks: { color: isDarkMode ? '#E5E7EB' : '#374151', stepSize: 5000 },
      },
    },
  };

  return (
    <div className="bg-gradient-to-br from-almadar-green-light/30 to-white 
    dark:from-almadar-gray-dark/90 dark:to-almadar-green-darker/80 
    text-almadar-gray-dark dark:text-almadar-green-light 
    shadow-xl dark:shadow-neon rounded-2xl p-6 
    col-span-full sm:col-span-6 xl:col-span-1 flex flex-col transition-all duration-500 ease-in-out">

      {/* العنوان */}
      <header className="px-5 py-4 border-b border-almadar-green-light dark:border-almadar-green flex items-center">
        <h2 className="font-bold text-lg tracking-wide dark:text-white/90">
          💰 الدخل المتوقع من القضايا
        </h2>
      </header>

      {/* الوصف */}
      <div className="mt-4">
        <p className="text-sm text-gray-700 dark:text-white/80 leading-relaxed tracking-wide">
          يعرض هذا المخطط مقارنة بين الإيرادات المتوقعة والمحققة من القضايا على مدار العام، مما يساعد في تحسين التخطيط المالي وتحقيق الأهداف الاستراتيجية.
        </p>
      </div>

      {/* الرسم البياني */}
      <div className="w-full h-64 sm:h-80 md:h-96 mt-6">
        <Bar data={chartData} options={chartOptions} />
      </div>
    </div>
  );
}

export default DashboardCard06;
