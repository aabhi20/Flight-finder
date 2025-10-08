import React, { useState, useEffect, useCallback, useRef } from "react";

const mockAirports = [
  {
    iata: "DED",
    city: "Dehradun",
    name: "Jolly Grant Airport",
    country: "India",
  },
  {
    iata: "DEL",
    city: "Delhi",
    name: "Indira Gandhi International Airport",
    country: "India",
  },
  {
    iata: "BOM",
    city: "Mumbai",
    name: "Chhatrapati Shivaji Maharaj International Airport",
    country: "India",
  },
  {
    iata: "BLR",
    city: "Bengaluru",
    name: "Kempegowda International Airport",
    country: "India",
  },
  {
    iata: "MAA",
    city: "Chennai",
    name: "Chennai International Airport",
    country: "India",
  },
  { iata: "GOI", city: "Goa", name: "Dabolim Airport", country: "India" },
  {
    iata: "JFK",
    city: "New York",
    name: "John F. Kennedy International Airport",
    country: "USA",
  },
  { iata: "LHR", city: "London", name: "Heathrow Airport", country: "UK" },
  {
    iata: "DXB",
    city: "Dubai",
    name: "Dubai International Airport",
    country: "UAE",
  },
];

const flightAPI = {
  getAirportSuggestions: async (query) => {
    await new Promise((r) => setTimeout(r, 300));
    if (!query) return [];
    const lower = query.toLowerCase();
    return mockAirports.filter(
      (a) =>
        a.iata.toLowerCase().includes(lower) ||
        a.city.toLowerCase().includes(lower) ||
        a.name.toLowerCase().includes(lower)
    );
  },
};

const useDebounce = (value, delay) => {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debounced;
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
  const passengerDropdownRef = useRef(null);

  useEffect(() => {
    if (initialData) setFormData(initialData);
  }, [initialData]);

  const debouncedFrom = useDebounce(formData.from, 300);
  const debouncedTo = useDebounce(formData.to, 300);

  const searchAirports = useCallback(async (query, setSuggestions, setShow) => {
    if (query.length < 2) {
      setSuggestions([]);
      setShow(false);
      return;
    }
    setLoadingSuggestions(true);
    try {
      const results = await flightAPI.getAirportSuggestions(query);
      setSuggestions(results);
      setShow(true);
    } catch {
      setSuggestions([]);
      setShow(false);
    } finally {
      setLoadingSuggestions(false);
    }
  }, []);

  useEffect(() => {
    if (debouncedFrom && showFromSuggestions)
      searchAirports(debouncedFrom, setFromSuggestions, setShowFromSuggestions);
  }, [debouncedFrom, showFromSuggestions, searchAirports]);

  useEffect(() => {
    if (debouncedTo && showToSuggestions)
      searchAirports(debouncedTo, setToSuggestions, setShowToSuggestions);
  }, [debouncedTo, showToSuggestions, searchAirports]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        passengerDropdownRef.current &&
        !passengerDropdownRef.current.contains(e.target)
      ) {
        setShowPassengers(false);
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
    if (!formData.from.trim())
      return setError("Please select a departure airport.");
    if (!formData.to.trim())
      return setError("Please select a destination airport.");
    if (!formData.departureDate)
      return setError("Please select a departure date.");
    if (formData.tripType === "roundTrip" && !formData.returnDate)
      return setError("Please select a return date for your round trip.");
    if (formData.from.toUpperCase() === formData.to.toUpperCase())
      return setError("Departure and destination airports cannot be the same.");

    setShowPassengers(false);
    setShowFromSuggestions(false);
    setShowToSuggestions(false);
    onSearch(formData);
  };

  const swapLocations = () => {
    setFormData((prev) => ({ ...prev, from: prev.to, to: prev.from }));
    setFromSuggestions([]);
    setToSuggestions([]);
  };

  const selectAirport = (airport, field) => {
    handleInputChange(field, airport.iata);
    field === "from"
      ? (setShowFromSuggestions(false), setFromSuggestions([]))
      : (setShowToSuggestions(false), setToSuggestions([]));
  };

  const today = new Date().toISOString().split("T")[0];

  const passengerTypes = [
    { type: "adults", label: "Adults", age: "12+ years", min: 1, max: 9 },
    { type: "children", label: "Children", age: "2-11 years", min: 0, max: 9 },
    {
      type: "infants",
      label: "Infants",
      age: "Under 2",
      min: 0,
      max: formData.adults,
    },
  ];

  return (
    <div className="bg-white rounded-[3vw] shadow-lg p-[4vw] md:rounded-[2vw] md:p-[2vw] lg:rounded-[1vw] lg:p-[1.5vw]">
      <div className="flex justify-center mb-[4vw] md:mb-[2vw] lg:mb-[1.5vw]">
        <div className="inline-flex rounded-[2.5vw] md:rounded-[1.5vw] lg:rounded-[1vw] border border-gray-200 p-[1vw] md:p-[0.5vw] lg:p-[0.3vw] bg-gray-50">
          {["oneWay", "roundTrip"].map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => handleInputChange("tripType", t)}
              className={`px-[4vw] py-[2vw] md:px-[2vw] md:py-[1vw] lg:px-[1.2vw] lg:py-[0.5vw] rounded-[2vw] md:rounded-[1.2vw] lg:rounded-[0.8vw] font-medium text-[3.5vw] md:text-[1.2vw] lg:text-[0.9vw] transition-all duration-200 ${
                formData.tripType === t
                  ? "bg-[#5948DB] text-white shadow-md"
                  : "text-gray-700 hover:bg-white hover:shadow-sm"
              }`}
            >
              {t === "oneWay" ? "One Way" : "Round Trip"}
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
          <div className="relative col-span-1 sm:col-span-2 flex flex-col sm:flex-row items-center gap-[3vw] sm:gap-[1vw] lg:col-span-2">
            <div className="relative w-full">
              <label className="block text-[2.8vw] md:text-[1.2vw] lg:text-[0.8vw] font-medium text-gray-700 mb-[1vw] md:mb-[0.5vw]">
                From <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="DED, Dehradun"
                value={formData.from}
                onChange={(e) => {
                  handleInputChange("from", e.target.value);
                  setShowFromSuggestions(true);
                }}
                onFocus={() => {
                  if (formData.from.length >= 2) setShowFromSuggestions(true);
                }}
                onBlur={() =>
                  setTimeout(() => setShowFromSuggestions(false), 200)
                }
                className="w-full px-[3vw] py-[2vw] md:px-[1.5vw] md:py-[1vw] lg:px-[0.8vw] lg:py-[0.6vw] border border-gray-300 rounded-[2vw] md:rounded-[1.2vw] lg:rounded-[0.8vw] focus:ring-blue-500/50 focus:border-blue-500 text-[2.8vw] md:text-[1.2vw] lg:text-[0.9vw]"
                disabled={loading}
              />
              {showFromSuggestions && (
                <div className="absolute top-full left-0 right-0 mt-[1vw] bg-white border border-gray-200 rounded-[2vw] lg:rounded-[0.8vw] shadow-lg z-30 max-h-[40vw] md:max-h-[15vw] overflow-y-auto">
                  {loadingSuggestions ? (
                    <div className="px-[3vw] py-[2vw] text-center text-gray-500 text-[2.5vw] lg:text-[0.7vw]">
                      Searching...
                    </div>
                  ) : fromSuggestions.length > 0 ? (
                    fromSuggestions.map((airport, idx) => (
                      <button
                        key={`${airport.iata}-${idx}`}
                        type="button"
                        onClick={() => selectAirport(airport, "from")}
                        className="w-full p-[3vw] hover:bg-blue-50 border-b border-gray-100 text-[2.8vw] md:text-[0.9vw] text-left"
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="font-medium text-gray-900">
                              {airport.iata} - {airport.city}
                            </div>
                            <div className="text-gray-600 text-[2.5vw] md:text-[0.7vw] truncate">
                              {airport.name}
                            </div>
                          </div>
                          <div className="text-gray-500 text-[2.5vw] md:text-[0.7vw] ml-[1vw]">
                            {airport.country}
                          </div>
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className="px-[3vw] py-[2vw] text-center text-gray-500 text-[2.5vw] md:text-[0.7vw]">
                      No airports found.
                    </div>
                  )}
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={swapLocations}
              disabled={loading}
              className="flex items-center sm:pt-[2.8vw] lg:pt-[1.8vw] p-[2vw] text-[#5948DB] hover:bg-blue-50 rounded-full transition-colors rotate-90 sm:rotate-0"
            >
              <svg
                className="w-[5vw] h-[5vw] md:w-[1.8vw] md:h-[1.8vw]"
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

            <div className="relative w-full">
              <label className="block text-[2.8vw] md:text-[1.2vw] lg:text-[0.8vw] font-medium text-gray-700 mb-[1vw] md:mb-[0.5vw]">
                To <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="DEL, Delhi"
                value={formData.to}
                onChange={(e) => {
                  handleInputChange("to", e.target.value);
                  setShowToSuggestions(true);
                }}
                onFocus={() => {
                  if (formData.to.length >= 2) setShowToSuggestions(true);
                }}
                onBlur={() =>
                  setTimeout(() => setShowToSuggestions(false), 200)
                }
                className="w-full px-[3vw] py-[2vw] md:px-[1.5vw] md:py-[1vw] lg:px-[0.8vw] lg:py-[0.6vw] border border-gray-300 rounded-[2vw] md:rounded-[1.2vw] lg:rounded-[0.8vw] text-[2.8vw] md:text-[1.2vw] lg:text-[0.9vw]"
                disabled={loading}
              />
              {showToSuggestions && (
                <div className="absolute top-full left-0 right-0 mt-[1vw] bg-white border border-gray-200 rounded-[2vw] lg:rounded-[0.8vw] shadow-lg z-30 max-h-[40vw] md:max-h-[15vw] overflow-y-auto">
                  {loadingSuggestions ? (
                    <div className="px-[3vw] py-[2vw] text-center text-gray-500 text-[2.5vw] lg:text-[0.7vw]">
                      Searching...
                    </div>
                  ) : toSuggestions.length > 0 ? (
                    toSuggestions.map((airport, idx) => (
                      <button
                        key={`${airport.iata}-${idx}`}
                        type="button"
                        onClick={() => selectAirport(airport, "to")}
                        className="w-full p-[3vw] hover:bg-blue-50 border-b border-gray-100 text-[2.8vw] md:text-[0.9vw] text-left"
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="font-medium text-gray-900">
                              {airport.iata} - {airport.city}
                            </div>
                            <div className="text-gray-600 text-[2.5vw] md:text-[0.7vw] truncate">
                              {airport.name}
                            </div>
                          </div>
                          <div className="text-gray-500 text-[2.5vw] md:text-[0.7vw] ml-[1vw]">
                            {airport.country}
                          </div>
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className="px-[3vw] py-[2vw] text-center text-gray-500 text-[2.5vw] md:text-[0.7vw]">
                      No airports found.
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-[2.8vw] md:text-[1.2vw] lg:text-[0.8vw] font-medium text-gray-700 mb-[1vw] md:mb-[0.5vw]">
              Departure <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={formData.departureDate}
              min={today}
              onChange={(e) =>
                handleInputChange("departureDate", e.target.value)
              }
              className="w-full px-[3vw] py-[2vw] md:px-[1.5vw] md:py-[1vw] lg:px-[0.8vw] lg:py-[0.6vw] border border-gray-300 rounded-[2vw] md:rounded-[1.2vw] lg:rounded-[0.8vw] text-[2.8vw] md:text-[1.2vw] lg:text-[0.9vw]"
              disabled={loading}
            />
          </div>

          {formData.tripType === "roundTrip" && (
            <div>
              <label className="block text-[2.8vw] md:text-[1.2vw] lg:text-[0.8vw] font-medium text-gray-700 mb-[1vw] md:mb-[0.5vw]">
                Return <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={formData.returnDate}
                min={formData.departureDate || today}
                onChange={(e) =>
                  handleInputChange("returnDate", e.target.value)
                }
                className="w-full px-[3vw] py-[2vw] md:px-[1.5vw] md:py-[1vw] lg:px-[0.8vw] lg:py-[0.6vw] border border-gray-300 rounded-[2vw] md:rounded-[1.2vw] lg:rounded-[0.8vw] text-[2.8vw] md:text-[1.2vw] lg:text-[0.9vw]"
                disabled={loading}
              />
            </div>
          )}

          <div className="relative col-span-1" ref={passengerDropdownRef}>
            <label className="block text-[2.8vw] md:text-[1.2vw] lg:text-[0.8vw] font-medium text-gray-700 mb-[1vw] md:mb-[0.5vw]">
              Passengers
            </label>
            <button
              type="button"
              onClick={() => setShowPassengers(!showPassengers)}
              disabled={loading}
              className="w-full px-[3vw] py-[2vw] md:px-[1.5vw] md:py-[1vw] lg:px-[0.8vw] lg:py-[0.6vw] border border-gray-300 rounded-[2vw] md:rounded-[1.2vw] lg:rounded-[0.8vw] text-left bg-white hover:bg-gray-50 flex justify-between items-center text-[2.8vw] md:text-[1.2vw] lg:text-[0.9vw]"
            >
              {`${formData.adults} Adt, ${formData.children} Ch, ${formData.infants} Inf`}
              <svg
                className={`w-[4vw] h-[4vw] md:w-[1.2vw] md:h-[1.2vw] text-gray-400 transition-transform ${
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
            </button>

            {showPassengers && (
              <div className="absolute top-full left-0 mt-[1vw] bg-white border border-gray-200 rounded-[2vw] lg:rounded-[0.8vw] shadow-lg z-20 p-[3vw] md:p-[1.5vw] w-[70vw] md:w-auto min-w-[250px]">
                <div className="space-y-[2vw] md:space-y-[0.8vw]">
                  {passengerTypes.map((pax) => (
                    <div
                      key={pax.type}
                      className="flex items-center justify-between"
                    >
                      <div>
                        <span className="text-[3vw] md:text-[0.9vw] font-medium text-gray-900">
                          {pax.label}
                        </span>
                        <p className="text-[2.5vw] md:text-[0.7vw] text-gray-500">
                          {pax.age}
                        </p>
                      </div>
                      <div className="flex items-center space-x-[1.5vw] md:space-x-[0.5vw]">
                        <button
                          type="button"
                          onClick={() =>
                            handleInputChange(
                              pax.type,
                              Math.max(pax.min, formData[pax.type] - 1)
                            )
                          }
                          className="w-[6vw] h-[6vw] md:w-[2vw] md:h-[2vw] rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 text-gray-600 text-[3vw] md:text-[1vw]"
                        >
                          -
                        </button>
                        <span className="w-[5vw] md:w-[2vw] text-center font-medium text-[3vw] md:text-[0.9vw]">
                          {formData[pax.type]}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            handleInputChange(
                              pax.type,
                              Math.min(pax.max, formData[pax.type] + 1)
                            )
                          }
                          className="w-[6vw] h-[6vw] md:w-[2vw] md:h-[2vw] rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 text-gray-600 text-[3vw] md:text-[1vw]"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => setShowPassengers(false)}
                  className="w-full mt-[3vw] md:mt-[1vw] bg-[#5948DB] text-white rounded-[2vw] md:rounded-[0.8vw] px-[3vw] py-[2vw] md:px-[0.8vw] md:py-[0.5vw] text-[3vw] md:text-[0.9vw] hover:bg-blue-700 font-medium transition-colors"
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </div>

        {error && (
          <div className="text-center text-red-500 font-medium mb-[4vw] md:mb-[2vw] lg:mb-[1.5vw] text-[2.8vw] md:text-[1.2vw] lg:text-[0.9vw]">
            {error}
          </div>
        )}

        <div className="flex justify-center">
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto px-[8vw] py-[3vw] md:px-[4vw] md:py-[1.2vw] bg-[#5948DB] text-white font-semibold rounded-[2vw] md:rounded-[0.8vw] hover:bg-[#513bf8] text-[3.5vw] md:text-[1.1vw] transition-all shadow-lg disabled:opacity-50 flex items-center justify-center gap-[2vw] md:gap-[0.5vw]"
          >
            {loading ? "Searching..." : "Search Flights"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchBar;
