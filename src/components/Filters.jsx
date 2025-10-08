import React, { useState } from "react";

const Filters = ({ filters, onFiltersChange, totalResults }) => {
  const [localFilters, setLocalFilters] = useState({
    priceRange: [0, 50000],
    departureTime: null,
  });
  const [isExpanded, setIsExpanded] = useState({
    sort: true,
    stops: true,
    airlines: true,
    price: false,
    departure: false,
  });

  const availableAirlines = [
    { name: "IndiGo", code: "6E", count: 45 },
    { name: "SpiceJet", code: "SG", count: 32 },
    { name: "Air India", code: "AI", count: 28 },
    { name: "Vistara", code: "UK", count: 25 },
    { name: "GoAir", code: "G8", count: 18 },
  ];

  const toggleSection = (key) =>
    setIsExpanded((prev) => ({ ...prev, [key]: !prev[key] }));

  const clearAllFilters = () => {
    onFiltersChange({
      sortBy: "recommended",
      stops: "all",
      airlines: [],
      priceRange: [0, 50000],
      departureTime: null,
    });
    setLocalFilters({ priceRange: [0, 50000], departureTime: null });
  };

  const applyFilters = () => {
    onFiltersChange({ ...filters, ...localFilters });
  };

  const FilterSection = ({ title, sectionKey, children }) => (
    <div className="border-b border-gray-200 last:border-b-0">
      <button
        onClick={() => toggleSection(sectionKey)}
        className="w-full flex items-center justify-between p-[2vw] sm:p-[1.2vw] lg:p-[0.8vw] rounded-[0.8vw] hover:bg-gray-50 transition"
      >
        <h3 className="font-semibold text-[4vw] sm:text-[2.2vw] lg:text-[1.2vw] text-gray-900">
          {title}
        </h3>
        <svg
          className={`text-gray-500 transition-transform w-[4vw] h-[4vw] sm:w-[2vw] sm:h-[2vw] lg:w-[1.2vw] lg:h-[1.2vw] ${
            isExpanded[sectionKey] ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      {isExpanded[sectionKey] && <div className="pb-[1.5vw]">{children}</div>}
    </div>
  );

  const FilterOption = ({ type, value, checked, onChange, label, extra }) => (
    <label className="flex justify-between items-center cursor-pointer">
      <div className="flex items-center gap-[1vw]">
        <input
          type={type}
          checked={checked}
          value={value}
          onChange={onChange}
          className={`appearance-none border rounded-full w-[4vw] h-[4vw] sm:w-[2vw] sm:h-[2vw] lg:w-[1.2vw] lg:h-[1.2vw] checked:border-[#5948DB] checked:border-4 transition`}
        />
        <span className="text-[4vw] sm:text-[2.2vw] lg:text-[1.2vw] font-medium text-gray-900 hover:text-[#5948DB]">
          {label}
        </span>
      </div>
      {extra && (
        <span className="text-[3.5vw] sm:text-[2vw] lg:text-[1vw] text-gray-500">
          {extra}
        </span>
      )}
    </label>
  );

  const departureSlots = [
    {
      key: "early-morning",
      label: "Early Morning",
      time: "00:00 - 06:00",
      icon: "🌙",
    },
    { key: "morning", label: "Morning", time: "06:00 - 12:00", icon: "🌅" },
    { key: "afternoon", label: "Afternoon", time: "12:00 - 18:00", icon: "☀️" },
    { key: "evening", label: "Evening", time: "18:00 - 24:00", icon: "🌆" },
  ];

  return (
    <div className="bg-white shadow-sm rounded-[0.8vw] p-[3vw] sm:p-[1.5vw] lg:p-[1vw]">
      {/* Header */}
      <div className="flex items-center justify-between mb-[3vw] sm:mb-[1.5vw] lg:mb-[1vw]">
        <h2 className="text-[5vw] sm:text-[2.5vw] lg:text-[1.3vw] font-semibold text-gray-900">
          Filters
        </h2>
        <button
          onClick={clearAllFilters}
          className="text-[4vw] sm:text-[2vw] lg:text-[1vw] font-medium text-[#5948DB] hover:text-[#4a3fd0]"
        >
          Clear All
        </button>
      </div>

      {/* Results Count */}
      <div className="bg-blue-50 rounded-[0.8vw] mb-[3vw] p-[2vw] sm:p-[1vw] lg:p-[0.8vw]">
        <p className="text-[3.5vw] sm:text-[2vw] lg:text-[1vw] text-[#5948DB]">
          <span className="font-semibold">{totalResults}</span> flights found
        </p>
      </div>

      <div className="flex flex-col gap-[2vw]">
        {/* Sort */}
        <FilterSection title="Sort By" sectionKey="sort">
          <div className="flex flex-col gap-[1.2vw]">
            {["recommended", "cheapest", "fastest"].map((opt) => (
              <FilterOption
                key={opt}
                type="radio"
                value={opt}
                checked={filters.sortBy === opt}
                onChange={() => onFiltersChange({ ...filters, sortBy: opt })}
                label={opt.charAt(0).toUpperCase() + opt.slice(1)}
              />
            ))}
          </div>
        </FilterSection>

        {/* Stops */}
        <FilterSection title="Stops" sectionKey="stops">
          <div className="flex flex-col gap-[1.2vw]">
            {["all", "nonstop", "1stop"].map((opt) => (
              <FilterOption
                key={opt}
                type="radio"
                value={opt}
                checked={filters.stops === opt}
                onChange={() => onFiltersChange({ ...filters, stops: opt })}
                label={
                  opt === "all"
                    ? "Any number of stops"
                    : opt === "nonstop"
                    ? "Non-stop"
                    : "1 stop"
                }
                extra={`(${
                  opt === "all"
                    ? totalResults
                    : opt === "nonstop"
                    ? Math.floor(totalResults * 0.4)
                    : Math.floor(totalResults * 0.6)
                })`}
              />
            ))}
          </div>
        </FilterSection>

        {/* Airlines */}
        <FilterSection title="Airlines" sectionKey="airlines">
          <div className="space-y-[1vw] max-h-[18vw] overflow-y-auto">
            {availableAirlines.map((airline) => (
              <FilterOption
                key={airline.name}
                type="checkbox"
                value={airline.name}
                checked={filters.airlines.includes(airline.name)}
                onChange={() => {
                  const newList = filters.airlines.includes(airline.name)
                    ? filters.airlines.filter((a) => a !== airline.name)
                    : [...filters.airlines, airline.name];
                  onFiltersChange({ ...filters, airlines: newList });
                }}
                label={airline.name}
                extra={`(${airline.count})`}
              />
            ))}
          </div>
        </FilterSection>

        {/* Price Range */}
        <FilterSection title="Price Range" sectionKey="price">
          <div className="flex flex-col gap-[1vw]">
            <div className="flex justify-between text-[3.5vw] sm:text-[2vw] lg:text-[1vw] text-gray-600">
              <span>₹0</span>
              <span>₹50,000+</span>
            </div>
            <input
              type="range"
              min="0"
              max="50000"
              step="1000"
              value={localFilters.priceRange[1]}
              onChange={(e) =>
                setLocalFilters((prev) => ({
                  ...prev,
                  priceRange: [0, parseInt(e.target.value)],
                }))
              }
              className="w-full h-[0.5vw] rounded-[0.8vw] appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #5948DB 0%, #5948DB ${
                  (localFilters.priceRange[1] / 50000) * 100
                }%, #e5e7eb ${
                  (localFilters.priceRange[1] / 50000) * 100
                }%, #e5e7eb 100%)`,
              }}
            />
            <div className="flex justify-between text-[3.5vw] sm:text-[2vw] lg:text-[1vw]">
              <span>Max: ₹{localFilters.priceRange[1].toLocaleString()}</span>
            </div>
          </div>
        </FilterSection>

        {/* Departure */}
        <FilterSection title="Departure Time" sectionKey="departure">
          <div className="grid grid-cols-2 gap-[1vw]">
            {departureSlots.map((slot) => (
              <button
                key={slot.key}
                type="button"
                onClick={() =>
                  setLocalFilters((prev) => ({
                    ...prev,
                    departureTime:
                      prev.departureTime === slot.key ? null : slot.key,
                  }))
                }
                className={`border rounded-[0.8vw] text-center p-[2vw] sm:p-[1vw] lg:p-[0.8vw] transition-colors ${
                  localFilters.departureTime === slot.key
                    ? "border-[#5948DB] bg-blue-50"
                    : "border-gray-200 hover:border-[#5948DB] hover:bg-blue-50"
                }`}
              >
                <div className="text-[4vw] sm:text-[2vw] lg:text-[1.2vw] mb-[1vw]">
                  {slot.icon}
                </div>
                <div
                  className={`text-[3.5vw] sm:text-[2vw] lg:text-[1vw] font-medium ${
                    localFilters.departureTime === slot.key
                      ? "text-[#5948DB]"
                      : "text-gray-900"
                  }`}
                >
                  {slot.label}
                </div>
                <div className="text-[3vw] sm:text-[1.8vw] lg:text-[0.9vw] text-gray-500 mt-[0.5vw]">
                  {slot.time}
                </div>
              </button>
            ))}
          </div>
        </FilterSection>
      </div>

      {/* Apply Button for Mobile */}
      <div className="mt-[3vw] block lg:hidden">
        <button
          onClick={applyFilters}
          className="w-full bg-[#5948DB] text-white font-semibold rounded-[0.8vw] p-[2vw] sm:p-[1vw] lg:p-[0.8vw] hover:bg-[#4a3fd0] transition-colors text-[4vw] sm:text-[2.2vw] lg:text-[1.2vw]"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
};

export default Filters;
