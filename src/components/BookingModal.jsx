import React, { useState } from "react";

const BookingModal = ({
  isOpen,
  onClose,
  onConfirm,
  car,
  pickupDate,
  returnDate,
  totalAmount,
  daysDifference,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleConfirmBooking = async () => {
    setIsLoading(true);

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const bookingData = {
      id: `booking_${Date.now()}`,
      carId: car.id,
      carName: car.name,
      carType: car.type,
      carYear: car.year,
      carImage: car.image,
      pickupDate,
      returnDate,
      totalAmount,
      daysDifference,
      bookingDate: new Date().toISOString(),
      status: "confirmed",
    };

    onConfirm(bookingData);
    setIsLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              Confirm Your Booking
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-4">
          {/* Car Details */}
          <div className="flex items-center mb-4">
            <img
              src={car.image}
              alt={car.name}
              className="w-16 h-16 object-cover rounded-lg mr-4"
            />
            <div>
              <h3 className="font-semibold text-gray-900">{car.name}</h3>
              <p className="text-sm text-gray-600">{car.type} • {car.year}</p>
            </div>
          </div>

          {/* Booking Details */}
          <div className="space-y-3 mb-6">
            <div className="flex justify-between">
              <span className="text-gray-600">Pickup Date:</span>
              <span className="font-medium">{pickupDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Return Date:</span>
              <span className="font-medium">{returnDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Duration:</span>
              <span className="font-medium">{daysDifference} days</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Daily Rate:</span>
              <span className="font-medium">${car.price}/day</span>
            </div>
            <div className="border-t pt-3">
              <div className="flex justify-between">
                <span className="text-lg font-semibold">Total Amount:</span>
                <span className="text-lg font-bold text-blue-600">${totalAmount}</span>
              </div>
            </div>
          </div>

          {/* Terms and Conditions */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h4 className="font-medium text-gray-900 mb-2">Important Information:</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Valid driver's license required for pickup</li>
              <li>• Credit card authorization required</li>
              <li>• Free cancellation up to 24 hours before pickup</li>
              <li>• Fuel must be returned at same level</li>
              <li>• Insurance coverage included</li>
            </ul>
          </div>

          {/* Contact Information */}
          <div className="text-sm text-gray-600 mb-6">
            <p>Need help? Contact us at:</p>
            <p className="font-medium">📞 (555) 123-4567</p>
            <p className="font-medium">📧 support@vroomly.com</p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200">
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmBooking}
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </div>
              ) : (
                "Confirm Booking"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;