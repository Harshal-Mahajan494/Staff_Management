'use client';
import { useState, useEffect } from 'react';

export default function ReturnDashboard() {
  const [bookingData, setBookingData] = useState([]);
  const [returnedCars, setReturnedCars] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [selectedFuelStatus, setSelectedFuelStatus] = useState('');

  // Fetch booking confirmations
  useEffect(() => {
    async function fetchBookings() {
      try {
        const res = await fetch('http://192.168.1.28:8080/api/booking-confirmations');
        const data = await res.json();
        setBookingData(data);
      } catch (error) {
        console.error('Error fetching booking confirmations:', error);
      }
    }

    fetchBookings();
  }, []);

  const openModal = (booking) => {
    setSelectedBooking(booking);
    setSelectedFuelStatus('');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedBooking(null);
  };

  const handleReturn = async () => {
    if (!selectedBooking) return;

    const { car } = selectedBooking;

    if (!selectedFuelStatus) {
      alert('Please select fuel status.');
      return;
    }

    const returnPayload = {
      bookingId: selectedBooking.bookingId,
      carId: car?.carId || null,
      fuelStatus: selectedFuelStatus,
    };

    try {
      const res = await fetch('http://192.168.1.28:8080/api/return-car', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(returnPayload),
      });

      if (res.ok) {
        setReturnedCars((prev) => ({
          ...prev,
          [selectedBooking.bookingId]: { ...car, fuelStatus: selectedFuelStatus },
        }));
        alert(`✅ Returned ${car?.carName} for booking ID ${selectedBooking.bookingId}`);
        closeModal();
      } else {
        const errorText = await res.text();
        console.error('Error response:', errorText);
        alert('Failed to save return info. Please try again.');
      }
    } catch (error) {
      console.error('Error posting return data:', error);
      alert('Error saving return info');
    }
  };

  return (
    <div className="min-h-screen bg-white p-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Vehicle Return Schedule</h1>

        <div className="overflow-x-auto bg-white shadow-lg rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Booking ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">User Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Return Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Return DateTime</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Car Model</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Registration No</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {bookingData.map((booking) => {
                const returned = returnedCars[booking.bookingId];
                const userName = booking.booking?.member?.firstName || 'Unknown';
                const returnLocation = booking.booking?.dropLocation || 'Unknown';
                const returnDateTime = booking.booking?.returnDate
                  ? new Date(booking.booking.returnDate).toLocaleString()
                  : 'Unknown';
                const carModel = booking.car?.carName || 'N/A';
                const regNo = booking.car?.registrationNUmber || booking.car?.registrationNumber || 'N/A';

                return (
                  <tr key={booking.bookingId} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-600">{booking.bookingId}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{userName}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{returnLocation}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{returnDateTime}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{carModel}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{regNo}</td>
                    <td className="px-6 py-4 text-sm">
                      {returned ? (
                        <a
                          href={`http://192.168.1.28:8080/api/invoice/${booking.bookingId}`}
                          download
                          className="text-green-600 hover:text-green-800 font-medium"
                        >
                          Invoice Download
                        </a>
                      ) : (
                        <button
                          onClick={() => openModal(booking)}
                          className="text-green-600 hover:text-green-800 font-medium"
                        >
                          Return
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Modal */}
        {isModalOpen && selectedBooking && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-800">Return Vehicle</h2>
                <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                  ✕
                </button>
              </div>

              {returnedCars[selectedBooking.bookingId] ? (
                <div className="space-y-3 text-sm text-gray-700">
                  <p>
                    <strong>Returned Car:</strong> {returnedCars[selectedBooking.bookingId].carName}
                  </p>
                  <p>
                    <strong>Reg No:</strong>{' '}
                    {returnedCars[selectedBooking.bookingId].registrationNUmber ||
                      returnedCars[selectedBooking.bookingId].registrationNumber}
                  </p>
                  <p>
                    <strong>Fuel Status:</strong> {returnedCars[selectedBooking.bookingId].fuelStatus}
                  </p>
                  {returnedCars[selectedBooking.bookingId].imgPath && (
                    <img
                      src={returnedCars[selectedBooking.bookingId].imgPath}
                      alt={returnedCars[selectedBooking.bookingId].carName}
                      className="w-full rounded mt-3"
                    />
                  )}
                  <div className="pt-4 text-right">
                    <button
                      onClick={closeModal}
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Close
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4 text-sm text-gray-700">
                  <div>
                    <p>
                      <strong>Car:</strong> {selectedBooking.car?.carName || 'N/A'}
                    </p>
                    <p>
                      <strong>Reg No:</strong>{' '}
                      {selectedBooking.car?.registrationNUmber || selectedBooking.car?.registrationNumber || 'N/A'}
                    </p>
                  </div>

                  <div>
                    <label className="block font-medium mb-1">Fuel Status:</label>
                    <select
                      value={selectedFuelStatus}
                      onChange={(e) => setSelectedFuelStatus(e.target.value)}
                      className="w-full border border-gray-300 rounded px-3 py-2"
                    >
                      <option value="">-- Select --</option>
                      <option value="Full">Full</option>
                      <option value="Half">Half</option>
                      <option value="Empty">Empty</option>
                    </select>
                  </div>

                  <div className="flex justify-end gap-3 pt-2">
                    <button
                      onClick={closeModal}
                      className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleReturn}
                      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                      Confirm Return
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
