import React, { useMemo } from "react";
import FlightCard from "./FlightCard";

const FlightList = ({ flights, filters }) => {
  // --- Filter and sort flights ---
  const processedFlights = useMemo(() => {
    let filteredFlights = [...flights];
    if (filters.stops !== "all") {
      if (filters.stops === "nonstop") {
        filteredFlights = filteredFlights.filter(
          (flight) => flight.stops === 0
        );
      } else if (filters.stops === "1stop") {
        filteredFlights = filteredFlights.filter(
          (flight) => flight.stops === 1
        );
      }
    }
    if (filters.airlines.length > 0) {
      filteredFlights = filteredFlights.filter((flight) =>
        filters.airlines.includes(flight.airline)
      );
    }
    filteredFlights.sort((a, b) => {
      switch (filters.sortBy) {
        case "cheapest":
          return a.price - b.price;
        case "fastest": {
          const getDurationMinutes = (duration) => {
            const parts = duration.match(/(\d+)h\s*(\d+)m/);
            if (parts) return parseInt(parts[1]) * 60 + parseInt(parts[2]);
            return 0;
          };
          return (
            getDurationMinutes(a.duration) - getDurationMinutes(b.duration)
          );
        }
        case "recommended":
        default:
          const scoreA = a.price * 0.7 + a.stops * 100;
          const scoreB = b.price * 0.7 + b.stops * 100;
          return scoreA - scoreB;
      }
    });
    return filteredFlights;
  }, [flights, filters]);

  // --- Label for sort type ---
  const getSortLabel = () => {
    switch (filters.sortBy) {
      case "cheapest":
        return "Cheapest First";
      case "fastest":
        return "Fastest First";
      case "recommended":
      default:
        return "Recommended";
    }
  };

  // --- No flights fallback ---
  if (processedFlights.length === 0) {
    return (
      <div className="text-center py-[8vw] sm:py-[5vw] lg:py-[3vw]">
        <svg
          className="mx-auto mb-[4vw] sm:mb-[2vw] lg:mb-[1vw] w-[10vw] h-[10vw] sm:w-[4vw] sm:h-[4vw] lg:w-[2vw] lg:h-[2vw] text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
        <h3 className="text-[5vw] sm:text-[2.5vw] lg:text-[1.3vw] font-medium text-gray-900 mb-[2vw] sm:mb-[1vw] lg:mb-[0.5vw]">
          No flights found
        </h3>
        <p className="text-[4vw] sm:text-[2vw] lg:text-[1vw] text-gray-500">
          Try adjusting your filters to see more results.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-[5vw] sm:space-y-[3vw] lg:space-y-[1.5vw]">
      {/* Sort Tag/Header */}
      <div className="mb-[4vw] sm:mb-[2vw] lg:mb-[1vw]">
        <div className="inline-flex items-center px-[4vw] py-[1.8vw] sm:px-[2vw] sm:py-[1vw] lg:px-[1vw] lg:py-[0.6vw] bg-[#5948DB] rounded-[1vw] border border-gray-300">
          <span className="text-[4vw] sm:text-[2vw] lg:text-[1vw] text-white">
            Sorted by:{" "}
            <span className="font-semibold text-white">{getSortLabel()}</span>
          </span>
        </div>
      </div>

      {/* Flights */}
      <div className="space-y-[5vw] sm:space-y-[3vw] lg:space-y-[1.5vw]">
        {processedFlights.map((flight) => (
          <FlightCard key={flight.id} flight={flight} />
        ))}
      </div>

      {/* Load More (for demo purposes, up to 10+) */}
      {processedFlights.length >= 10 && (
        <div className="text-center pt-[6vw] sm:pt-[3vw] lg:pt-[1.5vw]">
          <button className="px-[5vw] py-[2vw] sm:px-[2.5vw] sm:py-[1vw] lg:px-[1.5vw] lg:py-[0.6vw] border border-gray-300 rounded-[0.8vw] text-[4vw] sm:text-[2vw] lg:text-[1vw] text-gray-700 hover:bg-gray-50 transition-colors">
            Load More Flights
          </button>
        </div>
      )}
    </div>
  );
};

export default FlightList;
