import React from 'react';

const Homework = () => {
  return (
   
    <div >
      
     
     

      
      <div className="bg-white rounded-xl overflow-hidden mb-8 w-full border-none">
        <div className="bg-white px-5 py-3 border-l-4 border-blue-600 text-sm font-bold text-blue-900">
          Pending Homework
        </div>
        <table className="w-full text-left">
          <thead className="bg-[#2d3748] text-gray-200 text-[11px] uppercase font-bold tracking-widest">
            <tr>
              <th className="p-4">Subject</th>
              <th className="p-4">Page Number</th>
              <th className="p-4 text-blue-300 font-bold">Total Marks</th>
              <th className="p-4">Due Date</th>
            </tr>
          </thead>
          <tbody className="text-sm bg-white">
            <tr className="border-t border-gray-50">
              <td className="p-4 font-bold text-blue-900">Math</td>
              <td className="p-4 text-gray-500">45</td>
              <td className="p-4 text-blue-600 font-bold">10</td>
              <td className="p-4 text-red-400">2026-05-10</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* جدول الـ Results & Grades */}
      <div className="bg-white rounded-xl overflow-hidden w-full border-none">
        <div className="bg-white px-5 py-3 border-l-4 border-green-600 text-sm font-bold text-green-900">
          Homework Results & Grades
        </div>
        <table className="w-full text-left text-sm bg-white">
          <thead className="bg-[#2d3748] text-gray-200 text-[11px] uppercase font-bold tracking-widest">
            <tr>
              <th className="p-4">Subject</th>
              <th className="p-4 text-center">Status</th>
              <th className="p-4 text-center">Score</th>
              <th className="p-4 text-center text-blue-300 font-bold">Total Marks</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t border-gray-50">
              <td className="p-4 font-bold text-blue-900">English</td>
              <td className="p-4 text-center">
                 <span className="text-[10px] font-bold text-blue-500 border border-blue-100 px-2 py-0.5 rounded">SUBMITTED</span>
              </td>
              <td className="p-4 text-center">
                <span className="bg-green-500 text-white w-7 h-7 inline-flex items-center justify-center rounded-full text-xs font-bold">18</span>
              </td>
              <td className="p-4 text-center text-gray-400">20</td>
            </tr>
            <tr className="border-t border-gray-50">
              <td className="p-4 font-bold text-blue-900">Science</td>
              <td className="p-4 text-center text-red-400 font-bold text-[10px]">MISSING</td>
              <td className="p-4 text-center">
                <span className="bg-green-500 text-white w-7 h-7 inline-flex items-center justify-center rounded-full text-xs font-bold">--</span>
              </td>
              <td className="p-4 text-center text-gray-400">15</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Homework;