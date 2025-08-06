import React, { useState, useRef, useEffect } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const BookingDetailModal = ({
  isOpen,
  onClose,
  booking,
  onUpdateBooking,
}) => {
  const [showModifyForm, setShowModifyForm] = useState(false);
  const [showExtendForm, setShowExtendForm] = useState(false);
  const [newReturnDate, setNewReturnDate] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const modalRef = useRef(null);

  if (!isOpen || !booking) return null;

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

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
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

  const handleExtendRental = async () => {
    if (!newReturnDate || !onUpdateBooking) return;

    setIsLoading(true);

    // Calculate new duration and amount
    const [day, month, year] = newReturnDate.split("-");
    const newReturnDateFormatted = `${day}-${month}-${year}`;

    const pickup = new Date(booking.pickupDate.split("-").reverse().join("-"));
    const newReturn = new Date(
      newReturnDateFormatted.split("-").reverse().join("-")
    );

    if (newReturn > pickup) {
      const timeDiff = newReturn.getTime() - pickup.getTime();
      const newDaysDifference = Math.ceil(timeDiff / (1000 * 3600 * 24));
      const dailyRate = booking.totalAmount / booking.daysDifference;
      const newTotalAmount = newDaysDifference * dailyRate;

      const updatedBooking = {
        returnDate: newReturnDateFormatted,
        daysDifference: newDaysDifference,
        totalAmount: newTotalAmount,
      };

      onUpdateBooking(booking.id, updatedBooking);
      setShowExtendForm(false);
      setNewReturnDate("");
    }

    setIsLoading(false);
  };

  const downloadPDF = async () => {
    if (!modalRef.current) return;

    try {
      setIsLoading(true);

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

      // Clone the modal content
      const modalContent = modalRef.current.cloneNode(true);

      // Remove the footer buttons and extend form for PDF
      const footer = modalContent.querySelector(".px-6.py-4.border-t");
      if (footer) {
        footer.remove();
      }

      const extendForm = modalContent.querySelector(
        ".bg-yellow-50.rounded-lg.p-4.mb-6.border.border-yellow-200"
      );
      if (extendForm) {
        extendForm.remove();
      }

      // Add PDF-specific styling
      modalContent.style.backgroundColor = "white";
      modalContent.style.color = "#333";
      modalContent.style.fontSize = "12px";
      modalContent.style.lineHeight = "1.4";

      // Add Vroomly header
      const header = document.createElement("div");
      header.innerHTML = `
        <div style="text-align: center; margin-bottom: 30px; border-bottom: 2px solid #3B82F6; padding-bottom: 20px;">
          <h1 style="color: #3B82F6; font-size: 28px; margin: 0; font-weight: bold;">VROOMLY</h1>
          <p style="color: #666; font-size: 14px; margin: 5px 0;">Car Rental Booking Details</p>
          <p style="color: #999; font-size: 12px; margin: 0;">Generated on ${new Date().toLocaleDateString()}</p>
        </div>
      `;

      pdfContainer.appendChild(header);
      pdfContainer.appendChild(modalContent);
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
      const imgWidth = pdfWidth - 20; // 10mm margin on each side
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 10; // 10mm top margin

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
      setIsLoading(false);
    }
  };

  const shareBooking = async () => {
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
        // Fallback for browsers that don't support Web Share API
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        ref={modalRef}
        className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              Booking Details
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg
                className="w-6 h-6"
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
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-4">
          {/* Booking ID and Status */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Booking ID</h3>
              <p className="text-sm text-gray-600">{booking.id}</p>
            </div>
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                booking.status
              )}`}
            >
              {getStatusText(booking.status)}
            </span>
          </div>

          {/* Car Information */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-3">
              Car Details
            </h3>
            <div className="flex items-start space-x-4">
              <img
                src={booking.carImage}
                alt={booking.carName}
                className="w-20 h-16 object-cover rounded-lg"
              />
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900">
                  {booking.carName}
                </h4>
                <p className="text-sm text-gray-600">
                  {booking.carType} • {booking.carYear}
                </p>
                <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Type:</span>{" "}
                    <span className="text-gray-600">{booking.carType}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Year:</span>{" "}
                    <span className="text-gray-600">{booking.carYear}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Rental Period */}
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-3">
              Rental Period
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-gray-700 mb-1">Pickup Date</h4>
                <p className="text-gray-900">
                  {formatDate(booking.pickupDate)}
                </p>
              </div>
              <div>
                <h4 className="font-medium text-gray-700 mb-1">Return Date</h4>
                <p className="text-gray-900">
                  {formatDate(booking.returnDate)}
                </p>
              </div>
              <div>
                <h4 className="font-medium text-gray-700 mb-1">Duration</h4>
                <p className="text-gray-900">{booking.daysDifference} days</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-700 mb-1">Daily Rate</h4>
                <p className="text-gray-900">
                  ${(booking.totalAmount / booking.daysDifference).toFixed(2)}
                  /day
                </p>
              </div>
            </div>
          </div>

          {/* Pricing Breakdown */}
          <div className="bg-green-50 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-3">
              Pricing Breakdown
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Daily Rate:</span>
                <span className="font-medium">
                  ${(booking.totalAmount / booking.daysDifference).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Number of Days:</span>
                <span className="font-medium">{booking.daysDifference}</span>
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
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-3">
              Booking Information
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Booking Date:</span>
                <span className="font-medium">
                  {formatBookingDate(booking.bookingDate)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Booking Status:</span>
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

          {/* Extend Rental Form */}
          {showExtendForm && booking.status === "confirmed" && (
            <div className="bg-yellow-50 rounded-lg p-4 mb-6 border border-yellow-200">
              <h3 className="text-lg font-medium text-gray-900 mb-3">
                Extend Rental
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    New Return Date
                  </label>
                  <input
                    type="date"
                    value={newReturnDate}
                    onChange={(e) => setNewReturnDate(e.target.value)}
                    min={booking.returnDate.split("-").reverse().join("-")}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={handleExtendRental}
                    disabled={isLoading || !newReturnDate}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? "Processing..." : "Extend Rental"}
                  </button>
                  <button
                    onClick={() => {
                      setShowExtendForm(false);
                      setNewReturnDate("");
                    }}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Important Information */}
          <div className="bg-yellow-50 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-3">
              Important Information
            </h3>
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
            <h3 className="text-lg font-medium text-gray-900 mb-3">
              Need Help?
            </h3>
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
                <span className="font-medium">(555) 123-4567</span>
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
                <span className="font-medium">support@vroomly.com</span>
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
                <span className="font-medium">24/7 Customer Support</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200">
          <div className="flex flex-wrap gap-2 justify-between">
            <div className="flex space-x-2">
              {booking.status === "confirmed" && (
                <button
                  onClick={() => setShowExtendForm(!showExtendForm)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                >
                  Extend Rental
                </button>
              )}
              <button
                onClick={downloadPDF}
                disabled={isLoading}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Generating PDF..." : "Download PDF"}
              </button>
              <button
                onClick={shareBooking}
                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm"
              >
                Share Booking
              </button>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  // Print booking details
                  window.print();
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Print Details
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetailModal;