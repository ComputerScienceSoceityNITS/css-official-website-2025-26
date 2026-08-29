import React from 'react';

const TerminalLoader = () => {
  return (
    <div className="flex items-center justify-center space-x-2">
      <div className="w-5 h-5 border border-arch-line border-t-transparent rounded-full animate-spin"></div>
      <span className="text-arch-ink text-sm">Loading...</span>
    </div>
  );
};

export default TerminalLoader;