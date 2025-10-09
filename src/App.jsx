import React, { useState, useEffect } from "react";
import SearchBar from "./components/SearchBar";
import FlightList from "./components/FlightList";
import Filters from "./components/Filters";
import LoadingState from "./components/LoadingState";
import ErrorMessage from './components/ErrorMessage';
import flightAPI from "./services/flightAPI";

function App() {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchData, setSearchData] = useState(null);
  const [filters, setFilters] = useState({
    sortBy: "recommended",
    stops: "all",
    airlines: [],
    priceRange: [0, 50000],
    departureTime: null,
  });

  // Pre-load search data on component mount
  useEffect(() => {
    const performInitialSearch = async () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowString = tomorrow.toISOString().split("T")[0];

      const defaultSearchParams = {
        from: "DED",
        to: "DEL",
        departureDate: tomorrowString,
        returnDate: "",
        tripType: "oneWay",
        adults: 1,
        children: 0,
        infants: 0,
      };

      try {
        setSearchData(defaultSearchParams);
        await new Promise((resolve) => setTimeout(resolve, 1500)); // simulate loading
        const flightData = await flightAPI.searchFlights(defaultSearchParams);

        if (flightData && flightData.length > 0) {
          setFlights(flightData);
        } else {
          const fallback = await generateFallbackFlights(defaultSearchParams);
          setFlights(fallback);
        }
      } catch {
        try {
          const fallback = await generateFallbackFlights(defaultSearchParams);
          setFlights(fallback);
        } catch {
          setError("Failed to load flights. Please refresh the page.");
        }
      } finally {
        setLoading(false);
      }
    };

    performInitialSearch();
  }, []);

  // Fallback flight generation
  const generateFallbackFlights = async (searchParams) => {
    return [
      {
        id: 1,
        airline: "IndiGo",
        price: 5500,
        stops: 0,
        departureTime: "06:30",
        arrivalTime: "08:00",
        duration: 90,
      },
      {
        id: 2,
        airline: "Air India",
        price: 6000,
        stops: 1,
        departureTime: "09:00",
        arrivalTime: "11:30",
        duration: 150,
      },
      {
        id: 3,
        airline: "SpiceJet",
        price: 5800,
        stops: 0,
        departureTime: "12:00",
        arrivalTime: "13:30",
        duration: 90,
      },
    ];
  };

  // Search handler
  const handleSearch = async (searchParams) => {
    setLoading(true);
    setError(null);
    setSearchData(searchParams);

    try {
      const flightData = await flightAPI.searchFlights(searchParams);
      if (flightData && flightData.length > 0) {
        setFlights(flightData);
      } else {
        const fallback = await generateFallbackFlights(searchParams);
        setFlights(fallback);
      }
    } catch (err) {
      setError(
        `${err.message} Please try different airports or check your connection.`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    if (searchData) handleSearch(searchData);
  };

  // Apply filters dynamically
  const getFilteredFlights = () => {
    let filtered = [...flights];

    // Stops filter
    if (filters.stops === "nonstop")
      filtered = filtered.filter((f) => f.stops === 0);
    if (filters.stops === "1stop")
      filtered = filtered.filter((f) => f.stops === 1);

    // Airlines filter
    if (filters.airlines.length > 0)
      filtered = filtered.filter((f) => filters.airlines.includes(f.airline));

    // Departure time filter
    if (filters.departureTime) {
      filtered = filtered.filter((f) => {
        const hour = parseInt(f.departureTime.split(":")[0], 10);
        switch (filters.departureTime) {
          case "early-morning":
            return hour >= 0 && hour < 6;
          case "morning":
            return hour >= 6 && hour < 12;
          case "afternoon":
            return hour >= 12 && hour < 18;
          case "evening":
            return hour >= 18 && hour < 24;
          default:
            return true;
        }
      });
    }

    // Price filter
    filtered = filtered.filter((f) => f.price <= filters.priceRange[1]);

    // Sorting
    if (filters.sortBy === "cheapest")
      filtered.sort((a, b) => a.price - b.price);
    if (filters.sortBy === "fastest")
      filtered.sort((a, b) => a.duration - b.duration);

    return filtered;
  };

  const filteredFlights = getFilteredFlights();

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <main className="max-w-[90vw] mx-auto p-[4vw] sm:p-[2vw] md:max-w-[80vw] lg:max-w-[67vw] xl:max-w-[60vw] xl:p-[1vw]">
        {/* Header */}
        <header className="text-center mb-[6vw] sm:mb-[4vw] lg:mb-[2.5vw] xl:mb-[2vw]">
          <h1 className="font-bold text-[7vw] sm:text-[5vw] md:text-[4vw] lg:text-[3.2vw] xl:text-[2vw] text-gray-800">
            Flight Search
          </h1>
          <p className="text-[3vw] sm:text-[2vw] lg:text-[1.3vw] xl:text-[1vw] text-gray-600 mt-[2vw]">
            Find the best flights for your next adventure
          </p>
        </header>

        {/* Search Section */}
        <SearchBar
          onSearch={handleSearch}
          loading={loading}
          initialData={searchData}
        />

        {/* Results Section */}
        {searchData && (
          <div className="flex flex-col gap-[6vw] sm:gap-[4vw] lg:gap-[2vw] lg:flex-row mt-[6vw] sm:mt-[4vw] lg:mt-[2vw]">
            {/* Filters */}
            <div className="w-full lg:w-[26vw] xl:w-[20vw] flex-shrink-0">
              <Filters
                filters={filters}
                onFiltersChange={setFilters}
                totalResults={flights.length}
                searchData={searchData}
              />
            </div>

            {/* Results */}
            <div className="flex-1 min-w-0">
              {loading && <LoadingState />}
              {error && (
                <ErrorMessage
                  message={error}
                  onRetry={handleRetry}
                  type="error"
                />
              )}
              {!loading && !error && filteredFlights.length > 0 && (
                <>
                  <div className="mb-[4vw] p-[3vw] bg-white rounded-[1.5vw]">
                    <div className="flex flex-col gap-[2vw] sm:flex-row sm:justify-between sm:items-end">
                      <div>
                        <h2 className="font-bold text-[4vw] sm:text-[2.2vw] lg:text-[1.4vw] text-gray-900">
                          {filteredFlights.length} flights found
                        </h2>
                        <p className="text-[3vw] sm:text-[1.6vw] lg:text-[1vw] text-gray-600 mt-[1vw]">
                          From <strong>{searchData.from}</strong> to{" "}
                          <strong>{searchData.to}</strong> •{" "}
                          {searchData.departureDate}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-[2.7vw] sm:text-[1.5vw] text-gray-500">
                          Starting from
                        </p>
                        <p className="font-bold text-green-600 text-[4vw] sm:text-[2.5vw]">
                          ₹
                          {Math.min(
                            ...filteredFlights.map((f) => f.price)
                          ).toLocaleString("en-IN")}
                        </p>
                      </div>
                    </div>
                  </div>
                  <FlightList flights={filteredFlights} filters={filters} />
                </>
              )}
              {!loading && !error && filteredFlights.length === 0 && (
                <div className="text-center py-[8vw]">
                  <h3 className="font-bold text-[4vw] sm:text-[2vw] lg:text-[1.4vw] text-gray-900 mb-[1vw]">
                    No flights found
                  </h3>
                  <p className="text-gray-500 text-[2vw] mb-[2vw]">
                    No flights match your filter criteria.
                  </p>
                  <button
                    onClick={handleRetry}
                    className="py-[2vw] px-[6vw] bg-blue-600 text-white rounded-[1vw] hover:bg-blue-700 transition-colors"
                  >
                    Try Different Search
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
