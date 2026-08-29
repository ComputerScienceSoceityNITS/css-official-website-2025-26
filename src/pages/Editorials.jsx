import React from "react";

const EditorialsComingSoon = () => {
  return (
    <div className="relative min-h-screen bg-arch-bg text-arch-ink flex items-center justify-center px-6 py-10 overflow-hidden">
      {/* Background Effects */}
      

      {/* Main Card */}
      <div className="relative max-w-lg w-full bg-arch-card border border-arch-line p-10 text-center">
        {/* Cyberpunk corners */}
        <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-arch-line"></div>
        <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-arch-line"></div>
        <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-arch-line"></div>
        <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-arch-line"></div>

        {/* Text */}
        <h1
          className="text-5xl font-bold mb-4 text-arch-ink"
          
        >
          COMING SOON
        </h1>
        <p className="text-arch-ink-3 text-lg">
          The <span className="text-arch-ink">Editorials</span> page is under
          construction.
        </p>

        {/* Terminal-style cursor */}
        <div className="flex justify-center items-center mt-6">
          <span className="text-arch-ink text-lg">$~</span>
          <div className="w-2 h-6 bg-arch-ink ml-2 animate-blink"></div>
        </div>
      </div>
    </div>
  );
};

export default EditorialsComingSoon;
