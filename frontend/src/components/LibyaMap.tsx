import React from 'react';

/**
 * Displays an interactive SVG map of Libya with blinking indicators for key cities.
 * The SVG asset is stored in the public directory so it can be referenced directly.
 */
const LibyaMap: React.FC = () => {
  return (
    <div className="w-full h-auto">
      <img src="/libya-map.svg" alt="خريطة ليبيا" className="w-full h-auto" />
    </div>
  );
};

export default LibyaMap;
