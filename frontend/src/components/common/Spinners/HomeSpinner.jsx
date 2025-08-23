import React from 'react';

const HomeSpinner = () => {
  return (
    <div className="flex flex-row items-center justify-center gap-2">
      <div className="w-4 h-4 rounded-full bg-primary-light animate-bounce"></div>
      <div className="w-4 h-4 rounded-full bg-primary-light animate-bounce [animation-delay:-.3s]"></div>
      <div className="w-4 h-4 rounded-full bg-primary-light animate-bounce [animation-delay:-.5s]"></div>
    </div>
  );
};

export default HomeSpinner;
