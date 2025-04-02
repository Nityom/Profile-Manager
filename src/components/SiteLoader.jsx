import React from 'react';

const SiteLoader = () => {
  return (
    <div className="fixed inset-0 bg-white bg-opacity-90 z-50 flex flex-col items-center justify-center">
      <div className="animate-spin rounded-full h-24 w-24 border-t-4 border-b-4 border-black"></div>
      <p className="mt-4 text-xl font-semibold text-gray-900">Loading your profiles...</p>
      <p className="text-gray-500 text-sm mt-2">Please wait while we set things up</p>
    </div>
  );
};

export default SiteLoader;