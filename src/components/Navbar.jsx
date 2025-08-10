import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AuthModal from "./AuthModal";
import Toast from "./Toast";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    // Check localStorage on component mount
    const savedLoginState = localStorage.getItem("isLoggedIn");
    return savedLoginState === "true";
  });
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  // Toast state
  const [toast, setToast] = useState({
    message: "",
    type: "success",
    isVisible: false,
  });

  // Show toast function
  const showToast = (message, type = "success") => {
    setToast({
      message,
      type,
      isVisible: true,
    });
  };

  // Close toast function
  const closeToast = () => {
    setToast((prev) => ({ ...prev, isVisible: false }));
  };

  // Logout function
  const handleLogout = () => {
    console.log("Logout function called!");
    setIsLoggedIn(false);
    setShowProfileDropdown(false);
    // Clear from localStorage
    localStorage.removeItem("isLoggedIn");
    showToast("Successfully logged out!", "success");
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const target = event.target;
      const profileDropdown = document.querySelector("[data-profile-dropdown]");
      const profileButton = document.querySelector("[data-profile-button]");

      if (
        showProfileDropdown &&
        profileDropdown &&
        !profileDropdown.contains(target) &&
        profileButton &&
        !profileButton.contains(target)
      ) {
        setShowProfileDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showProfileDropdown]);

  return (
    <nav className="top-0 left-0 right-0 z-50 flex justify-center align-content-center">
      <div className="top-0 sm:top-2 md:top-4 z-40 fixed  w-full sm:w-[90%] md:w-5/6 bg-[#FFFFFF] 
      shadow border-[1px] border-zinc-200 dark:border-zinc-800 dark:bg-[#FFFFFF] px-4 py-2 
      sm:rounded-lg font-dmSans">
        <div className="flex items-center justify-between h-16">
          {/* Left Side - Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`transition-colors ${
                location.pathname === "/"
                  ? "text-blue-600"
                  : "text-gray-700 hover:text-blue-600"
              }`}
            >
              Home
            </Link>
            <Link
              to="/cars"
              className={`transition-colors ${
                location.pathname === "/cars"
                  ? "text-blue-600"
                  : "text-gray-700 hover:text-blue-600"
              }`}
            >
              Vehicles
            </Link>
          </div>

          {/* Center - Logo */}
          <div className="flex items-center ml-20 justify-center flex-1">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                <svg
                  className="w-15 h-15 text-black"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
                  <path d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z" />
                  <path d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 6c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z" />
                </svg>
              </div>
              <span className="text-4xl font-bold text-gray-900">Vroomly</span>
            </Link>
          </div>

          {/* Right Side - My Bookings, Contact, Search Bar, and Login */}
          <div className="flex items-center space-x-4">
            {/* My Bookings */}
            <button
              onClick={() => {
                if (isLoggedIn) {
                  // Navigate to bookings if logged in
                  window.location.href = "/bookings";
                } else {
                  // Show toast and store message for home page
                  sessionStorage.setItem(
                    "authMessage",
                    "Please login to see your bookings"
                  );
                  window.location.href = "/";
                }
              }}
              className={`hidden md:block transition-colors ${
                location.pathname === "/bookings"
                  ? "text-blue-600"
                  : "text-gray-700 hover:text-blue-600"
              }`}
            >
              My Bookings
            </button>

            {/* Contact */}
            <Link
              to="/contact"
              className={`hidden md:block transition-colors ${
                location.pathname === "/contact"
                  ? "text-blue-600"
                  : "text-gray-700 hover:text-blue-600"
              }`}
            >
              Contact
            </Link>

            {/* Login/Profile Button */}
            {!isLoggedIn ? (
              <button
                onClick={() => {
                  setAuthMode("login");
                  setIsAuthModalOpen(true);
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Login
              </button>
            ) : (
              <div className="relative">
                <button
                  data-profile-button
                  onClick={() => {
                    console.log(
                      "Profile button clicked! Current state:",
                      showProfileDropdown
                    );
                    setShowProfileDropdown(!showProfileDropdown);
                  }}
                  className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors"
                >
                  <img
                    src="/profile_icon.png"
                    alt="Profile"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <svg
                    className={`w-4 h-4 transition-transform ${
                      showProfileDropdown ? "rotate-180" : ""
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

                {/* Profile Dropdown */}
                {showProfileDropdown && (
                  <div
                    data-profile-dropdown
                    className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200"
                  >
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        mode={authMode}
        onAuthSuccess={() => {
          setIsLoggedIn(true);
          // Save to localStorage
          localStorage.setItem("isLoggedIn", "true");
          showToast("Successfully logged in!", "success");
        }}
      />

      {/* Toast */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={closeToast}
      />
    </nav>
  );
};

export default Navbar;