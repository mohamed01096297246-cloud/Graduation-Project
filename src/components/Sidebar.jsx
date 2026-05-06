import React from 'react';

const Sidebar = ({ activeTab, setActiveTab }) => {
  const menu = [
    { id: "classschedule", label: "Class Schedule", icon: "📅" },
    { id: "schedule", label: "Exam Schedule", icon: "🗓️" },
    { id: "attendance", label: "Attendance", icon: "✅" },
    { id: "homework", label: "Homework", icon: "📚" },
    { id: "behavior", label: "Behavior", icon: "⭐" },
    { id: "grades", label: "Exam Results", icon: "📊" },
    { id: "notifications", label: "Notifications", icon: "🔔" },
  ];

  return (
    <div
      style={{
        width: '240px',
        background: '#eff6ff',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        left: 0,
        top: 0,
        zIndex: 50,
        borderRight: '1.5px solid #bfdbfe',
        boxShadow: '4px 0 20px rgba(30,58,138,0.07)',
      }}
    >
      {/* Logo */}
      <div style={{ padding: '32px 24px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '10px',
            background: '#1e3a8a', display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: '18px', flexShrink: 0
          }}>🎓</div>
          <h1 style={{ margin: 0, fontSize: '22px', fontWeight: 900, letterSpacing: '-0.5px', color: '#1e3a8a' }}>
            Edu<span style={{ color: '#60a5fa' }}>Link</span>
          </h1>
        </div>
        <div style={{
          marginTop: '20px', height: '1px',
          background: 'linear-gradient(90deg, #bfdbfe, transparent)'
        }} />
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '0 12px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {menu.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveTab(item.id)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '11px 14px',
                borderRadius: '14px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: isActive ? 700 : 500,
                transition: 'all 0.2s ease',
                background: isActive ? '#1e3a8a' : 'transparent',
                color: isActive ? '#fff' : '#1e3a8a',
                boxShadow: isActive ? '0 4px 12px rgba(30,58,138,0.2)' : 'none',
                textAlign: 'left',
              }}
              onMouseEnter={e => {
                if (!isActive) {
                  e.currentTarget.style.background = '#dbeafe';
                }
              }}
              onMouseLeave={e => {
                if (!isActive) {
                  e.currentTarget.style.background = 'transparent';
                }
              }}
            >
              <div style={{
                width: '3px', height: '20px', borderRadius: '99px',
                background: isActive ? '#60a5fa' : 'transparent',
                flexShrink: 0,
                transition: 'all 0.2s ease'
              }} />
              <span style={{ fontSize: '17px', flexShrink: 0 }}>{item.icon}</span>
              <span style={{ letterSpacing: '-0.2px' }}>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Contact School */}
      <div style={{ padding: '16px 16px 28px' }}>
        <div style={{
          height: '1px',
          background: 'linear-gradient(90deg, #bfdbfe, transparent)',
          marginBottom: '16px'
        }} />
        <button
          style={{
            width: '100%',
            padding: '13px 16px',
            borderRadius: '14px',
            border: '1.5px solid #bfdbfe',
            background: '#fff',
            color: '#1e3a8a',
            fontSize: '12px',
            fontWeight: 700,
            letterSpacing: '0.04em',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            transition: 'all 0.2s ease',
            boxShadow: '0 2px 8px rgba(30,58,138,0.07)',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = '#1e3a8a';
            e.currentTarget.style.color = '#fff';
            e.currentTarget.style.borderColor = '#1e3a8a';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = '#fff';
            e.currentTarget.style.color = '#1e3a8a';
            e.currentTarget.style.borderColor = '#bfdbfe';
          }}
        >
          <span style={{ fontSize: '15px' }}>📞</span>
          Contact School
        </button>
      </div>
    </div>
  );
};

export default Sidebar;