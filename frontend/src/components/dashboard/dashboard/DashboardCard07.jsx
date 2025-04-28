import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
);

function DashboardCard07({ isDarkMode }) {
  const [data] = useState({
    openCases: 50,
    consultations: 120,
    sessions: 30,
    caseTrend: [73, 64, 73, 69, 104, 104, 164],
  });

  const caseTrendData = {
    labels: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو'],
    datasets: [
      {
        label: 'عدد القضايا',
        data: data.caseTrend,
        borderColor: isDarkMode ? '#60A5FA' : '#3B82F6',
        backgroundColor: isDarkMode ? 'rgba(96,165,250,0.2)' : 'rgba(59,130,246,0.2)',
        borderWidth: 2,
        pointRadius: 5,
        pointBackgroundColor: isDarkMode ? '#60A5FA' : '#3B82F6',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
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
        ticks: { color: isDarkMode ? '#E5E7EB' : '#374151', stepSize: 20 },
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
          🎯 القضايا المتداولة
        </h2>
      </header>

      {/* احصائيات سريعة */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
        <div className="flex flex-col items-center p-4 bg-white dark:bg-gray-800 shadow-sm rounded-xl">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-white/80 mb-2">عدد القضايا المفتوحة</h3>
          <div className="text-3xl font-bold text-blue-500">{data.openCases}</div>
        </div>

        <div className="flex flex-col items-center p-4 bg-white dark:bg-gray-800 shadow-sm rounded-xl">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-white/80 mb-2">عدد الاستشارات</h3>
          <div className="text-3xl font-bold text-green-500">{data.consultations}</div>
        </div>

        <div className="flex flex-col items-center p-4 bg-white dark:bg-gray-800 shadow-sm rounded-xl">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-white/80 mb-2">عدد الجلسات</h3>
          <div className="text-3xl font-bold text-orange-500">{data.sessions}</div>
        </div>
      </div>

      {/* الرسم البياني */}
      <div className="w-full h-64 sm:h-80 md:h-96 mt-6">
        <Line data={caseTrendData} options={chartOptions} />
      </div>

    </div>
  );
}

export default DashboardCard07;
