import React, { useState, useEffect, useRef } from 'react';
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

function DashboardCard04({ isDarkMode }) {
  const chartRef = useRef(null);
  const [gradientColors, setGradientColors] = useState([]);

  const lawyerPerformance = {
    labels: [
      'أحمد العتيبي',
      'محمد القحطاني',
      'سارة الأنصاري',
      'نورة السبيعي',
      'عبدالله الدوسري',
    ],
    casesHandled: [50, 75, 40, 65, 55],
    successRate: [85, 90, 75, 80, 70],
  };

  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.ctx;
      const colors = lawyerPerformance.casesHandled.map((_, index) => {
        const gradient = ctx.createLinearGradient(0, 0, 400, 0);

        if (isDarkMode) {
          gradient.addColorStop(
            0,
            ['#E6E6FA', '#C3B1E1', '#9370DB', '#6A5ACD', '#483D8B'][index],
          );
          gradient.addColorStop(1, '#2B1B50');
        } else {
          gradient.addColorStop(
            0,
            ['#FFA500', '#10B981', '#FF5733', '#4682B4', '#FFD700'][index],
          );
          gradient.addColorStop(1, '#FFF5E1');
        }

        return gradient;
      });
      setGradientColors(colors);
    }
  }, [isDarkMode]);

  const backgroundColors = gradientColors.length
    ? gradientColors
    : isDarkMode
    ? ['#E6E6FA', '#C3B1E1', '#9370DB', '#6A5ACD', '#483D8B']
    : ['#FFA500', '#10B981', '#FF5733', '#4682B4', '#FFD700'];

  const chartData = {
    labels: lawyerPerformance.labels,
    datasets: [
      {
        label: 'عدد القضايا',
        data: lawyerPerformance.casesHandled,
        backgroundColor: backgroundColors,
        borderColor: isDarkMode ? '#FFF' : '#333',
        borderWidth: 1,
        borderRadius: 6,
        barThickness: 20,
        hoverBackgroundColor: isDarkMode ? '#C3B1E1' : '#FFD700',
      },
      {
        label: 'نسبة النجاح (%)',
        data: lawyerPerformance.successRate,
        backgroundColor: isDarkMode ? '#A57AFF' : '#1E90FF',
        borderColor: isDarkMode ? '#7D5FB2' : '#104E8B',
        borderWidth: 1,
        borderRadius: 6,
        barThickness: 20,
      },
    ],
  };

  const chartOptions = {
    indexAxis: 'y',
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
      tooltip: {
        backgroundColor: isDarkMode ? '#2B1B50' : '#FFF',
        titleColor: isDarkMode ? '#FFF' : '#000',
        bodyColor: isDarkMode ? '#CCC' : '#444',
      },
    },
    scales: {
      x: {
        ticks: { color: isDarkMode ? '#E5E7EB' : '#374151', stepSize: 10 },
      },
      y: {
        grid: { display: false },
        ticks: { color: isDarkMode ? '#E5E7EB' : '#374151' },
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
          👨‍⚖️ أداء المحامين في المكتب
        </h2>
      </header>

      {/* Description */}
      <div className="mt-4">
        <p className="text-sm text-gray-700 dark:text-white/80 leading-relaxed tracking-wide">
          يعرض هذا المخطط عدد القضايا التي تعامل معها كل محامٍ، بالإضافة إلى نسبة النجاح، مما يساعد على تقييم أداء فريق العمل وتحديد مجالات التطوير.
        </p>
      </div>

      {/* Chart */}
      <div className="w-full h-64 sm:h-80 md:h-96 mt-6">
        <Bar ref={chartRef} data={chartData} options={chartOptions} />
      </div>
    </div>
  );
}

export default DashboardCard04;
