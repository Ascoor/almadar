import { FaArrowLeft } from 'react-icons/fa';

const SectionHeader = ({ listName, icon, showBackButton }) => {
  return (
    <div className="
      flex flex-col items-center justify-center text-center space-y-4 
      rounded-full p-6 md:p-8 shadow-xl transition-all duration-300
      bg-gradient-to-r from-white via-blue-50 to-white
      border border-blue-200
      dark:bg-gradient-to-r dark:from-navy/20 dark:to-navy/10
      dark:text-foreground dark:ring-2 dark:ring-mint-500 
      dark:shadow-[0_0_30px_#66ffcc40]
    ">
      {/* الأيقونة */}
      {icon && (
        <img
          src={icon}
          alt="icon"
          className="w-20 h-20 sm:w-24 sm:h-24 object-contain hover:scale-110 transition-transform"
        />
      )}

      {/* العنوان */}
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-blue-900 dark:text-inherit">
        {listName}
      </h2>

      {/* زر الرجوع */}
      {showBackButton && (
        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-2 px-5 py-2 
            bg-blue-100 text-blue-700 
            hover:bg-blue-200 hover:text-blue-900 
            dark:bg-muted dark:text-muted-foreground 
            dark:hover:bg-accent dark:hover:text-white
            rounded-xl shadow transition-all"
        >
          <FaArrowLeft />
          <span>رجوع</span>
        </button>
      )}
    </div>
  );
};

export default SectionHeader;
