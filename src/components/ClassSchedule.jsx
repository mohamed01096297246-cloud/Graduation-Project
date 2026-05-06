import React from 'react';

const ClassSchedule = () => {
  const timeSlots = [
    { startTime: "08:00 AM", endTime: "09:00 AM" },
    { startTime: "09:00 AM", endTime: "10:00 AM" },
    { startTime: "10:00 AM", endTime: "11:00 AM" },
    { startTime: "11:00 AM", endTime: "12:00 PM" },
    { startTime: "12:00 PM", endTime: "01:00 PM" }
  ];

  const days = [
    { label: "Sunday",    value: "sun" },
    { label: "Monday",    value: "mon" },
    { label: "Tuesday",   value: "tue" },
    { label: "Wednesday", value: "wed" },
    { label: "Thursday",  value: "thu" }
  ];

  return (
    <div style={{ width: '100%', overflowX: 'auto', padding: '20px', backgroundColor: '#fcfcfc' }}>
      <table style={{ 
        width: '100%', 
        borderCollapse: 'separate', 
        borderSpacing: '0',
        minWidth: '850px', 
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)',
        border: '1px solid #e2e8f0'
      }}>
        <thead>
          <tr style={{ background: '#1e3a8a' }}>
            <th style={{
              padding: '20px', textAlign: 'left',
              color: '#fff', fontSize: '13px', fontWeight: 800,
              textTransform: 'uppercase', letterSpacing: '0.1em',
              width: '120px', borderBottom: '2px solid rgba(255,255,255,0.1)'
            }}>
              Day
            </th>

            {timeSlots.map((slot, i) => (
              <th key={i} style={{
                padding: '15px',
                textAlign: 'center',
                borderBottom: '2px solid rgba(255,255,255,0.1)',
                borderLeft: '1px solid rgba(255,255,255,0.1)'
              }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '10px', 
                    backgroundColor: 'rgba(255,255,255,0.1)', 
                    padding: '6px 12px', 
                    borderRadius: '50px',
                    border: '1px solid rgba(255,255,255,0.2)'
                  }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <span style={{ fontSize: '9px', color: '#93c5fd', fontWeight: 'bold', textTransform: 'uppercase' }}>Start</span>
                      <span style={{ fontSize: '12px', color: '#fff', fontWeight: '700' }}>{slot.startTime}</span>
                    </div>

                    <div style={{ width: '1px', height: '20px', backgroundColor: 'rgba(255,255,255,0.3)' }}></div>

                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <span style={{ fontSize: '9px', color: '#93c5fd', fontWeight: 'bold', textTransform: 'uppercase' }}>End</span>
                      <span style={{ fontSize: '12px', color: '#fff', fontWeight: '700' }}>{slot.endTime}</span>
                    </div>
                  </div>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {days.map((dayObj, rowIdx) => (
            <tr key={dayObj.value} style={{
              background: rowIdx % 2 === 0 ? '#ffffff' : '#f8faff',
              transition: 'all 0.2s ease',
            }}
              onMouseEnter={e => e.currentTarget.style.background = '#f1f5f9'}
              onMouseLeave={e => e.currentTarget.style.background = rowIdx % 2 === 0 ? '#ffffff' : '#f8faff'}
            >
              <td style={{
                padding: '18px 20px',
                fontWeight: 800, fontSize: '14px',
                color: '#1e3a8a', borderRight: '1px solid #e2e8f0',
                borderBottom: '1px solid #e2e8f0',
                backgroundColor: rowIdx % 2 === 0 ? '#f0f7ff' : '#e9f2ff'
              }}>
                {dayObj.label}
              </td>

              {timeSlots.map((_, i) => (
                <td key={i} style={{
                  padding: '18px 15px', textAlign: 'center',
                  borderBottom: '1px solid #e2e8f0',
                  borderRight: i < timeSlots.length - 1 ? '1px solid #f1f5f9' : 'none'
                }}>
                  <div style={{
                    fontSize: '14px', fontWeight: '600',
                    color: '#334155', letterSpacing: '0.02em'
                  }}>
                    Subject Name
                  </div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ClassSchedule;