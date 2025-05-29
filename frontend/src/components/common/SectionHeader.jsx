import { ArrowLeft } from 'lucide-react';

const SectionHeader = ({ listName, icon, showBackButton }) => {
  return (
    <div
      className="
        flex flex-col items-center text-center space-y-4 
        p-4 sm:p-6 md:p-8 shadow-2xl transition-all
        bg-white bg-gradient-to-tr from-royal/10 via-gold/10 to-royal/10
        border border-greenic/20 rounded-full mb-6
        dark:bg-greenic-darker
        dark:bg-gradient-to-r dark:from-navy-darker/50 dark:via-royal-darker/40 dark:to-navy-darker/80
        dark:text-greenic dark:ring-2 dark:ring-greenic/30 
        dark:shadow-greenic/2 0
      "
    >
      {icon && (
        <img
          src={icon}
          alt="icon"
          className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 object-contain transition-transform duration-300 hover:scale-110"
        />
      )}

      <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-tight text-blue-900 dark:text-white">
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
