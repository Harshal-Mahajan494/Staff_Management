'use client';
import { useEffect, useState } from 'react';

export default function StaffDashboard() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState('');
  const [filtered, setFiltered] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetch('http://192.168.1.28:8080/api/bookings')
      .then(res => res.json())
      .then(json => {
        setData(json);
        setFiltered(json);
      })
      .catch(err => {
        console.error('Failed to fetch bookings:', err);
      });
  }, []);

  useEffect(() => {
    const result = data.filter(item =>
      `${item.member.firstName} ${item.member.lastName}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
    setFiltered(result);
    setCurrentPage(1);
  }, [search, data]);

  const paginatedData = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  // Helper to format date string
  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleString(); // You can customize formatting here
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen text-black">
      <h1 className="text-3xl font-bold mb-6">🚗 Staff Vehicle Assignments</h1>

      {/* Search input */}
      <input
        type="text"
        placeholder="Search by member name..."
        className="mb-4 px-3 py-2 border rounded w-full max-w-xs"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300 text-sm text-black">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="py-3 px-4 border">Member ID</th>
              <th className="py-3 px-4 border">Member Name</th>
              <th className="py-3 px-4 border">Pickup Location</th>
              <th className="py-3 px-4 border">Pickup Date/Time</th>
              <th className="py-3 px-4 border">Vehicle Name</th>
              <th className="py-3 px-4 border">Reg. No</th>
              <th className="py-3 px-4 border">Status</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.length > 0 ? (
              paginatedData.map((item, index) => (
                <tr key={index} className="hover:bg-gray-100">
                  <td className="py-2 px-4 border">{item.member.memberId}</td>
                  <td className="py-2 px-4 border">{`${item.member.firstName} ${item.member.lastName}`}</td>
                  <td className="py-2 px-4 border">{item.pickupLocation || '-'}</td>
                  <td className="py-2 px-4 border">{formatDate(item.pickupDate)}</td>
                  <td className="py-2 px-4 border">{item.vehicleId || '-'}</td>
                  <td className="py-2 px-4 border">-</td>
                  <td className="py-2 px-4 border">
                    <span
                      className={`px-2 py-1 rounded text-white text-xs font-medium ${
                        item.vehicleId ? 'bg-green-500' : 'bg-blue-500'
                      }`}
                    >
                      {item.vehicleId ? 'Assigned' : 'Pending'}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="py-4 px-4 text-center border" colSpan="7">
                  No data found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-6 flex justify-between items-center max-w-xs">
        <button
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          disabled={currentPage === 1}
        >
          Prev
        </button>
        <span className="text-sm">
          Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
        </span>
        <button
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}
