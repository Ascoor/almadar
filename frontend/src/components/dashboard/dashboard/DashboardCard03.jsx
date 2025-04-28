import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

function DashboardCard03({ isDarkMode }) {
  const [caseDurationData, setCaseDurationData] = useState({
    labels: ['جنائي', 'مدني', 'تجاري', 'عمالي', 'إداري'],
    durations: [180, 120, 90, 60, 45],
  });

  const chartData = {
    labels: caseDurationData.labels,
    datasets: [
      {
        label: 'متوسط المدة (بالأيام)',
        data: caseDurationData.durations,
        backgroundColor: isDarkMode
          ? ['#ffbb34', '#60A5FA', '#FBBF24', '#f2a33b', '#A78BFA']
          : ['#EF4444', '#3B82F6', '#F59E0B', '#f2a33b', '#8B5CF6'],
        borderColor: isDarkMode ? '#FFF' : '#333',
        borderWidth: 1,
        borderRadius: 6,
        barThickness: 50,
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
        ticks: { color: isDarkMode ? '#E5E7EB' : '#374151', stepSize: 30 },
      },
    },
  };

  return (
    <div className="bg-gradient-to-br from-almadar-green-light/30 to-white 
    dark:from-almadar-gray-dark/90 dark:to-almadar-green-darker/80
    text-almadar-gray-dark dark:text-almadar-green-light 
    shadow-xl dark:shadow-neon rounded-2xl p-6 
    col-span-full sm:col-span-6 xl:col-span-1 flex flex-col transition-all duration-500 ease-in-out">
      
      {/* Header */}
      <header className="px-5 py-4 border-b border-almadar-green-light dark:border-almadar-green flex items-center">
        <h2 className="font-bold text-lg tracking-wide dark:text-white/90">
          ⏳ متوسط مدة إنهاء القضايا
        </h2>
      </header>

      {/* Description */}
      <div className="mt-4">
        <p className="text-sm text-gray-700 dark:text-white/80 leading-relaxed tracking-wide">
          يعرض هذا المخطط متوسط المدة اللازمة لإغلاق القضايا، مما يساعد على تقييم وتحسين الأداء التشغيلي للمكتب عبر رؤية أوضح للزمن المستغرق في التقاضي.
        </p>
      </div>

      {/* Chart */}
      <div className="w-full h-64 sm:h-80 md:h-96 mt-6">
        <Bar data={chartData} options={chartOptions} />
      </div>
    </div>
  );
}

export default DashboardCard03;
