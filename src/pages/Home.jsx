import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Toast from "../components/Toast";
import { useSearch } from "../context/SearchContext";

const Home = () => {
  const navigate = useNavigate();
  const { filters, updateFilter } = useSearch();

  // Animation states
  const [animateHero, setAnimateHero] = useState(false);
  const [animateFeatures, setAnimateFeatures] = useState(false);
  const [animateCars, setAnimateCars] = useState(false);
  const [animateStats, setAnimateStats] = useState(false);
  const [animateFAQ, setAnimateFAQ] = useState(false);
  const [toast, setToast] = useState({
    message: "",
    type: "success",
    isVisible: false,
  });

  // FAQ state management
  const [openFAQ, setOpenFAQ] = useState(null);

  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  // Check for auth message on component mount
  useEffect(() => {
    const authMessage = sessionStorage.getItem("authMessage");
    if (authMessage) {
      setToast({
        message: authMessage,
        type: "info",
        isVisible: true,
      });
      // Clear the message from sessionStorage
      sessionStorage.removeItem("authMessage");
    }
  }, []);

  // Animation triggers
  useEffect(() => {
    // Hero animation on mount
    setAnimateHero(true);

    // Features animation after hero
    const featuresTimer = setTimeout(() => setAnimateFeatures(true), 300);

    // Cars animation after features
    const carsTimer = setTimeout(() => setAnimateCars(true), 600);

    // Stats animation after cars
    const statsTimer = setTimeout(() => setAnimateStats(true), 900);

    // FAQ animation after stats
    const faqTimer = setTimeout(() => setAnimateFAQ(true), 1200);

    return () => {
      clearTimeout(featuresTimer);
      clearTimeout(carsTimer);
      clearTimeout(statsTimer);
      clearTimeout(faqTimer);
    };
  }, []);

  // Scroll-triggered animations
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;

      // Trigger animations based on scroll position
      if (scrollY > windowHeight * 0.3) {
        setAnimateFeatures(true);
      }
      if (scrollY > windowHeight * 0.6) {
        setAnimateCars(true);
      }
      if (scrollY > windowHeight * 1.2) {
        setAnimateStats(true);
      }
      if (scrollY > windowHeight * 1.8) {
        setAnimateFAQ(true);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const closeToast = () => {
    setToast((prev) => ({ ...prev, isVisible: false }));
  };
  const featuredCars = [
    {
      id: 1,
      name: "BMW X5",
      type: "SUV",
      year: "2006",
      price: 300,
      seats: 4,
      fuel: "Petrol",
      transmission: "Semi-Automatic",
      location: "Bhubaneswar",
      image: "",
    },
    {
      id: 2,
      name: "Toyota Corolla",
      type: "Sedan",
      year: "2021",
      price: 150,
      seats: 4,
      fuel: "Diesel",
      transmission: "Automatic",
      location: "Baripada",
      image: "",
    },
    {
      id: 3,
      name: "Jeep Wrangler",
      type: "SUV",
      year: "2019",
      price: 250,
      seats: 4,
      fuel: "Diesel",
      transmission: "Manual",
      location: "Balasore",
      image: "",
    },
    {
      id: 4,
      name: "Ford Neo 6",
      type: "Sedan",
      year: "2020",
      price: 180,
      seats: 2,
      fuel: "Diesel",
      transmission: "Automatic",
      location: "Bhadrak",
      image: "",
    },
    {
      id: 5,
      name: "Audi A6",
      type: "Sedan",
      year: "2022",
      price: 350,
      seats: 4,
      fuel: "Petrol",
      transmission: "Automatic",
      location: "Cuttack",
      image: "",
    },
    {
      id: 6,
      name: "Honda Civic",
      type: "Sedan",
      year: "2021",
      price: 280,
      seats: 4,
      fuel: "Petrol",
      transmission: "Automatic",
      location: "Jharsuguda",
      image: "",
    },
  ];

  const testimonials = [
    {
      id: 1,
      name: "Demo",
      location: "Demo",
      quote:
        "Amazing service! The car was in perfect condition and the pickup process was seamless.",
      avatar:
        "",
    },
    {
      id: 2,
      name: "Demo sahu",
      location: "Demo",
      quote:
        "Great experience with CarRental. Will definitely use their service again!",
      avatar:
        "",
    },
    {
      id: 3,
      name: "Demo",
      location: "Demo",
      quote:
        "Professional service and excellent customer support. Highly recommended!",
      avatar:
        "",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="">
        {/* Hero Section */}
        <section className="relative flex justify-center py-32 overflow-hidden min-h-screen">
          {/* Background Image */}
          <div
            className={`absolute inset-0 transition-all duration-1000 ease-out ${
              animateHero ? "opacity-100 scale-100" : "opacity-0 scale-110"
            }`}
          >
            {/* Dark Overlay */}
            {/* <div className="absolute inset-0 bg-black bg-opacity-50"></div> */}
          </div>

          {/* Content */}
          <div className="absolute bottom-0 flex justify-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full h-50">
            <div
              className={`text-center mb-10 transition-all duration-1000 ease-out ${
                animateHero
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
            >
              <h1 className="text-5xl font-bold text-black mb-6">
               Book Your Ride in Seconds!
              </h1>

              {/* Search Form */}
              <div
                className={`max-w-4xl mx-auto bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/20 transition-all duration-1000 ease-out delay-300 ${
                  animateHero
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                }`}
              >
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {/* Pickup Location */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-900">
                      Pickup Location
                      <svg
                        className="inline w-4 h-4 ml-1"
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
                    </label>
                    <select
                      value={filters.location}
                      onChange={(e) => updateFilter("location", e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-500"
                    >
                      <option value="">Please select location</option>
                      <option value="Bhubaneswar">Bhubaneswar</option>
                      <option value="Cuttack">Cuttack</option>
                      <option value="Bhadrak">Bhadrak</option>
                      <option value="Balasore">Balasore</option>
                      <option value="Baripada">Baripada</option>
                      <option value="Jharsuguda">Jharsuguda</option>
                    </select>
                  </div>

                  {/* Pick-up Date */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-900">
                      Pick-up Date
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        value={filters.pickupDate}
                        onChange={(e) =>
                          updateFilter("pickupDate", e.target.value)
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-500"
                      />
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none"></div>
                    </div>
                  </div>

                  {/* Return Date */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-900">
                      Return Date
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        value={filters.returnDate}
                        onChange={(e) =>
                          updateFilter("returnDate", e.target.value)
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-500"
                      />
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none"></div>
                    </div>
                  </div>

                  {/* Search Button */}
                  <div className="flex items-end">
                    <button
                      onClick={() => {
                        if (
                          filters.location ||
                          filters.pickupDate ||
                          filters.returnDate
                        ) {
                          navigate("/cars");
                        }
                      }}
                      className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center font-semibold"
                    >
                      <svg
                        className="w-5 h-5 mr-2"
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
                      Search
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Vehicles Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div
              className={`text-center mb-12 transition-all duration-1000 ease-out ${
                animateCars
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Featured Vehicles
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Explore our selection of premium vehicles available for your
                next adventure.
              </p>
            </div>

            <div className="grid grid-cols-4 gap-4">
              {featuredCars.map((car, index) => (
                <div
                  key={car.id}
                  className={`bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-500 ease-out hover:scale-105 ${
                    animateCars
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-8"
                  }`}
                  style={{ transitionDelay: `${index * 200}ms` }}
                >
                  <div className="relative">
                    <img
                      src={car.image}
                      alt={car.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                        Available Now
                      </span>
                    </div>
                    <div className="absolute bottom-4 right-4">
                      <span className="bg-black text-white px-3 py-1 rounded-full text-sm font-medium">
                        {car.price} / day
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                      {car.name}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {car.type} - {car.year}
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

            <div className="text-center mt-12">
              <button 
              className="border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-lg hover:bg-blue-600 hover:text-white transition-colors"
              onClick={() => navigate("/Cars")}>
                Explore all cars →
              </button>
            </div>
          </div>
        </section>

        
        

        {/* Testimonials Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div
              className={`text-center mb-12 transition-all duration-1000 ease-out ${
                animateFeatures
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                What Our Customers Say
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Discover why discerning travelers choose CarRental for their
                luxury accommodations around the world.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <div
                  key={testimonial.id}
                  className={`bg-white rounded-xl shadow-lg p-8 transition-all duration-1000 ease-out delay-${
                    index * 200
                  } ${
                    animateFeatures
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-8"
                  }`}
                >
                  <div className="flex items-center mb-4">
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full mr-4"
                    />
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        {testimonial.name}
                      </h4>
                      <p className="text-gray-600 text-sm">
                        {testimonial.location}
                      </p>
                    </div>
                  </div>
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className="w-5 h-5 text-blue-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-gray-700 italic">"{testimonial.quote}"</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Never Miss a Deal!
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Subscribe to get the latest offers, new arrivals, and exclusive
              discounts
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email id"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <button className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div
              className={`text-center mb-12 transition-all duration-1000 ease-out ${
                animateFAQ
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-lg text-gray-600">
                Find answers to common questions about our car rental service
              </p>
            </div>

            <div className="space-y-6">
              {/* FAQ Item 1 */}
              <div
                className={`bg-white rounded-lg shadow-sm border border-gray-200 transition-all duration-1000 ease-out delay-300 ${
                  animateFAQ
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                }`}
              >
                <button
                  onClick={() => toggleFAQ(0)}
                  className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
                >
                  <h3 className="text-lg font-semibold text-gray-900">
                    How does the AI Trip Cost Estimator work?
                  </h3>
                  <svg
                    className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
                      openFAQ === 0 ? "rotate-180" : ""
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
                <div
                  className={`px-6 pb-4 transition-all duration-300 ease-in-out overflow-hidden ${
                    openFAQ === 0 ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <p className="text-gray-600">
                    Our AI-powered cost estimator uses Google Maps API to
                    calculate the most efficient route and provide accurate cost
                    estimates for your trip. It takes into account distance,
                    fuel consumption, and current fuel prices to give you a
                    comprehensive cost breakdown before you book.
                  </p>
                </div>
              </div>

              {/* FAQ Item 2 */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <button
                  onClick={() => toggleFAQ(1)}
                  className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
                >
                  <h3 className="text-lg font-semibold text-gray-900">
                    What subscription packages do you offer?
                  </h3>
                  <svg
                    className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
                      openFAQ === 1 ? "rotate-180" : ""
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
                <div
                  className={`px-6 pb-4 transition-all duration-300 ease-in-out overflow-hidden ${
                    openFAQ === 1 ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <p className="text-gray-600">
                    We offer flexible subscription packages including weekly and
                    monthly plans. These packages provide discounted rates for
                    regular users and include benefits like priority booking,
                    free delivery, and exclusive vehicle access. Contact our
                    support team for detailed pricing and plan options.
                  </p>
                </div>
              </div>

              {/* FAQ Item 3 */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <button
                  onClick={() => toggleFAQ(2)}
                  className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
                >
                  <h3 className="text-lg font-semibold text-gray-900">
                    How do owner rewards and ratings work?
                  </h3>
                  <svg
                    className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
                      openFAQ === 2 ? "rotate-180" : ""
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
                <div
                  className={`px-6 pb-4 transition-all duration-300 ease-in-out overflow-hidden ${
                    openFAQ === 2 ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <p className="text-gray-600">
                    Car owners earn rewards based on their vehicle's
                    performance, customer ratings, and rental frequency.
                    Highly-rated vehicles get featured prominently in our
                    listings, and owners receive bonus incentives for
                    maintaining excellent service standards. Our rating system
                    ensures quality vehicles are prioritized.
                  </p>
                </div>
              </div>

              {/* FAQ Item 4 */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <button
                  onClick={() => toggleFAQ(3)}
                  className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
                >
                  <h3 className="text-lg font-semibold text-gray-900">
                    What is the One-Tap Insurance Add-on Option?
                  </h3>
                  <svg
                    className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
                      openFAQ === 3 ? "rotate-180" : ""
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
                <div
                  className={`px-6 pb-4 transition-all duration-300 ease-in-out overflow-hidden ${
                    openFAQ === 3 ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <p className="text-gray-600">
                    Our one-tap insurance option allows you to add comprehensive
                    coverage to your rental with just one click. This includes
                    collision damage waiver, theft protection, and roadside
                    assistance. The insurance is automatically calculated and
                    added to your booking total for complete peace of mind.
                  </p>
                </div>
              </div>

              {/* FAQ Item 5 */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <button
                  onClick={() => toggleFAQ(4)}
                  className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
                >
                  <h3 className="text-lg font-semibold text-gray-900">
                    How does the Eco Filter for Electric Vehicles work?
                  </h3>
                  <svg
                    className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
                      openFAQ === 4 ? "rotate-180" : ""
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
                <div
                  className={`px-6 pb-4 transition-all duration-300 ease-in-out overflow-hidden ${
                    openFAQ === 4 ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <p className="text-gray-600">
                    Our eco filter helps you find electric and hybrid vehicles
                    easily. When you select this filter, you'll see the CO2
                    savings compared to traditional vehicles, helping you make
                    environmentally conscious choices. The system calculates
                    emissions savings based on your trip distance and vehicle
                    type.
                  </p>
                </div>
              </div>

              {/* FAQ Item 6 */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <button
                  onClick={() => toggleFAQ(5)}
                  className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
                >
                  <h3 className="text-lg font-semibold text-gray-900">
                    What is Smart Contract-based Secure Booking?
                  </h3>
                  <svg
                    className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
                      openFAQ === 5 ? "rotate-180" : ""
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
                <div
                  className={`px-6 pb-4 transition-all duration-300 ease-in-out overflow-hidden ${
                    openFAQ === 5 ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <p className="text-gray-600">
                    Our smart contract system (coming soon) will provide
                    blockchain-based secure booking with automated escrow
                    services. This ensures secure payments, transparent terms,
                    and automatic dispute resolution. The system will provide
                    enhanced security and trust for both renters and vehicle
                    owners.
                  </p>
                </div>
              </div>
            </div>

            <div className="text-center mt-12">
              <p className="text-gray-600 mb-4">
                Still have questions? We're here to help!
              </p>
              <button
                onClick={() => navigate("/contact")}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                Contact Support
              </button>
            </div>
          </div>
        </section>

        <Footer />
      </div>

      {/* Toast */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={closeToast}
      />
    </div>
  );
};

export default Home;
