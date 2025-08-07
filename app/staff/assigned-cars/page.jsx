'use client';

import { useEffect, useState } from 'react';

export default function StaffDashboard() {
  const [bookings, setBookings] = useState([]);
  const [assignedCars, setAssignedCars] = useState({});
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedCar, setSelectedCar] = useState(null);
  const [carDetails, setCarDetails] = useState(null);
  const [availableCars, setAvailableCars] = useState([]);
  const [fuelStatus, setFuelStatus] = useState(""); // Fuel status state
  const [bookingId, setBookingId] = useState(""); // Booking ID state

  useEffect(() => {
    async function fetchData() {
      try {
        const bookingRes = await fetch('http://192.168.1.28:8080/api/bookings/unconfirmed');
        const bookingData = await bookingRes.json();
        const bookingsList = Array.isArray(bookingData) ? bookingData : [bookingData];
        setBookings(bookingsList);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const openModal = async (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
    setSelectedCar(null);
    setCarDetails(null);
    setFuelStatus(""); // Reset fuel status when modal opens
    setBookingId(user.bookingId); // Store booking ID

    const vehicleId = user?.vehicleId;
    if (vehicleId) {
      try {
        const carRes = await fetch(`http://192.168.1.28:8080/api/car/by-vehicle/${vehicleId}`);
        const carData = await carRes.json();
        const validCars = carData?.filter(car => car !== null) || [];
        setAvailableCars(validCars);
      } catch (error) {
        console.error('Error fetching available cars:', error);
      }
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
    setCarDetails(null);
    setAvailableCars([]);
  };

  const handleCarSelection = (carId) => {
    const selected = availableCars.find(car => car.carId === carId);
    setCarDetails(selected);
    setFuelStatus(selected?.fuelStatus || ""); // Pre-fill fuel status with the current value
  };

  const handleFuelStatusChange = (event) => {
    setFuelStatus(event.target.value);
  };

  const handleFuelConfirm = async () => {
    if (!carDetails) return;

    // Send the complete data (booking ID, car ID, fuel status) to the API
    try {
      const response = await fetch(`http://192.168.1.28:8080/api/update-booking`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookingId: bookingId,           // Include booking ID
          carId: carDetails.carId,        // Include selected car ID
          fuelStatus: fuelStatus,         // Include updated fuel status
        }),
      });

      if (response.ok) {
        alert('Booking updated successfully!');
        closeModal(); // Close the modal after successful update
      } else {
        alert('Failed to update the booking.');
      }
    } catch (error) {
      console.error('Error updating booking:', error);
      alert('An error occurred while updating the booking.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-semibold mb-8 text-black">User Transportation Schedule</h1>

        <div className="overflow-x-auto bg-white shadow-lg rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-indigo-600 text-white">
              <tr>
                <th className="px-6 py-3 text-xs font-medium uppercase text-black">Booking ID</th>
                <th className="px-6 py-3 text-xs font-medium uppercase text-black">Name</th>
                <th className="px-6 py-3 text-xs font-medium uppercase text-black">Pickup Location</th>
                <th className="px-6 py-3 text-xs font-medium uppercase text-black">Pickup DateTime</th>
                <th className="px-6 py-3 text-xs font-medium uppercase text-black">Vehicle Type</th>
                <th className="px-6 py-3 text-xs font-medium uppercase text-black">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {bookings.map((booking) => (
                <tr key={booking.bookingId} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm text-black">{booking.bookingId}</td>
                  <td className="px-6 py-4 text-sm font-medium text-black">{booking.member?.firstName}</td>
                  <td className="px-6 py-4 text-sm text-black">{booking.pickupLocation}</td>
                  <td className="px-6 py-4 text-sm text-black">{booking.pickupDate}</td>
                  <td className="px-6 py-4 text-sm text-black">{booking.vehicleId}</td>
                  <td className="px-6 py-4 text-sm">
                    {booking.vehicleId && (
                      <button
                        onClick={() => openModal(booking)}
                        className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        Select Car
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for Car Selection */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 z-50 flex items-center justify-center transition-opacity">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-4xl w-full transform transition-transform flex">
            {/* Left Section: Car Options */}
            <div className="w-1/2 pr-4">
              <h2 className="text-2xl font-semibold mb-4 text-black">
                Select Car for {selectedUser?.member?.firstName}
              </h2>

              {availableCars.length > 0 ? (
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-black">Available Cars</h3>
                  <div className="space-y-4">
                    {availableCars.map((car) => (
                      <div
                        key={car.carId}
                        onClick={() => handleCarSelection(car.carId)}
                        className={`cursor-pointer p-4 border rounded-md ${
                          carDetails?.carId === car.carId
                            ? 'border-indigo-500 bg-indigo-50'
                            : 'border-gray-300 hover:bg-gray-100'
                        } transition-all`}
                      >
                        <p className="font-semibold text-black">{car.carName}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-gray-500">No available cars found for this booking.</p>
              )}
            </div>

            {/* Right Section: Car Details */}
            {carDetails && (
              <div className="w-1/2 pl-4 border-l border-gray-300">
                <h3 className="text-xl font-semibold mb-2 text-black">Car Details</h3>
                {carDetails.imgPath && (
                  <img
                    src={carDetails.imgPath}
                    alt={carDetails.carName}
                    className="w-full h-48 object-cover rounded-md mb-4"
                  />
                )}
                <p className="text-black"><strong>Fuel Status:</strong> {carDetails.fuelStatus}</p>

                {/* Fuel Status Change */}
                <div className="mt-4">
                  <label htmlFor="fuelStatus" className="block text-sm font-medium text-black">Change Fuel Status</label>
                  <select
                    id="fuelStatus"
                    value={fuelStatus}
                    onChange={handleFuelStatusChange}
                    className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  >
                    <option value="Full">Full</option>
                    <option value="Half">Half</option>
                    <option value="Low">Low</option>
                    <option value="Empty">Empty</option>
                  </select>
                </div>

                <button
                  onClick={handleFuelConfirm}
                  className="mt-6 w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  Confirm Selection
                </button>
              </div>
            )}

            <div className="mt-4 w-full text-right">
              <button
                onClick={closeModal}
                className="text-gray-600 hover:text-gray-800 text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
