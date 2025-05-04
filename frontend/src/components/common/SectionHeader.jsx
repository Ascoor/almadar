import { FaArrowLeft } from 'react-icons/fa';
 

const SectionHeader = ({ listName, icon, showBackButton }) => {
  return (
    <div className="relative flex flex-col items-center justify-center bg-gradient-to-r from-almadar-blue to-almadar-sky dark:bg-gradient-to-r dark:from-almadar-sky-dark dark:to-almadar-sidebar-dark text-white dark:text-almadar-mint-light rounded-2xl p-8 shadow-2xl transition-all duration-500 ease-in-out">
      
      {/* الأيقونة */}
      {icon && (
        <div className="flex justify-center mb-4">
        <img
  src={icon}
  alt="Contracts Icon"
  className="w-[80px] h-[80px] sm:w-[100px] sm:h-[100px] object-contain transition-transform duration-300 ease-in-out transform hover:scale-110"
 />

        </div>
      )}

      {/* العنوان */}
      <h2 className="text-center font-extrabold text-2xl sm:text-3xl md:text-4xl text-shadow-lg tracking-wide mb-6 animate__animated animate__fadeIn">
        {listName}
      </h2>

      {/* زر الرجوع */}
      {showBackButton && (
        <div className="absolute bottom-6 sm:bottom-8 left-1/2 transform -translate-x-1/2">
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-3 px-6 py-3 bg-almadar-mint-light hover:bg-almadar-mint dark:bg-almadar-mint-dark dark:hover:bg-almadar-mint hover:shadow-xl rounded-xl text-gray-800 dark:text-gray-100 transition-all duration-300 transform hover:scale-110 hover:shadow-2xl"
          >
            <FaArrowLeft className="text-lg" />
            <span className="font-medium">رجوع</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default SectionHeader;
