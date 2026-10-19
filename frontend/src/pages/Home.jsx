import React from "react";
import bannerImage from "../assets/banner-image-2.png";

const Home = () => {
  return (
    <section className="homeContainer">
      {/* Main wrapper:  */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-10 md:gap-12 lg:gap-16 px-4 sm:px-6 md:px-8 min-h-[calc(100vh-12.25rem)]">
        {/* LEFT column: */}
        <div className="flex-1 w-full flex flex-col items-center justify-center gap-4 md:gap-6 text-center">
          {/* Tagline pill: */}
          <div className="bg-gray-100 px-4 sm:px-6 py-2 sm:py-3 rounded-2xl shadow-md flex flex-wrap items-center justify-center gap-2 sm:gap-4">
            <p className="text-blue-800 font-semibold text-sm sm:text-base">
              Real time
            </p>
            <p className="text-blue-800 text-xl sm:text-2xl leading-none">•</p>
            <p className="text-blue-800 font-semibold text-sm sm:text-base">
              Interactive
            </p>
            <p className="text-blue-800 text-xl sm:text-2xl leading-none">•</p>
            <p className="text-blue-800 font-semibold text-sm sm:text-base">
              Simple
            </p>
          </div>

          {/* Headline */}
          <h1 className="text-3xl sm:text-4xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-800 leading-tight">
            Create and Share polls in real time
          </h1>

          {/* Paragraph */}
          <p className="text-base sm:text-lg md:text-lg lg:text-xl text-gray-600 max-w-xl">
            Live Poll lets you create and share polls in real time, allowing you
            to gather instant feedback from your audience.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto mt-2">
            <button className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-md transition-colors w-full sm:w-auto cursor-pointer ">
              Get Started Free
            </button>
            <button className="px-6 py-3 rounded-xl border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 font-semibold transition-colors w-full sm:w-auto cursor-pointer">
              Learn More
            </button>
          </div>
        </div>

        {/* RIGHT column — image */}
        <div className="flex-1 w-full flex items-center justify-center">
          <img
            src={bannerImage}
            alt="Banner"
            className="w-full max-w-sm sm:max-w-md lg:max-w-lg h-auto max-h-80 sm:max-h-96 lg:max-h-150 object-contain"
          />
        </div>
      </div>
    </section>
  );
};

export default Home;
