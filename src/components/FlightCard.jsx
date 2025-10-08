import React from "react";

import indigoLogo from "../assets/logos/indigo.jpg";
import airindia from "../assets/logos/airindia.png";
import goair from "../assets/logos/goair.png";
import spicejet from "../assets/logos/spicejet.png";
import vistara from "../assets/logos/vistara.png";

const FlightCard = ({ flight }) => {
  const formatTime = (time) => time;
  const formatDuration = (duration) => duration;

  const formatPrice = (price, currency) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: currency || "INR",
      maximumFractionDigits: 0,
    }).format(price);

  const getStopsText = (stops) => {
    if (stops === 0) return "Non-stop";
    if (stops === 1) return "1 stop";
    return `${stops} stops`;
  };

  const getAirlineLogo = (airline) => {
    const logos = {
      IndiGo: indigoLogo,
      SpiceJet: spicejet,
      "Air India": airindia,
      Vistara: vistara,
      GoAir: goair,
    };
    return (
      logos[airline] ||
      `https://via.placeholder.com/40x40/6B7280/FFFFFF?text=${airline.charAt(
        0
      )}`
    );
  };

  return (
    <div className="bg-white rounded-[0.8vw] shadow-md hover:shadow-md transition-shadow duration-200 p-[3vw] sm:p-[1.5vw] lg:p-[1vw]">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-[2vw] lg:gap-[1vw]">
        {/* Airline Info */}
        <div className="flex items-center gap-[2vw] sm:gap-[1vw] lg:gap-[0.8vw]">
          <img
            src={getAirlineLogo(flight.airline)}
            alt={flight.airline}
            className="w-[10vw] h-[10vw] sm:w-[4vw] sm:h-[4vw] lg:w-[2.5vw] lg:h-[2.5vw] rounded-[1vw] object-contain"
          />
          <div>
            <div className="font-semibold text-[4vw] sm:text-[2vw] lg:text-[1.2vw] text-gray-900">
              {flight.airline}
            </div>
            <div className="text-[3vw] sm:text-[1.5vw] lg:text-[1vw] text-gray-500">
              {flight.flightNumber}
            </div>
          </div>
        </div>

        {/* Route Info */}
        <div className="flex-1 max-w-[90vw] lg:max-w-[40vw] mx-auto">
          <div className="grid grid-cols-3 items-center gap-[2vw] sm:gap-[1vw] lg:gap-[0.8vw]">
            {/* Departure */}
            <div className="text-center">
              <div className="text-[5vw] sm:text-[2.5vw] lg:text-[1.2vw] font-bold text-gray-900">
                {formatTime(flight.departure.time)}
              </div>
              <div className="text-[3.5vw] sm:text-[1.5vw] lg:text-[1vw] font-medium text-gray-600">
                {flight.departure.airport}
              </div>
            </div>

            {/* Duration & Route Line */}
            <div className="text-center">
              <div className="text-[3vw] sm:text-[1.2vw] lg:text-[0.9vw] text-gray-500 mb-[1vw]">
                {formatDuration(flight.duration)}
              </div>
              <div className="flex items-center justify-center mb-[1vw] gap-[1vw]">
                <div className="w-[1vw] h-[1vw] sm:w-[0.5vw] sm:h-[0.5vw] lg:w-[0.3vw] lg:h-[0.3vw] bg-[#5948DB] rounded-full"></div>
                <div
                  className={`h-[0.3vw] sm:h-[0.15vw] lg:h-[0.1vw] bg-[#5948DB] flex-1 relative`}
                >
                  {flight.stops > 0 && (
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[0.5vw] h-[0.5vw] sm:w-[0.25vw] sm:h-[0.25vw] lg:w-[0.12vw] lg:h-[0.12vw] bg-gray-400 rounded-full"></div>
                  )}
                </div>
                <div className="w-[1vw] h-[1vw] sm:w-[0.5vw] sm:h-[0.5vw] lg:w-[0.3vw] lg:h-[0.3vw] bg-[#5948DB] rounded-full"></div>
              </div>
              <div className="text-[3vw] sm:text-[1.5vw] lg:text-[0.9vw] text-gray-500">
                {getStopsText(flight.stops)}
              </div>
            </div>

            {/* Arrival */}
            <div className="text-center">
              <div className="text-[5vw] sm:text-[2.5vw] lg:text-[1.2vw] font-bold text-gray-900">
                {formatTime(flight.arrival.time)}
              </div>
              <div className="text-[3.5vw] sm:text-[1.5vw] lg:text-[1vw] font-medium text-gray-600">
                {flight.arrival.airport}
              </div>
            </div>
          </div>
        </div>

        {/* Price & CTA */}
        <div className="text-center lg:text-right lg:min-w-[15vw] space-y-[2vw] sm:space-y-[1vw] lg:space-y-[0.8vw]">
          <div className="text-[5vw] sm:text-[2.5vw] lg:text-[1.5vw] font-bold text-gray-900">
            {formatPrice(flight.price, flight.currency)}
          </div>
          <button className="w-full lg:w-auto px-[4vw] py-[1.5vw] sm:px-[2vw] sm:py-[1vw] lg:px-[1.5vw] lg:py-[0.7vw] bg-[#5948DB] text-white font-semibold rounded-[0.8vw] hover:bg-[#4a3fd0] transition-colors focus:ring-2 focus:ring-[#5948DB] focus:ring-offset-2 text-[4vw] sm:text-[2vw] lg:text-[1.2vw]">
            Select
          </button>
        </div>
      </div>

      {/* Bottom Info */}
      <div className="mt-[2vw] pt-[2vw] border-t border-gray-100 grid grid-cols-2 lg:grid-cols-4 gap-[2vw] sm:gap-[1vw] lg:gap-[0.8vw] text-[3vw] sm:text-[1.5vw] lg:text-[0.9vw] text-gray-600">
        <div>
          <span className="font-medium">Baggage:</span> 15 kg
        </div>
        <div>
          <span className="font-medium">Refundable:</span> No
        </div>
        <div>
          <span className="font-medium">Seat:</span> Available
        </div>
        <div>
          <span className="font-medium">Meal:</span> Extra cost
        </div>
      </div>
    </div>
  );
};

export default FlightCard;
