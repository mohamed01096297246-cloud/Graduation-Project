import React from 'react';

const Attendance = () => {
  const dailyAttendance = [
    { day: 'Sunday', date: '2026-04-12', status: 'Present', note: 'On time' },
    { day: 'Monday', date: '2026-04-13', status: 'Late', note: 'Arrived at 08:15' },
    { day: 'Tuesday', date: '2026-04-14', status: 'Present', note: 'On time' },
    { day: 'Wednesday', date: '2026-04-15', status: 'Absent', note: 'Medical leave' },
    { day: 'Thursday', date: '2026-04-16', status: 'Present', note: 'On time' }
  ];

  return (
    <div className="space-y-4 animate-fadeIn">
      {/* Attendance Table */}
      <div className="bg-white rounded-xl border border-blue-50 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-[#1e3a8a] text-white text-[10px] uppercase tracking-widest">
            <tr>
              <th className="px-4 py-3 border-r border-blue-800/30">Day</th>
              <th className="px-4 py-3 border-r border-blue-800/30">Date</th>
              <th className="px-4 py-3 border-r border-blue-800/30">Status</th>
              <th className="px-4 py-3">Details</th>
            </tr>
          </thead>
          <tbody className="text-[12px]">
            {dailyAttendance.map((item, idx) => (
              <tr key={idx} className="border-b border-blue-50 hover:bg-blue-50/30 transition">
                <td className="px-4 py-3 font-bold text-[#1e3a8a] bg-[#f0f7ff]/50 border-r border-blue-50">{item.day}</td>
                <td className="px-4 py-3 font-semibold text-gray-600 border-r border-blue-50">{item.date}</td>
                <td className="px-4 py-3 border-r border-blue-50">
                  <span
                    className={`px-3 py-0.5 rounded-full text-[10px] font-black uppercase ${
                      item.status === 'Present'
                        ? 'bg-green-100 text-green-700'
                        : item.status === 'Absent'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    {item.status}
                  </span>
                </td>
                <td className="px-4 py-3 font-semibold text-gray-600">{item.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Attendance;
