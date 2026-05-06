import React, { useState } from 'react';

const ExamSchedule = () => {
  const [examType, setExamType] = useState('mid');

  const subjects = [
    { name: 'Math', dateMid: '2026-01-10', dateFinal: '2026-05-10' },
    { name: 'Religion', dateMid: '2026-01-11', dateFinal: '2026-05-11' },
    { name: 'English', dateMid: '2026-01-12', dateFinal: '2026-05-12' },
    { name: 'Arabic', dateMid: '2026-01-13', dateFinal: '2026-05-13' },
    { name: 'Science', dateMid: '2026-01-14', dateFinal: '2026-05-14' },
    { name: 'History', dateMid: '2026-01-15', dateFinal: '2026-05-15' },
  ];

  const currentSchedule = subjects.map(sub => ({
    date: examType === 'mid' ? sub.dateMid : sub.dateFinal,
    subject: sub.name,
    start: '09:00 AM',
    end: examType === 'mid' ? '10:00 AM' : '11:00 AM'
  }));

  return (
    <div className="space-y-4 animate-fadeIn">
      <div className="px-1 flex justify-end items-center">
        <div className="flex gap-1 bg-blue-50 p-1 rounded-lg border border-blue-100 shadow-sm">
          <button
            onClick={() => setExamType('mid')}
            className={`px-4 py-1.5 rounded-md text-[11px] font-bold transition-all duration-200 ${
              examType === 'mid'
                ? 'bg-[#1e3a8a] text-white shadow-md'
                : 'text-[#1e3a8a] hover:bg-blue-100'
            }`}
          >
            Mid
          </button>
          <button
            onClick={() => setExamType('final')}
            className={`px-4 py-1.5 rounded-md text-[11px] font-bold transition-all duration-200 ${
              examType === 'final'
                ? 'bg-[#1e3a8a] text-white shadow-md'
                : 'text-[#1e3a8a] hover:bg-blue-100'
            }`}
          >
            Final
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-blue-50 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-[#1e3a8a] text-white text-[10px] uppercase tracking-widest">
            <tr>
              <th className="px-4 py-4 border-r border-blue-800/30 text-center">Date</th>
              <th className="px-4 py-4 border-r border-blue-800/30">Subject</th>
              <th className="px-4 py-4 border-r border-blue-800/30 text-center">Start</th>
              <th className="px-4 py-4 text-center">End</th>
            </tr>
          </thead>
          <tbody className="text-[12px]">
            {currentSchedule.map((exam, idx) => (
              <tr key={idx} className="border-b border-blue-50 hover:bg-blue-50/30 transition">
                <td className="px-4 py-4 font-bold text-[#1e3a8a] bg-[#f0f7ff]/50 border-r border-blue-50 text-center">
                  {exam.date}
                </td>
                <td className="px-4 py-4 font-semibold text-gray-700 border-r border-blue-50">
                  {exam.subject}
                </td>
                <td className="px-4 py-4 font-bold text-blue-600 border-r border-blue-50 text-center uppercase">
                  {exam.start}
                </td>
                <td className="px-4 py-4 font-bold text-red-600 bg-red-50/30 text-center uppercase">
                  {exam.end}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ExamSchedule;