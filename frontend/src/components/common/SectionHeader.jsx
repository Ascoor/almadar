import { ArrowLeft } from 'lucide-react';

const SectionHeader = ({ listName, icon, showBackButton }) => {
  return (
<div
  className="
    flex flex-col items-center justify-center text-center space-y-4
    px-6 py-8 sm:py-10 rounded-3xl shadow-lg transition-all
    border border-greenic/30 backdrop-blur-md

    bg-gradient-to-br from-gold/10 via-white to-royal/10
    text-royal font-semibold text-xl sm:text-2xl tracking-wide

    dark:bg-gradient-to-br dark:from-royal-darker/50 dark:via-navy/40 dark:to-greenic/20
    dark:text-greenic-light dark:shadow-md dark:shadow-greenic/10
  "
>
  
      {icon && (
        <img
          src={icon}
          alt="icon"
          className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 object-contain transition-transform duration-300 hover:scale-110"
        />
      )}

      <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-tight text-gold-dark dark:text-white">
        {listName}
      </h2>

      {showBackButton && (
        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-2 px-4 py-1.5 
            bg-blue-100 text-blue-800 
            hover:bg-blue-200 hover:text-blue-900 
            dark:bg-navy-dark dark:text-muted-foreground 
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
