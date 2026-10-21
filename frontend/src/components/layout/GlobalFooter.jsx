import React from "react";

const GlobalFooter = () => {
  const year = new Date().getFullYear();
  return (
    <div className="globalFooterContainer pt-10 md:pt-0">
      <footer className="bg-gray-900 text-gray-300 fixed bottom-0 left-0 right-0 z-50 w-full">
        <div className="max-w-6xl mx-auto px-2 sm:px-6 py-3 md:py-4">
          <div className="flex flex-row items-center justify-between gap-2 md:gap-4">
            <div className="flex items-center gap-1 sm:gap-2 shrink-0">
              <span className="text-lg sm:text-xl">📊</span>
              <span className="font-semibold text-white text-sm sm:text-base">
                LivePoll
              </span>
            </div>

            <p className="text-[10px] sm:text-sm text-gray-400 text-center">
              All rights reserved
            </p>
            <p className="text-[10px] sm:text-sm text-gray-400 text-right">
              © {year} LivePoll
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default GlobalFooter;
