import { ArrowLeft } from 'lucide-react';

const SectionHeader = ({ listName, icon, showBackButton }) => {
  return (
    <div
      className="
        relative z-10 flex flex-col items-center justify-center text-center gap-4
        px-6 py-8 sm:py-10 rounded-3xl border border-border
        bg-card shadow-sm md:shadow dark:shadow-glow transition-all duration-300
      "
      aria-label={listName}
    >
      {icon && (
        <img
          src={icon}
          alt={typeof listName === 'string' ? listName : 'section icon'}
          className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 object-contain icon-3d transition-transform duration-300 hover:scale-110"
        />
      )}

      <h2
        className="section-title section-title-animate text-balance leading-tight font-extrabold font-heading text-2xl sm:text-3xl md:text-4xl"
      >
        {listName}
      </h2>

      {showBackButton && (
        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-2 rounded-2xl px-4 py-1.5 bg-secondary text-fg hover:shadow-glow transition"
        >
          <ArrowLeft className="icon-3d" />
          <span className="text-sm sm:text-base">رجوع</span>
        </button>
      )}
    </div>
  );
};

export default SectionHeader;
