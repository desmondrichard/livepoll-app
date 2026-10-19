import React from "react";
import { Outlet } from "react-router";
import GlobalHeader from "./GlobalHeader";
import GlobalFooter from "./GlobalFooter";

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <GlobalHeader />

      {/* pt-16,pb-16- used to fix fixed header,footer */}
      <main className="flex-1 pt-16 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          <Outlet />  
        </div>
      </main>

      <GlobalFooter />
    </div>
  );
};

export default Layout;
