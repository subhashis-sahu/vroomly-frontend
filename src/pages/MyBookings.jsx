import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const MyBookings = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedBookings, setExpandedBookings] = useState(new Set());
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  // Check authentication and load bookings
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    if (!isLoggedIn) {
      // Store message and redirect to home
      sessionStorage.setItem(
        "authMessage",
        "Please login to see your bookings"
      );
      navigate("/", { replace: true });
      return;
    }

    // Load bookings from localStorage
    const storedBookings = JSON.parse(localStorage.getItem("bookings") || "[]");
    setBookings(storedBookings);
    setIsLoading(false);
  }, [navigate]);

  // Don't render anything if not logged in (will redirect)
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  if (!isLoggedIn) {
    return null;
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "confirmed":
        return "Confirmed";
      case "pending":
        return "Pending";
      case "cancelled":
        return "Cancelled";
      default:
        return "Unknown";
    }
  };

  const handleCancelBooking = (bookingId) => {
    const updatedBookings = bookings.map((booking) =>
      booking.id === bookingId
        ? { ...booking, status: "cancelled" }
        : booking
    );
    setBookings(updatedBookings);
    localStorage.setItem("bookings", JSON.stringify(updatedBookings));
  };

  const handleUpdateBooking = (
    bookingId,
    updatedData
  ) => {
    const updatedBookings = bookings.map((booking) =>
      booking.id === bookingId ? { ...booking, ...updatedData } : booking
    );
    setBookings(updatedBookings);
    localStorage.setItem("bookings", JSON.stringify(updatedBookings));
  };

  const toggleExpanded = (bookingId) => {
    const newExpanded = new Set(expandedBookings);
    if (newExpanded.has(bookingId)) {
      newExpanded.delete(bookingId);
    } else {
      newExpanded.add(bookingId);
    }
    setExpandedBookings(newExpanded);
  };

  const formatDate = (dateString) => {
    const [day, month, year] = dateString.split("-");
    return new Date(`${year}-${month}-${day}`).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatBookingDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const downloadPDF = async (booking) => {
    try {
      setIsGeneratingPDF(true);

      // Create a temporary container for the PDF content
      const pdfContainer = document.createElement("div");
      pdfContainer.style.position = "absolute";
      pdfContainer.style.left = "-9999px";
      pdfContainer.style.top = "0";
      pdfContainer.style.width = "800px";
      pdfContainer.style.backgroundColor = "white";
      pdfContainer.style.padding = "40px";
      pdfContainer.style.fontFamily = "Arial, sans-serif";
      pdfContainer.style.color = "#333";

      // Create PDF content
      const content = `
        <div style="text-align: center; margin-bottom: 30px; border-bottom: 2px solid #3B82F6; padding-bottom: 20px;">
          <h1 style="color: #3B82F6; font-size: 28px; margin: 0; font-weight: bold;">VROOMLY</h1>
          <p style="color: #666; font-size: 14px; margin: 5px 0;">Car Rental Booking Details</p>
          <p style="color: #999; font-size: 12px; margin: 0;">Generated on ${new Date().toLocaleDateString()}</p>
        </div>
        
        <div style="margin-bottom: 20px;">
          <h3 style="color: #333; font-size: 16px; margin-bottom: 10px;">Booking ID: ${
            booking.id
          }</h3>
          <p style="color: #666; font-size: 14px;">Status: ${getStatusText(
            booking.status
          )}</p>
        </div>
        
        <div style="background: #f9f9f9; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
          <h3 style="color: #333; font-size: 16px; margin-bottom: 10px;">Car Details</h3>
          <p style="color: #333; font-size: 14px; margin: 5px 0;"><strong>Name:</strong> ${
            booking.carName
          }</p>
          <p style="color: #333; font-size: 14px; margin: 5px 0;"><strong>Type:</strong> ${
            booking.carType
          }</p>
          <p style="color: #333; font-size: 14px; margin: 5px 0;"><strong>Year:</strong> ${
            booking.carYear
          }</p>
        </div>
        
        <div style="background: #eff6ff; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
          <h3 style="color: #333; font-size: 16px; margin-bottom: 10px;">Rental Period</h3>
          <p style="color: #333; font-size: 14px; margin: 5px 0;"><strong>Pickup:</strong> ${formatDate(
            booking.pickupDate
          )}</p>
          <p style="color: #333; font-size: 14px; margin: 5px 0;"><strong>Return:</strong> ${formatDate(
            booking.returnDate
          )}</p>
          <p style="color: #333; font-size: 14px; margin: 5px 0;"><strong>Duration:</strong> ${
            booking.daysDifference
          } days</p>
          <p style="color: #333; font-size: 14px; margin: 5px 0;"><strong>Daily Rate:</strong> $${(
            booking.totalAmount / booking.daysDifference
          ).toFixed(2)}/day</p>
        </div>
        
        <div style="background: #f0fdf4; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
          <h3 style="color: #333; font-size: 16px; margin-bottom: 10px;">Pricing Breakdown</h3>
          <p style="color: #333; font-size: 14px; margin: 5px 0;"><strong>Daily Rate:</strong> $${(
            booking.totalAmount / booking.daysDifference
          ).toFixed(2)}</p>
          <p style="color: #333; font-size: 14px; margin: 5px 0;"><strong>Number of Days:</strong> ${
            booking.daysDifference
          }</p>
          <p style="color: #333; font-size: 16px; margin: 10px 0; font-weight: bold;"><strong>Total Amount:</strong> $${
            booking.totalAmount
          }</p>
        </div>
        
        <div style="background: #f9f9f9; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
          <h3 style="color: #333; font-size: 16px; margin-bottom: 10px;">Booking Information</h3>
          <p style="color: #333; font-size: 14px; margin: 5px 0;"><strong>Booking Date:</strong> ${formatBookingDate(
            booking.bookingDate
          )}</p>
          <p style="color: #333; font-size: 14px; margin: 5px 0;"><strong>Status:</strong> ${getStatusText(
            booking.status
          )}</p>
        </div>
        
        <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
          <h3 style="color: #333; font-size: 16px; margin-bottom: 10px;">Important Information</h3>
          <ul style="color: #333; font-size: 14px; margin: 0; padding-left: 20px;">
            <li>Valid driver's license required for pickup</li>
            <li>Credit card authorization required</li>
            <li>Free cancellation up to 24 hours before pickup</li>
            <li>Fuel must be returned at same level</li>
            <li>Insurance coverage included</li>
          </ul>
        </div>
        
        <div style="background: #eff6ff; padding: 15px; border-radius: 8px;">
          <h3 style="color: #333; font-size: 16px; margin-bottom: 10px;">Contact Information</h3>
          <p style="color: #333; font-size: 14px; margin: 5px 0;"><strong>Phone:</strong> (555) 123-4567</p>
          <p style="color: #333; font-size: 14px; margin: 5px 0;"><strong>Email:</strong> support@vroomly.com</p>
          <p style="color: #333; font-size: 14px; margin: 5px 0;"><strong>Support:</strong> 24/7 Customer Support</p>
        </div>
      `;

      pdfContainer.innerHTML = content;
      document.body.appendChild(pdfContainer);

      // Convert to canvas
      const canvas = await html2canvas(pdfContainer, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        width: 800,
        height: pdfContainer.scrollHeight,
      });

      // Remove the temporary container
      document.body.removeChild(pdfContainer);

      // Create PDF
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pdfWidth - 20;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 10;

      // Add first page
      pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight - 20;

      // Add additional pages if needed
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight + 10;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight - 20;
      }

      // Download the PDF
      pdf.save(`booking-${booking.id}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Error generating PDF. Please try again.");
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const shareBooking = async (booking) => {
    const shareData = {
      title: "My Car Rental Booking",
      text: `I've booked a ${booking.carName} for ${
        booking.daysDifference
      } days from ${formatDate(booking.pickupDate)} to ${formatDate(
        booking.returnDate
      )}. Total: $${booking.totalAmount}`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(
          `My car rental booking: ${booking.carName} for ${booking.daysDifference} days. Total: $${booking.totalAmount}`
        );
        alert("Booking details copied to clipboard!");
      }
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-16">

      {/* Header */}
      <section className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
          <p className="text-gray-600 mt-2">Manage your car rental bookings</p>
        </div>
      </section>

      {/* Bookings List */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading your bookings...</p>
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-12">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No bookings
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              You haven't made any bookings yet.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
              >
                <div className="flex items-start space-x-4">
                  {/* Car Image */}
                  <div className="flex-shrink-0">
                    <img
                      src={booking.carImage}
                      alt={booking.carName}
                      className="w-24 h-16 object-cover rounded-lg"
                    />
                  </div>

                  {/* Booking Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {booking.carName}
                      </h3>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                          booking.status
                        )}`}
                      >
                        {getStatusText(booking.status)}
                      </span>
                    </div>

                    <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Pickup:</span>{" "}
                        {booking.pickupDate}
                      </div>
                      <div>
                        <span className="font-medium">Return:</span>{" "}
                        {booking.returnDate}
                      </div>
                      <div>
                        <span className="font-medium">Duration:</span>{" "}
                        {booking.daysDifference} days
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <div className="text-lg font-bold text-gray-900">
                        ${booking.totalAmount}
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => toggleExpanded(booking.id)}
                          className="bg-blue-100 text-blue-700 px-4 py-2 rounded-md hover:bg-blue-200 transition-colors text-sm"
                        >
                          {expandedBookings.has(booking.id)
                            ? "Hide Details"
                            : "Show Details"}
                        </button>
                        {booking.status === "confirmed" && (
                          <button
                            onClick={() => handleCancelBooking(booking.id)}
                            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors text-sm"
                          >
                            Cancel Booking
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Expanded Details */}
                    {expandedBookings.has(booking.id) && (
                      <div className="mt-6 space-y-4">
                        {/* Booking ID and Status */}
                        <div className="bg-gray-50 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <h4 className="text-lg font-medium text-gray-900">
                                Booking ID
                              </h4>
                              <p className="text-sm text-gray-600">
                                {booking.id}
                              </p>
                            </div>
                            <span
                              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                                booking.status
                              )}`}
                            >
                              {getStatusText(booking.status)}
                            </span>
                          </div>
                        </div>

                        {/* Car Information */}
                        <div className="bg-gray-50 rounded-lg p-4">
                          <h4 className="text-lg font-medium text-gray-900 mb-3">
                            Car Details
                          </h4>
                          <div className="flex items-start space-x-4">
                            <img
                              src={booking.carImage}
                              alt={booking.carName}
                              className="w-20 h-16 object-cover rounded-lg"
                            />
                            <div className="flex-1">
                              <h5 className="font-semibold text-gray-900">
                                {booking.carName}
                              </h5>
                              <p className="text-sm text-gray-600">
                                {booking.carType} • {booking.carYear}
                              </p>
                              <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                                <div>
                                  <span className="font-medium text-gray-700">
                                    Type:
                                  </span>{" "}
                                  <span className="text-gray-600">
                                    {booking.carType}
                                  </span>
                                </div>
                                <div>
                                  <span className="font-medium text-gray-700">
                                    Year:
                                  </span>{" "}
                                  <span className="text-gray-600">
                                    {booking.carYear}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Rental Period */}
                        <div className="bg-blue-50 rounded-lg p-4">
                          <h4 className="text-lg font-medium text-gray-900 mb-3">
                            Rental Period
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <h5 className="font-medium text-gray-700 mb-1">
                                Pickup Date
                              </h5>
                              <p className="text-gray-900">
                                {formatDate(booking.pickupDate)}
                              </p>
                            </div>
                            <div>
                              <h5 className="font-medium text-gray-700 mb-1">
                                Return Date
                              </h5>
                              <p className="text-gray-900">
                                {formatDate(booking.returnDate)}
                              </p>
                            </div>
                            <div>
                              <h5 className="font-medium text-gray-700 mb-1">
                                Duration
                              </h5>
                              <p className="text-gray-900">
                                {booking.daysDifference} days
                              </p>
                            </div>
                            <div>
                              <h5 className="font-medium text-gray-700 mb-1">
                                Daily Rate
                              </h5>
                              <p className="text-gray-900">
                                $
                                {(
                                  booking.totalAmount / booking.daysDifference
                                ).toFixed(2)}
                                /day
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Pricing Breakdown */}
                        <div className="bg-green-50 rounded-lg p-4">
                          <h4 className="text-lg font-medium text-gray-900 mb-3">
                            Pricing Breakdown
                          </h4>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Daily Rate:</span>
                              <span className="font-medium">
                                $
                                {(
                                  booking.totalAmount / booking.daysDifference
                                ).toFixed(2)}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">
                                Number of Days:
                              </span>
                              <span className="font-medium">
                                {booking.daysDifference}
                              </span>
                            </div>
                            <div className="border-t pt-2">
                              <div className="flex justify-between">
                                <span className="text-lg font-semibold text-gray-900">
                                  Total Amount:
                                </span>
                                <span className="text-lg font-bold text-green-600">
                                  ${booking.totalAmount}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Booking Information */}
                        <div className="bg-gray-50 rounded-lg p-4">
                          <h4 className="text-lg font-medium text-gray-900 mb-3">
                            Booking Information
                          </h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600">
                                Booking Date:
                              </span>
                              <span className="font-medium">
                                {formatBookingDate(booking.bookingDate)}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">
                                Booking Status:
                              </span>
                              <span
                                className={`font-medium ${
                                  getStatusColor(booking.status).split(" ")[1]
                                }`}
                              >
                                {getStatusText(booking.status)}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Important Information */}
                        <div className="bg-yellow-50 rounded-lg p-4">
                          <h4 className="text-lg font-medium text-gray-900 mb-3">
                            Important Information
                          </h4>
                          <ul className="space-y-2 text-sm text-gray-700">
                            <li className="flex items-start">
                              <svg
                                className="w-4 h-4 text-yellow-600 mr-2 mt-0.5 flex-shrink-0"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                                />
                              </svg>
                              Valid driver's license required for pickup
                            </li>
                            <li className="flex items-start">
                              <svg
                                className="w-4 h-4 text-yellow-600 mr-2 mt-0.5 flex-shrink-0"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                                />
                              </svg>
                              Credit card authorization required
                            </li>
                            <li className="flex items-start">
                              <svg
                                className="w-4 h-4 text-yellow-600 mr-2 mt-0.5 flex-shrink-0"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                                />
                              </svg>
                              Free cancellation up to 24 hours before pickup
                            </li>
                            <li className="flex items-start">
                              <svg
                                className="w-4 h-4 text-yellow-600 mr-2 mt-0.5 flex-shrink-0"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                                />
                              </svg>
                              Fuel must be returned at same level
                            </li>
                            <li className="flex items-start">
                              <svg
                                className="w-4 h-4 text-yellow-600 mr-2 mt-0.5 flex-shrink-0"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                                />
                              </svg>
                              Insurance coverage included
                            </li>
                          </ul>
                        </div>

                        {/* Contact Information */}
                        <div className="bg-blue-50 rounded-lg p-4">
                          <h4 className="text-lg font-medium text-gray-900 mb-3">
                            Need Help?
                          </h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center">
                              <svg
                                className="w-4 h-4 text-blue-600 mr-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                />
                              </svg>
                              <span className="font-medium">
                                (555) 123-4567
                              </span>
                            </div>
                            <div className="flex items-center">
                              <svg
                                className="w-4 h-4 text-blue-600 mr-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                />
                              </svg>
                              <span className="font-medium">
                                support@vroomly.com
                              </span>
                            </div>
                            <div className="flex items-center">
                              <svg
                                className="w-4 h-4 text-blue-600 mr-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              </svg>
                              <span className="font-medium">
                                24/7 Customer Support
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-wrap gap-2 justify-center pt-4 border-t border-gray-200">
                          <button
                            onClick={() => downloadPDF(booking)}
                            disabled={isGeneratingPDF}
                            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {isGeneratingPDF
                              ? "Generating PDF..."
                              : "Download PDF"}
                          </button>
                          <button
                            onClick={() => shareBooking(booking)}
                            className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm"
                          >
                            Share Booking
                          </button>
                          <button
                            onClick={() => window.print()}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                          >
                            Print Details
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <Footer />
      </div>
    </div>
  );
};

export default MyBookings;
