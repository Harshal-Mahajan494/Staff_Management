'use client'

import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function StaffSidebarLayout({ children }) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        // Clear any client-side auth state
        document.cookie = 'authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        router.push('/login');
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-60 bg-gray-900 text-white flex flex-col justify-between p-4">
        <div>
          <h1 className="text-xl font-bold mb-6">Staff Panel</h1>
          <nav className="flex flex-col space-y-3">
            <Link href="/staff/dashboard" className="hover:text-gray-300">Dashboard</Link>
            <Link href="/staff/view-bookings" className="hover:text-gray-300">View Bookings</Link>
            <Link href="/staff/assigned-cars" className="hover:text-gray-300">Assigned Cars</Link>
            <Link href="/staff/Return" className="hover:text-gray-300">Return</Link>
          </nav>
        </div>
        <div className="text-center">
          <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center text-sm mx-auto mb-2">
            S
          </div>
          <button
            onClick={handleLogout}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded text-sm transition-colors"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 bg-gray-100 p-6 overflow-y-auto">
        {children}
      </div>
    </div>
  );
}
