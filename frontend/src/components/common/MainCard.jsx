import { useState } from 'react';
import { useSpring, animated } from '@react-spring/web';
import { useNavigate } from 'react-router-dom';

const useIconCardAnimation = () => {
  const [isInteracting, setIsInteracting] = useState(false);

  const animationStyles = useSpring({
    transform: isInteracting
      ? 'scale(1.05) translateY(-8px)'
      : 'scale(1) translateY(0)',
    backdropFilter: isInteracting ? 'blur(12px)' : 'blur(4px)',
    config: { mass: 1, tension: 350, friction: 26 },
  });

  return { animationStyles, setIsInteracting };
};

const MainCard = ({ count, icon, label, route }) => {
  const { animationStyles, setIsInteracting } = useIconCardAnimation();
  const navigate = useNavigate();

  return (
    <animated.div
      style={animationStyles}
      onMouseEnter={() => setIsInteracting(true)}
      onMouseLeave={() => setIsInteracting(false)}
      onTouchStart={() => setIsInteracting(true)}
      onTouchEnd={() => setIsInteracting(false)}
      onClick={() => navigate(route)}
      className="cursor-pointer bg-gradient-to-br from-almadar-green-light/40 to-almadar-green/30 dark:bg-gradient-to-br dark:from-almadar-gray-dark/80 dark:to-almadar-green-darker/80 backdrop-blur rounded-3xl p-6 shadow-lg dark:shadow-almadar-green-light flex items-center justify-between w-full max-w-sm transition-all duration-300 ease-in-out transform hover:scale-105"
    >
      {/* نصوص البطاقة */}
      <div className="flex flex-col items-start ml-4">
        <div className="text-lg font-bold text-almadar-gray dark:text-yellow-400 tracking-wide mb-2">
          {label}
        </div>

        <div className="text-3xl font-extrabold text-almadar-green dark:text-white tracking-tight">
          {count}
        </div>
      </div>

      {/* أيقونة البطاقة */}
      <div className="w-20 h-20 flex items-center justify-center bg-gradient-to-br from-yellow-400 via-orange-400 to-orange-600 dark:bg-gradient-to-br dark:from-yellow-400 dark:via-orange-400 dark:to-orange-500 rounded-full shadow-lg hover:shadow-2xl transition-all duration-300">
        <img src={icon} alt={label} className="w-12 h-12 object-contain" />
      </div>
    </animated.div>
  );
};

export default MainCard;
