'use client'
import { useEffect, useState } from 'react'

export default function StaffDashboard() {
  const [stats, setStats] = useState({ totalBookings: 0, currentBookings: 0, totalRevenue: 0 })

  // useEffect(() => {
  //   fetch('/api/dashboard')  // ✅ Correct path
  //     .then(res => res.json())
  //     .then(data => setStats(data))
  // }, [])

  return (
    <div className="p-6 text-black">
      <h1 className="text-3xl font-bold mb-6">Welcome IndiaDrive Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* <StatCard title="Total Bookings" value={stats.totalBookings} />
        <StatCard title="Current Bookings" value={stats.currentBookings} />
        <StatCard title="Total Revenue" value={`₹${stats.totalRevenue}`} /> */}
      </div>
    </div>
  )
}

// function StatCard({ title, value }) {
//   return (
//     <div className="bg-white p-5 rounded-xl shadow">
//       <h2 className="text-xl font-semibold">{title}</h2>
//       <p className="text-2xl font-bold mt-2">{value}</p>
//     </div>
//   )
// }
