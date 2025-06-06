import { ArrowLeft } from 'lucide-react';

const SectionHeader = ({ listName, icon, showBackButton }) => {
  return (
<div
  className="
    relative z-10 flex flex-col items-center justify-center text-center space-y-4
    px-6 py-8 sm:py-10 rounded-3xl shadow-xl transition-all border border-greenic/30 backdrop-blur-md

    bg-gradient-to-br from-[#fdf6e3]/60 via-[#f0f9ff]/50 to-[#dbeafe]/80
    text-navy-dark font-bold text-xl sm:text-2xl tracking-wide

    dark:bg-gradient-to-br dark:from-[#1a1a2e]/70 dark:via-[#16213e]/60 dark:to-[#0f3460]/50
    dark:text-green-200 dark:shadow-lg dark:shadow-greenic/10
  "
>
  
      {icon && (
        <img
          src={icon}
          alt="icon"
          className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 object-contain transition-transform duration-300 hover:scale-110"
        />
      )}


  <h2 className="text-shadow text-balance leading-relaxed">   {listName}
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
