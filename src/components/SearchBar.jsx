import React, { useState, useEffect, useCallback, useRef } from "react";
import flightAPI from "../services/flightAPI"; // keep your working local import

// --- Debounce hook ---
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
};

const SearchBar = ({ onSearch, loading, initialData }) => {
  const [formData, setFormData] = useState({
    from: "",
    to: "",
    departureDate: "",
    returnDate: "",
    tripType: "oneWay",
    adults: 1,
    children: 0,
    infants: 0,
  });
  const [error, setError] = useState("");
  const [showPassengers, setShowPassengers] = useState(false);
  const [fromSuggestions, setFromSuggestions] = useState([]);
  const [toSuggestions, setToSuggestions] = useState([]);
  const [showFromSuggestions, setShowFromSuggestions] = useState(false);
  const [showToSuggestions, setShowToSuggestions] = useState(false);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  // Refs for outside click
  const passengerDropdownRef = useRef(null);
  const fromSuggestionsRef = useRef(null);
  const toSuggestionsRef = useRef(null);

  useEffect(() => {
    if (initialData) setFormData(initialData);
  }, [initialData]);

  const debouncedFromQuery = useDebounce(formData.from, 300);
  const debouncedToQuery = useDebounce(formData.to, 300);

  const searchAirports = useCallback(
    async (query, setSuggestions, setShowSuggestions) => {
      if (query.includes("(") && query.includes(")")) {
        setShowSuggestions(false);
        return;
      }
      if (query.length < 2) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }
      setLoadingSuggestions(true);
      try {
        const results = await flightAPI.getAirportSuggestions(query);
        setSuggestions(results);
        setShowSuggestions(results.length > 0);
      } catch (err) {
        console.error("Failed to fetch airport suggestions:", err);
        setSuggestions([]);
        setShowSuggestions(false);
      } finally {
        setLoadingSuggestions(false);
      }
    },
    []
  );

  useEffect(() => {
    searchAirports(
      debouncedFromQuery,
      setFromSuggestions,
      setShowFromSuggestions
    );
  }, [debouncedFromQuery, searchAirports]);

  useEffect(() => {
    searchAirports(debouncedToQuery, setToSuggestions, setShowToSuggestions);
  }, [debouncedToQuery, searchAirports]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        passengerDropdownRef.current &&
        !passengerDropdownRef.current.contains(e.target)
      ) {
        setShowPassengers(false);
      }
      if (
        fromSuggestionsRef.current &&
        !fromSuggestionsRef.current.contains(e.target)
      ) {
        setShowFromSuggestions(false);
      }
      if (
        toSuggestionsRef.current &&
        !toSuggestionsRef.current.contains(e.target)
      ) {
        setShowToSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (field, value) => {
    setError("");
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    // Strict validation for selection
    const fromIataMatch = formData.from.match(/\(([^)]+)\)/);
    const toIataMatch = formData.to.match(/\(([^)]+)\)/);

    if (!fromIataMatch)
      return setError(
        "Please select a departure airport from the suggestions."
      );
    if (!toIataMatch)
      return setError(
        "Please select a destination airport from the suggestions."
      );
    if (!formData.departureDate)
      return setError("Please select a departure date.");
    if (formData.tripType === "roundTrip" && !formData.returnDate)
      return setError("Please select a return date for your round trip.");
    if (fromIataMatch[1] === toIataMatch[1])
      return setError("Departure and destination airports cannot be the same.");

    const finalSearchParams = {
      ...formData,
      from: fromIataMatch[1],
      to: toIataMatch[1],
    };
    setShowFromSuggestions(false);
    setShowToSuggestions(false);
    setShowPassengers(false);
    onSearch(finalSearchParams);
  };

  const swapLocations = () => {
    setFormData((prev) => ({ ...prev, from: prev.to, to: prev.from }));
  };

  const selectAirport = (airport, field) => {
    handleInputChange(field, `${airport.city} (${airport.iata})`);
    if (field === "from") {
      setShowFromSuggestions(false);
    } else {
      setShowToSuggestions(false);
    }
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="bg-white rounded-[3vw] md:rounded-[2vw] lg:rounded-[1vw] shadow-lg p-[4vw] md:p-[2.5vw] lg:p-[1.5vw]">
      <div className="flex justify-center mb-[4vw] md:mb-[2vw] lg:mb-[1.5vw]">
        <div className="inline-flex rounded-[2.5vw] md:rounded-[1.5vw] lg:rounded-[1vw] border border-gray-200 p-[1vw] md:p-[0.5vw] lg:p-[0.3vw] bg-gray-50">
          {["oneWay", "roundTrip"].map((tripType) => (
            <button
              key={tripType}
              type="button"
              onClick={() => handleInputChange("tripType", tripType)}
              className={`px-[4vw] py-[2vw] sm:px-[3vw] sm:py-[1.5vw] md:px-[2vw] md:py-[1vw] lg:px-[1.2vw] lg:py-[0.5vw] rounded-[2vw] md:rounded-[1.2vw] lg:rounded-[0.8vw] font-medium text-[3.5vw] sm:text-[2vw] md:text-[1.2vw] lg:text-[0.9vw] transition-all duration-200 ${
                formData.tripType === tripType
                  ? "bg-[#5948DB] text-white shadow-md"
                  : "text-gray-700 hover:bg-white hover:shadow-sm"
              }`}
            >
              {tripType === "oneWay" ? "One Way" : "Round Trip"}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div
          className={`grid gap-[3vw] md:gap-[1.5vw] lg:gap-[1vw] mb-[4vw] md:mb-[3vw] lg:mb-[2vw] grid-cols-1 sm:grid-cols-2 ${
            formData.tripType === "roundTrip"
              ? "lg:grid-cols-5"
              : "lg:grid-cols-4"
          }`}
        >
          <div
            className={`relative col-span-1 sm:col-span-2 flex flex-col sm:flex-row items-center gap-[3vw] sm:gap-[1vw] lg:col-span-2`}
          >
            {/* FROM INPUT */}
            <div className="relative w-full" ref={fromSuggestionsRef}>
              <label className="block text-[2.8vw] sm:text-[1.8vw] md:text-[1.2vw] lg:text-[0.8vw] font-medium text-gray-700 mb-[1vw] md:mb-[0.5vw] lg:mb-[0.3vw]">
                From
              </label>
              <input
                type="text"
                placeholder="DED, Dehradun"
                value={formData.from}
                onChange={(e) => handleInputChange("from", e.target.value)}
                onFocus={() =>
                  formData.from.length >= 2 && setShowFromSuggestions(true)
                }
                className="w-full px-[3vw] py-[2vw] md:px-[1.5vw] md:py-[1vw] lg:px-[0.8vw] lg:py-[0.6vw] border border-gray-300 rounded-[2vw] md:rounded-[1.2vw] lg:rounded-[0.8vw] focus:ring-blue-500/50 focus:border-blue-500 text-[2.8vw] sm:text-[1.8vw] md:text-[1.2vw] lg:text-[0.9vw] transition-all focus:ring-[1vw] md:focus:ring-[0.6vw] lg:focus:ring-[0.3vw]"
                disabled={loading}
                autoComplete="off"
              />
              {showFromSuggestions && (
                <div className="absolute top-full left-0 right-0 mt-[1vw] lg:mt-[0.3vw] bg-white border border-gray-200 rounded-[2vw] lg:rounded-[0.8vw] shadow-lg z-30 max-h-[40vw] sm:max-h-[30vw] lg:max-h-[15vw] overflow-y-auto">
                  {loadingSuggestions ? (
                    <div className="px-[3vw] py-[2vw] text-center text-gray-500 text-[2.5vw] lg:text-[0.7vw]">
                      Searching...
                    </div>
                  ) : fromSuggestions.length > 0 ? (
                    fromSuggestions.map((airport) => (
                      <button
                        key={airport.iata}
                        type="button"
                        onMouseDown={() => selectAirport(airport, "from")}
                        className="w-full p-[3vw] sm:p-[1.5vw] lg:p-[0.8vw] text-left hover:bg-blue-50 border-b border-gray-100 last:border-b-0"
                      >
                        <div className="font-medium text-gray-900 text-[2.8vw] sm:text-[1.8vw] lg:text-[0.9vw]">
                          {airport.city} ({airport.iata})
                        </div>
                        <div className="text-gray-600 text-[2.5vw] sm:text-[1.5vw] lg:text-[0.7vw] truncate">
                          {airport.name}
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className="px-[3vw] py-[2vw] text-center text-gray-500 text-[2.5vw] lg:text-[0.7vw]">
                      No airports found.
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center sm:pt-[2.8vw] lg:pt-[1.8vw]">
              <button
                type="button"
                onClick={swapLocations}
                disabled={loading}
                className="p-[2vw] sm:p-[1vw] lg:p-[0.5vw] text-[#5948DB] hover:bg-blue-50 rounded-full transition-colors disabled:opacity-50 rotate-90 sm:rotate-0"
                title="Swap locations"
              >
                <svg
                  className="w-[5vw] h-[5vw] sm:w-[3vw] sm:h-[3vw] lg:w-[1.8vw] lg:h-[1.8vw]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                  />
                </svg>
              </button>
            </div>

            {/* TO INPUT */}
            <div className="relative w-full" ref={toSuggestionsRef}>
              <label className="block text-[2.8vw] sm:text-[1.8vw] md:text-[1.2vw] lg:text-[0.8vw] font-medium text-gray-700 mb-[1vw] md:mb-[0.5vw] lg:mb-[0.3vw]">
                To
              </label>
              <input
                type="text"
                placeholder="DEL, Delhi"
                value={formData.to}
                onChange={(e) => handleInputChange("to", e.target.value)}
                onFocus={() =>
                  formData.to.length >= 2 && setShowToSuggestions(true)
                }
                className="w-full px-[3vw] py-[2vw] md:px-[1.5vw] md:py-[1vw] lg:px-[0.8vw] lg:py-[0.6vw] border border-gray-300 rounded-[2vw] md:rounded-[1.2vw] lg:rounded-[0.8vw] focus:ring-blue-500/50 focus:border-blue-500 text-[2.8vw] sm:text-[1.8vw] md:text-[1.2vw] lg:text-[0.9vw] transition-all focus:ring-[1vw] md:focus:ring-[0.6vw] lg:focus:ring-[0.3vw]"
                disabled={loading}
                autoComplete="off"
              />
              {showToSuggestions && (
                <div className="absolute top-full left-0 right-0 mt-[1vw] lg:mt-[0.3vw] bg-white border border-gray-200 rounded-[2vw] lg:rounded-[0.8vw] shadow-lg z-30 max-h-[40vw] sm:max-h-[30vw] lg:max-h-[15vw] overflow-y-auto">
                  {loadingSuggestions ? (
                    <div className="px-[3vw] py-[2vw] text-center text-gray-500 text-[2.5vw] lg:text-[0.7vw]">
                      Searching...
                    </div>
                  ) : toSuggestions.length > 0 ? (
                    toSuggestions.map((airport) => (
                      <button
                        key={airport.iata}
                        type="button"
                        onMouseDown={() => selectAirport(airport, "to")}
                        className="w-full p-[3vw] sm:p-[1.5vw] lg:p-[0.8vw] text-left hover:bg-blue-50 border-b border-gray-100 last:border-b-0"
                      >
                        <div className="font-medium text-gray-900 text-[2.8vw] sm:text-[1.8vw] lg:text-[0.9vw]">
                          {airport.city} ({airport.iata})
                        </div>
                        <div className="text-gray-600 text-[2.5vw] sm:text-[1.5vw] lg:text-[0.7vw] truncate">
                          {airport.name}
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className="px-[3vw] py-[2vw] text-center text-gray-500 text-[2.5vw] lg:text-[0.7vw]">
                      No airports found.
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          <div>
            <label className="block text-[2.8vw] sm:text-[1.8vw] md:text-[1.2vw] lg:text-[0.8vw] font-medium text-gray-700 mb-[1vw] md:mb-[0.5vw] lg:mb-[0.3vw]">
              Departure
            </label>
            <input
              type="date"
              value={formData.departureDate}
              onChange={(e) =>
                handleInputChange("departureDate", e.target.value)
              }
              min={today}
              className="w-full px-[3vw] py-[2vw] md:px-[1.5vw] md:py-[1vw] lg:px-[0.8vw] lg:py-[0.6vw] border border-gray-300 rounded-[2vw] md:rounded-[1.2vw] lg:rounded-[0.8vw] focus:ring-blue-500/50 focus:border-blue-500 text-[2.8vw] sm:text-[1.8vw] md:text-[1.2vw] lg:text-[0.9vw] transition-all"
              disabled={loading}
            />
          </div>
          {formData.tripType === "roundTrip" && (
            <div>
              <label className="block text-[2.8vw] sm:text-[1.8vw] md:text-[1.2vw] lg:text-[0.8vw] font-medium text-gray-700 mb-[1vw] md:mb-[0.5vw] lg:mb-[0.3vw]">
                Return
              </label>
              <input
                type="date"
                value={formData.returnDate}
                onChange={(e) =>
                  handleInputChange("returnDate", e.target.value)
                }
                min={formData.departureDate || today}
                className="w-full px-[3vw] py-[2vw] md:px-[1.5vw] md:py-[1vw] lg:px-[0.8vw] lg:py-[0.6vw] border border-gray-300 rounded-[2vw] md:rounded-[1.2vw] lg:rounded-[0.8vw] focus:ring-blue-500/50 focus:border-blue-500 text-[2.8vw] sm:text-[1.8vw] md:text-[1.2vw] lg:text-[0.9vw] transition-all"
                disabled={loading}
              />
            </div>
          )}
          <div className="relative col-span-1" ref={passengerDropdownRef}>
            <label className="block text-[2.8vw] sm:text-[1.8vw] md:text-[1.2vw] lg:text-[0.8vw] font-medium text-gray-700 mb-[1vw] md:mb-[0.5vw] lg:mb-[0.3vw]">
              Passengers
            </label>
            <button
              type="button"
              onClick={() => setShowPassengers(!showPassengers)}
              className="w-full px-[3vw] py-[2vw] md:px-[1.5vw] md:py-[1vw] lg:px-[0.8vw] lg:py-[0.6vw] border border-gray-300 rounded-[2vw] md:rounded-[1.2vw] lg:rounded-[0.8vw] text-left bg-white"
            >
              <span className="flex items-center justify-between text-[2.8vw] sm:text-[1.8vw] md:text-[1.2vw] lg:text-[0.9vw]">
                <span className="truncate">{`${formData.adults} Adt, ${formData.children} Ch, ${formData.infants} Inf`}</span>
                <svg
                  className={`w-[4vw] h-[4vw] md:w-[2vw] md:h-[2vw] lg:w-[1.2vw] lg:h-[1.2vw] text-gray-400 transition-transform ${
                    showPassengers ? "rotate-180" : ""
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
              </span>
            </button>
            {/* Optional: passenger controls (adjust as needed) */}
            {showPassengers && (
              <div className="absolute top-full right-0 mt-[1vw] bg-white border rounded-[2vw] shadow-lg z-20 p-[3vw] w-[70vw] sm:w-[50vw] md:w-auto min-w-[250px]">
                {/* Passenger controls go here */}
              </div>
            )}
          </div>
        </div>
        {error && (
          <div className="text-center text-red-500 font-medium mb-[4vw] md:mb-[2vw] lg:mb-[1.5vw] text-[2.8vw] sm:text-[1.8vw] md:text-[1.2vw] lg:text-[0.9vw]">
            {error}
          </div>
        )}
        <div className="flex justify-center">
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto px-[8vw] py-[3vw] md:px-[5vw] md:py-[2vw] lg:px-[4vw] lg:py-[1.2vw] bg-[#5948DB] text-white font-semibold rounded-[2vw] md:rounded-[1.2vw] lg:rounded-[0.8vw] hover:bg-[#513bf8] text-[3.5vw] sm:text-[2.2vw] md:text-[1.5vw] lg:text-[1.1vw] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? "Searching..." : "Search Flights"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchBar;
