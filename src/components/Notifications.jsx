import React from 'react';

const Notifications = () => {
  const allNotifications = [
    {
      id: 1,
      title: "New school event",
      status: "NEW",
      time: "Just now >",
      message: "School Open Day scheduled for June 15th next month.",
      type: "event", 
    },
    {
      id: 2,
      title: "Reminder: Ahmed has an overdue",
      status: "NEW",
      time: "1 hour ago >",
      message: "Reminder: Ahmed has an overdue math assignment due tomorrow.",
      type: "reminder", 
    },
    {
      id: 3,
      title: "Exam schedule",
      status: "NEW",
      time: "April 22, 2026 >",
      message: "Final exam schedule for next week has been published. Please check the student portal.",
      type: "exam", 
    },
    {
      id: 4,
      title: "Attendance alert",
      status: "",
      time: "April 18, 2026 >",
      message: "Ahmed was absent from the Math class on April 18th. Please ensure he makes up the missed work.",
      type: "alert", 
    },
    {
      id: 5,
      title: "School fee payment reminder",
      status: "",
      time: "April 10, 2026 >",
      message: "Reminder: School fees for the second term are due by the end of this month.",
      type: "fee", 
    }
  ];

  
  const getBorderColor = (type) => {
    switch (type) {
      case 'alert': return 'border-red-500 bg-red-50/50';
      case 'fee': return 'border-yellow-500 bg-yellow-50/50';
      case 'event': return 'border-blue-500 bg-blue-50/50';
      default: return 'border-gray-300 bg-white';
    }
  };

  return (
    <div className="p-6 font-serif max-w-4xl mx-auto">
     
      <div className="flex justify-between items-center mb-6 border-b-2 border-blue-600 pb-2">
        <h2 className="text-lg font-bold text-gray-800 uppercase">Notifications</h2>
      </div>

      <div className="space-y-3">
        {allNotifications.map((note) => (
          <div 
            key={note.id} 
            className={`border-l-4 p-3 rounded-r-lg shadow-sm transition-all hover:shadow-md ${getBorderColor(note.type)}`}
          >
            <div className="flex justify-between items-start">
              <h3 className="text-[11px] font-black text-gray-800">
                {note.title}
              </h3>
              <span className="text-[9px] text-gray-400 font-bold">{note.time}</span>
            </div>
            <p className="text-[10px] text-gray-600 mt-1 leading-relaxed">
              {note.message}
            </p>
          </div>
        ))}
      </div>

     
      
    </div>
  );
};

export default Notifications;
