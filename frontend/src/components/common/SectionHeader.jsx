import { ArrowLeft } from 'lucide-react';
const SectionHeader = ({ listName, icon: Icon, showBackButton }) => {
  return (
    <div className="...">
      {Icon && (
        <span className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 flex items-center justify-center transition-transform duration-300 hover:scale-110">
          <Icon className="w-10 h-10 text-navy-dark dark:text-green-200" />
        </span>
      )}

      <h2 className="text-shadow text-balance leading-relaxed">
        {listName}
      </h2>

      {showBackButton && (
        <button onClick={() => window.history.back()} className="flex items-center ...">
          <ArrowLeft />
          <span>رجوع</span>
        </button>
      )}
    </div>
  );
};


export default SectionHeader;
