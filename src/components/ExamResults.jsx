import React, { useState } from 'react';

const ExamResults = () => {
  const [examType, setExamType] = useState('mid');

  const examResultsByType = {
    mid: [
      { subject: 'Math', studentGrade: 37, finalGrade: 40 },
      { subject: 'English', studentGrade: 34, finalGrade: 40 },
      { subject: 'Science', studentGrade: 35, finalGrade: 40 },
      { subject: 'Arabic', studentGrade: 36, finalGrade: 40 },
      { subject: 'Social Studies', studentGrade: 30, finalGrade: 40 }
    ],
    final: [
      { subject: 'Math', studentGrade: 95, finalGrade: 100 },
      { subject: 'English', studentGrade: 88, finalGrade: 100 },
      { subject: 'Science', studentGrade: 92, finalGrade: 100 },
      { subject: 'Arabic', studentGrade: 90, finalGrade: 100 },
      { subject: 'Social Studies', studentGrade: 75, finalGrade: 100 }
    ]
  };

  const examResults = examResultsByType[examType];
  const totalStudentGrades = examResults.reduce((sum, item) => sum + item.studentGrade, 0);
  const totalFinalGrades = examResults.reduce((sum, item) => sum + item.finalGrade, 0);

  return (
    <div className="space-y-4 animate-fadeIn">
      <div className="px-1 flex justify-between items-center gap-3">
        <div></div>

        <div className="flex gap-1 bg-blue-50 p-1 rounded-lg border border-blue-100 shadow-sm">
          <button
            onClick={() => setExamType('mid')}
            className={`px-3 py-1.5 rounded-md text-[11px] font-bold transition-all duration-300 ${
              examType === 'mid'
                ? 'bg-[#1e3a8a] text-white shadow-md'
                : 'text-[#1e3a8a] hover:bg-blue-100'
            }`}
          >
            Mid
          </button>
          <button
            onClick={() => setExamType('final')}
            className={`px-3 py-1.5 rounded-md text-[11px] font-bold transition-all duration-300 ${
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
          <thead className="bg-[#1e3a8a] text-white text-[10px] tracking-[0.1em] uppercase">
            <tr>
              <th className="px-5 py-3 font-bold border-r border-blue-800/30">Subject</th>
              <th className="px-5 py-3 font-bold">Student Grade</th>
              <th className="px-5 py-3 font-bold">Final Grade</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-blue-50 text-sm">
            {examResults.map((g, i) => (
              <tr key={i} className="hover:bg-[#f0f7ff]/50 transition-colors">
                <td className="px-5 py-3 font-semibold text-gray-700 border-r border-blue-50/50">{g.subject}</td>
                <td className="px-5 py-3 font-bold text-blue-600">{g.studentGrade}</td>
                <td className="px-5 py-3 font-bold text-[#1e3a8a]">{g.finalGrade}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-4 bg-[#1e3a8a] text-white rounded-xl shadow-sm flex justify-between items-center">
        <p className="text-xs tracking-widest font-black uppercase">Total</p>
        <p className="text-sm font-black">
          {totalStudentGrades} / {totalFinalGrades}
        </p>
      </div>
    </div>
  );
};

export default ExamResults;
