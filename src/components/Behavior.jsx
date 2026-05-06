import React from 'react';

const Behavior = () => {
  const incidents = [
    {
      date: 'April 22, 2026',
      teacher: 'Ahmad Hassan',
      subject: 'Math',
      note: 'Was disruptive in class, repeatedly talking out of turn during the math lesson.',
      state: 'negative'
    },
    {
      date: 'April 18, 2026',
      teacher: 'Sarah Ali',
      subject: 'English',
      note: "Wasn't paying attention during the English class and missed key instructions.",
      state: 'negative'
    },
    {
      date: 'April 14, 2026',
      teacher: 'Sarah Ali',
      subject: 'English',
      note: 'Showed great improvement in attitude and completed all tasks ahead of time.',
      state: 'positive'
    }
  ];

  const stateConfig = {
    positive: {
      label: 'Positive',
      bg: '#dcfce7',
      color: '#15803d',
      dot: '#22c55e'
    },
    negative: {
      label: 'Negative',
      bg: '#fee2e2',
      color: '#b91c1c',
      dot: '#ef4444'
    },
    neutral: {
      label: 'Neutral',
      bg: '#f3f4f6',
      color: '#4b5563',
      dot: '#9ca3af'
    }
  };

  return (
    <div className="w-full animate-fadeIn">
     
      <div className="bg-white rounded-[1.5rem] shadow-sm border border-blue-50 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#1e3a8a] text-white text-[11px] font-black uppercase tracking-[0.15em]">
              <th className="px-6 py-5 border-r border-white/10 w-[18%]">Date</th>
              <th className="px-6 py-5 border-r border-white/10 w-[18%]">Teacher</th>
              <th className="px-6 py-5 border-r border-white/10 w-[15%]">State</th>
              <th className="px-6 py-5">Note</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-blue-50">
            {incidents.map((incident, index) => {
              const cfg = stateConfig[incident.state];
              return (
                <tr key={index} className="hover:bg-[#f0f7ff]/50 transition-colors group">
                  <td className="px-6 py-6 text-[#1e3a8a] font-black text-xs align-top italic">
                    {incident.date}
                  </td>
                  <td className="px-6 py-6 align-top">
                    <div className="text-gray-800 font-black text-xs uppercase tracking-tight">{incident.teacher}</div>
                    <div className="text-[#1e3a8a] text-[10px] font-black mt-0.5 uppercase">{incident.subject}</div>
                  </td>
                  <td className="px-6 py-6 align-top">
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px',
                        backgroundColor: cfg.bg,
                        color: cfg.color,
                        fontSize: '11px',
                        fontWeight: '800',
                        padding: '4px 10px',
                        borderRadius: '999px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em'
                      }}
                    >
                      <span
                        style={{
                          width: '7px',
                          height: '7px',
                          borderRadius: '50%',
                          backgroundColor: cfg.dot,
                          display: 'inline-block',
                          flexShrink: 0
                        }}
                      />
                      {cfg.label}
                    </span>
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex items-start gap-4">
                      <div className="min-w-[22px] h-[22px] bg-[#1e3a8a] rounded-full flex items-center justify-center text-white text-xs font-black shadow-sm shrink-0">
                        !
                      </div>
                      <p className="text-gray-600 text-[13px] leading-relaxed font-semibold italic">
                        {incident.note}
                      </p>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

     
    </div>
  );
};

export default Behavior;