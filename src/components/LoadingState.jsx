import React from "react";

const LoadingState = () => {
  const skeletonCards = Array.from({ length: 6 }, (_, index) => index);

  return (
    <div className="space-y-[2vw]">
      {/* Loading Header */}
      <div className="animate-pulse">
        <div className="h-[2vw] bg-gray-200 rounded-[0.5vw] w-[20vw] mb-[2vw]"></div>
      </div>

      {/* Skeleton Flight Cards */}
      {skeletonCards.map((index) => (
        <div
          key={index}
          className="bg-white rounded-[1vw] shadow-sm p-[3vw] animate-pulse"
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-[3vw] lg:space-y-0">
            {/* Left Section - Airline Info */}
            <div className="flex items-center space-x-[2vw]">
              {/* Airline Logo */}
              <div className="w-[6vw] h-[6vw] bg-gray-200 rounded-[1vw]"></div>
              {/* Airline Name Skeleton */}
              <div className="space-y-[1vw]">
                <div className="h-[1.2vw] bg-gray-200 rounded-[0.3vw] w-[10vw]"></div>
                <div className="h-[1vw] bg-gray-200 rounded-[0.3vw] w-[6vw]"></div>
              </div>
            </div>

            {/* Middle Section - Flight Times */}
            <div className="flex-1 grid grid-cols-3 items-center gap-[2vw] max-w-[50vw] mx-auto">
              {/* Departure */}
              <div className="text-center">
                <div className="h-[2vw] bg-gray-200 rounded-[0.5vw] w-[8vw] mx-auto mb-[1vw]"></div>
                <div className="h-[1.2vw] bg-gray-200 rounded-[0.5vw] w-[6vw] mx-auto"></div>
              </div>
              {/* Duration & Stops */}
              <div className="text-center">
                <div className="h-[1vw] bg-gray-200 rounded-[0.3vw] w-[8vw] mx-auto mb-[1vw]"></div>
                <div className="h-[3vw] w-[3vw] bg-gray-200 rounded-full mx-auto mb-[1vw]"></div>
                <div className="h-[1vw] bg-gray-200 rounded-[0.3vw] w-[10vw] mx-auto"></div>
              </div>
              {/* Arrival */}
              <div className="text-center">
                <div className="h-[2vw] bg-gray-200 rounded-[0.5vw] w-[8vw] mx-auto mb-[1vw]"></div>
                <div className="h-[1.2vw] bg-gray-200 rounded-[0.5vw] w-[6vw] mx-auto"></div>
              </div>
            </div>

            {/* Right Section - Price */}
            <div className="text-right lg:min-w-[10vw]">
              <div className="h-[2vw] bg-gray-200 rounded-[0.5vw] w-[8vw] ml-auto mb-[1vw]"></div>
              <div className="h-[3vw] bg-gray-200 rounded-[1vw] w-[10vw] ml-auto"></div>
            </div>
          </div>
        </div>
      ))}

      {/* Loading Message */}
      <div className="text-center py-[3vw]">
        <div className="flex items-center justify-center space-x-[1vw] text-gray-500">
          <svg
            className="animate-spin"
            style={{ height: "2vw", width: "2vw", color: "#5948DB" }}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2
              5.291A7.962 7.962 0 014 12H0c0 3.042
              1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <span className="text-[2vw] font-medium">
            Searching for flights...
          </span>
        </div>
      </div>
    </div>
  );
};

export default LoadingState;
