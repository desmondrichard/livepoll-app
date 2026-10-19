import React from "react";

const GlobalFooter = () => {
  const year = new Date().getFullYear();
  return (
    <div className="globalFooterContainer">
      <footer className="bg-gray-900 text-gray-300 fixed bottom-0 left-0 right-0 z-50 w-full">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xl">📊</span>
              <span className="font-semibold text-white">LivePoll</span>
            </div>

            <p className="text-sm text-gray-400">All rights reserved</p>
            <p className="text-sm text-gray-400">© {year} LivePoll</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default GlobalFooter;
