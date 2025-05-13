import React from 'react';
import { FileText, WalletCards, Warehouse, ArrowRightFromLine, ArrowLeftFromLine, MapPinned, Globe } from "lucide-react";

const DashCard = ({ title, count, subcategories, imageSrc }) => {
  return (
    <div className="flex items-center mb-6 w-full max-w-xs bg-reded-light/20 rounded-xl p-4 shadow-lg dark:bg-royal/70 transition-transform transform hover:scale-105 mx-auto">

      <div className="flex flex-col w-full">
        <div className="flex flex-col mb-2">
          <h2 className="text-md font-bold dark:text-cyan-200 text-navy">{title}</h2>
          <p className="text-base font-sm dark:text-gray-100 text-gray-600">إجمالي {count}</p>
        </div>

        <div className="flex flex-col space-y-2 w-full">
          {subcategories && subcategories.map((subcategory) => (
            <div key={subcategory.title} className="flex items-center justify-center w-full">
              <a href="#" target="_blank" className="transition-transform transform hover:scale-125 flex items-center">
                {subcategory.title === "دولي" ? (
                  <Globe className="w-6 h-6 ml-2  text-blue-500" />
                ) : subcategory.title === "محلي" ? (
                  <MapPinned className="w-6 h-6  ml-2 text-green-500" />
                ) : subcategory.title === "تحقيقات" ? (
                  <FileText className="w-6 h-6  ml-2 text-blue-500" />
                ) : subcategory.title === "مشورة" ? (
                  <WalletCards className="w-6 h-6 ml-2 text-green-500" />
                ) : subcategory.title === "من الشركة" ? (
                  <ArrowRightFromLine className="w-6 h-6 ml-2 text-blue-500" />
                ) : (
                  <ArrowLeftFromLine className="w-6 h-6 ml-2 text-green-500" />
                )}
              </a>
              <p className="text-sm font-medium dark:text-gold-light  ml-2 text-gray-600">{subcategory.title}</p>
              <p className="text-sm font-bold dark:text-gray-100 text-gray-600">{subcategory.count}</p>
            </div>
          ))}
        </div>
      </div>
            <div className="w-32 h-26 rounded-full overflow-hidden mr-4">
        <img className="w-full h-full object-cover" src={imageSrc} alt={title} />
      </div>
    </div>
  );
};

export default DashCard;