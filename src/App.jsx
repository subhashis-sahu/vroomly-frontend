import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { SearchProvider } from "./context/SearchContext";
import Home from "./pages/Home";
import Cars from "./pages/Cars";
import CarDetail from "./pages/CarDetail";
import MyBookings from "./pages/MyBookings";
import Contact from "./pages/Contact";

const App = () => {
  return (
    <SearchProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cars" element={<Cars />} />
          <Route path="/cars/:id" element={<CarDetail />} />
          <Route path="/bookings" element={<MyBookings />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </Router>
    </SearchProvider>
  );
};

export default App;
