import React, { useState } from 'react';
import './App.css';
import Sidebar from './components/Sidebar';
import Attendance from './components/Attendance';
import Homework from './components/Homework';
import Behavior from './components/Behavior';
import ExamResults from './components/ExamResults';
import Notifications from './components/Notifications';
import ExamSchedule from './components/ExamSchedule';
import ClassSchedule from './components/ClassSchedule';

function App() {
  const [activeTab, setActiveTab] = useState('classschedule');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const pageTitle = {
    grades: 'Exam Results',
    classschedule: 'Class Schedule',
    schedule: 'Exam Schedule',
    attendance: 'Attendance',
    homework: 'Homework',
    behavior: 'Behavior',
    notifications: 'Notifications',
  }[activeTab] || '';

  const renderContent = () => {
    switch (activeTab) {
      case 'classschedule': return <ClassSchedule />;
      case 'schedule': return <ExamSchedule />;
      case 'attendance': return <Attendance />;
      case 'homework': return <Homework />;
      case 'behavior': return <Behavior />;
      case 'grades': return <ExamResults />;
      case 'notifications': return <Notifications />;
      default: return <ClassSchedule />;
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#4dabf7] overflow-hidden font-sans">
      
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 md:hidden" 
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      <div className={`fixed inset-y-0 left-0 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition-transform duration-300 ease-in-out w-64 h-full z-50`}>
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} closeSidebar={() => setSidebarOpen(false)} />
      </div>

      <main className="flex-1 flex flex-col min-w-0">
        
        <header className="bg-[#1e3a8a] text-white h-16 flex items-center shadow-lg z-20 border-b border-white/10">
          <div className="w-full px-6 flex justify-between items-center">
            
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setSidebarOpen(!sidebarOpen)} 
                className="md:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <span className="text-2xl leading-none">☰</span>
              </button>
              
              <div className="flex flex-col">
                <h2 className="text-base font-black uppercase tracking-wider leading-tight text-white">
                  EduLink
                </h2>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-300/80">
                  Student Portal
                </span>
              </div>
            </div>

            <div className="flex items-center">
               <button className="flex items-center gap-2 text-[11px] font-bold bg-white/5 border border-white/20 px-5 py-2 rounded-full hover:bg-red-600 hover:border-red-600 transition-all duration-300 uppercase tracking-widest group">
                 Logout 
                 <span className="text-xs group-hover:translate-x-1 transition-transform">→</span>
               </button>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="max-w-[1200px] mx-auto p-6 md:p-10 pt-6">
            
            <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b-2 border-white/30 pb-6">
               <div>
                  {/* تم تصغير الخط هنا من text-3xl إلى text-xl مع تقليل الحواف (Padding) */}
                  <h1 className="text-xl font-black text-[#1e3a8a] uppercase tracking-wide italic drop-shadow-sm bg-white/95 px-4 py-1 rounded-md inline-block shadow-sm">
                    {pageTitle}
                  </h1>
                  
                  <div className="mt-3 flex items-center gap-3">
                    <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full border border-white/40 shadow-inner">
                      <span className="text-[#1e3a8a] text-[10px] font-bold uppercase opacity-80">My son:</span>
                      <span className="text-[#1e3a8a] text-xs font-black tracking-wide border-b border-[#1e3a8a]/30 pb-0.5">
                        Ahmed Mohamed
                      </span>
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full ml-1"></span>
                    </div>
                  </div>
               </div>

               <div className="bg-[#1e3a8a] text-white px-5 py-2.5 rounded-xl shadow-lg border-b-4 border-blue-900 flex flex-col items-center min-w-[140px]">
                 <p className="text-[9px] font-bold uppercase tracking-[0.2em] opacity-70 mb-0.5">Academic Year</p>
                 <p className="text-sm font-black tracking-wider">2025 / 2026</p>
               </div>
            </div>

            <div className="animate-fadeIn">
              {renderContent()}
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}

export default App;