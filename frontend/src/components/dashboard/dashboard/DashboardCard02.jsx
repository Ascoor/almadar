import React, { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

function DashboardCard02({ isDarkMode }) {
  const [caseData, setCaseData] = useState({
    labels: ['جنائي', 'مدني', 'تجاري', 'عمالي', 'إداري'],
    counts: [45, 30, 15, 10, 25],
  });

  const chartData = {
    labels: caseData.labels,
    datasets: [
      {
        label: 'نسبة توزيع القضايا',
        data: caseData.counts,
        backgroundColor: isDarkMode
          ? ['#F87171', '#60A5FA', '#FBBF24', '#34D399', '#A78BFA']
          : ['#EF4444', '#3B82F6', '#F59E0B', '#10B981', '#8B5CF6'],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: isDarkMode ? '#E5E7EB' : '#374151', // وضوح أكتر
          font: {
            size: 14,
          },
        },
      },
    },
  };

  return (
    <div className="bg-gradient-to-br from-almadar-green-light/30 to-white 
    dark:from-almadar-gray-dark/90 dark:to-almadar-green-darker/80
    text-almadar-gray-dark dark:text-white/90 
    shadow-xl dark:shadow-neon rounded-2xl p-6 
    col-span-full sm:col-span-6 xl:col-span-1 flex flex-col transition-all duration-500 ease-in-out">

      {/* Header */}
      <header className="px-5 py-4 border-b border-almadar-green-light dark:border-almadar-green flex items-center">
        <h2 className="font-bold text-lg tracking-wide">⚖️ توزيع القضايا حسب النوع</h2>
      </header>

      {/* Text description */}
      <div className="mt-4">
        <p className="text-sm text-gray-700 dark:text-white/80 leading-relaxed tracking-wide">
          يوضح هذا المخطط نسبة توزيع القضايا حسب التخصصات القانونية، مما يساعد في اتخاذ قرارات دقيقة بالتوظيف والتخطيط الاستراتيجي.
        </p>
      </div>

      {/* Pie Chart */}
      <div className="w-full h-64 sm:h-80 md:h-96 mt-6">
        <Pie data={chartData} options={chartOptions} />
      </div>

    </div>
  );
}

export default DashboardCard02;
