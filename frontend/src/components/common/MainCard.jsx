import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const MainCard = ({ count, icon, label, route }) => {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -8 }}
      transition={{ duration: 0.3 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={() => setIsHovered(true)}
      onTouchEnd={() => setIsHovered(false)}
      onClick={() => navigate(route)}
      className="cursor-pointer bg-gradient-to-br from-almadar-blue-light/40 to-almadar-blue/30 dark:bg-gradient-to-br dark:from-almadar-mint-dark/80 dark:to-almadar-blue-darker/80 backdrop-blur rounded-3xl p-6 shadow-lg dark:shadow-almadar-blue-light flex items-center justify-between w-full max-w-sm transition-all duration-300 ease-in-out transform hover:scale-105"
    >
      {/* Text */}
      <div className="flex flex-col items-start ml-4">
        <div className="text-lg font-bold text-almadar-mintray dark:text-yellow-400 tracking-wide mb-2">{label}</div>
        <div className="text-3xl font-extrabold text-almadar-blue dark:text-white tracking-tight">{count}</div>
      </div>
      {/* Icon */}
      <div className="w-20 h-20 flex items-center justify-center bg-gradient-to-br from-yellow-400 via-orange-400 to-orange-600 dark:bg-gradient-to-br dark:from-yellow-400 dark:via-orange-400 dark:to-orange-500 rounded-full shadow-lg hover:shadow-2xl transition-all duration-300">
        <img src={icon} alt={label} className="w-12 h-12 object-contain" />
      </div>
    </motion.div>
  );
};

export default MainCard;
