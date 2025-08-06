import React, { createContext, useContext, useState } from "react";

const SearchContext = createContext(undefined);

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error("useSearch must be used within a SearchProvider");
  }
  return context;
};

export const SearchProvider = ({ children }) => {
  const [filters, setFilters] = useState({
    location: "",
    pickupDate: "",
    returnDate: "",
    searchQuery: "",
    carType: "",
    priceRange: "",
  });

  const updateFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      location: "",
      pickupDate: "",
      returnDate: "",
      searchQuery: "",
      carType: "",
      priceRange: "",
    });
  };

  const isSearchActive = Object.values(filters).some((value) => value !== "");

  return (
    <SearchContext.Provider
      value={{
        filters,
        setFilters,
        updateFilter,
        clearFilters,
        isSearchActive,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};