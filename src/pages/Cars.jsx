import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useSearch } from "../context/SearchContext";

const Cars= () => {
  const navigate = useNavigate();
  const { filters, clearFilters, updateFilter } = useSearch();
  const [showFilters, setShowFilters] = useState(false);

  const availableCars = [
    {
      id: 1,
      name: "BMW X5",
      type: "SUV",
      year: "2006",
      price: 300,
      seats: 4,
      fuel: "Hybrid",
      transmission: "Semi-Automatic",
      location: "New York",
      image:
        "",
    },
    {
      id: 2,
      name: "Toyota Corolla",
      type: "Sedan",
      year: "2022",
      price: 150,
      seats: 5,
      fuel: "Petrol",
      transmission: "Automatic",
      location: "Los Angeles",
      image: "",
    },
    {
      id: 3,
      name: "Ford Neo 6",
      type: "Hatchback",
      year: "2023",
      price: 180,
      seats: 5,
      fuel: "Electric",
      transmission: "Automatic",
      location: "Chicago",
      image: "",
    },
    {
      id: 4,
      name: "Honda Civic",
      type: "Sedan",
      year: "2021",
      price: 140,
      seats: 5,
      fuel: "Petrol",
      transmission: "Manual",
      location: "Miami",
      image: "", // Reusing image as requested
    },
    {
      id: 5,
      name: "Audi A6",
      type: "Sedan",
      year: "2022",
      price: 350,
      seats: 4,
      fuel: "Hybrid",
      transmission: "Automatic",
      location: "Seattle",
      image:
        "",
    },
  ];

  // Filter cars based on search criteria
  const filteredCars = useMemo(() => {
    return availableCars.filter((car) => {
      // Search query filter
      if (filters.searchQuery) {
        const searchLower = filters.searchQuery.toLowerCase();
        const carNameLower = car.name.toLowerCase();
        const carTypeLower = car.type.toLowerCase();
        const carLocationLower = car.location.toLowerCase();

        if (
          !carNameLower.includes(searchLower) &&
          !carTypeLower.includes(searchLower) &&
          !carLocationLower.includes(searchLower)
        ) {
          return false;
        }
      }

      // Location filter
      if (filters.location && car.location !== filters.location) {
        return false;
      }

      // Date range filter (if both dates are selected)
      if (filters.pickupDate && filters.returnDate) {
        // In a real app, you would check car availability for these dates
        // For now, we'll just show all cars
        return true;
      }

      return true;
    });
  }, [availableCars, filters]);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="pt-16">
        {/* Main Content */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Title and Subtitle */}
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Available Cars
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Browse our selection of premium vehicles available for your next
                adventure.
              </p>
            </div>

            {/* Search/Filter Bar */}
            <div className="max-w-4xl mx-auto mb-8">
              <div className="relative bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center flex-1">
                    <svg
                      className="w-5 h-5 text-gray-400 mr-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                    <input
                      type="text"
                      placeholder="Search by make, model, or features"
                      value={filters.searchQuery}
                      onChange={(e) =>
                        updateFilter("searchQuery", e.target.value)
                      }
                      className="flex-1 border-none outline-none text-gray-700 placeholder-gray-500"
                    />
                  </div>

                  {/* Filter Toggle */}
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="ml-4 p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                      />
                    </svg>
                  </button>

                  {/* Clear Filters */}
                  {(filters.searchQuery ||
                    filters.location ||
                    filters.pickupDate ||
                    filters.returnDate) && (
                    <button
                      onClick={clearFilters}
                      className="ml-2 px-3 py-1 text-sm text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {/* Advanced Filters */}
                {showFilters && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Location Filter */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Location
                        </label>
                        <select
                          value={filters.location}
                          onChange={(e) =>
                            updateFilter("location", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="">All Locations</option>
                          <option value="New York">Bhubaneswar</option>
                          <option value="Los Angeles">Cuttack</option>
                          <option value="Chicago">Bhadrak</option>
                          <option value="Houston">Balasore</option>
                          <option value="Miami">Baripada</option>
                          <option value="Seattle">Jharsuguda</option>
                        </select>
                      </div>

                      {/* Pickup Date */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Pickup Date
                        </label>
                        <input
                          type="date"
                          value={filters.pickupDate}
                          onChange={(e) =>
                            updateFilter("pickupDate", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      {/* Return Date */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Return Date
                        </label>
                        <input
                          type="date"
                          value={filters.returnDate}
                          onChange={(e) =>
                            updateFilter("returnDate", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Car Count */}
            <div className="mb-8">
              <p className="text-gray-600">
                Showing {filteredCars.length} Cars
              </p>
            </div>

            {/* Car Listings Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCars.map((car) => (
                <div
                  key={car.id}
                  onClick={() => navigate(`/cars/${car.id}`)}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer"
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={car.image}
                      alt={car.name}
                      className="w-full h-48 object-cover transition-transform duration-300 hover:scale-110"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                        Available Now
                      </span>
                    </div>
                    <div className="absolute bottom-4 right-4">
                      <span className="bg-black text-white px-3 py-1 rounded-full text-sm font-medium">
                        ${car.price} / day
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                      {car.name}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {car.type} • {car.year}
                    </p>

                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <svg
                          className="w-4 h-4 mr-2"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {car.seats} Seats
                      </div>
                      <div className="flex items-center">
                        <svg
                          className="w-4 h-4 mr-2"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                        </svg>
                        {car.fuel}
                      </div>
                      <div className="flex items-center">
                        <svg
                          className="w-4 h-4 mr-2"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                        </svg>
                        {car.transmission}
                      </div>
                      <div className="flex items-center">
                        <svg
                          className="w-4 h-4 mr-2"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {car.location}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </div>
  );
};

export default Cars;
