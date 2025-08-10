import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import BookingModal from "../components/BookingModal";

const CarDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  // Get current date and set default dates
  const getCurrentDate = () => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    // 1st day of current month
    const pickupDay = 1;
    const pickupMonth = currentMonth + 1; // +1 because getMonth() returns 0-11
    const pickupYear = currentYear;

    // 1st day of next month
    const returnDay = 1;
    const returnMonth = currentMonth + 2; // Next month
    const returnYear = currentYear;

    // Handle December to January transition
    const adjustedReturnMonth =
      returnMonth > 12 ? returnMonth - 12 : returnMonth;
    const adjustedReturnYear = returnMonth > 12 ? returnYear + 1 : returnYear;

    return {
      pickup: `${pickupDay.toString().padStart(2, "0")}-${pickupMonth
        .toString()
        .padStart(2, "0")}-${pickupYear}`,
      return: `${returnDay.toString().padStart(2, "0")}-${adjustedReturnMonth
        .toString()
        .padStart(2, "0")}-${adjustedReturnYear}`,
    };
  };

  const defaultDates = getCurrentDate();
  const [pickupDate, setPickupDate] = useState(defaultDates.pickup);
  const [returnDate, setReturnDate] = useState(defaultDates.return);
  const [totalAmount, setTotalAmount] = useState(0);
  const [daysDifference, setDaysDifference] = useState(0);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [toast, setToast] = useState(null);

  // Mock car data - in a real app, this would come from an API based on the id
  const carsData = {
    1: {
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
        "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&h=600&fit=crop",
      description:
        "The BMW X5 is a mid-size luxury SUV that debuted in 1999 as BMW's first SUV. It offers a perfect blend of luxury, performance, and versatility for both city driving and off-road adventures.",
      features: [
        "360 Camera",
        "GPS",
        "Rear View Mirror",
        "Bluetooth",
        "Heated Seats",
      ],
    },
    2: {
      id: 2,
      name: "Toyota Corolla",
      type: "Sedan",
      year: "2022",
      price: 150,
      seats: 5,
      fuel: "Petrol",
      transmission: "Automatic",
      location: "Los Angeles",
      image: "/toyota_corolla.png",
      description:
        "The Toyota Corolla is a reliable and fuel-efficient sedan perfect for daily commuting and city driving. Known for its durability and low maintenance costs.",
      features: [
        "Bluetooth",
        "Backup Camera",
        "Lane Departure Warning",
        "Apple CarPlay",
        "Android Auto",
      ],
    },
    3: {
      id: 3,
      name: "Ford Neo 6",
      type: "Hatchback",
      year: "2023",
      price: 180,
      seats: 5,
      fuel: "Electric",
      transmission: "Automatic",
      location: "Chicago",
      image: "/ford_neo.png",
      description:
        "The Ford Neo 6 is a modern electric hatchback offering excellent range and performance. Perfect for eco-conscious drivers who want style and sustainability.",
      features: [
        "Electric Range 300+ miles",
        "Fast Charging",
        "Regenerative Braking",
        "Smart Connectivity",
        "Advanced Safety Features",
      ],
    },
    4: {
      id: 4,
      name: "Honda Civic",
      type: "Sedan",
      year: "2021",
      price: 140,
      seats: 5,
      fuel: "Petrol",
      transmission: "Manual",
      location: "Miami",
      image: "/toyota_corolla.png", // Reusing image as requested
      description:
        "The Honda Civic is a popular compact sedan known for its reliability, fuel efficiency, and sporty handling. A great choice for both daily driving and weekend trips.",
      features: [
        "Honda Sensing",
        "Apple CarPlay",
        "Android Auto",
        "Bluetooth",
        "Backup Camera",
      ],
    },
  };

  // Get car data based on id parameter
  const carId = id ? parseInt(id) : 1;
  const car = carsData[carId] || carsData[1]; // Default to BMW if id not found

  // Calculate days difference and total amount when dates change
  useEffect(() => {
    const calculateBooking = () => {
      const pickup = new Date(pickupDate.split("-").reverse().join("-"));
      const returnDateObj = new Date(returnDate.split("-").reverse().join("-"));

      if (pickup && returnDateObj && returnDateObj > pickup) {
        const timeDiff = returnDateObj.getTime() - pickup.getTime();
        const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
        setDaysDifference(daysDiff);
        setTotalAmount(daysDiff * car.price);
      } else {
        setDaysDifference(0);
        setTotalAmount(0);
      }
    };

    calculateBooking();
  }, [pickupDate, returnDate, car.price]);

  const handleBookNow = () => {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

    if (!isLoggedIn) {
      setToast({
        message: "Please login to book a car",
        type: "error",
      });
      return;
    }

    // Check if dates are valid
    if (daysDifference <= 0) {
      setToast({
        message: "Please select valid pickup and return dates",
        type: "error",
      });
      return;
    }

    setShowBookingModal(true);
  };

  const handleConfirmBooking = (bookingData) => {
    // Get existing bookings from localStorage
    const existingBookings = JSON.parse(
      localStorage.getItem("bookings") || "[]"
    );

    // Add new booking
    const updatedBookings = [...existingBookings, bookingData];
    localStorage.setItem("bookings", JSON.stringify(updatedBookings));

    setToast({
      message: `Booking confirmed! Your booking ID is ${bookingData.id}`,
      type: "success",
    });
  };

  // Auto-hide toast after 3 seconds
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-20">

      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
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
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to all cars
        </button>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column - Car Details */}
          <div className="space-y-8">
            {/* Car Image */}
            <div className="relative">
              <img
                src={car.image}
                alt={car.name}
                className="w-full h-96 object-cover rounded-lg shadow-lg"
              />
            </div>

            {/* Car Name and Type */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {car.name}
              </h1>
              <p className="text-lg text-gray-600">
                {car.type} • {car.year}
              </p>
            </div>

            {/* Car Specifications */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-100 rounded-lg p-4 flex items-center">
                <svg
                  className="w-6 h-6 text-gray-600 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <span className="font-medium text-gray-900">
                  {car.seats} Seats
                </span>
              </div>

              <div className="bg-gray-100 rounded-lg p-4 flex items-center">
                <svg
                  className="w-6 h-6 text-gray-600 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
                <span className="font-medium text-gray-900">{car.fuel}</span>
              </div>

              <div className="bg-gray-100 rounded-lg p-4 flex items-center">
                <svg
                  className="w-6 h-6 text-gray-600 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span className="font-medium text-gray-900">
                  {car.transmission}
                </span>
              </div>

              <div className="bg-gray-100 rounded-lg p-4 flex items-center">
                <svg
                  className="w-6 h-6 text-gray-600 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span className="font-medium text-gray-900">
                  {car.location}
                </span>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Description
              </h3>
              <p className="text-gray-600 leading-relaxed">{car.description}</p>
            </div>

            {/* Features */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Features
              </h3>
              <div className="space-y-2">
                {car.features.map((feature, index) => (
                  <div key={index} className="flex items-center">
                    <svg
                      className="w-5 h-5 text-blue-600 mr-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Booking Form */}
          <div className="lg:pl-8">
            <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-8 sticky top-8">
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {car.price} per day
                </div>
              </div>

              {/* Date Inputs */}
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pickup Date
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={pickupDate.split("-").reverse().join("-")}
                      onChange={(e) => {
                        const date = e.target.value;
                        if (date) {
                          const [year, month, day] = date.split("-");
                          setPickupDate(`${day}-${month}-${year}`);
                        }
                      }}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Return Date
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={returnDate.split("-").reverse().join("-")}
                      onChange={(e) => {
                        const date = e.target.value;
                        if (date) {
                          const [year, month, day] = date.split("-");
                          setReturnDate(`${day}-${month}-${year}`);
                        }
                      }}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1 italic">
                    💡 You can extend your return date anytime. Additional
                    charges will be calculated based on the daily rate of $
                    {car.price}/day.
                  </p>
                </div>

                {/* Total Amount Display */}
                {daysDifference > 0 && (
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600">Duration:</span>
                      <span className="font-medium text-gray-900">
                        {daysDifference} days
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Total Amount:
                      </span>
                      <span className="text-xl font-bold text-blue-600">
                        {totalAmount}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Book Now Button */}
              <button
                onClick={handleBookNow}
                className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors mb-4"
              >
                Book Now
              </button>

              <p className="text-sm text-gray-500 text-center">
                No credit card required to reserve
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
      </div>

      {/* Booking Modal */}
      <BookingModal
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        onConfirm={handleConfirmBooking}
        car={car}
        pickupDate={pickupDate}
        returnDate={returnDate}
        totalAmount={totalAmount}
        daysDifference={daysDifference}
      />

      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg transition-all duration-300 ${
            toast.type === "success"
              ? "bg-green-500 text-white"
              : toast.type === "error"
              ? "bg-red-500 text-white"
              : "bg-blue-500 text-white"
          }`}
        >
          <div className="flex items-center">
            {toast.type === "success" && (
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
                  d="M5 13l4 4L19 7"
                />
              </svg>
            )}
            {toast.type === "error" && (
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            )}
            {toast.type === "info" && (
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
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            )}
            <span>{toast.message}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default CarDetail;