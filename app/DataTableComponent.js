'use client';

import { useEffect, useRef } from 'react';
import 'datatables.net-dt/css/jquery.dataTables.css';
import $ from 'jquery';
import 'datatables.net-dt';

export default function DataTableComponent({ data }) {
  const tableRef = useRef(null);

  useEffect(() => {
    const table = $(tableRef.current).DataTable({
      destroy: true, // important for reinitializing
    });

    return () => {
      table.destroy();
    };
  }, []);

  return (
    <div className="p-4 overflow-x-auto">
      <table ref={tableRef} className="display w-full text-sm">
        <thead>
          <tr>
            <th>Member ID</th>
            <th>Member Name</th>
            <th>Pickup Location</th>
            <th>Pickup Date/Time</th>
            <th>Return Location</th>
            <th>Return Date/Time</th>
            <th>Vehicle Type</th>
            <th>Vehicle Name</th>
            <th>Reg. No</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, idx) => (
            <tr key={idx}>
              <td>{item.memberId}</td>
              <td>{item.memberName}</td>
              <td>{item.pickupLocation}</td>
              <td>{item.pickupDateTime}</td>
              <td>{item.returnLocation}</td>
              <td>{item.returnDateTime}</td>
              <td>{item.vehicleType}</td>
              <td>{item.vehicleName}</td>
              <td>{item.registrationNumber}</td>
              <td>
                <span
                  className={`px-2 py-1 rounded text-white text-xs font-medium ${
                    item.status === 'Handover'
                      ? 'bg-green-500'
                      : 'bg-blue-500'
                  }`}
                >
                  {item.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
