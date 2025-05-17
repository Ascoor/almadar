import { ArrowLeft } from 'lucide-react';

const SectionHeader = ({ listName, icon, showBackButton }) => {
  return (
 <div className="
  flex flex-col items-center text-center space-y-4 
  p-4 sm:p-6 md:p-8 shadow-xl transition-all duration-300
  bg-gradient-to-r from-white via-blue-50 to-white
  border border-blue-200 rounded-full mb-6
  dark:bg-gradient-to-r dark:from-navy/20 dark:to-navy/10
  dark:text-foreground dark:ring-2 dark:ring-mint-500 
  dark:shadow-[0_0_30px_#66ffcc40]
">
  {icon && (
    <img
      src={icon}
      alt="icon"
      className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 object-contain transition-transform hover:scale-110"
    />
  )}

  <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-tight text-blue-900 dark:text-inherit">
    {listName}
  </h2>

  {showBackButton && (
    <button
      onClick={() => window.history.back()}
      className="flex items-center gap-2 px-4 py-2 
        bg-blue-100 text-blue-700 
        hover:bg-blue-200 hover:text-blue-900 
        dark:bg-muted dark:text-muted-foreground 
        dark:hover:bg-accent dark:hover:text-white
        rounded-full shadow transition-all"
    >
      <ArrowLeft />
      <span className="text-sm sm:text-base">رجوع</span>
    </button>
  )}
</div>

  );
};

export default SectionHeader;
