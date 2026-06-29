import React from 'react';

export const Stats: React.FC = () => {
  const statsList = [
    { value: '95%', label: 'Resume Parsing Accuracy' },
    { value: '1,000+', label: 'Analyses Planned' },
    { value: '24/7', label: 'AI Assistance' },
    { value: 'Fast', label: 'Results' }
  ];

  return (
    <section className="stats-section" id="stats" data-aos="fade-up" data-aos-duration="1000">
      <div className="stats-grid">
        {statsList.map((stat, index) => (
          <div 
            key={index} 
            className="stat-card glass-card"
            data-aos="zoom-in" 
            data-aos-delay={index * 100}
            data-aos-duration="800"
          >
            <h3 className="stat-value">{stat.value}</h3>
            <p className="stat-label">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
};
