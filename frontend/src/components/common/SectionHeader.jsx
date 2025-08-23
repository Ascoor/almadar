import { ArrowLeft } from 'lucide-react';

const SectionHeader = ({ listName, icon, showBackButton }) => {
  return (
<div
  className="
    relative z-10 flex flex-col items-center justify-center text-center space-y-4
    px-6 py-8 sm:py-10 rounded-3xl shadow-xl transition-all border border-border backdrop-blur-md
    bg-gradient-accent text-foreground font-bold text-xl sm:text-2xl tracking-wide
    dark:shadow-lg
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
            bg-secondary text-secondary-foreground hover:bg-secondary/80
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
