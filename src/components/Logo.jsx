import React from 'react';

const Logo = () => {
  return (
    <div className="flex items-center justify-center h-full py-1 mt-10 ml-40">
      <img
        src="/mykap-logo.png"
        alt="MyKap Logo"
        className="h-12 sm:h-20 md:h-24 w-auto object-contain"
      />
    </div>
  );
};

export default Logo;